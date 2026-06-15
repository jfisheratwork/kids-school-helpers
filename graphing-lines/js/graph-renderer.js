import { state } from './state.js';

let svgElement = null;
const svgNS = "http://www.w3.org/2000/svg";

// Config
const GRID_SIZE = 10; // -10 to 10
const SVG_SIZE = 600; // 600x600 px internal resolution
const STEP = SVG_SIZE / (GRID_SIZE * 2); // 30px per unit
const ORIGIN = SVG_SIZE / 2;

/**
 * Converts algebraic (x, y) to screen SVG coordinates
 */
export function toScreen(x, y) {
  return {
    x: ORIGIN + (x * STEP),
    y: ORIGIN - (y * STEP) // SVG y-axis is inverted
  };
}

/**
 * Converts screen SVG coordinates to nearest algebraic (x, y) integer
 */
export function toAlgebraic(sx, sy) {
  const x = Math.round((sx - ORIGIN) / STEP);
  const y = Math.round((ORIGIN - sy) / STEP);
  return { x, y };
}

/**
 * Initializes the blank SVG canvas
 */
export function initGraph(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // clear

  svgElement = document.createElementNS(svgNS, "svg");
  svgElement.setAttribute("viewBox", `0 0 ${SVG_SIZE} ${SVG_SIZE}`);
  svgElement.setAttribute("class", "w-full h-full object-contain");
  // svgElement.style.touchAction = 'none'; // Prevent scrolling while tapping on mobile

  // Draw Grid Lines
  for (let i = -GRID_SIZE; i <= GRID_SIZE; i++) {
    const isAxis = i === 0;
    const pos = ORIGIN + (i * STEP);

    // Vertical line
    const vLine = document.createElementNS(svgNS, "line");
    vLine.setAttribute("x1", pos);
    vLine.setAttribute("y1", 0);
    vLine.setAttribute("x2", pos);
    vLine.setAttribute("y2", SVG_SIZE);
    vLine.setAttribute("stroke", isAxis ? "#000" : "#e5e7eb");
    vLine.setAttribute("stroke-width", isAxis ? "2" : "1");
    svgElement.appendChild(vLine);

    // Horizontal line
    const hLine = document.createElementNS(svgNS, "line");
    hLine.setAttribute("x1", 0);
    hLine.setAttribute("y1", pos);
    hLine.setAttribute("x2", SVG_SIZE);
    hLine.setAttribute("y2", pos);
    hLine.setAttribute("stroke", isAxis ? "#000" : "#e5e7eb");
    hLine.setAttribute("stroke-width", isAxis ? "2" : "1");
    svgElement.appendChild(hLine);
  }

  // Draw Tick Marks & Labels
  for (let i = -GRID_SIZE; i <= GRID_SIZE; i++) {
    if (i === 0) continue;
    
    // X-axis ticks
    const xPos = ORIGIN + (i * STEP);
    const xTick = document.createElementNS(svgNS, "line");
    xTick.setAttribute("x1", xPos);
    xTick.setAttribute("y1", ORIGIN - 4);
    xTick.setAttribute("x2", xPos);
    xTick.setAttribute("y2", ORIGIN + 4);
    xTick.setAttribute("stroke", "#000");
    xTick.setAttribute("stroke-width", "2");
    svgElement.appendChild(xTick);

    if (i % 2 === 0) { // Label every 2 units
      const xLabel = document.createElementNS(svgNS, "text");
      xLabel.setAttribute("x", xPos);
      xLabel.setAttribute("y", ORIGIN + 16);
      xLabel.setAttribute("text-anchor", "middle");
      xLabel.setAttribute("font-size", "10");
      xLabel.setAttribute("class", "text-gray-500 font-sans select-none");
      xLabel.textContent = i;
      svgElement.appendChild(xLabel);
    }

    // Y-axis ticks
    const yPos = ORIGIN - (i * STEP);
    const yTick = document.createElementNS(svgNS, "line");
    yTick.setAttribute("x1", ORIGIN - 4);
    yTick.setAttribute("y1", yPos);
    yTick.setAttribute("x2", ORIGIN + 4);
    yTick.setAttribute("y2", yPos);
    yTick.setAttribute("stroke", "#000");
    yTick.setAttribute("stroke-width", "2");
    svgElement.appendChild(yTick);

    if (i % 2 === 0) { // Label every 2 units
      const yLabel = document.createElementNS(svgNS, "text");
      yLabel.setAttribute("x", ORIGIN - 8);
      yLabel.setAttribute("y", yPos + 3);
      yLabel.setAttribute("text-anchor", "end");
      yLabel.setAttribute("font-size", "10");
      yLabel.setAttribute("class", "text-gray-500 font-sans select-none");
      yLabel.textContent = i;
      svgElement.appendChild(yLabel);
    }
  }

  // Container for dynamic elements (points, lines, hints)
  const dynamicGroup = document.createElementNS(svgNS, "g");
  dynamicGroup.setAttribute("id", "dynamic-graph-elements");
  svgElement.appendChild(dynamicGroup);

  container.appendChild(svgElement);
  
  return svgElement;
}

/**
 * Clears all dynamic points and lines
 */
export function clearGraph() {
  const dynamicGroup = document.getElementById('dynamic-graph-elements');
  if (dynamicGroup) {
    dynamicGroup.innerHTML = '';
  }
}

/**
 * Plots a single point on the graph
 */
export function plotPoint(x, y, id = null, color = "#4f46e5") {
  const dynamicGroup = document.getElementById('dynamic-graph-elements');
  if (!dynamicGroup) return;

  const { x: sx, y: sy } = toScreen(x, y);
  
  const circle = document.createElementNS(svgNS, "circle");
  if (id) circle.setAttribute("id", id);
  circle.setAttribute("cx", sx);
  circle.setAttribute("cy", sy);
  circle.setAttribute("r", "5");
  circle.setAttribute("fill", color);
  circle.setAttribute("class", "transition-all duration-300");
  
  dynamicGroup.appendChild(circle);
  return circle;
}

/**
 * Draws a line segment between two points
 */
export function drawLineSegment(x1, y1, x2, y2, color = "#4f46e5", isDashed = false) {
  const dynamicGroup = document.getElementById('dynamic-graph-elements');
  if (!dynamicGroup) return;

  const s1 = toScreen(x1, y1);
  const s2 = toScreen(x2, y2);

  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", s1.x);
  line.setAttribute("y1", s1.y);
  line.setAttribute("x2", s2.x);
  line.setAttribute("y2", s2.y);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "3");
  if (isDashed) {
    line.setAttribute("stroke-dasharray", "5,5");
  }
  
  dynamicGroup.appendChild(line);
  return line;
}

/**
 * Draws an infinite line across the entire grid given an equation
 * Uses y = mx + b
 */
export function drawInfiniteLine(mNum, mDen, b, color = "#4f46e5") {
  const dynamicGroup = document.getElementById('dynamic-graph-elements');
  if (!dynamicGroup) return;

  // Calculate endpoints at the edges of the grid (x = -15, x = 15 to ensure it covers)
  const x1 = -15;
  const y1 = (mNum / mDen) * x1 + b;
  
  const x2 = 15;
  const y2 = (mNum / mDen) * x2 + b;

  const s1 = toScreen(x1, y1);
  const s2 = toScreen(x2, y2);

  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", s1.x);
  line.setAttribute("y1", s1.y);
  line.setAttribute("x2", s2.x);
  line.setAttribute("y2", s2.y);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "3");
  
  dynamicGroup.appendChild(line);
  return line;
}
