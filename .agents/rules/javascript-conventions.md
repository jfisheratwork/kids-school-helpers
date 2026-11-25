---
trigger: model_decision
description: Vanilla ES6+ JavaScript naming, commenting, complexity, and domain validation conventions for Kids School Helpers.
globs: '**/*.js, **/*.mjs, **/*.cjs'
---

# JavaScript Naming & Coding Conventions

These conventions must be strictly followed when writing or refactoring Vanilla ES6+ JavaScript in **Kids School Helpers**.

## 1. Naming Conventions

### No Ambiguous Single-Character Variable Names

- Except for standard mathematical coordinates or algebraic symbols when strictly local and unambiguous (e.g., `x`, `y`, `m`, `b` for linear equations `y = mx + b`, or `n`, `d` inside low-level `Fraction` arithmetic), avoid single-character variable names like `i`, `j`, `p`, `r`, `s`.
- Use descriptive names: `stepIndex` instead of `i`, `problemItem` instead of `p`, `remainderValue` instead of `r`, `stepList` instead of `s`.

### Avoid Core Type & Reserved Name Conflicts

- Do **not** use names of core constructs, language built-ins, or base data types as parameter or variable names.
- Examples of forbidden names: `string`, `val`, `value`, `object`, `array`, `number`.
- Use specific names: `inputText`, `numeratorValue`, `parsedFraction`, `problemSpec`.

### Event Parameter Naming

- Do **not** use generic single-character `e`, `ev`, or generic `event` for event handlers.
- Use `passedEvent` or a domain-specific name such as `clickEvent`, `inputEvent`, or `keyEvent`.

### Exception Catch Naming

- Do **not** use generic `e` or `err` in `catch` blocks.
- Name the caught error after the operation that failed:
  - `parseFractionError`
  - `renderLatexError`
  - `generateProblemError`
  - `transitionError`

### Allowed Semantic Abbreviations

- Short semantic abbreviations are allowed when their mathematical or DOM context is unmistakable:
  - `gcd` / `lcm` (greatest common divisor / least common multiple)
  - `num` / `den` (numerator / denominator)
  - `coeff` (coefficient)
  - `stepIdx` (step index)
  - `el` / `btnEl` (DOM element suffix)

## 2. Code Commenting

- Include a concise header comment at the top of each module explaining its pedagogical or technical responsibility.
- Include a brief JSDoc or docstring comment above exported functions and classes detailing inputs, outputs, and invariants.
- When introducing a pinned CDN library or Web API (e.g., KaTeX, View Transitions API, `SpeechSynthesis`) for the first time in a file, include:
  1. A comment linking to the official release notes or specification documentation.
  2. A short note explaining its role in that module.

## 3. Style Preferences & Code Complexity

### Prefer Explicit Named Functions Over Deep Inline Callbacks

- Prefer named helper functions over long anonymous arrow callbacks in event listeners, array pipelines, and animation steps:
  ```javascript
  steps.forEach(renderSolverStep);
  ```

### Function Length and Cognitive Complexity

- Keep functions focused and under ~100 lines. Split longer generator or UI rendering routines into smaller, named helpers.
- Limit nesting: Nested control statements (`if`, `for`, `while`, `switch`) should not exceed 2 levels deep. Use guard clauses (early returns) and helper functions to keep control flow flat.
- Always use `const` or `let` (never `var`) and strict equality (`===` / `!==`). Never compare directly against `NaN` (use `Number.isNaN()`).

## 4. Math Domain Validation & Safe Coercion

### Validate at Boundaries

- All raw user inputs (custom equation fields, fraction input boxes, URL query strings, DOM dataset values) MUST pass through dedicated parsing and validation functions before entering math engines.
- Never silently coerce invalid numeric input to `0` if an error should be surfaced to the student.

### Exact Arithmetic Over Floating-Point Drift

- Use [`Fraction`](../../shared/js/fraction.js) for rational arithmetic in fraction, pre-algebra, and graphing solvers to avoid IEEE-754 floating-point rounding bugs (e.g., `0.1 + 0.2 !== 0.3`).
- Always guard against zero denominators (`den === 0`) and non-finite numbers (`!Number.isFinite(parsedNum)`) before performing division or constructing a `Fraction`.
