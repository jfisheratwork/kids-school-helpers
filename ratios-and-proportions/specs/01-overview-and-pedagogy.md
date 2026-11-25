# 01 - Ratios, Unit Rates & Proportions Specification (`ratios-and-proportions/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–7 (`5.MD.A.1`, `6.RP.A.1–3`, `7.RP.A.1–2`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
**Ratios and Proportional Relationships (`6.RP` & `7.RP`)** form the backbone of middle-school mathematics, bridging 5th-grade multiplicative scaling (`5.MD.A.1`, `5.NF.B.5`) to 8th-grade linear slope ([`graphing-lines/`](../../graphing-lines/index.html)).

### Planned Exercises & Solver Modes
1. **Equivalent Ratios, Tape Diagrams & Ratio Tables (`6.RP.A.1, 6.RP.A.3.A`)**: Part-to-part vs. part-to-whole ratios, interactive Singapore-style tape diagrams, double number lines, and missing-entry ratio tables.
2. **Unit Rates & Complex-Fraction Unit Rates (`6.RP.A.2`, `7.RP.A.1`)**: Best-buy unit pricing, constant speed, and 7th-grade fractional rates ($\frac{3/4\text{ mile}}{1/2\text{ hour}} = 1\frac{1}{2}\text{ mph}$).
3. **Constant of Proportionality ($k = \frac{y}{x}$, $y = kx$ — `7.RP.A.2`)**: Test whether tables/graphs represent proportional relationships, find $k$, write $y = kx$, and interpret $(0, 0)$ and $(1, k)$.
4. **Solving Proportions & Measurement Conversions (`5.MD.A.1`, `6.RP.A.3.D`, `7.RP.A.2–3`)**: Solve $\frac{a}{b} = \frac{c}{x}$ via multiplicative scale factors or cross-products, plus customary and metric dimensional unit conversions.

This module delivers visual SVG **Tape Diagrams**, **Double Number Lines**, and multi-step solvers following [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Sub-Skills & Complexity Progression |
| :--- | :---: | :--- |
| `tape_and_tables` | 6 | Simplify ratios ($a:b$), part-to-part vs. part-to-total tape diagrams (e.g., *"Red to blue paint is $3:5$; if total is $40\text{ oz}$, find blue"*), and 3-column ratio tables. |
| `unit_rates` | 6–7 | **Level 1 (`6.RP.A.2`)**: Whole/decimal unit rates ($\$$ per item, miles per hour, "better buy" comparison). **Level 2 (`7.RP.A.1`)**: Complex-fraction unit rates ($\frac{2/3\text{ gal}}{1/4\text{ wall}} = \frac{8}{3} = 2\frac{2}{3}\text{ gal/wall}$). |
| `proportionality_k` | 7 | Determine if a $(x, y)$ table is proportional by checking $\frac{y}{x}$ constancy; compute Constant of Proportionality $k = \frac{y}{x}$; write equation $y = kx$; identify unit-rate point $(1, k)$ on an SVG graph through $(0,0)$. |
| `solve_proportions` | 6–7 | **Level 1**: Integer scale factor ($\frac{3}{7} = \frac{15}{x}$). **Level 2**: Cross-multiplication ($ad = bc \rightarrow x$) yielding integer or fractional answers. **Level 3**: Algebraic proportion ($\frac{x + 2}{5} = \frac{6}{10}$). |
| `unit_conversions` | 5–6 | Customary (`in/ft/yd`, `oz/lb`, `fl oz/cup/pt/qt/gal`), metric (`mm/cm/m/km`, `mg/g/kg`, `mL/L`), and cross-system conversions using conversion ratios with visible unit cancellation! |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Tape Diagram Part-to-Total (`tape_and_tables`)
1. **Step 1 (`count_boxes`)**: Sum or subtract tape-diagram boxes matching the known quantity (e.g., for total $= 40$ with ratio $3:5$, total boxes $= 3 + 5 = 8$; for *"12 more blue than red"*, difference boxes $= 5 - 3 = 2$).
2. **Step 2 (`value_per_box`)**: Divide known quantity by box count ($40 \div 8 = 5$ per box), filling `5` into every SVG tape cell.
3. **Step 3 (`target_quantity`)**: Multiply boxes of requested part by unit box value ($5 \times 5 = 25$).

### 3.2 Complex-Fraction Unit Rates (`unit_rates` Level 2)
1. **Step 1 (`setup_complex_fraction`)**: Place target numerator unit over `per`-unit denominator: $\frac{a/b}{c/d}$.
2. **Step 2 (`rewrite_as_division`)**: Rewrite fraction bar as division and multiply by reciprocal: $\frac{a}{b} \times \frac{d}{c}$.
3. **Step 3 (`simplify_rate`)**: Multiply and reduce via `Fraction` (`shared/js/fraction.js`), accepting improper or mixed number.

### 3.3 Cross-Product Proportions (`solve_proportions`)
1. **Step 1 (`cross_multiply`)**: Equate cross-products: $a \cdot x = b \cdot c$ (e.g., $\frac{4}{9} = \frac{10}{x} \rightarrow 4x = 90$).
2. **Step 2 (`isolate_x`)**: Divide both sides by coefficient $a$: $x = \frac{90}{4} = \frac{45}{2} = 22.5$.

---

## 4. 3-Frame `\htmlId` Animations, Dual Inputs & Worksheets
- **3-Frame View Transitions**:
  - *Cross-Multiplication*: Frame 1 $\frac{\htmlId{a}{4}}{\htmlId{b}{9}} = \frac{\htmlId{c}{10}}{\htmlId{x}{x}}$; Frame 2 diagonal glide of `\htmlId{x}{x}` up-left and `\htmlId{b}{9}` up-right (`\htmlId{a}{4}\htmlId{x}{x} = \htmlId{b}{9} \cdot \htmlId{c}{10}`); Frame 3 simplifies RHS to `4x = 90`.
  - *Unit Cancellation*: Strikethrough morph on matching numerator/denominator units (`\cancel{\text{ft}}`).
- **Dual Inputs**, **Custom Ratio/Proportion Entry**, **Synced `<details>` Guide**, and **Printable Tape-Diagram / Ratio-Table / Proportion Worksheets** with worked Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Exact `Fraction`-backed generators for tape diagrams, complex rates, $k = y/x$ tables, proportions, and unit-conversion tables.
2. **Slice 2**: Unit tests in `test/unit-tests.js` covering zero-division guards, non-proportional table distractors, and complex-fraction reductions.
3. **Slice 3**: SVG Tape Diagram & Double Number Line renderer, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
