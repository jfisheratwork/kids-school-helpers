# 01 - Algebraic Expressions & Linear Inequalities Specification (`expressions-and-inequalities/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 6–7 (`6.EE.A.2–4`, `6.EE.B.5, 6.EE.B.8`, `6.EE.C.9`, `7.EE.A.1–2`, `7.EE.B.4.B`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
[`pre-algebra-solver/`](../../pre-algebra-solver/index.html) solves multi-step equations ($=$), leaving two essential **Grades 6–7 Expressions & Equations (`6.EE`, `7.EE`)** pillars uncovered:
1. **Manipulating expressions without an `=` sign**: Evaluating by substitution, combining like terms, subtracting parenthesized expressions, and factoring linear expressions (`6.EE.A.2–4`, `7.EE.A.1`).
2. **Solving and graphing linear inequalities (`<, >, \le, \ge`)**: Including the critical sign-reversal rule when multiplying or dividing both sides by a negative number, plus open vs. closed circle ray plotting on a number line (`6.EE.B.8`, `7.EE.B.4.B`).

### Planned Exercises & Solver Modes
1. **Evaluating Algebraic Expressions by Substitution (`6.EE.A.2.C`)**: Substitute integer, negative, fraction, or decimal values into multi-variable expressions (e.g., $3x^2 - 4y$ for $x = -2, y = 5$) using protective parentheses.
2. **Simplifying & Factoring Linear Expressions (`6.EE.A.3–4`, `7.EE.A.1`)**: Combine like terms, distribute positive/negative/fractional coefficients ($-\frac{2}{3}(6x - 9) + 4x$), subtract linear expressions $(5x - 3) - (2x - 7)$, and factor $12x - 18 = 6(2x - 3)$.
3. **Verbal Translation & Independent/Dependent Variables (`6.EE.A.2.A`, `6.EE.C.9`)**: Translate phrases (*"7 less than twice $n$"* $\rightarrow 2n - 7$, avoiding the $7 - 2n$ reversal trap!) and relate two-variable tables/equations ($d = 55t$).
4. **Solving & Graphing Linear Inequalities (`6.EE.B.8`, `7.EE.B.4.B`)**: Solve 1- and 2-step inequalities ($ax + b < c$, $-3x + 4 \ge 13$), enforce **inequality direction reversal when multiplying or dividing by a negative**, and plot open/closed circles + rays on an SVG number line.

All components follow [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Progression & Pedagogical Focus |
| :--- | :---: | :--- |
| `evaluate_substitution` | 6–7 | **Level 1**: Positive whole values ($4a + 7b$). **Level 2**: Exponents & geometry formulas ($V = s^3, SA = 6s^2$). **Level 3**: Negative & fractional values ($2x^2 - 5y$ at $x = -3, y = -4$, emphasizing $(-3)^2 = +9$). |
| `simplify_linear` | 6–7 | **Level 1**: Combine positive like terms ($5x + 3 + 2x + 8$). **Level 2**: Distribute & combine with negatives ($3(2x - 4) - (x - 7)$). **Level 3 (`7.EE.A.1`)**: Rational coefficients ($-\frac{3}{4}(8x - 12) + \frac{1}{2}x$). |
| `factor_linear` | 6–7 | Factor `GCF` from $ax + b$ (e.g., $18x - 24 = 6(3x - 4)$; Level 3 factors negative leading coefficient $-10x - 15 = -5(2x + 3)$). |
| `translate_and_tables` | 6 | Verbal-to-algebraic (*"5 less than 3 times $x$"* $\rightarrow 3x - 5$) and independent ($x$) vs. dependent ($y$) input-output rule tables ($y = 4x + 1$). |
| `inequalities` | 6–7 | **Level 1 (`6.EE.B.8`)**: Graph $x > -3$ or solve 1-step $x + 5 \le 12$. **Level 2 (`7.EE.B.4.B`)**: 2-step positive coefficient ($2x - 5 < 9$). **Level 3**: Negative coefficient requiring **inequality sign flip** ($-4x + 7 \ge 19 \rightarrow -4x \ge 12 \rightarrow x \le -3$) + interactive number-line ray check! |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Simplifying Linear Expressions (`simplify_linear`)
1. **Step 1 (`distribute`)**: Distribute outside multipliers across parentheses (treating `- (x - 7)` as `-1(x - 7) = -x + 7`).
2. **Step 2 (`group_like_terms`)**: Group variable terms together and constant terms together.
3. **Step 3 (`combine_simplified`)**: Output canonical simplified linear expression `mx + b` (accepting commutative `b + mx`).

### 3.2 Solving & Graphing Two-Step Inequalities (`inequalities`)
1. **Step 1 (`isolate_variable_term`)**: Add/subtract constant $b$ on both sides (inequality symbol stays unchanged: $-4x + 7 \ge 19 \rightarrow -4x \ge 12$).
2. **Step 2 (`divide_by_coefficient`)**: Divide both sides by $a$:
   - If $a > 0$: keep inequality direction.
   - If $a < 0$: **reverse inequality direction** ($\ge \rightarrow \le$, $> \rightarrow <$), surfacing a specific coaching message if the student enters `x >= -3` instead of `x <= -3`!
3. **Step 3 (`graph_on_number_line`)**: Select circle type (`open` for $<, >$; `closed/filled` for $\le, \ge$) at boundary value $-3$ and shade ray direction (`left` for $<, \le$; `right` for $>, \ge$).

---

## 4. 3-Frame `\htmlId` Animations, SVG Number Line & Worksheets
- **3-Frame View Transitions**:
  - *Negative Inequality Division*: Frame 1 `\frac{-4x}{\textcolor{#dc2626}{-4}} \htmlId{rel}{\ge} \frac{12}{\textcolor{#dc2626}{-4}}`; Frame 2 highlights negative divisor warning badge and rotates/morphs `\htmlId{rel}{\ge}` $\rightarrow$ `\textcolor{#dc2626}{\mathbf{\le}}`; Frame 3 resolves to `x \le -3`.
  - *Substitution*: Wraps negative inputs in protective indigo parentheses `2(\textcolor{#4f46e5}{-3})^2`.
- **Interactive SVG Ray Plotter**: Toggle boundary open/closed dot + click left/right arrow ray.
- **Printable Worksheets**: Expression simplification/factoring sheets and inequality worksheets complete with blank number lines and shaded-ray Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Canonical `ax + b` expression normalizer + generators for substitution, simplification, factoring, translation, and inequalities.
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying `-(x - c)` sign distribution, commutative equivalence (`3 + 2x` vs `2x + 3`), and negative-divisor inequality sign reversal.
3. **Slice 3**: Solver UI + interactive SVG Inequality Ray Plotter, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
