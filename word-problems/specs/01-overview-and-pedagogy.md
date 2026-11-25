# 01 - Multi-Step Word Problems & Tape Diagrams Specification (`word-problems/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–7 (`5.NF.A.2`, `5.NF.B.6–7`, `6.RP.A.3`, `6.EE.B.7`, `7.NS.A.3`, `7.EE.B.3–4`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
Directly fulfilling the roadmap goal in [todo.md](../../spec/todo.md) (*"Expand word problem / real-world application modes across modules"*) and **CCSS `7.EE.B.3`** (*solve multi-step real-life problems posed with positive and negative rational numbers in any form — whole numbers, fractions, decimals, percents — and assess reasonableness using mental computation and estimation*), this module teaches **structured mathematical modeling** rather than keyword guessing.

### Planned Exercises & Solver Modes
1. **Grade 5 Fractional & Multi-Operation Word Problems (`5.NF`, `5.NBT`)**: Multi-step recipes, lengths, and equal-sharing stories modeled with Singapore-style fractional bar/tape diagrams.
2. **Grade 6 Ratio, Rate & One-Step Equation Word Problems (`6.RP`, `6.EE`)**: Part-whole comparison bars, unit-rate speed/pricing stories, and defining a variable to write and solve $x + p = q$ or $px = q$.
3. **Grade 7 Mixed Rational & Estimation Word Problems (`7.NS.A.3`, `7.EE.B.3`)**: Real-world temperature/elevation/bank-ledger stories mixing whole numbers, signed fractions, decimals, and percents — paired with **upfront benchmark estimation** to check answer reasonableness!
4. **Grade 7 Two-Step Algebraic Equation & Inequality Word Problems (`7.EE.B.4`)**: Fixed-fee + per-unit rate scenarios ($px + q = r$, $p(x + q) = r$, and budget-cap inequalities $px + q \le r$).

Every exercise follows a consistent 4-stage scaffold aligned with [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Grade-Band Tracks

| Track ID | Grade | Scenario Archetypes & Number Domains |
| :--- | :---: | :--- |
| `grade5_bars` | 5 | Multi-step whole-number, decimal-money, and unlike-fraction stories (e.g., *"Maya had $3\frac{1}{2}\text{ yd}$ of ribbon, used $1\frac{3}{4}\text{ yd}$ for a gift, then bought $\frac{5}{8}\text{ yd}$ more"*), modeled with additive/comparison SVG Bar Diagrams. |
| `grade6_ratios_rates` | 6 | Ratio comparison tape diagrams, distance-rate-time ($d = rt$), and unit-price budget problems. |
| `grade7_mixed_rationals` | 7 | `7.NS.A.3` & `7.EE.B.3` stories deliberately mixing forms (e.g., *"Submarine at $-42.5\text{ m}$ dives $15\frac{1}{4}\text{ m}$ deeper, then rises $20\%$ of its depth"*) with mandatory front-end estimation check. |
| `grade7_equations_ineq` | 7 | `7.EE.B.4` fixed-fee + rate modeling: e.g., *"A bowling alley charges $\$4.50$ shoe rental plus $\$6.25$ per game. With $\$25$, what is the maximum whole number of games?"* (highlighting discrete whole-number rounding down of $x \le 3.28 \rightarrow 3\text{ games}$!). |

---

## 3. Pedagogical 4-Step Modeling State Machine

1. **Step 1 (`extract_and_estimate`) — Target Unknown & Benchmark Estimate (`7.EE.B.3`)**:
   - Highlight known quantities + target unit in the story text and enter a quick rounded benchmark estimate (accepted within a generous pedagogical tolerance band, e.g., $\pm 25\%$, or exact setup selection) so students build intuition before computing.
2. **Step 2 (`build_model_or_equation`) — Visual Bar Diagram / Algebraic Setup**:
   - *Arithmetic/Ratio tracks*: Complete the missing expression or SVG Tape Diagram bracket relationship.
   - *Algebraic track (`grade7_equations_ineq`)*: Write the equation or inequality (e.g., `6.25x + 4.50 <= 25`).
3. **Step 3 (`compute_intermediate`) — Execute Core Calculation**:
   - Convert mixed forms into a common representation (all decimals or all `Fraction`s) and compute the intermediate step.
4. **Step 4 (`interpret_with_units`) — Final Contextual Answer**:
   - Apply real-world rounding/truncation constraints (e.g., whole buses needed rounds *up* via $\lceil x \rceil$, affordable items rounds *down* via $\lfloor x \rfloor$) alongside the displayed unit label!

---

## 4. 3-Frame `\htmlId` Animations, SVG Tape Diagrams & Worksheets
- **Interactive Story Highlighter & SVG Bar Model**: Story phrases color-map directly to labeled segments of an SVG Singapore Bar / Tape Diagram.
- **3-Frame View Transitions**:
  - Frame 1: Story phrases wrapped in color-matched text spans (`Fixed Fee`, `Rate × Variable`, `Total`).
  - Frame 2: Phrases morph into symbolic expression `\htmlId{rate}{6.25}x + \htmlId{fee}{4.50} \le \htmlId{tot}{25}`.
  - Frame 3: Solves and applies discrete context check (`x \le 3.28 \rightarrow 3\text{ games}`).
- **Dual Inputs**, **Topic & Grade Selectors**, **Synced `<details>` Modeling Guide**, and **Printable Word-Problem Worksheets** with Bar-Diagram sketches and step-by-step Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Parameterized story template engine (collision-free names/numbers, exact `Fraction`/scaled-decimal answers, discrete ceiling/floor rules).
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying mixed rational conversions, ceiling-vs-floor context problems, and estimation bounds.
3. **Slice 3**: SVG Singapore Bar/Tape Diagram renderer, `<details>` modeling guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
