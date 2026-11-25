# 09 - Grades 5, 6, and 7 Complete Mathematics Curriculum Roadmap

## 1. Vision & Scope

**Kids School Helpers** aims to provide free, zero-build, interactive step-by-step solvers and printable worksheet generators covering **every core domain of 5th, 6th, and 7th grade mathematics** (with seamless bridges into 8th-grade Pre-Algebra and Algebra I).

Every existing and planned module shares a unified pedagogical contract defined in [01-architecture-and-standards.md](01-architecture-and-standards.md), [02-unified-solver-animations.md](02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](03-dual-input-and-step-progression.md):
- **Upfront Collapsible "How to Solve" Guide (`guide.js`)**: Topic-synced reference cards rendered with KaTeX (`0.16.10`).
- **Upfront Step Progression & Dual Inputs**: Students see all planned steps before starting and can either step through via **1. Partial / Step Result** or solve immediately via **2. Final Answer**.
- **3-Frame KaTeX `\htmlId` Morphing Hints (`SharedAnimationPlayer`)**: Manual-advance `Tab` workflow (`autoplay: false`) that visualizes why each mathematical operation works before optionally filling the input.
- **Custom Problem Entry**: Students and parents can enter homework problems directly into the solver.
- **High-DPI Printable Worksheets + Worked Answer Keys**: Configurable difficulty levels, problem counts, and step-by-step teacher/parent answer keys.

---

## 2. Grade-by-Grade Curriculum Coverage Matrix (Grades 5–7)

### 2.1 Grade 5 Mathematics (`5.OA`, `5.NBT`, `5.NF`, `5.MD`, `5.G`)

| Domain | Core 5th Grade Skills | Coverage Status | Target Module(s) |
| :--- | :--- | :--- | :--- |
| **Operations & Algebraic Thinking (`5.OA`)** | Parentheses/brackets/braces, numerical expressions, verbal-to-expression translation, numerical patterns & ordered pairs | **Planned** | [`order-of-operations/`](../order-of-operations/specs/01-overview-and-pedagogy.md), [`integers-and-rationals/`](../integers-and-rationals/specs/01-overview-and-pedagogy.md) |
| **Number & Operations in Base Ten (`5.NBT`)** | Multi-digit whole-number & decimal multiplication and long division | **Live** | [`multiplication/`](../multiplication/index.html), [`division/`](../division/index.html) |
| **Number & Operations in Base Ten (`5.NBT`)** | Decimal place value to thousandths, powers of $10$ shifts, comparing, rounding, and vertical decimal $+ / -$ | **Planned** | [`decimals-operations/`](../decimals-operations/specs/01-overview-and-pedagogy.md) |
| **Number & Operations — Fractions (`5.NF`)** | Equivalent fractions, $+ / -$ unlike fractions & mixed numbers, $\times / \div$ fractions, fraction-as-division | **Live** | [`fractions/`](../fractions/index.html), [`multiplication/`](../multiplication/index.html), [`division/`](../division/index.html), [`fractions-to-decimals/`](../fractions-to-decimals/index.html) |
| **Number & Operations — Fractions (`5.NF`)** | Multi-step fraction word problems & visual bar/scaling models | **Planned** | [`word-problems/`](../word-problems/specs/01-overview-and-pedagogy.md) |
| **Measurement & Data (`5.MD`)** | Rectangular prism volume ($V = l \times w \times h$) | **Live** | [`geometry/`](../geometry/index.html) |
| **Measurement & Data (`5.MD`)** | Customary/metric unit conversions, fractional measurement line plots, additive volume of L-shaped composite prisms | **Planned** | [`ratios-and-proportions/`](../ratios-and-proportions/specs/01-overview-and-pedagogy.md), [`statistics-and-data/`](../statistics-and-data/specs/01-overview-and-pedagogy.md), [`geometry/` expansion](../geometry/specs/01-grades-5-7-geometry-expansion.md) |
| **Geometry (`5.G`)** | Quadrant I coordinate plotting & real-world grid paths; 2D polygon attribute hierarchy | **Planned** | [`integers-and-rationals/`](../integers-and-rationals/specs/01-overview-and-pedagogy.md), [`geometry/` expansion](../geometry/specs/01-grades-5-7-geometry-expansion.md) |

---

### 2.2 Grade 6 Mathematics (`6.RP`, `6.NS`, `6.EE`, `6.G`, `6.SP`)

| Domain | Core 6th Grade Skills | Coverage Status | Target Module(s) |
| :--- | :--- | :--- | :--- |
| **Ratios & Proportional Relationships (`6.RP`)** | Ratio notation, tape diagrams, double number lines, ratio tables, unit rates, measurement conversions | **Planned** | [`ratios-and-proportions/`](../ratios-and-proportions/specs/01-overview-and-pedagogy.md) |
| **Ratios & Proportional Relationships (`6.RP.A.3.C`)** | Percent as rate per $100$, finding part/whole/percent | **Planned** | [`percents/`](../percents/specs/01-overview-and-pedagogy.md) |
| **The Number System (`6.NS.A–B`)** | Dividing fractions by fractions, multi-digit division, decimal $\times / \div$, decimal-to-fraction GCF reduction | **Live** | [`division/`](../division/index.html), [`fractions/`](../fractions/index.html), [`multiplication/`](../multiplication/index.html), [`decimals-to-fractions/`](../decimals-to-fractions/index.html) |
| **The Number System (`6.NS.B.3–4`)** | Fluent decimal $+ / -$, prime factorization, GCF, LCM, distributive GCF factoring $a + b = g(p + q)$ | **Planned** | [`decimals-operations/`](../decimals-operations/specs/01-overview-and-pedagogy.md), [`number-theory/`](../number-theory/specs/01-overview-and-pedagogy.md) |
| **The Number System (`6.NS.C`)** | Positive/negative numbers, opposites, absolute value, ordering rationals, 4-quadrant coordinate plane & grid distances | **Planned** | [`integers-and-rationals/`](../integers-and-rationals/specs/01-overview-and-pedagogy.md) |
| **Expressions & Equations (`6.EE`)** | Solving one-step linear equations ($x + p = q$, $px = q$) | **Live** | [`pre-algebra-solver/`](../pre-algebra-solver/index.html) |
| **Expressions & Equations (`6.EE`)** | Whole-number exponents, evaluating expressions by substitution, combining like terms, equivalent expressions, $x > c$ inequalities on number lines, independent/dependent variable tables | **Planned** | [`order-of-operations/`](../order-of-operations/specs/01-overview-and-pedagogy.md), [`expressions-and-inequalities/`](../expressions-and-inequalities/specs/01-overview-and-pedagogy.md) |
| **Geometry (`6.G`)** | Area of triangles & rectangles, rectangular prism volume | **Live** | [`geometry/`](../geometry/index.html) |
| **Geometry (`6.G`)** | Area of parallelograms, trapezoids & composite polygons; fractional-edge prism volume; coordinate polygons; 3D nets & surface area | **Planned** | [`geometry/` expansion](../geometry/specs/01-grades-5-7-geometry-expansion.md) |
| **Statistics & Probability (`6.SP`)** | Mean, median, mode, range, quartiles, IQR, Mean Absolute Deviation (MAD), dot plots, histograms, box-and-whisker plots | **Planned** | [`statistics-and-data/`](../statistics-and-data/specs/01-overview-and-pedagogy.md) |

---

### 2.3 Grade 7 Mathematics (`7.RP`, `7.NS`, `7.EE`, `7.G`, `7.SP`)

| Domain | Core 7th Grade Skills | Coverage Status | Target Module(s) |
| :--- | :--- | :--- | :--- |
| **Ratios & Proportional Relationships (`7.RP.A.1–2`)** | Complex-fraction unit rates ($\frac{a/b}{c/d}$), testing proportionality, constant of proportionality $k = \frac{y}{x}$, $y = kx$ equations & graphs | **Planned** (+ Live graphing bridge) | [`ratios-and-proportions/`](../ratios-and-proportions/specs/01-overview-and-pedagogy.md), [`graphing-lines/`](../graphing-lines/index.html) |
| **Ratios & Proportional Relationships (`7.RP.A.3`)** | Multi-step percent applications: tax, tip, markup, markdown/discount, commission, simple interest ($I = Prt$), percent change & error | **Planned** | [`percents/`](../percents/specs/01-overview-and-pedagogy.md) |
| **The Number System (`7.NS.A.2.D`)** | Converting signed fractions & mixed numbers to terminating and repeating decimals via long division | **Live** | [`fractions-to-decimals/`](../fractions-to-decimals/index.html), [`decimals-to-fractions/`](../decimals-to-fractions/index.html) |
| **The Number System (`7.NS.A.1–3`)** | $+, -, \times, \div$ with signed integers, signed fractions, signed decimals, additive inverse on number lines, complex fractions | **Planned** | [`integers-and-rationals/`](../integers-and-rationals/specs/01-overview-and-pedagogy.md) |
| **Expressions & Equations (`7.EE.B.4.A`)** | Solving multi-step linear equations $px + q = r$ and $p(x + q) = r$ with integers, negatives, and fractions | **Live** | [`pre-algebra-solver/`](../pre-algebra-solver/index.html) |
| **Expressions & Equations (`7.EE.A.1–2, 7.EE.B.3, 7.EE.B.4.B`)** | Expanding/factoring linear expressions with rational coefficients, two-step inequalities ($px + q > r$ with negative-division sign flip), multi-step rational word problems & estimation | **Planned** | [`expressions-and-inequalities/`](../expressions-and-inequalities/specs/01-overview-and-pedagogy.md), [`word-problems/`](../word-problems/specs/01-overview-and-pedagogy.md) |
| **Geometry (`7.G`)** | Circle area/circumference, basic missing angles, basic prism volume (plus 8th-grade Pythagorean bridge) | **Live** | [`geometry/`](../geometry/index.html) |
| **Geometry (`7.G`)** | Scale drawings & scale factor, triangle construction/inequality rules, 2D cross-sections of 3D solids, multi-step algebraic supplementary/complementary/vertical angle equations, composite area & surface area | **Planned** | [`geometry/` expansion](../geometry/specs/01-grades-5-7-geometry-expansion.md) |
| **Statistics & Probability (`7.SP.A–B`)** | Random sampling, population inference, comparing two data distributions via center & MAD/IQR overlap | **Planned** | [`statistics-and-data/`](../statistics-and-data/specs/01-overview-and-pedagogy.md) |
| **Statistics & Probability (`7.SP.C`)** | Likelihood scale ($0$–$1$), theoretical & experimental probability, compound independent/dependent events via lists, two-way tables & tree diagrams | **Planned** | [`probability/`](../probability/specs/01-overview-and-pedagogy.md) |

---

## 3. Planned New Module Inventory (10 New Modules + 1 Existing-Module Expansion)

| # | Directory | Module Title | Target Grades | Specification |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `decimals-operations/` | Decimal Place Value, Rounding & Add/Subtract | 5–6 | [01-overview-and-pedagogy.md](../decimals-operations/specs/01-overview-and-pedagogy.md) |
| 2 | `order-of-operations/` | Order of Operations (PEMDAS) & Exponents | 5–6 | [01-overview-and-pedagogy.md](../order-of-operations/specs/01-overview-and-pedagogy.md) |
| 3 | `number-theory/` | Factors, Prime Factorization, GCF & LCM | 5–6 | [01-overview-and-pedagogy.md](../number-theory/specs/01-overview-and-pedagogy.md) |
| 4 | `integers-and-rationals/` | Integers, Signed Rationals & 4-Quadrant Grid | 5–7 | [01-overview-and-pedagogy.md](../integers-and-rationals/specs/01-overview-and-pedagogy.md) |
| 5 | `ratios-and-proportions/` | Ratios, Unit Rates & Proportions | 6–7 | [01-overview-and-pedagogy.md](../ratios-and-proportions/specs/01-overview-and-pedagogy.md) |
| 6 | `percents/` | Percentages, Discounts, Tax & Simple Interest | 6–7 | [01-overview-and-pedagogy.md](../percents/specs/01-overview-and-pedagogy.md) |
| 7 | `expressions-and-inequalities/` | Algebraic Expressions & Linear Inequalities | 6–7 | [01-overview-and-pedagogy.md](../expressions-and-inequalities/specs/01-overview-and-pedagogy.md) |
| 8 | `statistics-and-data/` | Statistics, MAD, Box Plots & Data Displays | 5–7 | [01-overview-and-pedagogy.md](../statistics-and-data/specs/01-overview-and-pedagogy.md) |
| 9 | `probability/` | Theoretical, Experimental & Compound Probability | 7 | [01-overview-and-pedagogy.md](../probability/specs/01-overview-and-pedagogy.md) |
| 10 | `word-problems/` | Multi-Step Word Problems & Tape Diagrams | 5–7 | [01-overview-and-pedagogy.md](../word-problems/specs/01-overview-and-pedagogy.md) |
| 11 | `geometry/` (Expansion) | Scale Drawings, 3D Nets, Cross-Sections & Polygons | 5–7 | [01-grades-5-7-geometry-expansion.md](../geometry/specs/01-grades-5-7-geometry-expansion.md) |

---

## 4. Recommended Implementation Sequence & Shared Primitives

### 4.1 Candidate Shared Utilities (`/shared/js/`)
When individual modules move into implementation (following explicit `implementation_plan.md` approval and 3+ UI mockups per [`AGENTS.md`](../AGENTS.md) §1, §9, §13), small zero-dependency helpers may be promoted into `/shared/js/`:
- `number-line-svg.js`: Reusable crisp SVG number line supporting tick intervals, signed fractions/decimals, jump arcs (`integers-and-rationals/`), and open/closed inequality rays (`expressions-and-inequalities/`).
- `decimal-exact.js`: Scaled BigInt / integer-mantissa decimal arithmetic avoiding IEEE-754 floating-point drift (e.g., `0.1 + 0.2 === 0.3` exactness) across `decimals-operations/`, `percents/`, and `statistics-and-data/`.
- `svg-charts.js`: High-DPI printable SVG generators for tape diagrams, factor trees, dot/line plots, histograms, box plots, and probability trees.

### 4.2 Recommended Build Waves
1. **Wave 1 — Core Arithmetic & Number Sense Foundations (Grades 5–6)**:
   - `decimals-operations/`, `order-of-operations/`, `number-theory/`
2. **Wave 2 — Signed Numbers, Ratios & Percents (Grades 6–7)**:
   - `integers-and-rationals/`, `ratios-and-proportions/`, `percents/`
3. **Wave 3 — Expressions, Inequalities & Geometry Expansion (Grades 6–7)**:
   - `expressions-and-inequalities/`, `geometry/` expansion
4. **Wave 4 — Data, Probability & Synthesis Word Problems (Grades 5–7)**:
   - `statistics-and-data/`, `probability/`, `word-problems/`
