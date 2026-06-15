import { state } from './state.js';
import { clearGraph, plotPoint, toAlgebraic, drawInfiniteLine } from './graph-renderer.js';

export function initSolverUI() {
  const svgGraph = document.getElementById('graph-container').querySelector('svg');
  if (svgGraph) {
    svgGraph.addEventListener('click', handleGraphClick);
  }

  // Bind equation input for "determine" mode
  const eqInput = document.getElementById('equation-input');
  if (eqInput) {
    eqInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkDeterminedEquation(e.target.value);
      }
    });
  }

  state.subscribe(updateUI);
}

function handleGraphClick(e) {
  if (state.currentMode === 'worksheet') return;

  const eq = state.currentEquation;
  if (!eq) return;

  // Calculate algebraic coordinates of the click
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  
  // Need to scale click coordinates to SVG internal coordinate system (SVG_SIZE = 600)
  const scaleX = 600 / rect.width;
  const scaleY = 600 / rect.height;
  
  const svgX = clickX * scaleX;
  const svgY = clickY * scaleY;

  const { x, y } = toAlgebraic(svgX, svgY);

  if (state.currentMode === 'interactive') {
    if (state.interactive.step === 0) {
      // Looking for Y-Intercept
      let b = 0;
      if (eq.type === 'slope-intercept') b = eq.b;
      else if (eq.type === 'standard') b = eq.C / eq.B;

      if (x === 0 && y === b) {
        // Correct!
        plotPoint(x, y, 'point-y-int', '#10b981'); // Green
        state.interactive.yInterceptPlotted = true;
        state.interactive.points.push({x, y});
        state.interactive.step = 1;
        
        addHistoryItem(`Plotted y-intercept at (0, ${b})`);
        state.notify();
      } else {
        // Incorrect, maybe flash red
        const pt = plotPoint(x, y, 'err', '#ef4444');
        setTimeout(() => pt.remove(), 500);
      }
    } else if (state.interactive.step === 1) {
    // Looking for a second valid point on the line
    let m = 0;
    let b = 0;
    if (eq.type === 'slope-intercept') {
      m = eq.m.num / eq.m.den;
      b = eq.b;
    } else if (eq.type === 'standard') {
      m = -eq.A / eq.B;
      b = eq.C / eq.B;
    }

    // Check if the point lies on the line: y = mx + b -> y - mx - b = 0
    const expectedY = m * x + b;
    
    // Also must not be the y-intercept again
    if (Math.abs(y - expectedY) < 0.001 && x !== 0) {
      // Correct!
      plotPoint(x, y, 'point-2', '#10b981');
      state.interactive.secondPointPlotted = true;
      state.interactive.points.push({x, y});
      state.interactive.step = 2;
      
      addHistoryItem(`Plotted second point at (${x}, ${y})`);
      
      // Draw the final line
      if (eq.type === 'slope-intercept') {
        drawInfiniteLine(eq.m.num, eq.m.den, eq.b, '#10b981');
      } else {
        drawInfiniteLine(-eq.A, eq.B, eq.C / eq.B, '#10b981');
      }
      
      state.notify();
    } else {
      const pt = plotPoint(x, y, 'err', '#ef4444');
      setTimeout(() => pt.remove(), 500);
    }
  }
  } else if (state.currentMode === 'determine') {
    let m = 0, b = 0;
    if (eq.type === 'slope-intercept') {
      m = eq.m.num / eq.m.den;
      b = eq.b;
    } else if (eq.type === 'standard') {
      m = -eq.A / eq.B;
      b = eq.C / eq.B;
    }

    if (state.determine.step === 0) {
      // Find y-intercept
      console.error(`DETERMINE CLICK: x=${x}, y=${y}, b=${b}, step=${state.determine.step}`);
      if (x === 0 && y === b) {
        plotPoint(x, y, 'det-y-int', '#10b981');
        state.determine.yInterceptIdentified = true;
        state.determine.points.push({x, y});
        state.determine.step = 1;
        addHistoryItem(`Identified y-intercept at (0, ${b})`);
        state.notify();
      } else {
        const pt = plotPoint(x, y, 'err', '#ef4444');
        setTimeout(() => pt.remove(), 500);
      }
    } else if (state.determine.step === 1) {
      // Find second point
      const expectedY = m * x + b;
      if (Math.abs(y - expectedY) < 0.001 && x !== 0) {
        plotPoint(x, y, 'det-pt-2', '#10b981');
        state.determine.secondPointIdentified = true;
        state.determine.points.push({x, y});
        state.determine.step = 2;
        addHistoryItem(`Identified second point at (${x}, ${y})`);
        state.notify();
      } else {
        const pt = plotPoint(x, y, 'err', '#ef4444');
        setTimeout(() => pt.remove(), 500);
      }
    }
  }
}

function checkDeterminedEquation(inputValue) {
  const eq = state.currentEquation;
  if (!eq) return;

  // Remove all whitespace
  const cleanInput = inputValue.replace(/\s+/g, '').toLowerCase();
  
  // Let's do a very basic check. Ideally we'd parse this.
  // For now, we'll just check if it matches the expected slope-intercept form strictly
  let expected = '';
  if (eq.type === 'slope-intercept') {
    let mStr = '';
    if (eq.m.den === 1) {
      if (eq.m.num === 1) mStr = 'x';
      else if (eq.m.num === -1) mStr = '-x';
      else mStr = `${eq.m.num}x`;
    } else {
      mStr = `${eq.m.num}/${eq.m.den}x`;
    }
    
    let bStr = '';
    if (eq.b > 0) bStr = `+${eq.b}`;
    else if (eq.b < 0) bStr = `${eq.b}`; // negative sign included
    
    expected = `y=${mStr}${bStr}`;
  } else {
    // Basic standard form
    let aStr = '';
    if (eq.A === 1) aStr = 'x';
    else if (eq.A === -1) aStr = '-x';
    else if (eq.A !== 0) aStr = `${eq.A}x`;
    
    let bStr = '';
    if (eq.B === 1) bStr = eq.A === 0 ? 'y' : '+y';
    else if (eq.B === -1) bStr = '-y';
    else if (eq.B > 0) bStr = eq.A === 0 ? `${eq.B}y` : `+${eq.B}y`;
    else if (eq.B < 0) bStr = `${eq.B}y`;
    
    expected = `${aStr}${bStr}=${eq.C}`;
  }

  if (cleanInput === expected) {
    document.getElementById('equation-input').classList.add('border-green-500', 'bg-green-50');
    addHistoryItem(`Correct! Equation is ${expected}`);
  } else {
    // Simple visual shake or red border
    const el = document.getElementById('equation-input');
    el.classList.add('border-red-500', 'bg-red-50');
    setTimeout(() => {
      el.classList.remove('border-red-500', 'bg-red-50');
    }, 1000);
  }
}

function addHistoryItem(text) {
  const historyList = document.getElementById('history-list');
  const li = document.createElement('li');
  li.className = 'text-sm text-gray-700 py-2 border-b border-gray-100 flex items-center';
  li.innerHTML = `
    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    ${text}
  `;
  historyList.appendChild(li);
}

export function updateUI() {
  const objText = document.getElementById('objective-text');
  const eqInputContainer = document.getElementById('equation-input-container');
  
  if (state.currentMode === 'interactive') {
    if (eqInputContainer) eqInputContainer.classList.add('hidden');
    if (state.interactive.step === 0) {
      objText.textContent = "Identify the y-intercept. Click the correct point on the graph.";
    } else if (state.interactive.step === 1) {
      objText.textContent = "Identify the slope (Rise over Run). Click a second point on the line.";
    } else {
      objText.textContent = "Great job! The line is plotted.";
    }
  } else if (state.currentMode === 'determine') {
    if (state.determine.step === 0) {
      if (eqInputContainer) eqInputContainer.classList.add('hidden');
      objText.textContent = "Analyze the line. Click the y-intercept on the graph.";
    } else if (state.determine.step === 1) {
      if (eqInputContainer) eqInputContainer.classList.add('hidden');
      objText.textContent = "Identify the slope. Click any other valid integer coordinate on the line.";
    } else {
      if (eqInputContainer) eqInputContainer.classList.remove('hidden');
      objText.textContent = "Great. Now type the corresponding equation below.";
    }
  }
}
