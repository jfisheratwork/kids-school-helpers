# Fractions Practice: Step-by-Step Explainer Guide Specification

## Overview
This specification defines the architectural and pedagogical design for adding a step-by-step explainer guide drawer to the **Fractions Practice** module (`fractions/`), establishing parity with `pre-algebra-solver`, `multiplication`, `division`, and `geometry`.

## User Need
In `pre-algebra-solver`, `multiplication`, and `division`, students have access to an expandable "How to Solve" drawer at the top of the workspace. This provides clear, sequential, and highlighted instructions before or during problem solving. In `fractions/`, no such guide exists, leaving students without a high-level conceptual roadmap when tackling fraction operations.

## Architecture & Component Breakdown

### 1. Collapsible Drawer Container (`fractions/index.html`)
- **Semantic Element:** HTML `<details id="guide-fractions">` with `<summary>` element.
- **Styling:** Tailwind CSS matching pre-algebra and geometry:
  - `bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden group no-print`
  - High-contrast typography (`text-indigo-900 font-semibold`)
  - Rotating SVG chevron icon (`group-open:rotate-180`)
  - Educational icon in header (SVG checklist / book)
- **Placement:** Placed at the top of `<main>`, immediately preceding `<div id="interactive-workspace">`, ensuring visibility across both Interactive Solver and Worksheet generator contexts while excluded from printed worksheets via `no-print`.

### 2. Topic Synchronization & Internal Exploration
The drawer supports two synchronized navigation modalities:
1. **Context-Aware Default:** Automatically displays the guide for the currently selected topic in `#config-topic` (`addsub`, `multiply`, `divide`, `concepts`).
2. **Topic Selector Buttons:** Embedded pill navigation within the drawer allowing students to freely read guides for other topics without needing to change problem generator settings.

### 3. Pedagogical Content Coverage

#### A. Adding & Subtracting Fractions (`addsub`)
1. **Check Denominators:** If denominators are identical, keep denominator and add or subtract numerators ($\frac{a}{d} \pm \frac{b}{d} = \frac{a \pm b}{d}$).
2. **Find LCD:** If denominators differ, calculate the Least Common Multiple (LCM) of denominators.
3. **Convert to Equivalent Fractions:** Multiply numerator and denominator of each fraction by the factor needed to achieve the LCD.
4. **Add or Subtract Numerators:** Add or subtract the numerators while keeping the common denominator.
5. **Simplify Result:** Divide by Greatest Common Factor (GCF) and convert to mixed numbers if necessary.

#### B. Multiplying Fractions (`multiply`)
1. **Convert Mixed Numbers:** Convert any mixed numbers into improper fractions ($w \frac{n}{d} = \frac{w \cdot d + n}{d}$).
2. **Multiply Numerators Across:** Multiply the top numbers ($a \times c$).
3. **Multiply Denominators Across:** Multiply the bottom numbers ($b \times d$).
4. **Simplify Result:** Reduce by dividing by the GCF.

#### C. Dividing Fractions (`divide`)
1. **Convert Mixed Numbers:** Change mixed numbers to improper fractions.
2. **Keep, Change, Flip (KCF):**
   - **Keep** first fraction ($\frac{a}{b}$).
   - **Change** $\div$ to $\times$.
   - **Flip** second fraction to its reciprocal ($\frac{c}{d} \rightarrow \frac{d}{c}$).
3. **Multiply Across:** Multiply numerators together and denominators together.
4. **Simplify Result:** Reduce by dividing by GCF.

#### D. Core Concepts & Foundations (`concepts`)
1. **Proper vs. Improper Fractions:** Proper has $n < d$; improper has $n \ge d$.
2. **Converting Improper to Mixed Numbers:** Divide $n \div d$: quotient is whole number, remainder is new numerator.
3. **Least Common Denominator (LCD / LCM):** Smallest common multiple for both denominators.
4. **Greatest Common Factor (GCF) & Reducing:** Largest number dividing both numerator and denominator.

### 4. Technical Module Structure (`fractions/js/guide.js`)
- Isolated ES6 module to maintain zero-runtime-build static architecture and small modular file principles.
- Handles KaTeX rendering of mathematical expressions using `window.MathRenderer` or `window.katex`.
- Hooks into topic changes from `fractions/js/app.js` and `fractions/js/solver-ui.js`.
