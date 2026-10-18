# 02 - Unified Solver Step Animations Specification

## 1. Overview & Pedagogical Goals

Across all interactive solvers in **Kids School Helpers** (`pre-algebra-solver`, `fractions`, `multiplication`, `division`, `geometry`, and `graphing-lines`), step-by-step hints use a unified **Visual Explanation Player** powered by KaTeX `\htmlId{...}{...}` token tagging and the CSS View Transitions API (`document.startViewTransition`).

### Core Pedagogical Principles
1. **Multi-Frame Conceptual Progression (3 Frames per Step)**:
   - **Frame 1 (Current State)**: Displays the active expression, equation, or sub-problem with semantic `\htmlId` leaf tokens.
   - **Frame 2 (Highlighted Operation)**: Introduces the mathematical action (e.g., inverse operation on both sides, common denominator multiplier, Keep-Change-Flip reciprocal swap, digit multiplication + carry, or formula substitution) highlighted in Indigo (`\textcolor{#4f46e5}{...}`).
   - **Frame 3 (Simplified Result)**: Morphs the matching `\htmlId` tokens into their simplified positions for the completed step.
2. **Per-Frame Pedagogical Captions**:
   - Each frame includes a concise human-readable caption (`#anim-frame-caption`) explaining the exact transformation occurring in that frame.
3. **Decoupled Morph Speed vs. Reading Pause**:
   - **Morph Duration (`--morph-duration: 0.65s`)**: Tokens glide smoothly between positions over `0.65s` using `cubic-bezier(0.22, 1, 0.36, 1)`.
   - **Frame Pause Delay (`--frame-delay`)**: Controlled by the user's `Delay` slider (`0.5s` to `10.0s`, default `2.5s`), determining how long the player pauses on each frame during auto-play.
4. **Two-Stage `Tab` Hint Interaction**:
   - **1st `Tab` Press**: Opens the `#visual-explanation-container` and auto-plays the multi-frame visual explanation from Frame 1 without immediately overwriting the student's input box.
   - **2nd `Tab` Press** (when the visual explanation for the current step is already visible, or when clicking the **Fill Answer** button `#btn-anim-fill`): Populates the expected answer for the current step into the active input field and focuses it.

---

## 2. Shared Architecture (`shared/js/view-transitions.js` & `shared/js/animation-player.js`)

### 2.1 Leaf-Token `\htmlId` Rules
- Do **not** nest `\htmlId` tags inside another `\htmlId` when the inner token is meant to morph independently across frames; parent snapshots capture child elements and prevent independent movement.
- Keep token IDs identical between Frame $k$ and Frame $k+1$ for terms that persist or move (e.g., `\htmlId{n2}{...}` and `\htmlId{d2}{...}` swapping from numerator to denominator in Keep-Change-Flip).
- Newly introduced operation terms in Frame 2 use dedicated IDs (e.g., `add-lhs`, `add-rhs`, `div-lhs`, `div-rhs`, `op-mult`) so `:only-child` View Transition entry/exit animations highlight their appearance and disappearance.

### 2.2 View Transitions CSS & Accessibility (`shared/css/main.css`)
- `:root { view-transition-name: none; }` and `::view-transition { pointer-events: none; }` ensure that page controls, buttons, and inputs remain interactive while a localized math transition is active.
- Every `[id]` element inside a transitioned math container receives `view-transition-class: math-token` and `display: inline-block; width: fit-content;` to prevent aspect-ratio stretching.
- `@media (prefers-reduced-motion: reduce)` disables View Transition motion for accessibility.
- Temporary `view-transition-name` styles are cleaned up once `transition.finished` settles to prevent cross-container ID collisions.

### 2.3 `SharedAnimationPlayer` Contract (`shared/js/animation-player.js`)
- Supports frames as either LaTeX strings (`"\\frac{1}{2}"`) or objects (`{ math: "...", caption: "...", html: "..." }`), plus an optional parallel `captions: string[]` array on the step object (`step.frameCaptions`).
- Binds standard DOM controls inside `#visual-explanation-container`:
  - `#visual-explanation-display`: KaTeX block render target.
  - `#anim-frame-caption`: Per-frame explanation badge.
  - `#btn-anim-play`: Play / Pause toggle button.
  - `#btn-anim-prev` & `#btn-anim-next`: Manual frame (and optional cross-step) navigation.
  - `#btn-anim-fill`: One-click button to fill the current step's answer into the active input.
  - `#anim-frame-counter`: Displays `current/total` frame index.
  - `#anim-speed` & `#anim-speed-display`: Controls frame pause delay.
