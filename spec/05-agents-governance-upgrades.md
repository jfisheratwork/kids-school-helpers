# 05 - AGENTS.md Governance Upgrades

## Overview

This specification defines targeted additions to [`AGENTS.md`](../AGENTS.md) adopted from proven governance patterns in sibling repositories (`retirement_calculator` and `traveltracker`). These rules tighten code hygiene, fail-fast error handling, token efficiency, UI design exploration, and APM skill management while keeping `kid-school`'s zero-build-step Vanilla ES6+ workflow intact.

## Approved Additions to `AGENTS.md`

### 1. Harness Retrospective (`§3 Session Management`)
- At session wrap-up or PR preparation, inspect transcripts and git diffs to:
  1. Propose `Makefile` targets for multi-step commands executed 3+ times.
  2. Author `ast-grep` rules in `.agents/ast-grep-rules/` for recurring syntax or structural errors.
  3. Record new architectural invariants in `spec/01-architecture-and-standards.md`.

### 2. Code Hygiene & YAGNI (`§2 Attribution & Documentation Hygiene`)
- Before completing a task, strip unrequested helper functions, speculative abstractions, and dead code from touched files.
- Place official documentation links above newly introduced external libraries or browser/Web APIs (e.g., View Transitions API, KaTeX, SpeechSynthesis).

### 3. Project-Relative Markdown Links (`§2 Attribution & Documentation Hygiene`)
- All Markdown links to repository files and documentation in committed `.md` files must be project-relative (e.g., `[01-architecture-and-standards.md](spec/01-architecture-and-standards.md)`), never machine-relative (`file:///`, `/Users/`, `/home/`).
- Enforced deterministically via `scripts/check-repo.js --links` (Phase D).

### 4. Fail-Fast & Zero Silent Fallbacks (`§8 Strict Verification & Systemic Bug Searching`)
- Never use empty `catch` blocks or return silent dummy fallback values (`null`, `[]`, `{}`) in math generators, parsers, or solver engines unless explicitly required by the active spec.
- Validate external or user inputs (custom problems, fraction strings, URL/DOM inputs) at system boundaries and surface errors cleanly.

### 5. Offload Large Payloads to Temp Space (`§7 Token Efficiency & Workflow Management`)
- Never print logs, DOM dumps, or JSON payloads exceeding 100 lines directly to stdout.
- Write large outputs to `<conversation-id>/scratch/` or `/tmp/`, inspect the schema with `head -n 20` or `jq '.[0]'`, and extract answers with deterministic CLI tools (`jq`, `grep`, `awk`, or Node.js scripts).

### 6. Vertical Slices (`§9 Spec-Driven Lifecycle & Living Architecture Maintenance`)
- Implement course and feature specs in sequential verified checkpoints:
  1. **Math Model & Generator** (pure logic in `shared/js/` or `<module>/js/generator*.js`)
  2. **Unit Tests** (`test/unit-tests.js`)
  3. **Solver UI & Animations** (`solver-ui.js`, `hints-player.js`, `guide.js`)
  4. **Worksheets & Browser Verification** (`worksheet-generator.js`, zero-console-error check via `chrome-devtools-mcp`)
- Validate each slice with `node -c` / targeted unit tests before advancing to the next.

### 7. Mandatory Multi-Option UI Mockups (`New §13`)
- Whenever proposing, designing, or discussing UI features, visual enhancements, styling changes, or pedagogical layout workflows, agents must provide at least **three (3) distinct options** before finalizing `implementation_plan.md`.
- When competing personas or specialized UI subagents are engaged, each persona must independently provide at least **three (3) distinct mockups** representing its priorities (yielding at least 6 total options in a 2-persona matchup).

## Explicitly Excluded from Phase A
- APM Skill Management Governance (`§6 External Libraries & Dependency Inventory`).
- Replacing `make lint` / `make lint-rules` / `make pre-commit` with a single `make repchecks` mention in `§4`.
- Adding a separate `§14 Domain & Pedagogical Invariants` section to `AGENTS.md`.

## Deliverables & Verification
- Update `AGENTS.md` with sections 1–7 above.
- Ensure all Markdown links in `AGENTS.md` and `spec/05-agents-governance-upgrades.md` are project-relative.
- Update `spec/todo.md` once implemented.
