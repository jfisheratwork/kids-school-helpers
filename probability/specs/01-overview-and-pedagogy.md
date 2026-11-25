# 01 - Probability & Compound Events Specification (`probability/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grade 7 (`7.SP.C.5–8`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
**Grade 7 Probability (`7.SP.C.5–8`)** synthesizes fractions, decimals, percents, and proportional reasoning. Students commonly forget to simplify probability fractions or fail to reduce the denominator (and numerator when drawing two of the same color) in **without-replacement** compound draws.

### Planned Exercises & Solver Modes
1. **Likelihood Scale & Simple Theoretical Probability (`7.SP.C.5, 7.SP.C.7.A`)**: Classify events from $0$ (*Impossible*) to $\frac{1}{2}$ (*Equally Likely*) to $1$ (*Certain*), compute $P(E) = \frac{\text{favorable}}{\text{total}}$, and find complementary probability $P(\text{not } E) = 1 - P(E)$.
2. **Experimental Probability & Trial Predictions (`7.SP.C.6, 7.SP.C.7.B`)**: Compute relative frequency from observed frequency tables and predict expected occurrences over $N$ future trials ($P(E) \times N$).
3. **Sample Spaces & Counting Outcomes (`7.SP.C.8.B`)**: Build sample spaces for spinners, coins, dice, and outfits using **Organized Lists**, **Two-Way Outcome Grids**, and **SVG Tree Diagrams**, plus the Fundamental Counting Principle.
4. **Compound Independent & Dependent Events (`7.SP.C.8.A`)**: Step-by-step $P(A \text{ and } B)$ both **with replacement** (independent: $P(A) \cdot P(B)$) and **without replacement** (dependent: decrementing total — and favorable if matching — on the second draw!).

This module pairs exact `Fraction` validation (`shared/js/fraction.js`) with procedural SVG **Spinners, Marble Bags, Two-Way Outcome Tables, and Probability Tree Diagrams** following [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Exercises & Complexity Progression |
| :--- | :---: | :--- |
| `simple_and_complement` | 7 | Classify probability on `[0, 1]` scale (`Impossible`, `Unlikely`, `As Likely As Not`, `Likely`, `Certain`); compute reduced $P(E)$, $P(A \text{ or } B)$ for mutually exclusive outcomes, and $P(\text{not } E) = 1 - P(E)$ as fraction, decimal, or `%`. |
| `experimental_predict` | 7 | Compute experimental probability $\frac{\text{observed hits}}{\text{total trials}}$ from a tally table, compare against theoretical $P(E)$, and predict expected hits in $N$ trials ($P(E) \times N$). |
| `sample_spaces` | 7 | Count total outcomes ($m \times n \times k$) and favorable outcomes in 2-stage and 3-stage experiments (coin + die, two spinners, shirt/pants/shoes) via interactive Two-Way Grids and SVG Tree Diagrams. |
| `compound_events` | 7 | **Level 1 (Independent / With Replacement)**: $P(A \text{ then } B) = P(A) \cdot P(B)$. **Level 2 (Dependent / Without Replacement — Different Items)**: $P(\text{Red then Blue}) = \frac{R}{T} \cdot \frac{B}{T - 1}$. **Level 3 (Dependent — Same Item Twice)**: $P(\text{Red then Red}) = \frac{R}{T} \cdot \frac{R - 1}{T - 1}$. |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Experimental Prediction (`experimental_predict`)
1. **Step 1 (`total_trials`)**: Sum frequency table counts to find total past trials $T_{\text{obs}}$.
2. **Step 2 (`experimental_prob`)**: Write reduced relative frequency $P_{\text{exp}}(E) = \frac{f}{T_{\text{obs}}}$.
3. **Step 3 (`scale_prediction`)**: Multiply $P_{\text{exp}}(E) \times N_{\text{future}}$ to predict expected outcomes.

### 3.2 Compound Probability With vs. Without Replacement (`compound_events`)
1. **Step 1 (`prob_first_event`)**: Find $P(A) = \frac{n_A}{T}$ from the initial marble bag / deck SVG.
2. **Step 2 (`prob_second_event`)**:
   - *With replacement*: Bag resets to $T$ items $\rightarrow P(B) = \frac{n_B}{T}$.
   - *Without replacement*: Bag SVG visually removes 1 drawn item ($T - 1$ remaining; if event $B$ matches $A$, favorable count becomes $n_A - 1$) $\rightarrow P(B \mid A)$.
   -Targeted coaching message triggers if student reuses denominator $T$ on a without-replacement problem!
3. **Step 3 (`multiply_and_reduce`)**: Multiply $P(A) \times P(B \mid A)$ and reduce to lowest terms via `Fraction`.

---

## 4. 3-Frame `\htmlId` Animations, SVG Visuals & Worksheets
- **SVG Visuals**: Color-coded Marble Bag (with pattern/letter labels inside each marble for color-blind accessibility!), Equal-Sector Spinner, Two-Way Outcome Grid, and Branching Probability Tree highlighting favorable root-to-leaf paths.
- **3-Frame Animations**:
  - *Without Replacement*: Frame 1 shows $P(\text{1st}) = \frac{\htmlId{n1}{4}}{\htmlId{d1}{10}}$; Frame 2 animates `-1` decrement on remaining pool `\frac{4 - 1}{10 - 1} = \frac{3}{9}`; Frame 3 cross-cancels and multiplies `\frac{4}{10} \times \frac{3}{9} = \frac{2}{15}`.
- **Dual Inputs**, **Synced `<details>` Guide**, and **Printable Tree-Diagram & Compound-Probability Worksheets** with worked Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: `Fraction`-backed simple, experimental, sample-space, and compound probability generators (`T >= 2` invariant so $T - 1 \ge 1$).
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying `0 <= P <= 1`, reduced `Fraction` outputs, and independent vs. dependent same/different draw formulas.
3. **Slice 3**: Accessible SVG Marble Bag, Spinner, Two-Way Grid & Tree renderers, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
