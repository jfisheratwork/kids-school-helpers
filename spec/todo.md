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
  - Added dual input boxes (**1. Partial / Step Result** + **2. Final Answer**) below equations in `fractions/` and `pre-algebra-solver/`, supporting immediate full-problem completion when the final answer is entered directly.
  - Added upfront vertical multi-step progression lists in `fractions/` (`#fractions-steps-list`) and `pre-algebra-solver/` (`#history-list`) displaying all planned steps (`Step 1..N`) and retaining completed KaTeX step results.

## Remaining / Future Enhancements
- `[ ]` Expand word problem / real-world application modes across modules.
- `[ ]` Add optional audio/speech synthesis read-aloud support for step captions.
