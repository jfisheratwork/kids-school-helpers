# 02 - Interactive Graphing Mode

## Overview
A guided, interactive state machine that provides an equation to the student and asks them to correctly graph it on an interactive coordinate plane.

## State Machine (Slope-Intercept Form)
1. **Identify and Plot Y-Intercept:**
   - Equation displays $y = 2x + 4$.
   - User must click the correct point $(0, 4)$ on the graph.
2. **Identify Slope (Rise over Run):**
   - User must identify the slope is $2$ (Rise $2$, Run $1$).
   - User must click the correct second point $(1, 6)$.
3. **Draw Line:**
   - A line is drawn through the two verified points.

## Progressive Hint System
If a student hits the `Tab` key, the hint player opens:
* **Y-Intercept Hint:** Animates the $b$ value from the equation, dropping it onto the Y-axis of the grid.
* **Slope Hint:** Animates a step-wise "staircase" from the y-intercept, counting out the "rise" (up/down) and the "run" (right) to find the next valid coordinate.
