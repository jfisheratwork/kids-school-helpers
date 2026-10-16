process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ''}`;
const fs = require('fs');
const { execSync } = require('child_process');

function readInputPayload() {
    if (process.stdin.isTTY) return {};
    let inputData = '';
    try {
        inputData = fs.readFileSync(0, 'utf-8');
    } catch {
        return {};
    }
    if (!inputData.trim()) return {};
    try {
        return JSON.parse(inputData);
    } catch {
        return {};
    }
}

function runSyntaxCheck(targetFile) {
    try {
        execSync(`node -c "${targetFile}"`, { stdio: 'pipe' });
        console.error(`  ✔ Syntax Check: Passed (node -c)`);
        return true;
    } catch (syntaxErr) {
        console.error(`  ✖ Syntax Error in ${targetFile}:`);
        console.error(syntaxErr.stderr ? syntaxErr.stderr.toString() : syntaxErr.message);
        return false;
    }
}

function runAstGrepCheck(targetFile) {
    try {
        const sgOut = execSync(`ast-grep scan --min-severity error "${targetFile}"`, { stdio: 'pipe' }).toString();
        if (sgOut.trim()) {
            console.error(`  ℹ ast-grep Findings:\n${sgOut}`);
            return false;
        }
        console.error(`  ✔ ast-grep Scan: Clean (0 blocking errors)`);
        return true;
    } catch (astGrepErr) {
        const stdout = astGrepErr.stdout ? astGrepErr.stdout.toString() : '';
        const stderr = astGrepErr.stderr ? astGrepErr.stderr.toString() : '';
        console.error(`  ✖ ast-grep Violations:\n${(stdout + stderr).trim()}`);
        return false;
    }
}

function runEslintCheck(targetFile) {
    try {
        if (!fs.existsSync('node_modules/.bin/eslint')) {
            return true;
        }
        const eslintOut = execSync(`npx eslint "${targetFile}"`, { stdio: 'pipe' }).toString();
        if (eslintOut.trim()) {
            console.error(`  ℹ ESLint Diagnostics:\n${eslintOut}`);
        } else {
            console.error(`  ✔ ESLint: Passed`);
        }
        return true;
    } catch (eslintErr) {
        const stdout = eslintErr.stdout ? eslintErr.stdout.toString() : '';
        const stderr = eslintErr.stderr ? eslintErr.stderr.toString() : '';
        console.error(`  ℹ ESLint Warnings:\n${(stdout + stderr).trim()}`);
        return true;
    }
}

function verifyJavaScriptFile(targetFile) {
    console.error(`\n[Quality Hook] Verifying: ${targetFile}`);
    const syntaxOk = runSyntaxCheck(targetFile);
    const astGrepOk = runAstGrepCheck(targetFile);
    const eslintOk = runEslintCheck(targetFile);

    if (syntaxOk && astGrepOk && eslintOk) {
        console.error(
            `  ✅ [Quality Hook Authoritative Pass] Syntax and AST checks passed. Do NOT duplicate manual single-file node -c calls.`
        );
    }
}

/**
 * Antigravity PostToolUse Quality Hook
 * Validates JS syntax, scans with ast-grep rules, and notifies about UI changes.
 */
async function main() {
    const payload = readInputPayload();
    const toolArgs = payload?.toolCall?.args || {};
    const targetFile = toolArgs.TargetFile || process.argv[2];

    if (targetFile && fs.existsSync(targetFile)) {
        if (targetFile.endsWith('.js') && !targetFile.includes('/lib/')) {
            verifyJavaScriptFile(targetFile);
        }

        if (
            targetFile.endsWith('.html') ||
            targetFile.includes('/css/') ||
            targetFile.includes('/js/solver-ui') ||
            targetFile.includes('/js/hints-player') ||
            targetFile.includes('/js/worksheet')
        ) {
            console.error(
                `  🌐 [UI Verification Reminder] Frontend/UI file modified — verify in browser or with chrome-devtools-mcp (list_console_messages / take_screenshot).`
            );
        }
    }

    // Protocol contract: output empty JSON object
    console.log(JSON.stringify({}));
}

main().catch(() => {
    console.log(JSON.stringify({}));
});
