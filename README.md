# Kids School Helpers

A comprehensive collection of lightweight, zero-build, client-side educational web applications providing **interactive step-by-step math solvers**, **animated visual explanations**, and **printable worksheets with worked answer keys** across **5th, 6th, and 7th grade mathematics** (with bridges into 8th-grade Pre-Algebra).

> **Note:** This project is an experiment in fully agentic coding using Google Antigravity. The code is intentionally generated entirely by Gemini AI, rather than being hand-coded, to build muscle memory and explore rigorous governance, AST linting, and spec-driven patterns for guiding AI in software development.

---

## Curriculum Vision: Complete 5th, 6th & 7th Grade Math Coverage

**Kids School Helpers** is designed so a student in **Grade 5, Grade 6, or Grade 7** can practice every major topic in the middle-grades curriculum with transparent step-by-step scaffolding rather than black-box answers:

- **Grade 5 Foundations**: Multi-digit & decimal operations (`+`, `-`, `×`, `÷`), place value & rounding, powers of $10$, unlike fractions & mixed numbers, order of operations (`PEMDAS`), Quadrant I graphing, measurement conversions, fractional line plots, polygon classification, and rectangular/composite prism volume.
- **Grade 6 Core**: Ratios, tape diagrams & unit rates, percentages, fraction-by-fraction division, prime factorization (`GCF` & `LCM`), negative integers, absolute value & 4-quadrant coordinate graphing, exponents, algebraic expressions, one-step equations & inequalities, area of trapezoids/composite polygons, 3D surface-area nets, and statistical distributions (`Mean`, `Median`, `IQR`, `MAD`, histograms, box plots).
- **Grade 7 Mastery & Pre-Algebra Bridge**: Complex-fraction unit rates & proportional relationships ($y = kx$), multi-step consumer percents (tax, tip, discount, simple interest, percent change), full signed rational arithmetic, terminating & repeating decimal conversions, factoring linear expressions, multi-step equations & two-step inequalities, scale drawings, 3D cross-sections, algebraic angle relationships, circle geometry, population sampling, and compound probability.

See the full standards mapping and phased build plan in our [Grades 5–7 Complete Curriculum Roadmap](spec/09-grades-5-7-curriculum-roadmap.md).

---

## Live Applications (8 Interactive Solvers & Worksheet Suites)

| Module | Grade Span | Key Exercises & Capabilities |
| :--- | :---: | :--- |
| [**Multiplication Practice**](multiplication/index.html) | Grades 5–6 | Multi-digit whole-number & decimal vertical multiplication, proper/mixed fraction multiplication, and `1–12` times tables. |
| [**Division Practice**](division/index.html) | Grades 5–6 | Step-by-step whole-number & decimal long division (`Divide -> Multiply -> Subtract -> Bring Down`) and fraction division (`Keep-Change-Flip`). |
| [**Fractions Practice**](fractions/index.html) | Grades 5–6 | Core fraction concepts, adding/subtracting with common denominators, multiplying, and dividing single- to triple-digit proper & mixed fractions. |
| [**Fractions to Decimals**](fractions-to-decimals/index.html) | Grades 5–7 | Long-division decimal conversion across tenths, hundredths, thousandths, repeating decimals, and signed mixed numbers (plus custom input). |
| [**Decimals to Fractions**](decimals-to-fractions/index.html) | Grades 5–7 | Place-value identification ($10, 100, 1000$) and `GCF` simplification for terminating, mixed, and negative decimals (plus custom input). |
| [**Pre-Algebra Solver**](pre-algebra-solver/index.html) | Grades 6–8 | Interactive 1-to-5 step linear equation solver supporting distribution, combining like terms, negative integers, and rational coefficients. |
| [**Graphing Lines**](graphing-lines/index.html) | Grades 6–8 | Interactive SVG coordinate plane for plotting lines and determining equations in Slope-Intercept ($y = mx + b$) and Standard ($Ax + By = C$) forms. |
| [**Geometry Foundations**](geometry/index.html) | Grades 5–8 | Visual SVG lessons & solvers for area, perimeter, circumference, prism/cylinder volume, missing angles, and the Pythagorean Theorem. |

---

## Planned Curriculum Modules & Expansion Specs (Grades 5–7)

Each planned module below has an isolated directory and detailed pedagogical specification ready for vertical-slice implementation:

1. [**Decimal Place Value, Rounding & Add/Subtract** (`decimals-operations/`)](decimals-operations/specs/01-overview-and-pedagogy.md) *(Grades 5–6)* — Place value to thousandths, powers-of-$10$ shifts, comparing/rounding decimals, and aligned vertical decimal addition & subtraction with zero-annexation and borrowing.
2. [**Order of Operations & Exponents** (`order-of-operations/`)](order-of-operations/specs/01-overview-and-pedagogy.md) *(Grades 5–6)* — Nested parentheses/brackets, whole-number & rational exponents, funnel-style `PEMDAS` evaluation, left-to-right `×/÷` and `+/-` tie-breakers, and verbal-to-expression translation.
3. [**Number Theory: Prime Factorization, GCF & LCM** (`number-theory/`)](number-theory/specs/01-overview-and-pedagogy.md) *(Grades 5–6)* — Divisibility rules, interactive SVG prime factor trees, `GCF` & `LCM` Venn/ladder solvers, and distributive factoring $a + b = g(p + q)$.
4. [**Integers, Signed Rationals & 4-Quadrant Coordinate Plane** (`integers-and-rationals/`)](integers-and-rationals/specs/01-overview-and-pedagogy.md) *(Grades 5–7)* — Opposites, absolute value, number-line & zero-pair signed integer/rational arithmetic (`+`, `-`, `×`, `÷`), 4-quadrant plotting, reflections, and grid distances.
5. [**Ratios, Unit Rates & Proportions** (`ratios-and-proportions/`)](ratios-and-proportions/specs/01-overview-and-pedagogy.md) *(Grades 6–7)* — Equivalent ratios, tape diagrams, double number lines, complex-fraction unit rates, constant of proportionality ($k = \frac{y}{x}$, $y = kx$), cross-product proportions, and unit conversions.
6. [**Percentages & Consumer Math** (`percents/`)](percents/specs/01-overview-and-pedagogy.md) *(Grades 6–7)* — $10 \times 10$ percent grids, fraction-decimal-percent conversions, part/whole/percent problems, percent change, percent error, sales tax, tips, discounts/markups, and simple interest $I = Prt$.
7. [**Algebraic Expressions & Linear Inequalities** (`expressions-and-inequalities/`)](expressions-and-inequalities/specs/01-overview-and-pedagogy.md) *(Grades 6–7)* — Variable substitution, combining like terms, rational distribution & linear factoring, independent/dependent variable tables, and 1–2 step inequalities with negative-division sign reversal & number-line ray graphing.
8. [**Statistics, MAD, Box Plots & Data Displays** (`statistics-and-data/`)](statistics-and-data/specs/01-overview-and-pedagogy.md) *(Grades 5–7)* — Mean, median, mode, range, quartiles, `IQR`, step-by-step Mean Absolute Deviation (`MAD`) tables, fractional line plots, histograms, 5-number box plots, and random sample inference.
9. [**Probability & Compound Events** (`probability/`)](probability/specs/01-overview-and-pedagogy.md) *(Grade 7)* — Likelihood scale, theoretical & experimental probability, complementary events, and independent/dependent compound probability using organized lists, two-way tables, and interactive SVG tree diagrams.
10. [**Multi-Step Word Problems & Tape Diagrams** (`word-problems/`)](word-problems/specs/01-overview-and-pedagogy.md) *(Grades 5–7)* — Structured 4-step word-problem studio pairing Singapore-style bar/tape diagrams, benchmark estimation reasonableness checks, equation setup, and unit-labeled answers.
11. [**Geometry Foundations — Grades 5–7 Expansion**](geometry/specs/01-grades-5-7-geometry-expansion.md) *(Grades 5–7)* — Extends [`geometry/`](geometry/index.html) with 2D polygon hierarchies, trapezoid & composite area, L-prism additive volume, 3D surface-area nets, scale drawings, triangle conditions, 3D cross-sections, and multi-step algebraic angle pairs.

---

## Shared Pedagogical & UI Capabilities

- **Upfront Step Progression & Dual Inputs**: Solvers display the complete planned step outline upfront alongside **1. Partial / Step Result** and **2. Final Answer** inputs ([spec/03](spec/03-dual-input-and-step-progression.md)).
- **3-Frame KaTeX Token-Morphing Hints**: Pressing `Tab` opens a paused 3-frame View Transitions visual explanation (`SharedAnimationPlayer`), stepping frame-by-frame before optionally populating the active input ([spec/02](spec/02-unified-solver-animations.md)).
- **Collapsible "How to Solve" Guides**: Topic-aware reference drawers rendered dynamically with KaTeX.
- **Printable Worksheets & Worked Answer Keys**: Every module generates print-ready multi-page worksheets with clean typography and full step-by-step answer keys.

---

## Development Setup & Architecture

- **Zero-Build Static Architecture**: Pure Vanilla ES6+ JavaScript, HTML5, SVG, pinned Tailwind CSS (`3.4.4`), and pinned KaTeX (`0.16.10`), hosted as static SPAs via GitHub Pages ([spec/01-architecture-and-standards.md](spec/01-architecture-and-standards.md)).
- **Local Development**: To run locally or execute unit/headless checks, see our [Developer Onboarding Guide](developer.md).
- **AI Contributor Governance**: Please refer to [AGENTS.md](AGENTS.md) for strict spec-driven workflows, AST linting rules, and contributor standards.
