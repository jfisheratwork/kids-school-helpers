# Modularization Plan for Pre-Algebra Solver

We want to break down `index.html` to be much smaller and token-efficient, avoiding frameworks like Angular and sticking to modern Vanilla HTML/JS/CSS. This will make future iterations much faster and cleaner.

## Addressed Feedback
- **ES Modules and GitHub Pages**: Using ES Modules (`<script type="module">`) is **fully supported by GitHub Pages** because it serves files over standard HTTP/HTTPS with the correct MIME types. The only restriction with ES Modules is that they don't work when opening `index.html` directly via the `file://` protocol. Since you run `node server.js` locally and use GitHub Pages remotely, ES modules will work perfectly out-of-the-box without needing any build tools! We will use this approach for clean `import`/`export` separation.
- **Testing**: We will not run automated tests during the workflow. Instead, the agent will provide a clear signal when the entire implementation is complete, at which point the user will manually trigger the test suite (`make test`).

## Proposed Phases

### Phase 1: CSS Extraction
The `index.html` currently contains about 65 lines of inline CSS handling view transitions and print styling.
- **[NEW]** `pre-algebra-solver/css/styles.css`: Will contain all the CSS currently inside the `<style>` block of `index.html`.
- **[MODIFY]** `pre-algebra-solver/index.html`: Remove the `<style>` block and replace it with a `<link rel="stylesheet" href="css/styles.css">`.

### Phase 2: UI Logic Extraction (The Monolithic Script)
`index.html` has nearly 700 lines of inline JavaScript that handles everything from the step-by-step solver to the animation player and worksheet generation.

- **[NEW]** `pre-algebra-solver/js/app.js`: Main entry point (`<script type="module">`) that sets up global state and initializes event listeners.
- **[NEW]** `pre-algebra-solver/js/solver-ui.js`: Handles the core solver interaction (parsing user equations, solving next steps, displaying errors).
- **[NEW]** `pre-algebra-solver/js/hints-player.js`: Handles the Objectives & Hints panel (animation view transitions, timer intervals, next/back buttons).
- **[NEW]** `pre-algebra-solver/js/worksheet-generator.js`: Handles the logic for generating 10-20 random equations and managing the print/worksheet views.
- **[MODIFY]** `pre-algebra-solver/index.html`: Delete the massive inline script and replace it with a single module import: `<script type="module" src="js/app.js"></script>`.

### Phase 3: Generator Module Refactoring (Future)
`generator.js` is currently 1000+ lines. It currently handles equation generation, parsing, formatting, and mathematical evaluation.
- Break it down into specialized files: `parser.js`, `evaluator.js`, `formatter.js`, etc.
- *(Note: We will prioritize Phase 1 and 2 first to clean up the UI layer before tackling the logic layer).*

## Verification Plan
1. The agent will execute Phases 1 and 2.
2. The agent will signal completion.
3. The user will manually run `make test` and verify that the UI, solver, and worksheet features behave identically to before.
