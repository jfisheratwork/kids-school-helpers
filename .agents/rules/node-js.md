---
trigger: model_decision
description: Coding and architecture conventions for Kids School Helpers Node.js local tooling, dev server, and test runner scripts.
globs: 'server.js, scripts/**/*.js, test/**/*.js, **/*.mjs, **/*.cjs'
---

# Node.js Tooling Guidelines

In **Kids School Helpers**, Node.js (`>= 20.x`) is used strictly for local development serving ([`server.js`](../../server.js)), automated quality scripts (`scripts/`), and test runners (`test/`). The web application itself remains zero-build-step static HTML/CSS/JS.

## 1. Zero External Runtime Dependencies

- Prefer Node.js built-in modules (`node:fs`, `node:path`, `node:http`, `node:child_process`, `node:assert`) over adding external npm packages for local tooling scripts.
- Use the explicit `node:` specifier prefix for built-in modules when writing new or refactored scripts.

## 2. Asynchronous Code & Event Loop Hygiene

- Prefer `async`/`await` over raw Promise chains or nested callbacks in `server.js` and async test harnesses (`test/run-headless.js`).
- Avoid blocking synchronous filesystem calls (`fs.readFileSync`) inside active HTTP request handlers; reserve synchronous I/O for short-lived CLI validation scripts (e.g., pre-commit checks, `scripts/post-tool-quality.js`).

## 3. Module Format Consistency

- Keep each script consistent in module format—do not mix `require()` and ES `import`/`export` in the same file.
- Use ES Modules (`import`/`export`) for browser-shared code and `.mjs` scripts; match the existing format when editing CommonJS `.js` tooling scripts.

## 4. Structured Error Handling & Exit Codes

- Wrap async operations in structured `try`/`catch` blocks using operation-specific catch variable names (e.g., `readFileError`, `serverStartError`).
- CLI scripts and test runners MUST exit with a non-zero exit code (`process.exit(1)` or `process.exitCode = 1`) on failure so `Makefile` targets and `.githooks/pre-commit` fail fast.
- Handle unhandled promise rejections explicitly rather than ignoring them.
