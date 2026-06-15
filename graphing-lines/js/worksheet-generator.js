import { state } from './state.js';
import { generateEquation } from './generator.js';

export function generateWorksheet() {
  const container = document.getElementById('worksheet-grid');
  if (!container) return;
  
  container.innerHTML = ''; // Clear previous
  
  const numProblems = 6; // Standard 2x3 grid fits well on a page
  
  for (let i = 0; i < numProblems; i++) {
    // Generate a new random equation for each problem
    const eq = generateEquation(); // Note: this will also update state.currentEquation, which is fine since we are in worksheet mode
    
    const problemDiv = document.createElement('div');
    problemDiv.className = 'flex flex-col items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm print:shadow-none print:border-gray-400 print:break-inside-avoid';
    
    // Problem Header (Equation)
    const headerDiv = document.createElement('div');
    headerDiv.className = 'w-full flex justify-between items-center mb-4';
    
    const probNum = document.createElement('span');
    probNum.className = 'font-bold text-gray-700';
    probNum.textContent = `${i + 1}.`;
    
    const eqDiv = document.createElement('div');
    eqDiv.className = 'text-xl flex-grow text-center font-medium';
    
    // In "Find Equation" worksheet mode, we don't show the equation (unless it's the answer key)
    if (state.config.worksheetType === 'graph' || state.config.showKey) {
      window.MathRenderer.renderInline(eq.latex, eqDiv);
    } else {
      // Just an empty box or line for them to write on
      eqDiv.innerHTML = '<span class="inline-block w-48 h-8 border-b-2 border-gray-400"></span>';
    }
    
    headerDiv.appendChild(probNum);
    headerDiv.appendChild(eqDiv);
    
    // Blank SVG Graph using DOMParser to avoid innerHTML vulnerability
    const svgHTML = generateStaticGridSVG();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgHTML, 'image/svg+xml');
    const svgNode = doc.documentElement;
    
    const graphDiv = document.createElement('div');
    graphDiv.className = 'w-full aspect-square border border-gray-300';
    graphDiv.appendChild(svgNode);
    
    // Draw the line if we are in "find" mode, OR if "showKey" is enabled for "graph" mode
    const shouldDrawLine = (state.config.worksheetType === 'find') || (state.config.worksheetType === 'graph' && state.config.showKey);
    
    if (shouldDrawLine) {
      let mNum = 0, mDen = 1, b = 0;
      if (eq.type === 'slope-intercept') {
        mNum = eq.m.num;
        mDen = eq.m.den;
        b = eq.b;
      } else {
        mNum = -eq.A;
        mDen = eq.B;
        b = eq.C / eq.B;
      }
      
      const x1 = -10, y1 = (mNum/mDen) * x1 + b;
      const x2 = 10, y2 = (mNum/mDen) * x2 + b;
      
      const sx1 = 300 + (x1 * 30);
      const sy1 = 300 - (y1 * 30);
      const sx2 = 300 + (x2 * 30);
      const sy2 = 300 - (y2 * 30);
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", sx1);
      line.setAttribute("y1", sy1);
      line.setAttribute("x2", sx2);
      line.setAttribute("y2", sy2);
      
      // If it's the answer key for a graph problem, make it red. Otherwise, normal black line.
      const isAnswerKey = state.config.worksheetType === 'graph' && state.config.showKey;
      line.setAttribute("stroke", isAnswerKey ? "red" : "black");
      line.setAttribute("stroke-width", "3");
      
      svgNode.appendChild(line);
    }
    
    problemDiv.appendChild(headerDiv);
    problemDiv.appendChild(graphDiv);
    
    container.appendChild(problemDiv);
  }
}

function generateStaticGridSVG() {
  const GRID_SIZE = 10;
  const SVG_SIZE = 600;
  const STEP = 30;
  const ORIGIN = 300;
  
  let lines = '';
  // Grid Lines
  for (let i = -GRID_SIZE; i <= GRID_SIZE; i++) {
    const isAxis = i === 0;
    const pos = ORIGIN + (i * STEP);
    
    lines += `<line x1="${pos}" y1="0" x2="${pos}" y2="${SVG_SIZE}" stroke="${isAxis ? '#000' : '#e5e7eb'}" stroke-width="${isAxis ? '2' : '1'}" />`;
    lines += `<line x1="0" y1="${pos}" x2="${SVG_SIZE}" y2="${pos}" stroke="${isAxis ? '#000' : '#e5e7eb'}" stroke-width="${isAxis ? '2' : '1'}" />`;
  }
  
  return `<svg viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`;
}
