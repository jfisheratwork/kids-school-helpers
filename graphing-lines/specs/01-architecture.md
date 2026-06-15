# 01 - Architecture and Core Engine

## System Architecture
* **Directory:** `/graphing-lines/`
* **Paradigm:** Single Page Application (SPA), fully client-side. No backend server.
* **Styling:** Tailwind CSS for structural layout, matching the `/pre-algebra-solver/` aesthetic (minimalist, high contrast, sans-serif typography).

## Rendering Engine Decision
* **Technology:** HTML5 SVG manipulated via Vanilla JS DOM APIs.
* **Rationale:** SVG perfectly scales for high-DPI printable worksheets and works seamlessly with CSS View Transitions for animating points, slope triangles ("rise over run"), and line drawing.

## State Management
* The application will maintain a single unified `state` tracking:
  * Current mode (Interactive Graphing, Equation Determination, or Worksheet Generator).
  * Current equation data (Slope, Y-Intercept).
  * Current visual state (points plotted, hints visible).

## Equation Generation Engine
* **Forms:** Must support generating equations in both **Slope-Intercept Form ($y = mx + b$)** and **Standard Form ($Ax + By = C$)**.
* **Progression Bias:** Middle school curriculum introduces Slope-Intercept first. The generator must heavily bias towards Slope-Intercept form for beginners before introducing Standard Form.
* **Constraints:** Must ensure lines fit reasonably within a standard $-10$ to $10$ coordinate grid without extending too far off-screen.
