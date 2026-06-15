import { state } from './state.js';
import { toScreen, plotPoint, drawLineSegment } from './graph-renderer.js';

export function initHintsPlayer() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      triggerHint();
    }
  });
  const btn = document.getElementById('btn-show-hint');
  if (btn) {
    btn.addEventListener('click', triggerHint);
  }
}

export function triggerHint() {
  const eq = state.currentEquation;
  if (!eq) return;
  if (state.currentMode !== 'interactive' && state.currentMode !== 'determine') return;

  const currentStep = state.currentMode === 'interactive' ? state.interactive.step : state.determine.step;

  if (currentStep === 0) {
    // Hint for y-intercept
    let b = 0;
    if (eq.type === 'slope-intercept') b = eq.b;
    else b = eq.C / eq.B;

    // We can do a small animation of a point dropping down
    const pt = plotPoint(0, b, 'hint-y-int', '#f59e0b'); // Yellow
    
    // Add pulsing CSS
    pt.classList.add('animate-ping');
    setTimeout(() => pt.remove(), 2000);
    
  } else if (currentStep === 1) {
    // Hint for slope
    let mNum = 0, mDen = 0, b = 0;
    if (eq.type === 'slope-intercept') {
      mNum = eq.m.num;
      mDen = eq.m.den;
      b = eq.b;
    } else {
      mNum = -eq.A;
      mDen = eq.B;
      b = eq.C / eq.B;
    }

    // Draw rise/run from y-int
    const yInt = { x: 0, y: b };
    const nextPt = { x: mDen, y: b + mNum };
    
    // Rise line (vertical)
    const riseLine = drawLineSegment(yInt.x, yInt.y, yInt.x, nextPt.y, '#f59e0b', true);
    
    // Run line (horizontal)
    const runLine = drawLineSegment(yInt.x, nextPt.y, nextPt.x, nextPt.y, '#f59e0b', true);
    
    setTimeout(() => {
      riseLine.remove();
      runLine.remove();
    }, 3000);
  } else if (currentStep === 2 && state.currentMode === 'determine') {
    // Hint for writing the equation
    const hintDiv = document.createElement('div');
    hintDiv.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-100 border border-amber-400 text-amber-800 p-4 rounded shadow-lg z-50 text-center font-medium animate-pulse';
    
    let hintStr = '';
    if (eq.type === 'slope-intercept') {
      hintStr = `Remember: y = mx + b. Your slope (m) is ${eq.m.num}/${eq.m.den} and your y-intercept (b) is ${eq.b}.`;
    } else {
      hintStr = `Remember: Ax + By = C.`;
    }
    hintDiv.textContent = hintStr;
    document.getElementById('graph-container').appendChild(hintDiv);
    
    setTimeout(() => {
      hintDiv.remove();
    }, 4000);
  }
}
