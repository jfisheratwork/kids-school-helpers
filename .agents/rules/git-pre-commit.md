---
name: Git Pre-Commit Hook Guidelines
description: Requirements and steps for agentic pre-commit checks in Kids School Helpers to ensure syntax validity, ast-grep rule compliance, secret hygiene, and test verification.
globs: '*'
---

# Agentic Pre-Commit Hook Guidelines

All pre-commit workflows and commits in **Kids School Helpers** must pass deterministic quality, security, and regression gates.

## Required Pre-Commit Checklist

### 1. Code Quality & Conventions

- Enforce Vanilla ES6+ rules in [`coding.md`](coding.md) and [`javascript-conventions.md`](javascript-conventions.md).
- Verify all KaTeX rendering routes through [`shared/js/renderer.js`](../../shared/js/renderer.js) and no unsanitized `innerHTML` or `eval` calls were introduced.
- Confirm all Markdown links in modified `.md` files are project-relative (no `file:///`, `/Users/`, or `/home/`).

### 2. Pinned CDN Version Hygiene

- Confirm any CDN script or stylesheet links (Tailwind CSS `3.4.4`, KaTeX `0.16.10`) remain explicitly versioned with release-notes comments per [`AGENTS.md`](../../AGENTS.md) §6.
- Only propose CDN upgrades when a newer release has been public for at least 5 days.

### 3. Automated Validation Gates

- Run targeted unit tests for math changes and the repository pre-commit gates before committing:
  ```bash
  node test/unit-tests.js
  make lint
  make lint-rules
  make pre-commit
  ```
- For major features or UI/module changes, also verify zero console errors on `http://localhost:3000` and run `make test` (`node test/run-headless.js`).
- Block commits if any syntax check (`node -c`), `ast-grep` rule, merge conflict marker check, secret scan, or unit test fails.
- Never bypass hooks with `--no-verify` or `-n`.

### 4. Attribution & External Command Safety

- Every AI-assisted commit message MUST include the footer:
  ```text
  > Written with the assistance of Google Gemini
  ```
- Never run `git push` or create pull requests without explicit user review and approval per [`AGENTS.md`](../../AGENTS.md) §1.
