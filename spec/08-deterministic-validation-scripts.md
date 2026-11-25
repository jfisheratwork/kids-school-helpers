# 08 - Deterministic Validation Scripts & Git Hooks

## Overview

This specification defines lightweight, zero-dependency Node.js validation scripts and Git hooks for **Kids School Helpers**. To match the simplicity of a static Vanilla JS repository while upholding the same engineering standards as larger sibling projects, related static checks are consolidated into a single multi-check runner (`scripts/check-repo.js`) rather than scattered across many small files.

## Approved Scripts & Configs

### 1. Consolidated Static Validator (`scripts/check-repo.js`)
A single zero-dependency Node.js script supporting selective flags (`--links`, `--skills`, `--cdn`, or default `--all`):
- **`--links` (Project-Relative Markdown Links):** Scans all committed `.md` files (excluding `.git/`, `my_sessions/`, `local_only/`) and fails on machine-relative links (`file:///`, `/Users/`, `/home/`, Windows drive paths).
- **`--skills` (`.agents/` & `spec/` Safety Scan):** Scans `.agents/` and `spec/` for prompt-injection phrases, hidden zero-width/bidi Unicode characters, destructive shell commands (`rm -rf /`, `curl | sh`), and leaked secret patterns (AWS keys, GitHub tokens, private keys).
- **`--cdn` (Pinned CDN Verification):** Scans all `*.html` files across the root hub and all 8 courses to verify external CDN `<script>`/`<link>` tags:
  1. Never use `@latest` or unpinned versions.
  2. Match the approved pinned versions in `AGENTS.md` §6 (`tailwindcss@3.4.4`, `katex@0.16.10`, Google Fonts `Inter`).
  3. Include a release-notes or documentation URL comment alongside external library inclusions.

### 2. CI-Aware `ast-grep` Wrapper (`scripts/lint-rules.js`)
- Resolves `ast-grep` or `sg` in `PATH` and runs `scan --globs '!**/lib/**'`.
- In CI (`CI=true`, `GITHUB_ACTIONS=true`, or `--ci`), skips gracefully with an informative notice if `ast-grep` is unavailable.
- Locally, exits `1` with actionable install commands (`brew`, `cargo`, `npm`).

### 3. Upgraded PostToolUse Hook (`scripts/post-tool-quality.js`)
- Fixes target path resolution to check `toolArgs.Path || toolArgs.TargetFile || process.argv[2]` so both `write_file` and `edit_file` reliably trigger verification.
- Runs `node -c`, `ast-grep`, and optional ESLint on `.js` edits (excluding `/lib/`).
- Runs `node scripts/check-repo.js --cdn` when `.html` files are edited, and retains the UI verification reminder.

### 4. Git Hooks (`.githooks/pre-commit` & `.githooks/pre-push`)
- **`.githooks/pre-commit` (fast, staged-files gate):** Keeps existing merge-conflict, `node -c`, `ast-grep`, optional ESLint, and artifact-hygiene checks, and adds `node scripts/check-repo.js` whenever staged files include `.md`, `.html`, `.agents/`, or `spec/`.
- **`.githooks/pre-push` (full test gate):** Runs `make test-unit` and `make test-e2e` before allowing `git push`.

### 5. Minimal Formatting Config (`.prettierrc` & `.prettierignore`)
- Adds lightweight Prettier config matching the repository's existing formatting style (excluding `lib/`, `my_sessions/`, `local_only/`, and generated logs). Prettier remains strictly optional (`make format` / `make format-check` skip cleanly if not installed).

## Deliverables & Verification
- Create `scripts/check-repo.js`, `scripts/lint-rules.js`, `.githooks/pre-push`, `.prettierrc`, and `.prettierignore`.
- Update `scripts/post-tool-quality.js` and `.githooks/pre-commit`.
- Run `node scripts/check-repo.js`, `node scripts/lint-rules.js`, `make check`, and `make pre-commit` to verify zero false positives across the existing codebase.
