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
  * **Two-Stage `Tab` Key Behavior:**
    * **1st `Tab` Press:** Opens `#visual-explanation-container`, displays the frame caption (`#anim-frame-caption`), and auto-plays the 3-frame visual breakdown without spoiling the student's input box.
    * **2nd `Tab` Press (or `#btn-anim-fill`):** Fills the expected step answer into the active input box (or plots the expected point in Graphing Lines) with an indigo highlight pulse (`.math-Input-filled-pulse`).
* **Responsiveness:** Layout must reflow linearly for mobile viewports, shifting the Hint System Container below the Active Input Container.
