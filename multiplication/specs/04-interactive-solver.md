# 04 - Interactive Solver Mode

## Function
A step-by-step guided state machine for solving multiplication problems interactively.

## Standard & Decimal Flow (`solver-ui-standard.js` & `hints-player-standard.js`)
* **Algorithm:** Standard vertical multiplication.
* **Steps:** Multiplying digits, handling carries (remainders) above the top number, summing partial products, and finally placing the decimal point based on total decimal places.
* **Tab-to-Hint:** Pressing `Tab` triggers the `hints-player-standard.js` to animate the current step, highlighting the multiplier and multiplicand digits, and moving the carry if applicable.

## Fraction Flow (`solver-ui-fractions.js` & `hints-player-fractions.js`)
* **Algorithm:** Horizontal multiplication (numerator $\times$ numerator, denominator $\times$ denominator).
* **Steps:** Converting mixed numbers to improper fractions (if applicable), optionally cross-simplifying, multiplying, and simplifying the final product.
* **Tab-to-Hint:** Highlights corresponding numerators or denominators to be multiplied, or suggests factors for simplification.
