# 01 - Decimal Place Value, Rounding & Add/Subtract Specification (`decimals-operations/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–6 (`5.NBT.A.1–4`, `5.NBT.B.7`, `6.NS.B.3`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
While [`multiplication/`](../../multiplication/index.html), [`division/`](../../division/index.html), and [`decimals-to-fractions/`](../../decimals-to-fractions/index.html) cover decimal multiplication, division, and conversion, students in **Grades 5 and 6** require dedicated scaffolding for **decimal place value, powers-of-10 shifts, rounding, and aligned vertical addition/subtraction** (`5.NBT.A.1–4`, `5.NBT.B.7`, `6.NS.B.3`).

### Planned Exercises & Solver Modes
1. **Place Value & Expanded Form**: Identify digit values up to thousandths and convert between standard, word, and expanded forms ($4 \times 10 + 7 \times 0.1 + 3 \times 0.001$).
2. **Powers of 10 Decimal Shifts**: Multiply and divide decimals by $10^1, 10^2, 10^3, 10^4$ with animated decimal-point hops.
3. **Comparing, Ordering & Rounding Decimals**: Align place values, annex placeholder zeros, compare ($<, >, =$), and round to the nearest whole, tenth, hundredth, or thousandth.
4. **Vertical Decimal Addition & Subtraction**: Step-by-step column alignment by decimal point, zero-padding ragged lengths (e.g., $15.4 - 3.875 \rightarrow 15.400 - 3.875$), carrying, and borrowing across multiple zeros.

All solver layouts conform to [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels (`#config-topic` & `#config-complexity`)

| Topic ID | Title | Level 1 (Tenths) | Level 2 (Hundredths) | Level 3 (Thousandths & Ragged Lengths) |
| :--- | :--- | :--- | :--- | :--- |
| `place_rounding` | Place Value, Comparing & Rounding | Tenths place value & rounding ($4.6 \rightarrow 5$) | Hundredths comparison ($0.4$ vs $0.38$) & expanded form | Thousandths rounding with $9$-rollover ($3.996 \rightarrow 4.00$) |
| `powers_of_ten` | Powers of $10$ Shifts | $\times / \div 10, 100$ | $\times / \div 10^1, 10^2, 10^3$ | Missing exponent or factor ($4.25 \times 10^? = 4250$) |
| `add_decimals` | Vertical Decimal Addition | Same decimal places ($3.4 + 2.8$) | Ragged places ($12.6 + 4.38$) | 3 addends or thousandths ($8.4 + 19.075 + 0.68$) |
| `sub_decimals` | Vertical Decimal Subtraction | Same places, single borrow ($7.2 - 3.8$) | Annex 1 zero ($14.5 - 6.28 \rightarrow 14.50 - 6.28$) | Whole minus thousandths across zeros ($20 - 4.375 \rightarrow 20.000 - 4.375$) |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Exact Arithmetic Invariant (Zero IEEE-754 Drift)
All generator and validation math MUST represent decimals as scaled integer mantissas `(mantissaBigInt, scalePlaces)` (e.g., `14.5` at scale `3` is `14500n`), never raw JavaScript `Number` subtraction (`14.5 - 6.28` float artifacts are strictly forbidden).

### 3.2 Vertical Addition & Subtraction (`add_decimals`, `sub_decimals`)
1. **Step 1 (`align_and_pad`)**: Align numbers vertically by the decimal point `.` and annex trailing placeholder `0`s so both operands share max scale $k$ (e.g., $20 \rightarrow 20.000$).
2. **Step 2..N (`column_compute`)**: Moving right-to-left from $10^{-k}$ to highest whole-number place:
   - In subtraction, if top digit $<$ bottom digit, trigger explicit `regroup_borrow` step (highlighting chain borrows across `0`s: $20.000 \rightarrow 1\text{ }9.9\text{ }9\text{ }\!^{1}0$).
   - Compute column sum/difference and carry if sum $\ge 10$.
3. **Final Step (`place_decimal_and_confirm`)**: Drop the aligned decimal point straight down into the result row and confirm final value.

### 3.3 Rounding Decimals (`place_rounding`)
1. **Step 1 (`identify_target_digit`)**: Enter the digit in the target rounding place (e.g., hundredths digit of $3.486$ is `8`).
2. **Step 2 (`inspect_right_neighbor`)**: Enter the neighbor digit immediately to the right (`6`) and decide `up` ($\ge 5$) or `stay` ($< 5$).
3. **Step 3 (`rounded_value`)**: Enter rounded decimal (`3.49`, preserving trailing zeros when rounding to a named decimal place, e.g., `4.00` for nearest hundredth of `3.996`).

### 3.4 Powers of 10 (`powers_of_ten`)
1. **Step 1 (`determine_shift`)**: Identify direction and hop count from $10^k$ (`×` shifts decimal right $k$ places; `÷` shifts left $k$ places).
2. **Step 2 (`shifted_result`)**: Annex leading/trailing zeros as needed and enter final number.

---

## 4. 3-Frame `\htmlId` Animations, Dual Inputs & Worksheets
- **3-Frame View Transitions**:
  - *Subtraction Borrow*: Frame 1 highlights insufficient column $\htmlId{col}{0 - 5}$; Frame 2 morphs neighbor $\htmlId{nbr}{4} \rightarrow 3$ while carrying $+10$ to $\htmlId{col}{10 - 5}$; Frame 3 resolves to $\mathbf{5}$.
  - *Powers of 10*: Frame 1 highlights `\htmlId{pt}{.}`; Frame 2 draws curved hop arcs under digits; Frame 3 lands `\htmlId{pt}{.}` in its final slot.
- **Upfront Guide (`#guide-decimals-ops`)**, **Custom Expression Input (`#custom-dec-input`)**, **Dual Inputs (`#dec-step-input` + `#dec-final-input`)**, and **Printable Vertical-Grid Worksheets** with aligned decimal columns and worked regrouping Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Scaled-integer exact decimal helper + `generator.js` across all 4 topics.
2. **Slice 2**: Unit tests in `test/unit-tests.js` covering multi-zero borrows, $9$-rollover rounding, and $10^k$ shifts.
3. **Slice 3**: Tabular vertical place-value grid UI, `<details>` guide, and 3-frame `SharedAnimationPlayer` transitions.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
