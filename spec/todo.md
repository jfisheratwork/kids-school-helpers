# Repository Tasks & Roadmap

This file tracks the overarching progress of the `kids-school-helpers` repository. Detailed, module-specific plans should reside within their respective module directories (e.g., `pre-algebra-solver/specs/`).

## Completed Milestones
- `[x]` **Phase 1: Pre-Algebra Solver Module** (`pre-algebra-solver/`)
- `[x]` **Phase 2: Graphing & Slope Module** (`graphing-lines/`)
- `[x]` **Phase 3: Fractions, Multiplication, Division, and Geometry Solvers** (`fractions/`, `multiplication/`, `division/`, `geometry/`)
- `[x]` **Phase 4: Unified Multi-Frame Solver Animation Engine (`spec/02-unified-solver-animations.md`)**
  - Upgraded `ViewTransitions` (`shared/js/view-transitions.js`) and `shared/css/main.css` with leaf `\htmlId` token morphing (`view-transition-class: math-token`), decoupled `--morph-duration` (`0.65s`), and `:only-child` entry/exit keyframes.
  - Built `SharedAnimationPlayer` (`shared/js/animation-player.js`) with Frame Captions (`#anim-frame-caption`), Play/Pause/Replay (`#btn-anim-play`), Fill Answer (`#btn-anim-fill`), and Two-Stage `Tab` behavior across all 6 solver modules.
- `[x]` **Phase 5: Step-by-Step Explainer Guide for Fractions Practice (`fractions/specs/01-explainer-guide.md`)**
  - Added collapsible `<details id="guide-fractions">` drawer establishing parity with `pre-algebra-solver` and `geometry`.
  - Built modular `fractions/js/guide.js` with dynamic KaTeX typesetting across all 4 fraction topics (`addsub`, `multiply`, `divide`, `concepts`).
  - Added topic pill selector inside drawer and synchronized with Problem Config dropdowns.
  - Fixed systemic zero-denominator generator bug and ViewTransitions uncaught abort rejection.
- `[x]` **Phase 6: Manual-Advance Animations, Dual Inputs & Upfront Multi-Step Progression (`spec/03-dual-input-and-step-progression.md`)**
  - Disabled default animation autoplay (`autoplay: false`) across `SharedAnimationPlayer` (`shared/js/animation-player.js`), `fractions`, `pre-algebra-solver`, and `graphing-lines`.
  - Updated `Tab` key workflow to open paused on Frame `1/N`, step through frames `2..N` on subsequent `Tab` presses, and intelligently populate either the **Partial / Step Result** or **Final Answer** input on the final frame.
  - Added dual input boxes (**1. Partial / Step Result** + **2. Final Answer**) and upfront vertical multi-step progression lists across `fractions/`, `pre-algebra-solver/`, `multiplication/` (Standard & Fractions modes), and `division/` (Long Division & Fractions Division modes), supporting immediate full-problem completion when the final answer is entered directly.
  - Fixed initial right-aligned / off-center layout jump in table-based math grids (`shared/js/view-transitions.js` and `shared/css/main.css`) by scoping `view-transition-name` strictly to KaTeX `.enclosing[id]` tokens and adding a smooth `.math-fade-in` (`0.35s ease-out`) container fade-in.

- `[x]` **Phase 7: Multi-Digit Fractions Practice & Custom Variation**
  - Added **Number Size** dropdown (`Single Digit (1–9)`, `Double Digits (10–99)`, `Triple Digits (100–999)`) to Fractions Practice (`fractions/index.html`) across both Interactive Solver and Worksheet Generator modes.
  - Scaled fraction generators (`generator-addsub.js`, `generator-mult.js`, `generator-div.js`, `generator-concepts.js`) to generate multi-digit numerators and denominators while preserving valid mathematical reductions and zero-denominator safety.

- `[x]` **Phase 8: Fractions-to-Decimals (Long Division) & Decimals-to-Fractions Courses (`spec/04-fractions-and-decimals-conversion.md`)**
  - Added `/fractions-to-decimals/` with an interactive decimal long-division bracket, upfront How-To guide drawer (`guide.js`), 4 complexity levels (`basic`, `medium`, `challenging`, `repeating`), 3-frame `\htmlId` animations, dual inputs, and printable worksheets with full long-division Answer Keys.
  - Added `/decimals-to-fractions/` with step-by-step Place Value & GCF reduction, upfront How-To guide drawer (`guide.js`), 3 complexity levels (`basic`, `medium`, `challenging`), 3-frame `\htmlId` animations, dual inputs, and printable worksheets with step-by-step Answer Keys.

- `[x]` **Phase 9: Agent Governance, `.agents/` Ecosystem, Makefile & Deterministic Validation (`spec/05`–`spec/08`)**
  - Upgraded `AGENTS.md` with Harness Retrospective, Code Hygiene & YAGNI, Project-Relative Markdown Links, Fail-Fast / Zero Silent Fallbacks, Large Payload Offloading, Vertical Slices, and Mandatory Multi-Option UI Mockups (`spec/05-agents-governance-upgrades.md`).
  - Materialized `.agents/agents/` (`math-auditor.md`, `ui-auditor.md`), `.agents/rules/` (`coding.md`, `javascript-conventions.md`, `git-pre-commit.md`, `node-js.md`), `.agents/skills/` (`math-engine-audit`, `git-commit-push`), and 7 new `.agents/ast-grep-rules/` rules (`spec/06-agents-ecosystem-and-ast-rules.md`).
  - Consolidated `Makefile` targets (`serve`/`stop`/`status`, `test-unit`/`test-e2e`/`test`, `lint`, `check-repo`, `check`/`repchecks`, `pre-push`, `install-hooks`) (`spec/07-makefile-targets.md`).
  - Added `scripts/check-repo.js` (`--links`, `--skills`, `--cdn`), `scripts/lint-rules.js`, `.githooks/pre-push`, `.prettierrc`/`.prettierignore`, and upgraded `scripts/post-tool-quality.js` and `.githooks/pre-commit` (`spec/08-deterministic-validation-scripts.md`).

## Remaining / Future Enhancements
- `[ ]` Expand word problem / real-world application modes across modules.
- `[ ]` Add optional audio/speech synthesis read-aloud support for step captions.
