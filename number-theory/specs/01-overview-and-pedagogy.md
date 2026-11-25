# 01 - Number Theory: Prime Factorization, GCF, LCM & Distributive Factoring Specification (`number-theory/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–6 (`4.OA.B.4` review $\rightarrow$ `5.NF.A.1` prep $\rightarrow$ `6.NS.B.4`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
In [`fractions/`](../../fractions/index.html) and [`decimals-to-fractions/`](../../decimals-to-fractions/index.html), students apply `GCF` and `LCM` inside fraction steps, yet **Grade 6 (`6.NS.B.4`)** requires dedicated mastery of prime factorization, finding `GCF` ($\le 100$) and `LCM` ($\le 12$), and using the distributive property to factor numerical sums ($36 + 8 = 4(9 + 2)$).

### Planned Exercises & Solver Modes
1. **Divisibility, Factors & Prime/Composite Classification**: Test divisibility rules ($2, 3, 4, 5, 6, 9, 10$) and list factor rainbow pairs.
2. **Interactive SVG Prime Factor Trees**: Split composite numbers step-by-step down to circled prime leaves and write prime-power exponential form ($72 = 2^3 \times 3^2$).
3. **Greatest Common Factor (`GCF`) & Least Common Multiple (`LCM`)**: Visual prime-factor Venn diagram and division-ladder solvers for 2 or 3 numbers.
4. **Distributive Property Factoring (`6.NS.B.4`)**: Rewrite sums of whole numbers with a common factor as $a + b = g(p + q)$ where $\gcd(p, q) = 1$ (e.g., $36 + 8 = 4(9 + 2)$).

This module provides interactive SVG **Factor Trees**, **Prime-Factor Venn Diagrams**, and step-by-step algebraic factoring aligned with [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Title | Level 1 (Foundational) | Level 2 (Standard Grade 6) | Level 3 (Challenge / 3 Numbers) |
| :--- | :--- | :--- | :--- | :--- |
| `divisibility_factors` | Divisibility & Factor Pairs | Numbers $\le 50$, rules for $2, 5, 10$ | Numbers $\le 120$, digit-sum rules $3, 6, 9$ & last-two-digits $4$ | Complete factor-pair rainbow + Prime vs. Composite proof |
| `prime_factorization` | SVG Factor Trees & Exponents | 2–3 prime factors (e.g., $18, 20, 28$) | 4–5 prime factors ($48, 72, 90, 108$) | Larger composites ($120$–$360$) in canonical $p_1^{e_1} \cdot p_2^{e_2}$ form |
| `gcf_lcm` | GCF & LCM (Venn & Ladder) | Two numbers $\le 36$ | `6.NS.B.4` range (`GCF` $\le 100$, `LCM` $\le 12$ or $\le 24$) | Three numbers (e.g., $\text{GCF}/\text{LCM}(12, 18, 30)$) + GCF/LCM word cues |
| `distributive_gcf` | Distributive Factoring ($a + b = g(p + q)$) | Small common factor ($15 + 10 = 5(3 + 2)$) | Full `GCF` extraction ($36 + 8 = 4(9 + 2)$, $48 + 72 = 24(2 + 3)$) | Trap check: rejects partial factoring like $24 + 36 \rightarrow 6(4 + 6)$ with targeted hint that $\gcd(4,6)=2 > 1$! |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Interactive Factor Tree (`prime_factorization`)
1. **Step 1..K (`split_composite`)**: Given active composite node $N$, student enters any non-trivial factor pair `a * b` (e.g., `8 * 9` or `2 * 36` for $72$ — **branch-order agnostic!**). Prime nodes are circled in emerald; composite nodes branch further until only primes remain.
2. **Final Step (`write_exponential`)**: Collect sorted prime leaves into canonical exponential notation (accepting `2^3 * 3^2` or expanded `2 * 2 * 2 * 3 * 3` when configured).

### 3.2 GCF & LCM via Prime Venn Diagram (`gcf_lcm`)
1. **Step 1 (`factor_a`)**: Prime factorize $A$ (e.g., $24 = 2^3 \times 3$).
2. **Step 2 (`factor_b`)**: Prime factorize $B$ (e.g., $36 = 2^2 \times 3^2$).
3. **Step 3 (`shared_primes_gcf`)**: Multiply shared intersection primes in the center of the SVG Venn diagram ($\text{GCF} = 2 \times 2 \times 3 = 12$).
4. **Step 4 (`all_regions_lcm`)**: Multiply all Venn regions ($\text{LCM} = 2 \times 12 \times 3 = 72$).

### 3.3 Distributive GCF Factoring (`distributive_gcf`)
1. **Step 1 (`find_gcf`)**: Compute $g = \gcd(a, b)$ (e.g., $\gcd(36, 8) = 4$).
2. **Step 2 (`divide_terms`)**: Compute inner quotients $p = a \div g = 9$ and $q = b \div g = 2$.
3. **Step 3 (`factored_expression`)**: Write $4(9 + 2)$ and verify $\gcd(9, 2) = 1$.

---

## 4. 3-Frame `\htmlId` Animations, Dual Inputs & Worksheets
- **3-Frame Animations**:
  - *Distributive Factoring*: Frame 1 `\htmlId{a}{36} + \htmlId{b}{8}`; Frame 2 decomposes into `\htmlId{g1}{\textcolor{#4f46e5}{4}} \cdot \htmlId{p}{9} + \htmlId{g2}{\textcolor{#4f46e5}{4}} \cdot \htmlId{q}{2}`; Frame 3 glides shared `\htmlId{g1}{4}` outside parentheses to `4(9 + 2)`.
- **Dual Inputs**, **Custom Number/Pair Input**, **Upfront `<details>` Guide**, and **Printable Factor-Tree & Venn Worksheets** with complete worked Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Pure prime-sieve, branch-agnostic factor-tree validator, `GCF`/`LCM`, and distributive-factoring generator.
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying alternate valid tree splits ($72 = 8 \times 9$ vs $2 \times 36$) and partial-GCF trap feedback.
3. **Slice 3**: Dynamic SVG Factor Tree & Venn renderer, `<details>` guide, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
