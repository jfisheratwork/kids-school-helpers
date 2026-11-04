# 04 - Fractions to Decimals & Decimals to Fractions Conversion Courses Specification

## 1. Overview & Pedagogical Goals

This specification defines two new standalone interactive solver and worksheet modules in **Kids School Helpers**:
1. **Fractions to Decimals (`/fractions-to-decimals/`)**: Teaches converting fractions into decimals step by step using **Long Division** with explicit decimal-point alignment and trailing-zero annexation.
2. **Decimals to Fractions (`/decimals-to-fractions/`)**: Teaches converting decimals into simplified fractions (and mixed numbers) step by step using **Place Value Identification** ($10, 100, 1000$) and **Greatest Common Factor ($\text{GCF}$) Reduction**.

Both modules strictly adhere to the repository's core standards:
- **Architecture & Isolation (`spec/01-architecture-and-standards.md`)**: Pure client-side ES6 modules linked from the root `index.html` hub, using fixed-version Tailwind CSS (`3.4.4`) and KaTeX (`0.16.10`).
- **Unified 3-Frame Step Animations (`spec/02-unified-solver-animations.md`)**: Every step provides 3-frame KaTeX `\htmlId` token-morphing sequences via `SharedAnimationPlayer` and `ViewTransitions`.
- **Manual-Advance `Tab`, Dual Inputs & Upfront Progression (`spec/03-dual-input-and-step-progression.md`)**: Animations open paused on Frame `1/3` (`autoplay: false`), advance on subsequent `Tab` presses, and intelligently populate either the **1. Partial / Step Result** input or **2. Final Answer** input on the final frame. All planned steps for the active problem are displayed upfront in a vertical progression list above the dual inputs.
- **Upfront Collapsible Explainer Guide (`fractions/specs/01-explainer-guide.md`)**: Each course features an upfront collapsible `<details>` "How to Solve" guide with complexity/topic pills and dynamic KaTeX math rendering.
- **Printable Worksheets with Step-by-Step Answer Keys**: Each course provides a Worksheet mode using `WorksheetLayout` with configurable complexity levels, problem counts, and full worked Answer Keys.

---

## 2. Course 1: Fractions to Decimals (`/fractions-to-decimals/`)

### 2.1 Pedagogical Model & Long Division State Machine
Given a fraction $\frac{n}{d}$:
1. **Long Division Setup**:
   - The fraction $\frac{n}{d}$ means $n \div d$, where denominator $d$ is the **divisor** (outside the bracket) and numerator $n$ is the **dividend** (inside the bracket).
   - The dividend is formatted with an explicit decimal point and trailing zeros matching the required decimal precision: e.g., for $\frac{3}{4}$, dividend display is `3.00` (columns: `['3', '.', '0', '0']`), and quotient display is `0.75` (columns: `['0', '.', '7', '5']`).
2. **Step Sequence**:
   - **Whole-Number Division Cycle** (before `.`):
     - `divide_whole`: How many times does $d$ go into the integer part $n$?
       - For proper fractions ($n < d$), $q_0 = 0$. The student enters `0` (and the solver automatically places the aligned decimal point `.` in the quotient row right after `0`, displaying `0.`).
       - For improper fractions ($n \ge d$), standard long-division cycles (`divide_digit` $\rightarrow$ `multiply_back` $\rightarrow$ `subtract_down`) execute on the integer part until the decimal point is reached.
   - **Decimal Cycles** (for each trailing zero after `.`):
     - `bring_down_zero`: Annex and bring down the next trailing `0` after the decimal point to form the new working number (e.g., remainder $3 \rightarrow 30$).
     - `divide_digit`: Divide working number by divisor $d$ to find the next decimal quotient digit $q_k = \lfloor \text{workingNum} / d \rfloor$.
     - `multiply_back`: Multiply $q_k \times d = \text{multBack}$.
     - `subtract_down`: Subtract $\text{workingNum} - \text{multBack} = \text{remainder}$.
   - **Termination Condition**:
     - For terminating decimals (Levels 1–3), cycles stop as soon as $\text{remainder} = 0$.
     - For repeating decimals (Level 4), cycles run for 2 decimal places (hundredths) so students observe the repeating remainder pattern and enter the 2-decimal-place quotient (e.g., `0.33` for $\frac{1}{3}$ or `0.27` for $\frac{3}{11}$).

### 2.2 Complexity Levels, Mixed Numbers, Negatives & Custom Input (`#config-complexity` & `#ws-complexity`)
- **Level 1 — Basic (Tenths / 1 Decimal Place)**:
  - Proper fractions with denominators in $\{2, 5, 10\}$ that terminate in 1 decimal place (e.g., $\frac{1}{2} = 0.5$, $\frac{3}{5} = 0.6$, $\frac{7}{10} = 0.7$).
- **Level 2 — Medium (Hundredths / 2 Decimal Places)**:
  - Proper fractions with denominators in $\{4, 20, 25, 50\}$ that terminate in 2 decimal places (e.g., $\frac{1}{4} = 0.25$, $\frac{3}{4} = 0.75$, $\frac{7}{20} = 0.35$, $\frac{9}{25} = 0.36$).
- **Level 3 — Challenging (Thousandths & Improper Fractions)**:
  - Fractions with denominators in $\{8, 40\}$ terminating in up to 3 decimal places (e.g., $\frac{3}{8} = 0.375$, $\frac{5}{8} = 0.625$, $\frac{7}{8} = 0.875$) and improper fractions ($n > d$, e.g., $\frac{5}{4} = 1.25$, $\frac{7}{5} = 1.4$, $\frac{9}{4} = 2.25$).
- **Level 4 — Repeating Decimals (2–3 Decimal Places)**:
  - Fractions with denominators in $\{3, 6, 9, 11, 12, 15\}$ whose remainders repeat (e.g., $\frac{1}{3} = 0.33\dots$, $\frac{5}{6} = 0.83\dots$, $\frac{7}{12} = 0.583\dots$, $\frac{3}{11} = 0.27\dots$). Denominators like $12 = 2^2 \times 3$ automatically run to 3 decimal places so the repeating digit ($3$) is reached.
- **Level 5 — Mixed Numbers & Signed/Negative Fractions (e.g. $-5\frac{7}{12}$, $-2\frac{3}{4}$, $4\frac{5}{8}$)**:
  - Generates positive and negative mixed numbers $\pm w\frac{n}{d}$ across terminating and repeating denominators (including $d = 12$, e.g., $-5\frac{7}{12} = -5.583\dots$).
  - **Pedagogical Step Decomposition for Signed / Mixed Numbers ($\pm w\frac{n}{d}$)**:
    1. Separate the sign and whole-number part ($\pm w$) from the fractional part ($\frac{n}{d}$): e.g., $-5\frac{7}{12} = -\left(5 + \frac{7}{12}\right)$.
    2. Perform step-by-step Long Division on the fractional part $n \div d$ ($12 \overline{) 7.000} = 0.583$).
    3. Final Step (`combine_whole_and_sign`): Combine the whole number $w$, the fractional decimal from long division, and the negative sign (if negative): $-\left(5 + 0.583\ldots\right) = -5.583\ldots$.
- **Format & Sign Controls + Custom Problem Entry**:
  - **Fraction Format Selector (`#config-format` / `#ws-format`)**: `Auto (By Level)`, `Proper Only (e.g. 7/12)`, `Mixed Numbers (e.g. 5 7/12)`.
  - **Allow Negative Numbers Checkbox (`#config-negatives` / `#ws-negatives`)**: Toggles negative values (e.g., `-5 7/12`, `-3/4`).
  - **Custom Fraction / Mixed Number Input (`#custom-f2d-input` + `#btn-custom-f2d`)**: Allows typing any custom fraction or signed mixed number (such as `-5 7/12`, `-3/8`, `4 2/5`) to immediately launch the step-by-step long-division solver on that exact problem.
  -Similarly, **Decimals to Fractions (`/decimals-to-fractions/`)** includes an **Allow Negative Numbers (`#config-negatives` / `#ws-negatives`)** toggle and a **Custom Decimal Input (`#custom-d2f-input` + `#btn-custom-d2f`)** supporting signed mixed decimals (such as `-5.75 = -5 3/4` or `-23/4`).

### 2.3 Upfront Guide, Dual Inputs & Worksheets
- **Collapsible Guide (`#guide-f2d`)**: Topic pills synchronized with the complexity selector (`basic`, `medium`, `challenging`, `repeating`).
- **Dual Inputs**:
  - `#f2d-step-input`: Validates the current long-division step (`divide_digit`, `multiply_back`, `subtract_down`, `bring_down_zero`).
  - `#f2d-final-input`: Validates the final decimal value (accepting leading zero or shorthand, e.g., `0.75` or `.75`, and for repeating decimals `0.33`, `0.33...`, or `0.3`). Entering the correct final decimal immediately fills all remaining cells in the long division bracket and marks all steps complete.
- **Worksheet Generator**:
  - Generates printable problems showing $\text{Convert } \frac{n}{d} \text{ to a decimal: } \quad d \overline{) n.00\dots}$ and an Answer Key with the complete worked long division array and final decimal.

---

## 3. Course 2: Decimals to Fractions (`/decimals-to-fractions/`)

### 3.1 Pedagogical Model & Step State Machine
Given a decimal number (e.g., $0.75$, $0.375$, or $1.25$):
1. **Step 1 (`identify_place_value`) — Identify Place-Value Denominator**:
   - Count $k$ digits after the decimal point ($k=1 \rightarrow 10$ Tenths, $k=2 \rightarrow 100$ Hundredths, $k=3 \rightarrow 1000$ Thousandths).
   - Expected input: `"10"`, `"100"`, or `"1000"`.
   - 3-Frame Animation:
     - Frame 1: Highlights the decimal digits to the right of the decimal point using `\htmlId`.
     - Frame 2: Maps $k$ decimal places to $10^k$ ($\text{Tenths} = 10$, $\text{Hundredths} = 100$, $\text{Thousandths} = 1000$).
     - Frame 3: Displays $\text{Denominator} = 10^k$.
2. **Step 2 (`unsimplified_fraction`) — Write as Unsimplified Fraction over $10^k$**:
   - Place the decimal digits over $10^k$ (e.g., $0.75 \rightarrow \frac{75}{100}$; for $1.25 \rightarrow 1\frac{25}{100}$ or $\frac{125}{100}$).
   - Expected input: Unsimplified fraction string (accepts both `1 25/100` and `125/100` when whole part $> 0$).
   - 3-Frame Animation:
     - Frame 1: Starting decimal with `\htmlId{dec_digits}{...}`.
     - Frame 2: Digits move above the fraction bar over `\htmlId{denom}{10^k}`.
     - Frame 3: Unsimplified fraction $\frac{n_{\text{raw}}}{10^k}$.
3. **Step 3 (`find_gcf`) — Find Greatest Common Factor (when $\text{GCF}(n_{\text{raw}}, 10^k) > 1$)**:
   - Calculate $g = \gcd(n_{\text{raw}}, 10^k)$.
   - Expected input: String(g) (e.g., `"25"`).
   - 3-Frame Animation:
     - Frame 1: $\text{GCF}(\htmlId{n}{n_{\text{raw}}}, \htmlId{d}{10^k})$.
     - Frame 2: Factor decomposition showing shared factor $g$ in indigo (`\textcolor{#4f46e5}{g}`).
     - Frame 3: $\text{GCF} = \mathbf{g}$.
4. **Step 4 (`simplify_fraction`) — Divide by $\text{GCF}$ to Simplify (when $\text{GCF} > 1$)**:
   - Divide numerator and denominator by $g$: $\frac{n_{\text{raw}} \div g}{10^k \div g} = \frac{n_{\text{simp}}}{d_{\text{simp}}}$.
   - Expected input: Simplified fraction (e.g., `"3/4"`, and for mixed decimals accepts both `"1 1/4"` and `"5/4"`).
   - 3-Frame Animation:
     - Frame 1: $\frac{\htmlId{n}{n_{\text{raw}}}}{\htmlId{d}{10^k}}$.
     - Frame 2: $\frac{\htmlId{n}{n_{\text{raw}}} \textcolor{#4f46e5}{\div g}}{\htmlId{d}{10^k} \textcolor{#4f46e5}{\div g}}$.
     - Frame 3: Morphs into simplified fraction $\frac{\htmlId{n}{n_{\text{simp}}}}{\htmlId{d}{d_{\text{simp}}}}$.

### 3.2 Complexity Levels (`#config-complexity` & `#ws-complexity`)
- **Level 1 — Basic (Tenths & Benchmark Hundredths)**:
  - Single-digit tenths ($0.1$ to $0.9$) and benchmark hundredths ($0.20, 0.25, 0.40, 0.50, 0.60, 0.75, 0.80$).
- **Level 2 — Medium (General Hundredths)**:
  - Two-decimal-place numbers ($0.04$ to $0.96$) requiring reduction by $\text{GCF} \in \{2, 4, 5, 20, 25\}$ (e.g., $0.35 = \frac{7}{20}$, $0.48 = \frac{12}{25}$, $0.84 = \frac{21}{25}$).
- **Level 3 — Challenging (Thousandths & Mixed Decimals $> 1$)**:
  - Three-decimal-place numbers ($0.125 = \frac{1}{8}$, $0.375 = \frac{3}{8}$, $0.625 = \frac{5}{8}$, $0.875 = \frac{7}{8}$, $0.025 = \frac{1}{40}$, $0.040 = \frac{1}{25}$) and mixed decimals $> 1$ ($1.25 = 1\frac{1}{4}$, $2.4 = 2\frac{2}{5}$, $3.75 = 3\frac{3}{4}$).

### 3.3 Upfront Guide, Dual Inputs & Worksheets
- **Collapsible Guide (`#guide-d2f`)**: Topic pills synchronized with the complexity selector (`basic`, `medium`, `challenging`).
- **Dual Inputs**:
  - `#d2f-step-input`: Validates current step (`identify_place_value`, `unsimplified_fraction`, `find_gcf`, `simplify_fraction`).
  - `#d2f-final-input`: Validates the final simplified fraction at any time (accepting both mixed and improper forms for numbers $> 1$).
- **Worksheet Generator**:
  - Generates printable problems (`0.75 = `) and an Answer Key displaying the complete place-value & reduction chain ($0.75 = \frac{75}{100} = \frac{3}{4}$).
