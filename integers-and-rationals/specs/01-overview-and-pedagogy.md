# 01 - Integers, Signed Rationals & 4-Quadrant Coordinate Plane Specification (`integers-and-rationals/`)

- **Status:** Planned — Specification Ready
- **Target Grades:** Grades 5–7 (`5.G.A.1–2`, `6.NS.C.5–8`, `7.NS.A.1–3`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview, Standards Alignment & Planned Solver Modes
While [`pre-algebra-solver/`](../../pre-algebra-solver/index.html) includes negative coefficients, **Grades 6 and 7 (`6.NS.C.5–8`, `7.NS.A.1–3`)** require a dedicated conceptual foundation in negative numbers, absolute value, subtracting negatives via the additive inverse, signed rational arithmetic, and the 4-quadrant coordinate plane (with a **Grade 5 Quadrant I** entry mode for `5.G.A.1–2`).

### Planned Exercises & Solver Modes
1. **Opposites, Absolute Value & Ordering Signed Rationals (`6.NS.C.5–7`)**: Number-line placement, opposites, $|x|$ and $-|x|$ evaluation, and comparing/ordering signed integers, fractions, and decimals.
2. **Integer Arithmetic (`+`, `-`, `×`, `÷` — `7.NS.A.1–2`)**: Visual SVG number-line jump arcs, positive/negative zero-pair counters, additive inverse rewriting ($a - (-b) = a + b$), and multiplication/division sign rules.
3. **Signed Rational & Complex Fraction Operations (`7.NS.A.1–3`)**: Add, subtract, multiply, and divide signed fractions/mixed numbers, signed decimals, and complex fractions ($\frac{-3/4}{5/6}$).
4. **Coordinate Plane Explorer (Quadrant I $\rightarrow$ All 4 Quadrants — `5.G.A.1–2`, `6.NS.C.6, 6.NS.C.8`)**: Plot & read $(x, y)$, identify Quadrants I–IV and axes, reflect points across the $x$- and $y$-axes, and compute horizontal/vertical segment distances & polygon perimeters via absolute value.

All UI components, animations, and worksheets follow [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md).

---

## 2. Topics & Complexity Levels

| Topic ID | Grade | Exercises & Progression |
| :--- | :---: | :--- |
| `abs_and_order` | 6 | Opposites ($-(-7) = 7$), absolute value expressions ($|-12| + |-5|$, $-|-9|$), inequality statements ($-4.5 < -4.2$, $-\frac{3}{4} > -\frac{5}{6}$), and sorting 4 signed rationals on a number line. |
| `integer_add_sub` | 7 | Adding integers with same/different signs (zero-pair cancellation & number-line jumps); subtracting integers by rewriting $a - b = a + (-b)$ and $a - (-b) = a + b$; 3–4 term integer chains ($-8 - (-12) + (-5)$). |
| `integer_mult_div` | 7 | Multiplying & dividing 2–3 signed integers, integer powers $(-3)^2 = 9$ vs $-3^2 = -9$, and sign-count parity for multi-factor products. |
| `signed_rationals` | 7 | Adding/subtracting/multiplying/dividing signed fractions ($-\frac{2}{3} - \left(-\frac{5}{6}\right)$), signed decimals ($-3.4 \times (-1.5)$), and complex fractions ($\frac{-2/5}{3/10}$). |
| `coordinate_plane` | 5–6 | **Level 1 (Grade 5 `5.G.A.1`)**: Quadrant I plotting & grid travel. **Level 2 (Grade 6 `6.NS.C.6`)**: 4-quadrant plotting, naming Quadrant I/II/III/IV or $x$/$y$-axis, axis reflections $(x, y) \rightarrow (x, -y)$ or $(-x, y)$. **Level 3 (`6.NS.C.8`)**: Distance between $(-4, 3)$ and $(5, 3)$ using $|-4| + |5| = 9$ (same vs. opposite quadrant absolute-value rule) & rectangle perimeter/area on the grid. |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Integer & Rational Subtraction (`integer_add_sub`, `signed_rationals`)
1. **Step 1 (`rewrite_additive_inverse`)**: Rewrite subtraction as adding the opposite ("Add the Opposite"): e.g., $-5 - (-8) \rightarrow -5 + 8$, or $-\frac{3}{4} - \frac{1}{2} \rightarrow -\frac{3}{4} + \left(-\frac{1}{2}\right)$.
2. **Step 2 (`determine_sign_and_magnitude`)**:
   - *Same signs*: Add absolute values and keep common sign ($|-3| + |-7| = 10 \rightarrow -10$).
   - *Different signs*: Subtract smaller absolute value from larger ($|8| - |-5| = 3$) and take the sign of the larger magnitude ($+3$).
3. **Step 3 (`final_value`)**: Confirm simplified integer, fraction (via `Fraction` class in `shared/js/fraction.js`), or exact decimal.

### 3.2 4-Quadrant Coordinate Distance (`coordinate_plane` Level 3)
1. **Step 1 (`identify_varying_coord`)**: Identify which coordinate matches (e.g., $y = 3$ is constant $\rightarrow$ horizontal segment) and extract the changing coordinates ($x_1 = -4, x_2 = 5$).
2. **Step 2 (`abs_distance_to_axis`)**: Compute distance of each point to the axis ($|-4| = 4$, $|5| = 5$).
3. **Step 3 (`add_or_subtract_distances`)**: Opposite quadrants/sides of axis $\rightarrow$ add $4 + 5 = 9$; same quadrant $\rightarrow$ subtract $|x_2| - |x_1|$.

---

## 4. Visual SVG Components, 3-Frame Animations & Worksheets
- **Interactive SVG Number Line**: Displays `0` origin, negative/positive ticks, start marker, and directional jump arcs synchronized with steps.
- **Interactive SVG Coordinate Grid**: Click-to-plot points, Quadrant I–IV watermarks, dashed reflection lines, and ruler braces for axis distances.
- **3-Frame `\htmlId` Animations**: Morphs `- (-8)` into `\textcolor{#4f46e5}{+ 8}` before combining tokens; clearly contrasts `(-3)^2 = (-3)(-3) = +9` vs `-3^2 = -(3 \cdot 3) = -9`.
- **Printable Worksheets**: Number-line jump worksheets, signed arithmetic drills, and 4-quadrant coordinate grids with plotted Answer Keys.

---

## 5. Vertical-Slice Checkpoints
1. **Slice 1**: Reusable `number-line-svg.js` candidate + generators for all 5 topics using `Fraction` (`shared/js/fraction.js`) with zero-denominator safety.
2. **Slice 2**: Unit tests in `test/unit-tests.js` covering `-|-a|`, `(-a)^2` vs `-a^2`, additive-inverse rewrites, and cross-axis vs same-quadrant distances.
3. **Slice 3**: Interactive SVG Number Line & 4-Quadrant Grid UI, `<details>` guide, Dual Inputs, and 3-frame animations.
4. **Slice 4**: Printable worksheets + `chrome-devtools-mcp` zero-console-error verification.
