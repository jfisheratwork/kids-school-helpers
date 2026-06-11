# 02 - Core Modules

The application must implement two primary modes: Worksheet Generator Mode and Interactive Solver Mode.

## Equation Generator Engine
* **Function:** Procedurally generate multi-step linear equations.
* **Parameters:** Configurable variables for inclusion of fractions, negative numbers, parenthesis (distribution), and required steps (1 through 5).
* **Validation:** Algorithms must ensure generated equations yield finite, rational solutions.

## Mathematical Rendering Engine
* **Requirement:** Render mathematical notation, specifically fractions, in standard vertical typographic format rather than inline ASCII (e.g., $\frac{1}{2}$ instead of 1/2).
* **Implementation:** Utilize a client-side rendering library such as KaTeX or MathJax. Apply rendering to both generated worksheets and interactive UI elements via standard DOM manipulation.
