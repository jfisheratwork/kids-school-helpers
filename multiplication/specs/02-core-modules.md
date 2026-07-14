# 02 - Core Modules (Multiplication)

The application implements two primary modes: Interactive Solver Mode and Worksheet Generator Mode, split across two distinct mathematical flows (Standard/Decimals and Fractions).

## Standard/Decimal Generator Engine (`generator-standard.js`)
* **Function:** Procedurally generate multi-digit and decimal multiplication problems.
* **Parameters:** Drop-downs for 1, 2, 3, 4 digit combinations. Configurable number of decimal places (e.g., 0 to 2).

## Fraction Generator Engine (`generator-fractions.js`)
* **Function:** Procedurally generate fraction and mixed-number multiplication problems.
* **Parameters:** Options for proper fractions, improper fractions, and mixed numbers.

## Mathematical Rendering Engine (`renderer.js`)
* **Requirement:** Render mathematical notation using KaTeX.
* **Implementation:** Standard multiplication requires a vertical alignment (grid format) to allow highlighting and carrying. Fractions require standard horizontal rendering with distinct UI for numerators/denominators.
