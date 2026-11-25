# 01 - Order of Operations (PEMDAS / GEMS) & Exponents Specification (`order-of-operations/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–6 (`5.OA.A.1–2`, `6.EE.A.1`, `6.EE.A.2.C`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
Students in **Grades 5 and 6** transition from single binary operations to multi-step numerical expressions (`5.OA.A.1–2`, `6.EE.A.1`). The two most common misconceptions are:
1. Multiplying base by exponent ($2^3 \neq 6$) instead of repeated multiplication ($2 \times 2 \times 2 = 8$).
2. Treating `M` as strictly before `D` (computing $24 \div 4 \times 2$ as $24 \div 8 = 3$ instead of left-to-right $6 \times 2 = 12$) or `A` strictly before `S` ($15 - 6 + 4 = 13$, not $5$).

### Planned Exercises & Solver Modes
1. **Exponents Foundations**: Evaluate whole-number, decimal, and fractional powers ($2^5$, $0.3^2$, $\left(\frac{2}{3}\right)^3$, $n^0 = 1$, $n^1 = n$) by expanding repeated multiplication.
2. **PEMDAS / GEMS Funnel Evaluator**: Step-by-step funnel reduction of multi-operation expressions with parentheses `()`, nested brackets `[]`, exponents, and strict left-to-right `×/÷` and `+/-` tie-breaking.
3. **Verbal-to-Expression Translator (`5.OA.A.2`)**: Convert word descriptions ("multiply the sum of 8 and 5 by 3") into parenthesized numerical expressions and compare expression magnitudes without full computation.

This module builds a **Visual Funnel Step-by-Step Expression Evaluator** following [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Level | Description | Grouping & Exponents | Number Domain | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1 — 5th Grade Core** | 2–3 operations, single `()`, left-to-right `×/÷` & `+/-` traps | `()` only, no exponents | Whole numbers | $24 \div 4 \times 2 + (9 - 5)$ |
| **Level 2 — Nested Grouping** | 3–4 operations with nested `[ ... ( ... ) ... ]` | `()` and `[]` | Whole numbers | $3 \times [18 - (4 + 2) \times 2]$ |
| **Level 3 — 6th Grade Exponents** | Whole-number exponents ($b^e$) inside & outside parentheses | `()`, `[]`, exponents $e \in \{2,3,4\}$ | Whole numbers | $(7 - 3)^2 + 18 \div 3^2 \times 4$ |
| **Level 4 — Rational & Signed Challenge** | Fractional/decimal bases, fraction bars as grouping symbols, optional negatives | `()`, fraction bar $\frac{A}{B}$, powers | Decimals, fractions, optional negatives | $\frac{5^2 - 9}{2^3} + \left(\frac{1}{2}\right)^2 \times 12$ |
| **Topic: `exponents_drill`** | Standalone base-and-exponent expansion & evaluation | Expanded product $\rightarrow$ value | Whole, decimal, fraction bases | $\left(\frac{2}{3}\right)^3 = \frac{2}{3}\cdot\frac{2}{3}\cdot\frac{2}{3} = \frac{8}{27}$ |
| **Topic: `verbal_translate`** | Translate English math phrases into parenthesized expressions | Grouping placement | Whole numbers | *"Subtract 4 from 12, then divide by 2"* $\rightarrow (12 - 4) \div 2$ |

---

## 3. Pedagogical AST & Funnel Step State Machine

1. **Expression AST Construction**:
   - Generator builds a deterministic binary/unary AST with unique node IDs (`node_1`..`node_m`) and ensures every intermediate division yields an exact integer (Levels 1–3) or simplified `Fraction` (Level 4).
2. **Canonical Priority Resolver**:
   - At each step, the solver locates the highest-priority innermost reducible sub-expression:
     1. Innermost grouping `()` $\rightarrow$ `[]` $\rightarrow$ numerator/denominator of fraction bar.
     2. Exponents (`eval_exponent`).
     3. Leftmost `×` or `÷` (`eval_mult_div` — explicitly flagging left-to-right tie-breaker in hint copy when `÷` precedes `×`!).
     4. Leftmost `+` or `-` (`eval_add_sub` — explicitly flagging left-to-right tie-breaker when `-` precedes `+`!).
3. **Flexible Student Input Contract**:
   - **1. Partial / Step Result (`#pemdas-step-input`)**: Accepts *either* the evaluated sub-value (e.g., `16` for $(7-3)^2$) *or* the rewritten full line (`16 + 18 / 3^2 * 4`), appending the next narrowed funnel row below the expression!
   - **2. Final Answer (`#pemdas-final-input`)**: Accepts the final value at any point and expands all remaining funnel rows.

---

## 4. 3-Frame `\htmlId` Funnel Morphing & Worksheets
- **3-Frame Animation**:
  - Frame 1: Full expression with active target sub-expression wrapped in `\htmlId{active}{\textcolor{#4f46e5}{\underline{4^2}}}` while surrounding tokens carry stable `\htmlId{tok_i}{...}` IDs.
  - Frame 2: Target expands inline (`\htmlId{active}{4 \times 4}`).
  - Frame 3: Target collapses smoothly into `\htmlId{active}{\mathbf{16}}` as surrounding tokens glide inward into the funnel shape.
- **Custom Expression Parser**: Safe recursive-descent arithmetic parser (`+`, `-`, `*`, `/`, `^`, `()`, `[]` — zero `eval`!).
- **Printable Worksheets**: Multi-problem funnel workspace boxes with full line-by-line funnel reductions in the Answer Key.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: AST generator + safe recursive-descent custom parser (`generator.js`, `parser.js`).
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying `÷`-before-`×` and `-`-before-`+` tie-breakers, nested brackets, and rational powers.
3. **Slice 3**: Funnel UI, `<details>` PEMDAS/GEMS guide, and 3-frame token-collapse animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error check.
