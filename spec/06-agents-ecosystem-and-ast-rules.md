# 06 - `.agents/` Ecosystem & `ast-grep` Rules

## Overview

This specification defines the project-native `.agents/` directory structure for **Kids School Helpers**, keeping the setup lean and focused on math correctness, UI verification, modular coding rules, and deterministic `ast-grep` guardrails.

## Approved Additions

### 1. Subagent Personas (`.agents/agents/`)
Materialize two focused specialist personas (and align `AGENTS.md` §11 with them):
- **`.agents/agents/math-auditor.md`**: Audits fraction arithmetic, zero-denominator safety, equation/problem generators, step-by-step solver state machines, and `test/unit-tests.js` coverage.
- **`.agents/agents/ui-auditor.md`**: Audits responsive Tailwind layouts, KaTeX rendering, View Transitions animations, dual-input behavior, printable worksheets, and zero console errors via `chrome-devtools-mcp`.

### 2. Modular Workspace Rules (`.agents/rules/`)
Port and adapt focused rule files from sibling repositories (Vanilla ES6+ only; no TypeScript rules):
- `.agents/rules/coding.md`
- `.agents/rules/javascript-conventions.md`
- `.agents/rules/git-pre-commit.md`
- `.agents/rules/node-js.md`

### 3. Native Workspace Skills (`.agents/skills/`)
Create two focused project-native skills:
- **`.agents/skills/math-engine-audit/SKILL.md`**: Fraction reduction, zero-denominator guards, long-division / GCF / equation step parity, and unit test verification.
- **`.agents/skills/git-commit-push/SKILL.md`**: Staged pre-commit gate, required Gemini attribution footer, and explicit user approval before `git push`.

### 4. General `ast-grep` Structural Rules (`.agents/ast-grep-rules/`)
Port 5 general rules from sibling repositories:
- `no-floating-promises.yml`
- `no-prototype-pollution.yml`
- `no-generic-catch-param.yml`
- `no-silent-promise-fallback.yml`
- `require-sanitization-on-html.yml`

### 5. `kid-school`-Specific `ast-grep` Rules (`.agents/ast-grep-rules/`)
Add 2 domain-specific rules:
- `no-raw-katex-outside-renderer.yml`: Flags direct `katex.render` / `katex.renderToString` calls outside `shared/js/renderer.js` so KaTeX typesetting stays centralized.
- `no-zero-denominator-literal.yml`: Flags literal `new Fraction($N, 0)` calls to prevent divide-by-zero bugs at authoring time.

## Explicitly Excluded from Phase B
- Additional personas (`pedagogical-ui-engineer`, `security-sanitizer`, `spec-architect`, `harness-optimizer`).
- Additional skills (`spec-authoring`, `visual-verification`, `subagent-catalog`).
- `apm.yml` / APM upstream skill dependencies.
- `no-insecure-random.yml` and `no-direct-localstorage-write.yml`.
- `.agnix.toml`.

## Deliverables & Verification
- Create `.agents/agents/` (`math-auditor.md`, `ui-auditor.md`).
- Create `.agents/rules/` (`coding.md`, `javascript-conventions.md`, `git-pre-commit.md`, `node-js.md`).
- Create `.agents/skills/` (`math-engine-audit/SKILL.md`, `git-commit-push/SKILL.md`).
- Add the 7 new YAML rules under `.agents/ast-grep-rules/`.
- Run `make lint-rules` and verify zero unexpected false positives across existing course modules (fixing any true positives found).
