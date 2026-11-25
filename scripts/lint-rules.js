#!/usr/bin/env node

/**
 * CI-aware guarded runner for ast-grep structural rule scanning.
 *
 * In CI/CD mode (CI=true, CI=1, GITHUB_ACTIONS=true, or --ci):
 *   If ast-grep is missing, logs an informative notice and exits 0.
 * In Local mode:
 *   If ast-grep is missing, emits actionable install commands and exits 1.
 */

process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ''}`;

const { execSync, spawnSync } = require('child_process');

const isCI = Boolean(
    process.env.CI === 'true' ||
        process.env.CI === '1' ||
        process.env.GITHUB_ACTIONS === 'true' ||
        process.argv.includes('--ci')
);

function resolveAstGrepCommand() {
    for (const cmd of ['ast-grep', 'sg']) {
        const probe = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
        if (probe.status === 0) {
            return cmd;
        }
    }
    return null;
}

const astGrepCmd = resolveAstGrepCommand();

if (!astGrepCmd) {
    if (isCI) {
        console.log('🟡 [CI-MODE] ast-grep is not installed on this runner.');
        console.log('   Skipping structural AST rule scan without failing CI.');
        process.exit(0);
    } else {
        console.error('❌ [MISSING LOCAL TOOL] ast-grep is not installed on your system.');
        console.error('   Install on macOS (Homebrew):  brew install ast-grep');
        console.error('   Install via Cargo:            cargo install ast-grep --locked');
        console.error('   Install via npm:              npm install -g @ast-grep/cli');
        console.error('   (To bypass locally in CI mode, run with CI=true or --ci)');
        process.exit(1);
    }
}

try {
    console.log(`🔍 Running structural AST rule scan using ${astGrepCmd}...`);
    execSync(`${astGrepCmd} scan --globs '!**/lib/**'`, { stdio: 'inherit' });
    console.log('✅ Structural AST rule scan passed.');
} catch (scanError) {
    process.exit(scanError.status || 1);
}
