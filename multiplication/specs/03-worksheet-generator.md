# 03 - Worksheet Generator

## Function
Generates printable worksheets and corresponding answer keys for multiplication problems.

## Supported Modes
1. **Standard & Decimals:** Generates a grid of vertical multiplication problems based on the digit and decimal configuration.
2. **Fractions:** Generates a grid of horizontal fraction multiplication problems.

## Interface Layout
* **Parameters:** Dropdown for number of problems (e.g., 6, 8, 12, 16), checkboxes for decimals and fractions, and answer key inclusion.
* **Print Layout:** Utilizes CSS `@media print` rules to hide the configuration panel and main navigation, ensuring only the worksheet pages (and optional answer key) are printed.
