import { state } from './state.js';
import { updateHints, hideVisualExplanation, triggerVisualExplanation } from './hints-player.js';

export function copyAnswerToInput(val) {
  const input = document.getElementById('step-input');
  if (input) {
    input.value = val;
    input.focus();
    input.classList.remove('border-red-500', 'focus:border-red-500');
    const errEl = document.getElementById('step-error-message');
    if (errEl) {
      errEl.classList.add('hidden');
      errEl.textContent = '';
    }
  }
}

export function updateDevKeyVisibility() {
  const showKey = document.getElementById('config-show-key').checked;
  const devPanel = document.getElementById('dev-steps-panel');
  const solutionDisplay = document.getElementById('dev-solution-display');
  
  if (showKey) {
    devPanel.classList.remove('hidden');
    solutionDisplay.classList.remove('hidden');
  } else {
    devPanel.classList.add('hidden');
    solutionDisplay.classList.add('hidden');
  }
}

export function generateNew() {
  state.solveSessionId++;
  const steps = parseInt(document.getElementById('config-steps').value, 10);
  const allowNegatives = document.getElementById('config-negatives').checked;
  const allowFractions = document.getElementById('config-fractions').checked;
  const allowParenthesis = document.getElementById('config-parenthesis').checked;

  state.currentEquation = window.EquationGenerator.generate({
    steps,
    allowNegatives,
    allowFractions,
    allowParenthesis
  });

  state.currentStepIdx = 0;
  state.hintStepIdx = 0;

  // Initialize transition duration based on current speed slider value
  const speedSeconds = parseFloat(document.getElementById('anim-speed').value);
  document.documentElement.style.setProperty('--transition-duration', speedSeconds + 's');
  
  // Render initial equation
  const equationLaTeX = `${state.currentEquation.initialLHS} = ${state.currentEquation.initialRHS}`;
  updateCurrentEquationDisplay(equationLaTeX);
  setTimeout(setupOperatorTooltips, 50);

  // Initialize history with the original equation
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  const originalEqLi = document.createElement('li');
  originalEqLi.className = 'flex items-center justify-between py-2 border-b border-gray-100 last:border-0 bg-blue-50/50 px-3 rounded-md mb-2';
  originalEqLi.innerHTML = `
    <span class="math-step font-bold text-indigo-900"></span>
    <span class="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow-sm">Original</span>
  `;
  historyList.appendChild(originalEqLi);
  window.MathRenderer.renderInline(equationLaTeX, originalEqLi.querySelector('.math-step'));

  // Setup Hints objectives
  updateHints();
  hideVisualExplanation();

  // Show dev solution
  document.getElementById('dev-solution-display').textContent = `Solution: x = ${state.currentEquation.solution.toString()}`;
  
  // Render dev steps list
  const devList = document.getElementById('dev-steps-list');
  devList.innerHTML = '';
  state.currentEquation.steps.forEach((s, idx) => {
    const li = document.createElement('div');
    li.className = 'flex items-center space-x-1.5 text-xs font-mono text-gray-600';
    li.innerHTML = `<span>Step ${idx + 1} (${s.type}):</span> <span class="math-step-latex"></span>`;
    devList.appendChild(li);
    window.MathRenderer.renderInline(s.latex, li.querySelector('.math-step-latex'));
  });

  updateDevKeyVisibility();

  // Clear input
  const inputElem = document.getElementById('step-input');
  inputElem.value = '';
  inputElem.classList.remove('border-green-500', 'border-red-500', 'focus:border-green-500', 'focus:border-red-500');
  inputElem.disabled = false;
  inputElem.placeholder = "Type your next step here... (Press Tab for hint)";
}

export function applyViewTransitionNames(container, prefix = '') {
  container.querySelectorAll('[id]').forEach(el => {
    el.style.viewTransitionName = prefix + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  });
}

export function updateCurrentEquationDisplay(latex) {
  const display = document.getElementById('current-equation-display');
  if (!document.startViewTransition) {
    window.MathRenderer.renderBlock(latex, display);
    applyViewTransitionNames(display, 'eq_');
    return;
  }
  display.querySelectorAll('[id]').forEach(el => {
    el.style.viewTransitionName = 'eq_' + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  });
  document.startViewTransition(() => {
    window.MathRenderer.renderBlock(latex, display);
    applyViewTransitionNames(display, 'eq_');
  });
}

export function updateAnimationButtons() {
  const btnPrev = document.getElementById('btn-anim-prev');
  const btnNext = document.getElementById('btn-anim-next');
  
  if (!state.currentEquation) return;
  
  // Next button text
  if (state.animIndex === state.animFrames.length - 1 && state.hintStepIdx < state.currentEquation.steps.length - 1) {
    btnNext.innerHTML = `Step ${state.hintStepIdx + 2} &rarr;`;
  } else {
    btnNext.innerHTML = `Next &rarr;`;
  }
  
  // Back button text
  if (state.animIndex === 0 && state.hintStepIdx > state.currentStepIdx) {
    btnPrev.innerHTML = `&larr; Step ${state.hintStepIdx}`;
  } else {
    btnPrev.innerHTML = `&larr; Back`;
  }
}

export async function autoSolve() {
  const sessionId = state.solveSessionId;
  const inputElem = document.getElementById('step-input');
  inputElem.disabled = true;

  while (state.currentEquation && state.currentStepIdx < state.currentEquation.steps.length) {
    if (sessionId !== state.solveSessionId) break;
    const nextStep = state.currentEquation.steps[state.currentStepIdx];

    // 1. Show the step in the visual explanation box without autoplay
    triggerVisualExplanation(state.currentStepIdx, false);

    // 2. Wait for a short duration to let the user see the animation (e.g. 2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    if (sessionId !== state.solveSessionId) break;

    // 3. Append the completed step to history
    const historyList = document.getElementById('history-list');

    const newStepLi = document.createElement('li');
    newStepLi.className = 'flex items-center justify-between py-2 border-b border-gray-100 last:border-0';
    newStepLi.innerHTML = `
      <span class="math-step font-medium text-gray-800"></span>
      <span class="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">${nextStep.type}</span>
    `;
    historyList.appendChild(newStepLi);
    window.MathRenderer.renderInline(nextStep.latex, newStepLi.querySelector('.math-step'));

    // 4. Advance step index
    state.currentStepIdx++;
    state.hintStepIdx = state.currentStepIdx;

    // 5. Update main display
    if (state.currentStepIdx >= state.currentEquation.steps.length) {
      updateCurrentEquationDisplay(`x = ${state.currentEquation.solution.toLaTeX()}`);
      inputElem.placeholder = "Equation fully solved!";
      inputElem.value = '';
    } else {
      updateCurrentEquationDisplay(nextStep.latex);
      setTimeout(setupOperatorTooltips, 50);
    }

    updateHints();
  }

  if (sessionId === state.solveSessionId) {
    hideVisualExplanation();
  }
}

export function setupOperatorTooltips() {
  const equationDisplay = document.getElementById('current-equation-display');
  const tooltip = document.getElementById('custom-tooltip');
  
  const nextStep = state.currentEquation && state.currentStepIdx < state.currentEquation.steps.length 
    ? state.currentEquation.steps[state.currentStepIdx] 
    : null;
  if (!nextStep) return;

  const binOps = equationDisplay.querySelectorAll('.mbin');
  const relOps = equationDisplay.querySelectorAll('.mrel');
  const fractions = equationDisplay.querySelectorAll('.mfrac');
  const parens = equationDisplay.querySelectorAll('.mopen, .mclose');

  function showTooltip(e, text) {
    tooltip.textContent = text;
    tooltip.classList.remove('opacity-0');
    const rect = e.target.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    tooltip.style.left = `${rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.style.top = `${rect.top + scrollTop - tooltip.offsetHeight - 8}px`;
  }

  function hideTooltip() {
    tooltip.classList.add('opacity-0');
  }

  parens.forEach(el => {
    el.classList.add('cursor-help', 'hover:text-indigo-600', 'transition-colors');
    el.addEventListener('mouseover', (e) => {
      if (nextStep.type === 'distribute') {
        showTooltip(e, "Parentheses: Distribute the multiplication outside into all terms inside.");
      } else {
        showTooltip(e, "Parentheses: Groups elements together.");
      }
    });
    el.addEventListener('mouseout', hideTooltip);
  });

  binOps.forEach(el => {
    el.classList.add('cursor-help', 'hover:text-indigo-600', 'transition-colors');
    el.addEventListener('mouseover', (e) => {
      const op = el.textContent.trim();
      if (nextStep.type === 'move_constants' && op !== 'x') {
        showTooltip(e, `Constant Term Operator: Apply the opposite operation '${op === '+' ? '-' : '+'}' to move this constant.`);
      } else if (nextStep.type === 'move_variables' && el.previousElementSibling && el.previousElementSibling.textContent.includes('x')) {
        showTooltip(e, `Variable Term Operator: Apply the opposite operation '${op === '+' ? '-' : '+'}' to move this variable term.`);
      } else {
        showTooltip(e, `Operator: ${op === '+' ? 'Addition' : 'Subtraction'}`);
      }
    });
    el.addEventListener('mouseout', hideTooltip);
  });

  fractions.forEach(el => {
    el.classList.add('cursor-help', 'hover:text-indigo-600', 'transition-colors');
    el.addEventListener('mouseover', (e) => {
      showTooltip(e, "Fraction: Represents division. Multiply both sides by the denominator to clear it.");
    });
    el.addEventListener('mouseout', hideTooltip);
  });

  relOps.forEach(el => {
    el.classList.add('cursor-help', 'hover:text-indigo-600', 'transition-colors');
    el.addEventListener('mouseover', (e) => {
      showTooltip(e, "Equals: Keep both sides balanced by applying identical operations to LHS and RHS.");
    });
    el.addEventListener('mouseout', hideTooltip);
  });
}

export function submitCurrentStepAsCorrect(keepHintsOpen = false) {
  if (!state.currentEquation || state.currentStepIdx >= state.currentEquation.steps.length) return;
  const nextStep = state.currentEquation.steps[state.currentStepIdx];
  const inputEl = document.getElementById('step-input');
  
  const errEl = document.getElementById('step-error-message');
  errEl.classList.add('hidden');
  errEl.textContent = '';
  
  const historyList = document.getElementById('history-list');
  const newStepLi = document.createElement('li');
  newStepLi.className = 'flex items-center justify-between py-2 border-b border-gray-100 last:border-0';
  newStepLi.innerHTML = `
    <span class="math-step font-medium text-gray-800"></span>
    <span class="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">${nextStep.type}</span>
  `;
  historyList.appendChild(newStepLi);

  window.MathRenderer.renderInline(nextStep.latex, newStepLi.querySelector('.math-step'));

  // Advance state
  state.currentStepIdx++;
  state.hintStepIdx = state.currentStepIdx; // Reset hint tracking to new active step
  
  if (!keepHintsOpen) {
    hideVisualExplanation();
  }
  
  if (state.currentStepIdx >= state.currentEquation.steps.length) {
    inputEl.disabled = true;
    inputEl.placeholder = "Equation fully solved!";
    inputEl.value = '';
    updateCurrentEquationDisplay(`x = ${state.currentEquation.solution.toLaTeX()}`);
  } else {
    updateCurrentEquationDisplay(nextStep.latex);
    inputEl.value = '';
    inputEl.classList.remove('border-green-500', 'focus:border-green-500');
    setTimeout(setupOperatorTooltips, 50);
  }
}

export function initSolverUIEvents() {
  document.getElementById('config-show-key').addEventListener('change', updateDevKeyVisibility);

  document.getElementById('step-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!state.currentEquation) return;

      const userInput = this.value.trim();
      if (userInput === '') return;

      if (userInput.toLowerCase() === 'solve') {
        this.value = '';
        autoSolve();
        return;
      }

      const nextStep = state.currentEquation.steps[state.currentStepIdx];
      const validation = window.EquationGenerator.validateStep(userInput, nextStep);

      if (validation.valid) {
        this.classList.remove('border-red-500', 'focus:border-red-500');
        this.classList.add('border-green-500', 'focus:border-green-500');
        submitCurrentStepAsCorrect(false);
        updateHints();
      } else {
        this.classList.remove('border-green-500', 'focus:border-green-500');
        this.classList.add('border-red-500', 'focus:border-red-500');
        const errEl = document.getElementById('step-error-message');
        errEl.textContent = validation.errorMsg;
        errEl.classList.remove('hidden');
      }
    }

    // Handle Tab Autocomplete / Hints
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!state.currentEquation || state.currentStepIdx >= state.currentEquation.steps.length) return;

      // Animate and show visual explanation for the step at hintStepIdx
      triggerVisualExplanation(state.hintStepIdx);
    }
  });

  document.getElementById('step-input').addEventListener('input', function() {
    this.classList.remove('border-red-500', 'focus:border-red-500');
    const errEl = document.getElementById('step-error-message');
    errEl.classList.add('hidden');
    errEl.textContent = '';
  });

  document.getElementById('btn-generate').addEventListener('click', generateNew);

  // Navbar Mode Toggles
  document.getElementById('btn-mode-solver').addEventListener('click', function() {
    this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    this.classList.add('bg-primary', 'text-white');
    
    const btnGen = document.getElementById('btn-mode-generator');
    btnGen.classList.remove('bg-primary', 'text-white');
    btnGen.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    
    document.getElementById('mode-solver-container').classList.remove('hidden');
    document.getElementById('mode-generator-container').classList.add('hidden');
  });

  document.getElementById('btn-mode-generator').addEventListener('click', function() {
    this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    this.classList.add('bg-primary', 'text-white');
    
    const btnSolv = document.getElementById('btn-mode-solver');
    btnSolv.classList.remove('bg-primary', 'text-white');
    btnSolv.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
    
    document.getElementById('mode-solver-container').classList.add('hidden');
    document.getElementById('mode-generator-container').classList.remove('hidden');
  });
}
