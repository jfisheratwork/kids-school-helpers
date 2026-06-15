# Repository Tasks & Roadmap

This file tracks the overarching progress of the `kids-school-helpers` repository. Detailed, module-specific plans should reside within their respective module directories (e.g., `pre-algebra-solver/specs/`).

## Phase 1: Pre-Algebra Solver Module [DONE]
- `[x]` Establish repository structure, unified index, and deployment pipelines.
- `[x]` Build Procedural Equation Generator engine.
- `[x]` Implement Mathematical Rendering (KaTeX) for fractions and variables.
- `[x]` Build Worksheet Generator Mode (responsive UI + print formatting).
- `[x]` Build Interactive Solver Mode (Guided step-by-step state machine).
- `[x]` Implement Visual Explanation Player (animations and autocomplete features).
- `[x]` Modularize JavaScript files (`state.js`, `generator.js`, `solver-ui.js`, `hints-player.js`).
- `[x]` Write robust integration test suite (`test/integration.html`).

## Phase 2: Graphing & Slope Module [PENDING]
- `[ ]` Define architecture and rendering engine (Canvas vs SVG vs library like JSXGraph/Chart.js).
- `[ ]` Design Worksheet Generator for graphing paper and plot exercises.
- `[ ]` Design Interactive Solver for guiding students through slope-intercept form (`y = mx + b`), point-slope, and finding intersections.
- `[ ]` Build visual explanation player for animating lines, showing rise-over-run, and calculating intercepts.
