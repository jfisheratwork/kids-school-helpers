# 01 - Statistics, MAD, Box Plots & Data Displays Specification (`statistics-and-data/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–7 (`5.MD.B.2`, `6.SP.A.1–3`, `6.SP.B.4–5`, `7.SP.A.1–2`, `7.SP.B.3–4`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
Data literacy spans **5th-grade fractional measurement line plots (`5.MD.B.2`)**, **6th-grade univariate distributions, IQR, MAD, histograms & box plots (`6.SP`)**, and **7th-grade random sampling & comparative population inference (`7.SP.A–B`)**.

### Planned Exercises & Solver Modes
1. **Fractional Line Plots & Dot Plots (`5.MD.B.2`, `6.SP.B.4`)**: Read and construct line plots with $\frac{1}{2}, \frac{1}{4}, \frac{1}{8}$ unit measurements (redistributing totals equally or finding differences between extremes) and integer dot plots.
2. **Measures of Center & Five-Number Summary (`6.SP.A.3, 6.SP.B.5`)**: Step-by-step **Mean**, **Median** (odd & even dataset lengths), **Mode**, **Range**, **Quartiles ($Q_1, Q_3$)**, and **Interquartile Range ($\text{IQR} = Q_3 - Q_1$)**.
3. **Mean Absolute Deviation (`MAD`) Step Table Solver (`6.SP.B.5.C`, `7.SP.B.3`)**: Guided 3-stage table (`Find Mean` $\rightarrow$ `Compute |x_i - Mean| Distances` $\rightarrow$ `Average the Absolute Deviations`).
4. **Histograms, Box-and-Whisker Plots & Comparing Two Populations (`6.SP.B.4`, `7.SP.A.1–2`, `7.SP.B.3–4`)**: Construct/interpret frequency histograms and 5-number SVG box plots, make proportional population inferences from random samples, and express difference in centers as a multiple of `MAD` or `IQR`.

This module combines multi-step tabular statistical solvers with crisp procedural SVG charts (**Line/Dot Plots**, **Histograms**, and **Box-and-Whisker Plots**) adhering to [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Exercises & Complexity Progression |
| :--- | :---: | :--- |
| `fraction_line_plots` | 5 | Read `×` marks above $\frac{1}{2}, \frac{1}{4}, \frac{1}{8}$ ticks; compute total combined measurement, difference between heaviest/lightest, or equal redistribution average (`total ÷ count`). |
| `center_and_quartiles` | 6 | **Level 1**: Odd-length dataset ($n \in \{5, 7, 9\}$) — Sort, Mean, Median, Mode, Range. **Level 2**: Even-length dataset ($n \in \{6, 8, 10\}$) — averaging middle two values + $Q_1$, $Q_3$, and $\text{IQR} = Q_3 - Q_1$. |
| `mad_solver` | 6–7 | **Mean Absolute Deviation (`MAD`)** for $n \in \{5, 6, 8\}$ data points curated so the mean is a clean integer or `.5` decimal and `MAD` terminates cleanly in $\le 2$ decimal places. |
| `box_and_histograms` | 6 | Build or read **5-number summary Box-and-Whisker Plots** (`Min`, $Q_1$, `Median`, $Q_3$, `Max`, identifying $25\%/50\%/75\%$ quartile percentages) and binned **Frequency Histograms**. |
| `sampling_and_compare` | 7 | **Random Sample Inference (`7.SP.A.2`)**: Scale sample ratio $\frac{\text{sample count}}{n} = \frac{x}{N_{\text{pop}}}$ to predict population totals. **Compare Two Populations (`7.SP.B.3`)**: Compute $\frac{|\text{Mean}_A - \text{Mean}_B|}{\text{MAD}}$ across parallel dot/box plots. |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Quartiles & IQR (`center_and_quartiles` Level 2)
1. **Step 1 (`sort_ascending`)**: Order raw dataset least-to-greatest (preventing the #1 student median error: picking the middle number of an unsorted list!).
2. **Step 2 (`find_median`)**: Find overall median $Q_2$ (excluding $Q_2$ itself from both halves when $n$ is odd, per standard US middle-school exclusive-median convention).
3. **Step 3 (`find_q1_q3`)**: Compute median of lower half ($Q_1$) and median of upper half ($Q_3$).
4. **Step 4 (`compute_iqr`)**: Subtract $\text{IQR} = Q_3 - Q_1$.

### 3.2 Mean Absolute Deviation (`mad_solver`)
1. **Step 1 (`compute_mean`)**: Sum the $n$ values and divide by $n$ to find $\bar{x}$.
2. **Step 2 (`absolute_deviations`)**: Compute unsigned distances $d_i = |x_i - \bar{x}|$ for each data point (displayed in an interactive row).
3. **Step 3 (`average_deviations`)**: Sum $\sum d_i$ and divide by $n$ to obtain $\text{MAD}$.

---

## 4. 3-Frame `\htmlId` Animations, SVG Charts & Worksheets
- **3-Frame View Transitions**:
  - *Sorting & Median*: Frame 1 unsorted `\htmlId{d_i}{x_i}` tokens; Frame 2 tokens physically glide into sorted ascending order; Frame 3 highlights middle token(s) and $Q_1 / Q_3$ brackets.
  - *MAD*: Frame 1 number line with data dots and vertical fulcrum at $\bar{x}$; Frame 2 draws horizontal distance bars $|x_i - \bar{x}|$; Frame 3 averages bar lengths into `MAD`.
- **Dual Inputs**, **Custom Dataset Comma-Separated Input (`e.g. 12, 18, 15, 22, 13`)**, **Synced `<details>` Guide**, and **Printable SVG Chart & MAD-Table Worksheets** with worked Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Pure statistical calculator (`sort`, `mean`, exclusive `quartiles`, `iqr`, `mad`) + clean-number problem generators.
2. **Slice 2**: Unit tests in `test/unit-tests.js` verifying odd vs. even exclusive quartile splits ($n = 5, 6, 7, 8, 9, 10$), zero-range datasets, and fractional line-plot sums.
3. **Slice 3**: SVG Line/Dot Plot, Histogram & Box-Plot renderers, MAD table UI, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
