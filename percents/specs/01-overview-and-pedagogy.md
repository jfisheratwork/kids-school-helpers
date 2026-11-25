# 01 - Percentages & Consumer Math Specification (`percents/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 6–7 (`6.RP.A.3.C`, `7.RP.A.3`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
Percentages bridge **6th-grade rates per $100$ (`6.RP.A.3.C`)** and **7th-grade real-world financial and scientific applications (`7.RP.A.3`)**. Students frequently confuse whether to divide by the *original* or *new* value in percent change, or stop after finding a discount amount instead of subtracting it from the retail price.

### Planned Exercises & Solver Modes
1. **Percent Visual Grids & 3-Way Conversions (`F <-> D <-> %`)**: Shade $10 \times 10$ hundredths grids and convert fluently among fractions, decimals, and percents (including $< 1\%$, $> 100\%$, and fractional percents like $12.5\%$).
2. **Part, Whole & Percent Solver (`6.RP.A.3.C`)**: Solve all three core percent cases (*Find the Part*, *Find the Whole*, *Find the Percent*) via either the Percent Proportion ($\frac{\text{part}}{\text{whole}} = \frac{p}{100}$) or Percent Equation ($\text{part} = d \cdot \text{whole}$).
3. **Percent Change & Percent Error (`7.RP.A.3`)**: Step-by-step $\frac{|\text{new} - \text{original}|}{\text{original}} \times 100\%$ and $\frac{|\text{measured} - \text{actual}|}{\text{actual}} \times 100\%$ solvers.
4. **Consumer & Financial Math (`7.RP.A.3`)**: Multi-step Sales Tax, Tips/Gratuity, Discounts/Markdowns, Markups, Commission, Stacked Discount + Tax receipts, and Simple Interest ($I = Prt$ and total balance $A = P + I$).

This module eliminates both errors through explicit multi-step scaffolding, SVG **Percent Bar / $10 \times 10$ Grid Models**, and Dual Inputs conforming to [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Exercises & Complexity Progression |
| :--- | :---: | :--- |
| `conversions_f_d_p` | 6 | Convert Percent $\leftrightarrow$ Decimal ($\div 100$ / $\times 100$ two-place decimal shift) and Percent $\leftrightarrow$ Simplified Fraction ($35\% = \frac{35}{100} = \frac{7}{20}$; Level 3 includes $0.5\%$, $150\%$, $37.5\%$). |
| `part_whole_percent` | 6 | **Find Part**: *"What is $24\%$ of $50$?"* **Find Percent**: *"$18$ is what percent of $72$?"* **Find Whole**: *"$15$ is $30\%$ of what number?"* (with visual double-bar percent strip). |
| `percent_change_error` | 7 | **Percent Increase/Decrease**: $\frac{|\text{new} - \text{old}|}{\text{old}} \times 100\%$ + classify Increase vs. Decrease. **Percent Error**: $\frac{|\text{estimate} - \text{actual}|}{\text{actual}} \times 100\%$. |
| `tax_tip_discount` | 7 | **Level 1**: Single discount, markup, sales tax, tip, or commission. **Level 2**: Final sale/checkout price ($P_{\text{final}} = P - \text{discount}$ or $P + \text{tax}$). **Level 3**: Chained receipt (*"$20\%$ coupon applied first, then $8\%$ sales tax on the discounted subtotal"*). |
| `simple_interest` | 7 | Evaluate $I = P \cdot r \cdot t$ (converting annual rate $\%$ to decimal and months to fractional years when needed, e.g., $18\text{ months} = 1.5\text{ yr}$) and optionally total balance $A = P + I$. |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Percent Change (`percent_change_error`)
1. **Step 1 (`amount_of_change`)**: Compute positive difference $\Delta = |\text{new} - \text{original}|$ and state direction (`increase` if $\text{new} > \text{original}$, else `decrease`).
2. **Step 2 (`ratio_over_original`)**: Form ratio $\frac{\Delta}{\text{original}}$ (explicitly guarding against dividing by $\text{new}$!) and divide to decimal.
3. **Step 3 (`convert_to_percent`)**: Multiply by $100$ to express as `%` (exact or rounded to nearest tenth when specified).

### 3.2 Chained Discount + Sales Tax (`tax_tip_discount` Level 3)
1. **Step 1 (`discount_amount_or_multiplier`)**: Compute discount $D = r_{\text{disc}} \cdot P_0$ (or multiplier $1 - r_{\text{disc}}$).
2. **Step 2 (`sale_subtotal`)**: Subtract $P_{\text{sale}} = P_0 - D$.
3. **Step 3 (`tax_amount`)**: Compute tax on discounted subtotal $T = r_{\text{tax}} \cdot P_{\text{sale}}$.
4. **Step 4 (`checkout_total`)**: Add $P_{\text{total}} = P_{\text{sale}} + T$ formatted to 2 decimal places (`$XX.XX`).

### 3.3 Simple Interest (`simple_interest`)
1. **Step 1 (`normalize_rate_and_time`)**: Convert rate $r\%$ to decimal (e.g., $4.5\% \rightarrow 0.045$) and time $t$ to years.
2. **Step 2 (`compute_interest`)**: Multiply $I = P \cdot r \cdot t$.
3. **Step 3 (`total_balance`, when asked)**: Compute $A = P + I$.

---

## 4. 3-Frame `\htmlId` Animations, Dual Inputs & Worksheets
- **SVG Visuals**: Interactive $10 \times 10$ Percent Grid (for `conversions_f_d_p`) and aligned Dual Percent Tape Bar (`0%..100%+` aligned with `$0..$Whole`).
- **3-Frame Animations**: Morphs `4.5%` $\rightarrow$ `\frac{4.5}{100}` $\rightarrow$ `0.045` via two-slot decimal glide, and substitutes `\htmlId{P}{P}`, `\htmlId{r}{r}`, `\htmlId{t}{t}` into $I = Prt$.
- **Dual Inputs**, **Custom Scenario/Percent Builder**, **Synced `<details>` Guide**, and **Printable Consumer-Math Receipt & Percent Worksheets** with worked Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Exact scaled-decimal percent generators across all 5 topics (avoiding currency float rounding bugs).
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying exact cent rounding, months-to-years conversion, and chained discount-then-tax order.
3. **Slice 3**: SVG $10 \times 10$ Grid & Percent Bar UI, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
