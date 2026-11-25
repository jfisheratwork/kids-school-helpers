# 01 - Geometry Foundations: Grades 5, 6, and 7 Curriculum Expansion Specification (`geometry/`)

- **Status:** Planned Expansion — Specification Ready
- **Target Grades:** Grades 5–7 (`5.MD.C.5`, `5.G.B.3–4`, `6.G.A.1–4`, `7.G.A.1–3`, `7.G.B.4–6`)
- **Curriculum Roadmap:** [09-grades-5-7-curriculum-roadmap.md](../../spec/09-grades-5-7-curriculum-roadmap.md)

## 1. Overview & Pedagogical Goals

The existing [`geometry/`](../index.html) module currently provides interactive solvers and worksheets for foundational **Area & Perimeter** (rectangles, triangles, circles), **Volume & Surface Area** (basic rectangular prisms/cylinders), **Missing Angles** (basic complementary/supplementary/triangle sum), and the **Pythagorean Theorem** (8th-grade bridge).

To achieve complete **Grades 5, 6, and 7 Geometry & Geometric Measurement** coverage (`5.MD.C`, `5.G.B`, `6.G.A`, `7.G.A`, `7.G.B`) while adhering to [01-architecture-and-standards.md](../../spec/01-architecture-and-standards.md), [02-unified-solver-animations.md](../../spec/02-unified-solver-animations.md), and [03-dual-input-and-step-progression.md](../../spec/03-dual-input-and-step-progression.md), this specification defines six new topic tracks and upgrades `/geometry/` to full **Dual-Input + Upfront Progression** parity.

---

## 2. Target Standards & Missing Geometry Exercises

| Sub-Topic ID | Grade | Standards | New Interactive Exercises & Visuals |
| :--- | :---: | :--- | :--- |
| `polygons_hierarchy` | 5 | `5.G.B.3`, `5.G.B.4` | Classify triangles (acute/right/obtuse × scalene/isosceles/equilateral) and quadrilaterals (trapezoid, parallelogram, rectangle, rhombus, square) using tick/angle/parallel-arrow SVG markings and inclusive Venn/tree properties. |
| `composite_area` | 6–7 | `6.G.A.1`, `7.G.B.6` | Area of **parallelograms** ($A = bh$), **trapezoids** ($A = \frac{1}{2}(b_1 + b_2)h$), **kites/rhombi**, and **L-shaped / shaded-cutout composite figures** with interactive dashed decomposition lines. |
| `composite_volume_nets` | 5–7 | `5.MD.C.5.C`, `6.G.A.2`, `6.G.A.4`, `7.G.B.6` | Additive volume of **L-shaped composite rectangular prisms** ($V = V_1 + V_2$), prisms with **fractional edge lengths** ($l, w, h \in \mathbb{Q}^+$), and **unfolded 2D SVG Nets** for Surface Area of rectangular prisms, triangular prisms, and square/triangular pyramids. |
| `scale_drawings` | 7 | `7.G.A.1` | Find actual dimensions, scale drawing lengths, **scale factors**, and **scaled area ratios** ($A_{\text{actual}} = k^2 \cdot A_{\text{scale}}$) across side-by-side blueprint SVGs. |
| `triangles_and_slices` | 7 | `7.G.A.2`, `7.G.A.3` | **Triangle Inequality & Angle-Condition Checker** ($a + b > c$; unique triangle, many triangles, or impossible triangle) and **2D Plane Cross-Sections of 3D Solids** (parallel, perpendicular, and angled slices through rectangular prisms, cylinders, cones, and pyramids). |
| `algebraic_angles_circles` | 7 | `7.G.B.4`, `7.G.B.5` | **Multi-step algebraic angle pairs** (e.g., vertical angles $3x + 15 = 5x - 25$ or supplementary $(2x + 10) + (3x - 30) = 180$, solving for $x$ *and* the target angle measure) plus **Circle Exact ($\text{in terms of }\pi$) vs. Rounded ($\pi \approx 3.14$ or $\frac{22}{7}$) Area & Circumference**, including semicircles and quarter-circles. |

---

## 3. Pedagogical Step-by-Step State Machines

### 3.1 Composite Area & Shaded Cutouts (`composite_area`)
1. **Step 1 (`split_or_subtract_setup`)**: Identify the two component sub-regions $R_1$ and $R_2$ (additive $A_1 + A_2$ for L-shapes; subtractive $A_{\text{outer}} - A_{\text{cutout}}$ for frames/shaded borders) and find any unlabelled missing side length via parallel side subtraction.
2. **Step 2 (`compute_area_1`)**: Evaluate formula for Region 1 (e.g., $A_1 = b_1 \cdot h_1$ or trapezoid $\frac{1}{2}(b_1 + b_2)h$).
3. **Step 3 (`compute_area_2`)**: Evaluate formula for Region 2.
4. **Step 4 (`combine_areas`)**: Add or subtract $A_1 \pm A_2$ to produce the total area in square units.

### 3.2 3D Unfolded Nets for Surface Area (`composite_volume_nets`)
1. **Step 1 (`identify_face_pairs`)**: Map the 3D prism/pyramid onto an interactive color-coded 2D unfolded net (e.g., Front/Back, Top/Bottom, Left/Right for rectangular prisms; 2 triangular bases + 3 lateral rectangles for triangular prisms).
2. **Step 2 (`area_group_a`)**: Calculate the area of the bases (e.g., $2 \times \frac{1}{2}bh$ for triangular prism bases).
3. **Step 3 (`area_group_b`)**: Calculate the lateral face areas.
4. **Step 4 (`sum_surface_area`)**: Sum all face areas to find total $SA$.

### 3.3 Scale Drawings (`scale_drawings`)
1. **Step 1 (`unit_scale_ratio`)**: Express the given legend (e.g., $2\text{ cm} : 5\text{ m}$) as a unit scale factor ($1\text{ cm} = 2.5\text{ m}$).
2. **Step 2 (`proportion_setup`)**: Set up the scale proportion $\frac{\text{drawing}}{\text{actual}}$ for the target side(s).
3. **Step 3 (`compute_target`)**: Compute actual length, perimeter, or scaled area (highlighting that area scales by $k^2$, not $k$).

### 3.4 Algebraic Angle Pairs (`algebraic_angles_circles`)
1. **Step 1 (`identify_relationship`)**: Classify the angle pair from the intersecting-line SVG (`Complementary = 90°`, `Supplementary / Linear Pair = 180°`, `Vertical = Equal`) and write the algebraic equation.
2. **Step 2 (`solve_for_x`)**: Combine like terms and isolate $x$.
3. **Step 3 (`substitute_back`)**: Substitute $x$ back into the requested angle expression (e.g., $m\angle ABD = 2x + 10$) so students don't stop prematurely at $x$ when the question asks for degrees!

---

## 4. 3-Frame `\htmlId` View Transitions, Dual Inputs & Worksheets

- **Dual-Input Parity Upgrade**: Upgrade `geometry/index.html` and `geometry/js/solver-ui.js` from single-input `#geometry-step-input` to the repository-wide **1. Partial / Step Result** + **2. Final Answer** dual-input contract with upfront step progression ([spec/03](../../spec/03-dual-input-and-step-progression.md)).
- **3-Frame `\htmlId` Animations**:
  - Frame 1: Formula with named symbolic variables (`\htmlId{b1}{b_1}`, `\htmlId{h}{h}`).
  - Frame 2: Numeric substitution from the SVG diagram into matching `\htmlId` tokens.
  - Frame 3: Simplified value morphing into the step result.
- **Printable Worksheets**: Crisp black-and-white vector SVG shapes, 2D nets, scale blueprints, and angle diagrams with worked multi-step Answer Keys.

---

## 5. Vertical-Slice Implementation Checkpoints

1. **Slice 1 — Pure Generators & Step Models**: Modularize `geometry/js/` into focused topic generators (`generator-polygons.js`, `generator-composite.js`, `generator-nets.js`, `generator-scale.js`, `generator-angles-algebra.js`) with zero-dimension and valid-triangle (`a + b > c`) invariants.
2. **Slice 2 — Unit Tests**: Add deterministic coverage in `test/unit-tests.js` verifying positive dimensions, triangle inequality validity, rational/integer step answers, and exact vs. rounded $\pi$ solutions.
3. **Slice 3 — SVG Renderers, Guide Drawer & Dual-Input Solver UI**: Extend `renderer-shapes.js`, add synced topic pills to the `<details>` guide, and wire 3-frame `SharedAnimationPlayer` transitions.
4. **Slice 4 — Worksheets & Zero-Console-Error Audit**: Update `geometry/js/worksheet-generator.js` and verify via `chrome-devtools-mcp`.
