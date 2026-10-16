# AI Agent Rules & Governance

This document outlines the global rules and development standards for AI agents contributing to the **Kids School Helpers** repository.

## 1. Strict Approval & External Command Security

- **Explicit Plan Permission Required:** Agents MUST pause execution and wait for the user's manual explicit approval before beginning implementation after presenting an `implementation_plan.md`. Do not proceed based on implicit permission.
- **External Command Approval Required:** Never execute a NON-READONLY command that interacts with external services (e.g., GitHub, Hosting Platforms) without explicit user review and approval.
- **Scope:** This includes `git push`, creating pull requests, deploying to external servers, publishing packages, or any API write operations.
- **Process:** Always propose the exact command first, explain its impact, and wait for user confirmation.

## 2. Attribution & Documentation Hygiene

- **Commit Messages & Pull Requests:** All commit messages and PR descriptions created with AI assistance must include the following footer:
  > Written with the assistance of Google Gemini
- **UserWalkthrough.md:** Periodically update `UserWalkthrough.md` in the root workspace (ignored by git) with recent screenshots to verify visual layouts and step-by-step solver progression.
- **local_only/ Hygiene:** Personal profile backups, scratch notes, and local testing logs reside strictly in `local_only/` or `my_sessions/`. Keep `spec/todo.md` focused on remaining work; remove completed items once reflected in the living architecture.

## 3. Session Management

- **Session Directories:** At the start of every new coding session, a session directory tracking the session details must be created in the `my_sessions/` directory (which is `.gitignore`d to prevent local/personal session summaries and logs from being committed to GitHub).
- **Naming Convention:** `my_sessions/YYYY-MM-DD-Session-{n}/` where `{n}` is an incrementing integer starting at 1 for the first session of that day (e.g. `my_sessions/2026-10-16-Session-1/`).
- **New Session Trigger:** A new session folder MUST be created when starting work on a new feature branch, major module, or after wrapping up previous work, ensuring isolation and clean history.
- **Session Directory Contents & Update Frequency:**
  Each session directory MUST contain a `session_summary.md` markdown file, updated when committing or pushing:
  1. `session_summary.md`: The main summary of the session following this layout:
     - **Executive Summary:** A concise overview of the session, goals, and results at the top.
     - **Outcomes:** The specific results, updates, and milestones achieved.
     - **Fine-grained Details:** Breakdown of tasks completed (`Tasks Done`) and tasks remaining or postponed (`Tasks Not Done`).
     - **Prompt Log:** A list of high-level prompt summaries detailing each interaction/request during the session at the very bottom.

## 4. File System Boundaries & Tooling Hooks

- **Workspace Confinement:** Never modify files outside of the project's root workspace.
- **Git Directory:** Do not modify files inside the `.git` directory directly unless running an approved git command.
- **System Files:** Do not touch system configuration files or user home directory files outside the repo.
- **Automated PostToolUse Hook (`scripts/post-tool-quality.js`):** Every file edit via `write_to_file` or `replace_file_content` automatically runs `node -c` (syntax check), `ast-grep scan` (via `.agents/hooks.json`), and checks for UI files requiring visual verification. When the hook reports clean status, agents do not need to duplicate manual single-file syntax runs.
- **Pre-Commit Enforcement (`.githooks/pre-commit`):** A pre-commit hook runs staged validations including `node -c` syntax check, `ast-grep scan` using `.agents/ast-grep-rules`, merge conflict checks, and secret hygiene.
- **Task Completion & Makefile Workflow:** Always run `make lint`, `make lint-rules`, and `make pre-commit` once a logical feature or multi-file change is complete.

## 5. Tri-Tier Code Navigation: LSP, AST Analysis (`ast-grep`), and Fast Search

### Fast Navigation Playbook

Follow this high-speed, token-efficient navigation sequence:

1. **Tier 1 — LSP Bridge (`lsp-bridge` MCP) for Module & Symbol Semantics**:
   - Call `lsp_find_symbol(name: "...")`, `lsp_goto_definition`, `lsp_find_references`, `lsp_file_exports`, and `lsp_file_imports` to resolve ES6 module exports (e.g., `Fraction`, `EquationGenerator`, `SolverUI`) without loading full files into context.
   - Prefer `lsp_rename` and `lsp_find_references` before refactoring exported classes or shared math utilities.
2. **Tier 2 — Semantic AST Search (`ast-grep`) for Structural Patterns & File Outlines**:
   - Run `ast-grep outline --view expanded <path>` on unfamiliar files to emit a compact structural digest with exact line numbers (~95% token savings vs reading the full file).
   - Use `ast-grep` (`find_code` MCP, `sg run -p '<pattern>'`, or `make lint-rules`) for locating class definitions, method signatures, mathematical step state machines, or pattern-based DOM callsites.
3. **Tier 3 — Fast Regex Pairing (`ripgrep` / `rg`) for Unstructured Text**:
   - Reserve `rg` for quick literal string searches, CSS selectors, Tailwind classes, HTML element IDs, and Markdown documentation; escalate to `ast-grep` or `lsp-bridge` when AST context or call hierarchy matters.
4. **Instant Syntax Verification**:
   - Run `node -c <file.js>` for sub-second syntax verification before declaring tasks complete.

### Deterministic Refactoring & Compiler-First Feedback

- **Tooling-Driven Refactoring**: Bias refactoring toward automated and deterministic tools (`lsp_rename`, `ast-grep --rewrite`, `npx eslint --fix`, or Prettier) before applying manual text replacements.
- **Step-by-Step Refactor Validation**:
  1. Map all callsites using `lsp_find_references` or `ast-grep run -p '<symbol>($$$)'`.
  2. Apply changes modularly to individual component or state files.
  3. Validate syntax and rules with `make lint` and `make lint-rules` before declaring the refactor complete.

## 6. External Libraries & Dependency Inventory

When including external libraries (e.g., via CDN), agents MUST adhere to the following rules:

1. **Explicit Versioning**: Always use an explicit, fixed version number. Do not use `@latest` or unversioned links.
2. **Release Notes Comment**: Every external library inclusion must be accompanied by a code-level comment containing the URL to the release notes or changelog for that specific version.
3. **Session Start Updates**: At the start of a new session, agents should check if updated versions of included libraries are available. A library version may only be updated if it has been publicly released for **at least 5 days** (to avoid absorbing zero-day bugs or immediate post-release regressions).
4. **Runtime Philosophy:** This project runs as a pure client-side static web application with zero external runtime build steps. Node.js is used solely for local dev serving (`server.js`), headless test running, and linting.

### Project Dependency Inventory

| Type | Package / Asset | Version | Release Notes / Documentation | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CDN Runtime** | `Tailwind CSS` | `3.4.4` | [Tailwind v3.4.4 Release Notes](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.4) | Utility-first styling across all modules and worksheets |
| **CDN Runtime** | `KaTeX` | `0.16.10` | [KaTeX v0.16.10 Release Notes](https://github.com/KaTeX/KaTeX/releases/tag/v0.16.10) | Mathematical typesetting for fractions, equations, and steps |
| **Web Font** | `Inter` (Google Fonts) | `400..700` | [Google Fonts Spec](https://fonts.google.com/specimen/Inter) | Clean, legible typography for educational interfaces |
| **Dev Tool** | `ast-grep` | `0.45.3` | [ast-grep Documentation](https://ast-grep.github.io/) | Fast AST structural linting, pattern search, and refactoring |
| **Dev Tool** | `Node.js` | `>= 20.x` | [Node.js Releases](https://nodejs.org/en/about/previous-releases) | Zero-dependency local server (`server.js`) and test runner |
| **Dev Tool** | `Headless Chrome` | System | [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) | Headless integration test harness (`test/run-headless.js`) |
| **Dev Tool** | `ESLint` (Optional) | `^9.x` | [ESLint Documentation](https://eslint.org/) | Static syntax validation and code complexity guardrails |

## 7. Token Efficiency & Workflow Management

To optimize AI context window size and maintain high performance, agents MUST follow these workflow rules:

1. **Modular File Structure**: Prefer smaller, focused files over monolithic files. When adding significant new functionality, break it out into a new module, state controller, or generator file rather than appending thousands of lines to `index.html` or a single JavaScript file.
2. **Targeted Test Execution**: Do NOT run the full test suite (especially headless browser tests or Puppeteer) after every minor tweak. Only run integration tests when a major logic feature is complete, at the very end of a workflow, or when explicitly requested by the user. Rely on targeted manual verification or unit tests (`test/unit-tests.js`) for small changes.
3. **Encourage Batched Requests**: If the user begins making many small, rapid-fire iterative requests (e.g., minor CSS tweaks one by one), politely encourage the user to batch their requests into a larger body of work using an `implementation_plan.md` or spec file.
4. **Mandatory Architecture Reference**: Before designing new educational solvers or modifying shared math infrastructure, consult `spec/01-architecture-and-standards.md`, `spec/todo.md`, and module-level specs (e.g., `pre-algebra-solver/specs/`, `graphing-lines/specs/`).

## 8. Strict Verification & Systemic Bug Searching

- **Mandatory Validation Loop:** You CANNOT declare a task "done" without explicitly validating both the UI logic and the Developer Console. Use the `visual-verification` skill (`chrome-devtools-mcp`) or open `http://localhost:3000` to verify there are zero console errors and that math expressions/DOM layouts render as intended.
- **Systemic Pattern Matching:** If you discover a bug caused by a specific code pattern (e.g., direct NaN comparisons, unsimplified fractions, improper KaTeX escaping, unhandled zero denominators), you MUST proactively search the ENTIRE codebase for identical patterns using `ast-grep` or `rg`, and fix them globally before reporting back. Never assume a bug is isolated to a single file.

## 9. Spec-Driven Lifecycle & Living Architecture Maintenance

- **Specs First (`./spec` & module specs):** Any time a new body of work, solver mode, or major refactor is initiated, draft or reference the proposal document under `spec/` or module-level specs (e.g., `graphing-lines/specs/01-architecture.md`).
- **Implementation Plan Mandate:** Every `implementation_plan.md` MUST explicitly begin with a review and direct reference to the active spec, and receive explicit user approval before touching code.
- **Work Decomposition:** The approved spec must clearly decompose into specific verifiable tasks: mathematical models, state machines, generator logic, and DOM/UI checks.
- **Living Architecture Updates:** As work is completed, tested, and visually verified, reflect changes in:
  1. Targeted unit and headless browser integration tests (`test/`).
  2. Master architecture standards (`spec/01-architecture-and-standards.md`).
  3. Module roadmaps and completed milestones (`spec/todo.md`).

## 10. Structured Prompts & Subagent Delegation

- **Structured Prompts Over Free-Form Prose**: When delegating work to subagents, launching multi-agent workflows, or authoring task instructions, prompts MUST be structured rather than loose conversational text.
- **Mandatory Prompt Anatomy**:
  1. **Role & Specialist Persona**: Explicitly declare the agent's exact role (e.g., `Pedagogical Math Auditor`, `Interactive Solver UI Engineer`, `KaTeX Renderer Specialist`).
  2. **Context & Grounding References**: Link specific active specifications (`spec/*.md`) and module files (`shared/js/fraction.js`).
  3. **Explicit Scope & Boundaries**: Clearly state what is in scope and what is strictly out of scope to prevent domain drift.
  4. **Task Decomposition**: Break execution down into discrete, numbered steps with precise mathematical formulas, state contracts, or DOM selectors.
  5. **Verifiable Deliverables & Acceptance Criteria**: List exact files to create/modify, test suites to add/update, and execution commands (`node -c`, `make lint`, `make lint-rules`, `make test`).
  6. **Strict Governance & Constraints**: Enforce project non-negotiables: no unversioned CDNs, 0 syntax errors, zero console errors, clean fraction simplification.
- **Structured Handoff Reporting**: When subagents or autonomous agents complete a workflow, the handoff summary must be structured: Changes Applied, Test/Lint Results, Edge Cases Found, and Immediate Next Steps.

## 11. Workspace Skills & Purpose-Built Subagent Personas

- **Progressive Workspace Personas**:
  - `math-engine-auditor`: Verifies fraction arithmetic, equation generation algorithms, step-by-step solver rules, and division/multiplication steps.
  - `pedagogical-ui-engineer`: Builds responsive Tailwind layouts, printable worksheet templates, and interactive step input feedback.
  - `visual-auditor`: Verifies KaTeX math rendering, view transitions, responsive mobile reflow, and zero console errors via `chrome-devtools-mcp`.
  - `security-sanitizer`: Audits input sanitization, safe DOM text manipulation, and AST security rules.
  - `spec-architect`: Drafts module specifications and keeps `spec/` roadmaps synchronized.

## 12. Zero-Friction Lazy MCP Signatures & Proactive Coaching Triggers

### 12.1 Direct `call_mcp_tool` Signatures (No Schema Lookup Required)

To eliminate schema-lookup overhead, call these lazy MCP tools directly via `call_mcp_tool`:

- **LSP Symbol Lookup (`lsp-bridge` -> `lsp_find_symbol`)**:
  - `Arguments`: `{ "name": "<symbolName>", "include": ["hover", "definition", "references"] }`
- **LSP Module Surface (`lsp-bridge` -> `lsp_file_exports`)**:
  - `Arguments`: `{ "file_path": "/Users/jacobfisher/coding/kid-school/shared/js/fraction.js", "include_signatures": true }`
- **AST Structural Search (`ast-grep` -> `find_code`)**:
  - `Arguments`: `{ "project_folder": "/Users/jacobfisher/coding/kid-school", "language": "javascript", "pattern": "<AST_Pattern>" }`
- **Browser Console Audit (`chrome-devtools-mcp` -> `list_pages` & `list_console_messages`)**:
  - `list_pages` `Arguments`: `{}`
  - `list_console_messages` `Arguments`: `{ "pageId": 1, "types": ["error", "warn"] }`
- **Multi-Step Pedagogical/Mathematical Reasoning (`sequential-thinking` -> `sequentialthinking`)**:
  - `Arguments`: `{ "thought": "<step analysis>", "thoughtNumber": 1, "totalThoughts": 4, "nextThoughtNeeded": true }`

### 12.2 Proactive User Coaching & Slash Command Recommendations

Agents MUST proactively suggest the following workflows and tools to the user when matching conditions arise:

1. **Ambiguous Requirements or Solver Edge Cases -> Recommend `/grill-me`**:
   - _Trigger_: When the user proposes a new mathematical solver mode or ambiguous pedagogical flow.
   - _Prompt to User_: _"Tip: You can type `/grill-me` to run a rapid interactive interview to lock down solver edge cases before we draft the spec."_
2. **Complex Multi-Step Step Logic -> Invoke `sequential-thinking` & Inform User**:
   - _Trigger_: Tasks involving multi-step equation transformations, complex fraction factoring, or long division carry steps.
   - _Action_: Automatically call `sequential-thinking` (`sequentialthinking`) before authoring the plan and explain key mathematical transitions to the user.
3. **Large Multi-Module Features or Deep Audits -> Recommend `/goal` or `/boost`**:
   - _Trigger_: Long-running refactors, full-codebase audits, or new module builds (e.g. Graphing Lines module).
   - _Prompt to User_: _"Tip: For deep multi-step verification or autonomous completion across all modules, consider triggering `/boost` or `/goal`."_
4. **Recurring Health Checks or Timed Reminders -> Recommend `/schedule`**:
   - _Trigger_: CDN version checks, periodic test runs, or follow-up reminders.

---

_These rules are to be followed by all contributors and AI assistants working on Kids School Helpers._
