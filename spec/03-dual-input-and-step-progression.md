# 03 - Manual-Advance Animations, Dual Inputs, and Upfront Step Progression

## 1. Overview & Pedagogical Motivation
To give students full control over pacing, mental math shortcuts, and multi-step visibility, the interactive solvers enforce three core interaction rules:
1. **Manual-Advance Animations (`autoplay: false` by default)**: Visual step explanations never auto-play on a timer when opened. Students advance frame-by-frame at their own reading speed using either the player buttons (`Next →` / `← Back`) or repeated presses of the `Tab` key (with an optional `Play` button if they explicitly choose timer playback).
2. **Dual Inputs Below Each Equation (Partial Result vs. Final Answer)**: Every equation/problem workspace in `fractions/` and `pre-algebra-solver/` provides two distinct inputs:
   - **Partial / Step Result Input**: For working through intermediate steps sequentially.
   - **Final Answer Input**: For submitting the final solution at the end of the problem—or immediately at any point if the student solved the problem mentally or on paper.
3. **Upfront Multi-Step Progression Display**: Instead of hiding future steps or overwriting intermediate steps (such as the LCD in fractions), the solver workspace above the inputs displays all planned steps for the current problem upfront as vertical rows/slots, filling in each step's mathematical result as it is completed.

---

## 2. Global Manual-Advance Animation Contract (`shared/js/animation-player.js`)

### 2.1 No Default Autoplay
- `SharedAnimationPlayer.play()`, `loadFrames()`, and `handleTabKey()` default to `autoplay = false`.
- Opening a hint displays **Frame 1 (`1/N`)** in a paused state (`playing = false`), showing the `Play` button rather than `Pause`.

### 2.2 Multi-Tab Frame Progression & Intelligent Fill
When the student presses `Tab` inside an active solver input:
1. **1st `Tab` Press (Hint Closed or Different Step)**:
   - Opens `#visual-explanation-container` and renders **Frame 1 (`1/N`)** paused (`autoplay: false`).
   - Does not modify the student's input boxes.
2. **Subsequent `Tab` Presses (While `index < frames.length - 1`)**:
   - Advances the visual explanation by one frame (`index++`, e.g., `1/3` $\rightarrow$ `2/3` $\rightarrow$ `3/3`) using View Transitions token morphing.
   - Keeps input boxes untouched while the student steps through the visual breakdown.
3. **Final `Tab` Press (When `index === frames.length - 1`)**:
   - Intelligently populates the expected answer into the appropriate input box (**Partial Result** vs. **Final Answer**) and focuses that input with `.math-Input-filled-pulse`.

---

## 3. Dual Input System (`fractions/` & `pre-algebra-solver/`)

### 3.1 Input Roles
1. **Partial Result Input (`#fractions-step-input` / `#step-input`)**:
   - Active during intermediate steps (`currentStepIdx < steps.length - 1`).
   - Validates the current intermediate step (`Enter` key). When correct, marks the current step row complete in the solver above and advances `currentStepIdx`.
   - When `currentStepIdx` reaches the final step (`steps.length - 1`), focus automatically transitions to the **Final Answer Input** (while still accepting final-step entry in `#step-input` for backwards compatibility with legacy test harnesses).
2. **Final Answer Input (`#fractions-final-input` / `#final-answer-input`)**:
   - Always enabled while the problem is unsolved.
   - Validates against the problem's final step / solution (`steps[steps.length - 1]`).
   - **Direct Final Answer Completion**: If the student enters the correct final answer while earlier intermediate steps are still pending, all remaining intermediate step slots in the solver above are automatically populated and marked complete, and the problem transitions to the **Solved** state.

### 3.2 Intelligent `Tab` Target Selection
When `Tab` reaches the fill stage (after the final animation frame) or when the student clicks `#btn-anim-fill`:
- If the student initiated `Tab` from the **Final Answer Input** (`#fractions-final-input` / `#final-answer-input`), OR if the active step is the **final step** of the problem (`currentStepIdx === steps.length - 1`):
  - Fills the final answer into the **Final Answer Input** and focuses it.
- Otherwise (the student is on an intermediate step `currentStepIdx < steps.length - 1`):
  - Fills the intermediate step's expected result into the **Partial Result Input** and focuses it.

---

## 4. Upfront Multi-Step Solver Display (`fractions/` & `pre-algebra-solver/`)

### 4.1 Pre-Algebra Solver (`pre-algebra-solver/`)
- `#history-list` acts as a complete vertical **Step Roadmap & History** above the active equation and dual inputs:
  - **Row 0 (`Original`)**: Displays the starting equation (`initialLHS = initialRHS`).
  - **Rows 1..N (Planned Steps)**: Rendered immediately when a problem is generated:
    - **Completed (`i < currentStepIdx`)**: Displays the completed step's LaTeX equation and a green step badge (`Step i: Distribute`).
    - **Current (`i === currentStepIdx`)**: Highlighted with an active indigo border/badge (`Current Step i of N: <Objective>`) and prompt placeholder.
    - **Upcoming (`i > currentStepIdx`)**: Displays the upcoming step number and objective (`Step i of N: <Objective>`) in a muted preview row so the student sees all required steps upfront.

### 4.2 Fractions Practice (`fractions/`)
- Above the dual inputs, the solver workspace renders:
  - **Problem Expression Header (`#fractions-math-display`)**: Large KaTeX rendering of the problem expression.
  - **Upfront Step Progression List (`#fractions-steps-list`)**: Shows every step for the generated problem (`1..N`) as distinct vertical rows:
    - **Completed rows**: Keep their rendered KaTeX partial result permanently visible (e.g., $\text{LCD} = 12$, converted fractions $\frac{3}{12} + \frac{2}{12}$, and final simplified fraction $\frac{5}{12}$).
    - **Active row**: Highlighted with step badge (`Partial Step` or `Final Answer`) and description.
    - **Upcoming rows**: Visible as pending step slots showing what operations follow.

### 4.3 Multiplication Practice (`multiplication/`)
- **Standard Multiplication Mode (`#mode-standard-container`)**:
  - Provides dual inputs below the multiplication grid: **1. Partial / Step Result** (`#standard-step-input`) and **2. Final Answer** (`#standard-final-input`).
  - Pressing `Tab` on the final visual frame fills `#standard-step-input` on intermediate digit/placeholder/addition steps, or fills `#standard-final-input` on the final step (or when `Tab` was pressed inside `#standard-final-input` with `finalProductDisplay`).
  - Submitting the correct final product (`finalProductDisplay`) in `#standard-final-input` at any point immediately executes and populates all remaining partial product rows, carries, final sum digits, and decimal point in the grid above, marking the problem solved.
- **Fractions Multiplication Mode (`#mode-fractions-container`)**:
  - Provides upfront step progression (`#fractions-steps-list`) and dual inputs: **1. Partial / Step Result** (`#fractions-step-input`) and **2. Final Answer** (`#fractions-final-input`).

### 4.4 Division Practice (`division/`)
- **Long Division Mode (`#mode-long-division-container`)**:
  - Provides dual inputs below the long division bracket grid: **1. Partial / Step Result** (`#long-division-step-input`) and **2. Final Answer (Quotient)** (`#long-division-final-input`).
  - Pressing `Tab` on the final visual frame fills `#long-division-step-input` on intermediate divide/multiply/subtract/bring-down steps, or fills `#long-division-final-input` on the final step (or when `Tab` was pressed inside `#long-division-final-input` with `quotientStr`).
  - Submitting the correct full quotient (`quotientStr`) in `#long-division-final-input` at any point immediately populates all remaining quotient digits, multiplication rows, subtraction remainders, and bring-downs in the long division bracket above, marking the problem solved.
- **Fractions Division Mode (`#mode-fractions-container`)**:
  - Provides upfront step progression (`#fractions-steps-list`) and dual inputs: **1. Partial / Step Result** (`#fractions-step-input`) and **2. Final Answer** (`#fractions-final-input`).

---

## 5. Layout-Safe View Transitions & Smooth Fade-In (`shared/js/view-transitions.js` & `shared/css/main.css`)

### 5.1 Root Cause of Initial Right-Aligned / Off-Center Jump
- Previously, `ViewTransitions.applyNames()` matched `container.querySelectorAll('[id]')` and applied `view-transition-name` to every element with an `id` (including `<tr id="...">` and `<td id="...">` cells inside the Multiplication and Long Division `<table>` grids).
- Combined with `[style*="view-transition-name"] { display: inline-block; width: fit-content; }` in `shared/css/main.css`, table cells and rows were temporarily forced to `display: inline-block; width: fit-content` for the `0.65s` View Transition duration, collapsing column widths and shifting the grid off-center until `ViewTransitions.clearNames()` removed `view-transition-name` after `0.65s`.

### 5.2 Resolution
1. **Scope `ViewTransitions.applyNames()` Strictly to KaTeX `\htmlId` Spans**:
   - Query `container.querySelectorAll('.enclosing[id]')` instead of `[id]`, so structural HTML table cells (`<td>`, `<tr>`) and layout containers are never assigned `math-token` view-transition names.
2. **Remove Destructive `display: inline-block; width: fit-content` Override**:
   - Remove `[style*="view-transition-name"] { display: inline-block; width: fit-content; }` from `shared/css/main.css` so elements retain their native display and centering geometry at all times.
3. **Smooth Container Fade-In (`.math-fade-in`)**:
   - Apply a gentle opacity fade-in (`0.35s cubic-bezier(0.22, 1, 0.36, 1)`) when rendering new problems or updating grid steps so visual updates appear smoothly centered from frame zero without any horizontal jump.
