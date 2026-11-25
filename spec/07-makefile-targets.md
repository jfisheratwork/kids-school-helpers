# 07 - Makefile Targets & Consolidated Workflows

## Overview

This specification upgrades the root [`Makefile`](../Makefile) to support fast targeted testing, background server management, and a unified deterministic check gate while combining related checks to keep the target list simple and ergonomic.

## Consolidated Target Design

### 1. Local Server Lifecycle
- `make start`: Foreground `node server.js` on `http://localhost:3000` (existing).
- `make serve`: Starts `node server.js` in the background on port `3000`, recording PID in `.server.pid` and logs in `server.log` (idempotent if port `3000` is already listening).
- `make stop`: Cleanly stops the background server via `.server.pid` (falling back to `lsof -ti:3000`) and removes `.server.pid`.
- `make status`: Reports whether the server is running on port `3000` and its PID.

### 2. Targeted & Full Testing
- `make test-unit`: Runs `node test/unit-tests.js` (sub-second math & generator suite).
- `make test-e2e`: Runs `node test/run-headless.js` (headless Chrome integration suite).
- `make test`: Runs `test-unit` followed by `test-e2e`.

### 3. Consolidated Code, Docs & CDN Checks
To avoid target sprawl, closely related checks are grouped cleanly:
- `make check-syntax`: Runs `node -c` on all non-`lib/` JS files (existing).
- `make lint-rules`: Runs `node scripts/lint-rules.js` (CI-aware `ast-grep` wrapper from Phase D).
- `make lint`: Combined JS code-quality gate — runs `check-syntax`, `lint-rules`, and `eslint .` (gracefully skipping ESLint if not installed locally).
- `make check-repo`: Combined documentation, safety & CDN gate — runs `node scripts/check-repo.js` (project-relative Markdown links, `.agents/` + `spec/` safety scan, and pinned HTML CDN verification in one fast zero-dependency pass).
- `make format` / `make format-check`: Runs Prettier (`--write` / `--check`) if `prettier` is available locally (gracefully skipping with a notice in zero-dependency environments).

### 4. Single Umbrella Gate
- `make check` *(alias: `make repchecks`)*: Runs all fast deterministic checks in sequence: `lint`, `check-repo`, `format-check`, and `test-unit`.

### 5. Git Hook Management
- `make pre-commit`: Runs `.githooks/pre-commit` (existing).
- `make pre-push`: Runs `.githooks/pre-push` (unit + headless E2E gate).
- `make install-hooks`: Configures `git config core.hooksPath .githooks` and runs `chmod +x .githooks/pre-commit .githooks/pre-push`.

## Deliverables & Verification
- Update root `Makefile` and its `help` output to reflect the consolidated targets.
- Add `.server.pid` and `server.log` to `.gitignore` if not already ignored.
- Verify `make check`, `make serve` / `make status` / `make stop`, and `make test-unit` run cleanly after Phase D scripts are in place.
