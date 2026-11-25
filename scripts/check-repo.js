#!/usr/bin/env node

/**
 * Consolidated zero-dependency static validator for Kids School Helpers.
 *
 * Flags:
 *   --links   Verify Markdown links are project-relative (no file:///, /Users/, /home/, Windows paths)
 *   --skills  Scan .agents/ and spec/ for prompt injection, stealth Unicode, destructive shell, and secrets
 *   --cdn     Verify external CDN <script>/<link> tags in HTML files use pinned versions + release notes
 *   --all     Run all checks (default when no flags are provided)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

const LINK_IGNORED_DIRS = new Set(['.git', 'node_modules', 'my_sessions', 'local_only', 'lib']);
const CDN_IGNORED_DIRS = new Set(['.git', 'node_modules', 'my_sessions', 'local_only', 'lib', 'test']);
const SKILL_IGNORED_DIRS = new Set(['.git', 'node_modules']);

const MARKDOWN_LINK_REGEX =
    /\[[^\]]*\]\(((?:file:\/\/\/|\/(?:Users|home)\/|[A-Za-z]:[\\/](?:Users|home)\/)[^)]*)\)/g;
const HTML_HREF_REGEX =
    /<a\s+[^>]*href=["']((?:file:\/\/\/|\/(?:Users|home)\/|[A-Za-z]:[\\/](?:Users|home)\/)[^"']*)["']/gi;

const STEALTH_UNICODE_PATTERN = /[\u200B-\u200D\uFEFF\u202A-\u202E\u2066-\u2069]/;
const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    /disregard\s+(all\s+)?(previous|prior|system)\s+instructions/i,
    /bypass\s+(all\s+)?(system|safety|security)\s+rules/i,
    /system\s+prompt\s+override/i,
    /you\s+are\s+now\s+in\s+developer\s+mode/i,
    /jailbreak/i
];
const EXFILTRATION_PATTERNS = [
    /curl\s+[^|\n]*(-d|--data|--data-raw)\s+[^|\n]*(https?:\/\/|\$)/i,
    /wget\s+--post-(data|file)/i,
    /fetch\s*\(\s*['"`]https?:\/\/[^'"`]+\?[^'"`]*\+/i
];
const DESTRUCTIVE_PATTERNS = [
    /rm\s+-rf\s+(\/|~|\$HOME|\*)/i,
    /curl\s+[^|\n]+\|\s*(ba)?sh/i,
    /wget\s+[^|\n]+\|\s*(ba)?sh/i,
    /chmod\s+777/i,
    /\b(?:eval|exec)\s*\(\s*['"`]/i
];
const SECRET_PATTERNS = [
    /AKIA[0-9A-Z]{16}/,
    /ghp_[0-9a-zA-Z]{36}/,
    /github_pat_[0-9a-zA-Z_]{82}/,
    /-----BEGIN\s+(RSA|OPENSSH|EC|DSA)?\s*PRIVATE\s+KEY-----/
];

const APPROVED_CDN_VERSIONS = {
    tailwind: '3.4.4',
    katex: '0.16.10'
};

function toRelPath(fullPath) {
    return path.relative(ROOT_DIR, fullPath).split(path.sep).join('/');
}

function collectFiles(dir, ignoredDirs, extRegex) {
    if (!fs.existsSync(dir)) return [];
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isSymbolicLink()) continue;
        if (ignoredDirs.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectFiles(fullPath, ignoredDirs, extRegex));
        } else if (entry.isFile() && extRegex.test(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}

function isLinkRuleDefinitionLine(relPath, line) {
    const isRuleDoc =
        relPath === 'AGENTS.md' ||
        relPath === 'coding.md' ||
        relPath.endsWith('/coding.md') ||
        /^spec\/0[58]-/.test(relPath);
    if (!isRuleDoc) return false;
    return /(project-relative|machine-relative|file:\/\/\/|\/Users\/|\/home\/|Windows)/i.test(line);
}

function checkLinks() {
    const mdFiles = collectFiles(ROOT_DIR, LINK_IGNORED_DIRS, /\.md$/i);
    const violations = [];

    for (const file of mdFiles) {
        const relPath = toRelPath(file);
        const lines = fs.readFileSync(file, 'utf8').split('\n');

        lines.forEach((line, index) => {
            if (isLinkRuleDefinitionLine(relPath, line)) return;

            const lineNum = index + 1;
            let match;

            MARKDOWN_LINK_REGEX.lastIndex = 0;
            while ((match = MARKDOWN_LINK_REGEX.exec(line)) !== null) {
                violations.push({
                    file: relPath,
                    line: lineNum,
                    type: 'Markdown link',
                    link: match[1]
                });
            }

            HTML_HREF_REGEX.lastIndex = 0;
            while ((match = HTML_HREF_REGEX.exec(line)) !== null) {
                violations.push({
                    file: relPath,
                    line: lineNum,
                    type: 'HTML href',
                    link: match[1]
                });
            }
        });
    }

    if (violations.length > 0) {
        console.error(`\n❌ [--links] Found ${violations.length} machine-relative link(s) in Markdown files:`);
        for (const v of violations) {
            console.error(`  ${v.file}:${v.line} [${v.type}] -> ${v.link}`);
        }
        return false;
    }

    console.log(`✔ [--links] Verified ${mdFiles.length} Markdown file(s): all links are project-relative.`);
    return true;
}

function validateSkillFrontmatter(content, violations) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
        violations.push({
            type: 'INVALID_FRONTMATTER',
            message: 'SKILL.md is missing required YAML frontmatter (---)',
            line: 1
        });
        return;
    }
    const fm = match[1];
    if (!/^name:\s*[a-zA-Z0-9_-]+/m.test(fm)) {
        violations.push({
            type: 'INVALID_FRONTMATTER',
            message: "YAML frontmatter missing valid 'name' field",
            line: 1
        });
    }
    if (!/^description:\s*.+/m.test(fm)) {
        violations.push({
            type: 'INVALID_FRONTMATTER',
            message: "YAML frontmatter missing non-empty 'description' field",
            line: 1
        });
    }
}

function checkSkills() {
    const targets = ['.agents', 'spec'].map((dir) => path.join(ROOT_DIR, dir));
    const files = [];
    for (const target of targets) {
        files.push(...collectFiles(target, SKILL_IGNORED_DIRS, /\.(md|yaml|yml|json|sh)$/i));
    }

    const fileViolations = [];
    let totalViolations = 0;

    for (const file of files) {
        const relPath = toRelPath(file);
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        const violations = [];

        const isExcludedFromNegativePatterns =
            relPath.includes('ast-grep-rules/') ||
            relPath === 'spec/08-deterministic-validation-scripts.md';

        lines.forEach((line, index) => {
            const lineNum = index + 1;

            if (STEALTH_UNICODE_PATTERN.test(line)) {
                violations.push({
                    type: 'STEALTH_UNICODE',
                    message: 'Detected hidden zero-width or directional override Unicode character',
                    line: lineNum
                });
            }

            if (!isExcludedFromNegativePatterns) {
                for (const pattern of INJECTION_PATTERNS) {
                    if (pattern.test(line)) {
                        violations.push({
                            type: 'PROMPT_INJECTION',
                            message: `Potential prompt injection instruction: ${line.trim()}`,
                            line: lineNum
                        });
                    }
                }

                for (const pattern of EXFILTRATION_PATTERNS) {
                    if (pattern.test(line)) {
                        violations.push({
                            type: 'DATA_EXFILTRATION',
                            message: `Potential outbound data exfiltration command: ${line.trim()}`,
                            line: lineNum
                        });
                    }
                }

                for (const pattern of DESTRUCTIVE_PATTERNS) {
                    if (pattern.test(line)) {
                        violations.push({
                            type: 'DESTRUCTIVE_SHELL',
                            message: `Dangerous shell execution pattern: ${line.trim()}`,
                            line: lineNum
                        });
                    }
                }
            }

            for (const pattern of SECRET_PATTERNS) {
                if (pattern.test(line)) {
                    violations.push({
                        type: 'SECRET_LEAK',
                        message: 'Potential hardcoded API token or private key',
                        line: lineNum
                    });
                }
            }
        });

        if (path.basename(file) === 'SKILL.md') {
            validateSkillFrontmatter(content, violations);
        }

        if (violations.length > 0) {
            totalViolations += violations.length;
            fileViolations.push({ file: relPath, violations });
        }
    }

    if (totalViolations > 0) {
        console.error(`\n❌ [--skills] Safety scan failed with ${totalViolations} violation(s):`);
        for (const item of fileViolations) {
            console.error(`  ${item.file}:`);
            for (const v of item.violations) {
                console.error(`    [Line ${v.line}] ${v.type}: ${v.message}`);
            }
        }
        return false;
    }

    console.log(`✔ [--skills] Safety scan passed across ${files.length} file(s) in .agents/ and spec/.`);
    return true;
}

function hasReleaseNotesCommentAbove(lines, lineIndex, lookback = 5) {
    const start = Math.max(0, lineIndex - lookback);
    for (let i = start; i <= lineIndex; i++) {
        if (/<!--[\s\S]*?https?:\/\/[\s\S]*?-->/i.test(lines[i])) {
            return true;
        }
    }
    return false;
}

function checkCdn() {
    const htmlFiles = collectFiles(ROOT_DIR, CDN_IGNORED_DIRS, /\.html$/i);
    const violations = [];
    const passedFiles = [];
    const failedFiles = new Set();

    const externalTagRegex = /<(?:script\b[^>]*\bsrc|link\b[^>]*\bhref)=["'](https?:\/\/[^"']+)["'][^>]*>/gi;

    for (const file of htmlFiles) {
        const relPath = toRelPath(file);
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        let fileHasError = false;

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            let match;
            externalTagRegex.lastIndex = 0;

            while ((match = externalTagRegex.exec(line)) !== null) {
                const url = match[1];

                if (/@latest\b|[?&]version=latest\b/i.test(url)) {
                    fileHasError = true;
                    violations.push({
                        file: relPath,
                        line: lineNum,
                        message: `Unpinned @latest CDN reference is forbidden: ${url}`
                    });
                    continue;
                }

                if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(url)) {
                    if (/fonts\.googleapis\.com\/css2/i.test(url) && !/[?&]family=Inter\b/i.test(url)) {
                        fileHasError = true;
                        violations.push({
                            file: relPath,
                            line: lineNum,
                            message: `Google Fonts stylesheet must use approved Inter font family: ${url}`
                        });
                    }
                    continue;
                }

                if (/cdn\.tailwindcss\.com|tailwindcss/i.test(url)) {
                    const expected = APPROVED_CDN_VERSIONS.tailwind;
                    const hasPinnedTailwind =
                        url.includes(`version=${expected}`) ||
                        url.includes(`@${expected}`) ||
                        url.includes(`/${expected}/`);
                    if (!hasPinnedTailwind) {
                        fileHasError = true;
                        violations.push({
                            file: relPath,
                            line: lineNum,
                            message: `Tailwind CSS must be pinned to v${expected} (AGENTS.md §6): ${url}`
                        });
                    }
                    if (!hasReleaseNotesCommentAbove(lines, index, 5)) {
                        fileHasError = true;
                        violations.push({
                            file: relPath,
                            line: lineNum,
                            message: `Missing release-notes/doc URL comment within 5 lines above Tailwind tag: ${url}`
                        });
                    }
                    continue;
                }

                if (/katex/i.test(url)) {
                    const expected = APPROVED_CDN_VERSIONS.katex;
                    const hasPinnedKatex =
                        url.includes(`katex@${expected}`) || url.includes(`/${expected}/`);
                    if (!hasPinnedKatex) {
                        fileHasError = true;
                        violations.push({
                            file: relPath,
                            line: lineNum,
                            message: `KaTeX must be pinned to v${expected} (AGENTS.md §6): ${url}`
                        });
                    }
                    if (!hasReleaseNotesCommentAbove(lines, index, 5)) {
                        fileHasError = true;
                        violations.push({
                            file: relPath,
                            line: lineNum,
                            message: `Missing release-notes/doc URL comment within 5 lines above KaTeX tag: ${url}`
                        });
                    }
                    continue;
                }

                // Any other external CDN script/link must be explicitly versioned + documented
                const hasVersionPin =
                    /@\d+\.\d+/.test(url) ||
                    /[?&]version=\d+\.\d+/.test(url) ||
                    /\/v?\d+\.\d+\.\d+\//.test(url);
                if (!hasVersionPin) {
                    fileHasError = true;
                    violations.push({
                        file: relPath,
                        line: lineNum,
                        message: `External CDN asset is missing an explicit pinned version: ${url}`
                    });
                }
                if (!hasReleaseNotesCommentAbove(lines, index, 5)) {
                    fileHasError = true;
                    violations.push({
                        file: relPath,
                        line: lineNum,
                        message: `Missing release-notes/doc URL comment within 5 lines above external CDN tag: ${url}`
                    });
                }
            }
        });

        if (fileHasError) {
            failedFiles.add(relPath);
        } else {
            passedFiles.push(relPath);
        }
    }

    if (violations.length > 0) {
        console.error(
            `\n❌ [--cdn] CDN verification failed (${failedFiles.size} failed, ${passedFiles.length} passed):`
        );
        for (const v of violations) {
            console.error(`  ${v.file}:${v.line} - ${v.message}`);
        }
        return false;
    }

    console.log(`✔ [--cdn] Verified ${htmlFiles.length} HTML file(s): all external CDN versions & comments valid.`);
    return true;
}

function main() {
    const args = new Set(process.argv.slice(2));
    const runAll = args.size === 0 || args.has('--all');
    const runLinks = runAll || args.has('--links');
    const runSkills = runAll || args.has('--skills');
    const runCdn = runAll || args.has('--cdn');

    let allOk = true;
    if (runLinks) allOk = checkLinks() && allOk;
    if (runSkills) allOk = checkSkills() && allOk;
    if (runCdn) allOk = checkCdn() && allOk;

    if (!allOk) {
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { checkLinks, checkSkills, checkCdn };
