# Repository Tasks & Roadmap

This file tracks the overarching progress of the `kids-school-helpers` repository. Detailed, module-specific plans should reside within their respective module directories (e.g., `pre-algebra-solver/specs/`).

## Completed Milestones
- `[x]` **Phase 1: Pre-Algebra Solver Module** (`pre-algebra-solver/`)
- `[x]` **Phase 2: Graphing & Slope Module** (`graphing-lines/`)
- `[x]` **Phase 3: Fractions, Multiplication, Division, and Geometry Solvers** (`fractions/`, `multiplication/`, `division/`, `geometry/`)
- `[x]` **Phase 4: Unified Multi-Frame Solver Animation Engine (`spec/02-unified-solver-animations.md`)**
  - Upgraded `ViewTransitions` (`shared/js/view-transitions.js`) and `shared/css/main.css` with leaf `\htmlId` token morphing (`view-transition-class: math-token`), decoupled `--morph-duration` (`0.65s`), and `:only-child` entry/exit keyframes.
  - Built `SharedAnimationPlayer` (`shared/js/animation-player.js`) with Frame Captions (`#anim-frame-caption`), Play/Pause/Replay (`#btn-anim-play`), Fill Answer (`#btn-anim-fill`), and Two-Stage `Tab` behavior across all 6 solver modules.

## Remaining / Future Enhancements
- `[ ]` Expand word problem / real-world application modes across modules.
- `[ ]` Add optional audio/speech synthesis read-aloud support for step captions.
