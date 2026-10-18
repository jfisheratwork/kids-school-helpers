# 01 - Architecture and Standards

## System Architecture
* **Deployment Target:** GitHub Pages via GitHub Actions.
* **Target Repository:** `https://github.com/jfisheratwork/kids-school-helpers.git`.
* **Architecture:** Single Page Application (SPA), fully client-side. No backend server. Application must function as a standalone module within a larger multi-application repository.
* **Permitted Technologies:** HTML5, CSS3, Vanilla ES6+ JavaScript. Complex UI frameworks (e.g., React, Vue, Angular) are strictly prohibited. Lightweight utility libraries are permitted provided build artifacts remain static files.
* **Styling:** Utility-first CSS framework (e.g., Tailwind CSS) to enforce responsive design components without introducing complex JavaScript dependencies.

## Repository and Directory Structure
* **Root Integration:** The repository root must contain a primary `index.html` acting as a centralized navigational hub linking to all hosted applications.
* **Application Isolation:** Each solver module resides in a dedicated subdirectory (`/pre-algebra-solver/`, `/fractions/`, `/multiplication/`, `/division/`, `/geometry/`, `/graphing-lines/`).
* **Shared Utilities (`/shared/`):** Shared math primitives (`fraction.js`), KaTeX rendering (`renderer.js`), View Transitions (`view-transitions.js`), and the unified step animation engine (`animation-player.js`) reside in `/shared/js/` and `/shared/css/main.css`.

## User Interface & Pedagogical Animation Standards
* **Design Language:** Minimalist, high contrast, sans-serif typography.
* **Unified Step-by-Step Visual Explanation (`SharedAnimationPlayer` & `ViewTransitions`):**
  * All solvers use a 3-frame KaTeX `\htmlId` token-morphing sequence driven by the View Transitions API (`shared/js/view-transitions.js`) and `SharedAnimationPlayer` (`shared/js/animation-player.js`).
  * **Decoupled Morph vs. Playback Timing:** CSS `--morph-duration` (`0.65s`, `cubic-bezier(0.22, 1, 0.36, 1)`) controls the physical token glide, while `--transition-duration` (`#anim-speed`, default `2.5s`) controls the pause interval between frames.
  * **Manual-Advance `Tab` Key & Playback Behavior (`autoplay: false` by default):**
    * Animations never auto-play by default when opened; students advance frames via the `Next →` / `← Back` buttons or repeated `Tab` presses (or opt into timer playback via `Play`).
    * **1st `Tab` Press:** Opens `#visual-explanation-container` on Frame 1 (`1/N`, paused) without spoiling the student's input boxes.
    * **Subsequent `Tab` Presses (while `frameIndex < totalFrames - 1`):** Advances the visual explanation to the next frame (`2/N`, `3/N`, etc.).
    * **Final `Tab` Press (on last frame, or `#btn-anim-fill`):** Intelligently fills the expected answer into the **Partial Result** input (for intermediate steps) or **Final Answer** input (for the final step or when focused in the final answer box) with an indigo highlight pulse (`.math-Input-filled-pulse`).
* **Dual Inputs & Upfront Multi-Step Progression (`spec/03-dual-input-and-step-progression.md`):**
  * Solvers in `fractions/` and `pre-algebra-solver/` provide both a **Partial / Step Result** input and a **Final Answer** input below the equation, plus an upfront vertical list of all planned steps above the inputs that fills in as steps are completed.
* **Responsiveness:** Layout must reflow linearly for mobile viewports, shifting the Hint System Container below the Active Input Container.
