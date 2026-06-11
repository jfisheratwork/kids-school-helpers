# 04 - Interactive Solver Mode

## Function
A step-by-step guided state machine corresponding to the 5 standard pre-algebra steps.
1. Distribute.
2. Combine like terms.
3. Move variables to one side.
4. Move constants to opposite side.
5. Isolate variable.

## Interface Layout
* **History Container (Top):** Displays previously completed steps as a vertical, bulleted sequence. Rendered via KaTeX/MathJax.
* **Active Input Container (Bottom/Center):** Single active text input field for the current required step.
* **Hint System Container (Right):** Contextual panel displaying current phase objectives and tooltips.

## Input and Validation Mechanics
* **Step Validation:** User input must be parsed and algebraically compared to the expected intermediate state. If equivalent, the input is locked, moved to the History Container, and the state machine advances.
* **Autocomplete Function:** Implement an event listener on the active input field for the `Tab` key.
  * `Event.preventDefault()` must be called to halt browser focus shift.
  * Triggering `Tab` injects a partial or complete string of the correct mathematical transformation into the input field.

## Progressive Hint System
* The active step triggers specific data in the right-hand panel.
* Tooltips appear on hover over mathematical operators (e.g., hovering over a division symbol displays a tooltip regarding multiplying by reciprocals).
