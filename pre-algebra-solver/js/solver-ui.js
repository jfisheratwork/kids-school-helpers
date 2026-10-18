import { state } from './state.js';
import { updateHints, hideVisualExplanation, triggerVisualExplanation, fillCurrentStepAnswer, showFrame } from './hints-player.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

export function copyAnswerToInput(val, targetEl = null) {
  const input = targetEl || document.getElementById('step-input');
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

function getStepObjectiveLabel(type) {
  switch (type) {
    case 'distribute':
      return 'Distribute Parentheses';
    case 'combine':
      return 'Combine Like Terms';
    case 'move_variables':
      return 'Move Variable Terms';
    case 'move_constants':
      return 'Move Constant Terms';
    case 'isolate':
      return 'Isolate Variable (x)';
    default:
      return type;
  }
}

export function renderHistoryList() {
  const historyList = document.getElementById('history-list');
  const summaryBadge = document.getElementById('steps-progress-summary');
  if (!historyList || !state.currentEquation) return;

  const totalSteps = state.currentEquation.steps.length;
  const completedSteps = Math.min(state.currentStepIdx, totalSteps);
  if (summaryBadge) {
    summaryBadge.textContent = `${completedSteps} of ${totalSteps} steps completed`;
  }

  historyList.replaceChildren();

  // 1. Original Equation Row
  const equationLaTeX = `${state.currentEquation.initialLHS} = ${state.currentEquation.initialRHS}`;
  const origLi = document.createElement('li');
  origLi.dataset.stepStatus = 'original';
  origLi.className = 'flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50/70 border border-blue-200 mb-2';

  const origMathSpan = document.createElement('span');
  origMathSpan.className = 'math-step font-bold text-indigo-950';
  window.MathRenderer.renderInline(equationLaTeX, origMathSpan);

  const origBadge = document.createElement('span');
  origBadge.className = 'text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow-sm';
  origBadge.textContent = 'Original';

  origLi.appendChild(origMathSpan);
  origLi.appendChild(origBadge);
  historyList.appendChild(origLi);

  // 2. All Planned Steps (1..N) Upfront
  state.currentEquation.steps.forEach((step, idx) => {
    const isDone = idx < state.currentStepIdx;
    const isCurrent = idx === state.currentStepIdx;
    const isFinal = idx === totalSteps - 1;

    const li = document.createElement('li');
    li.dataset.stepIndex = String(idx);
    li.dataset.stepStatus = isDone ? 'completed' : isCurrent ? 'active' : 'upcoming';

    if (isDone) {
      li.className = 'flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-sm transition-colors';
    } else if (isCurrent) {
      li.className = 'flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-indigo-50 border border-indigo-300 shadow-sm text-sm transition-colors';
    } else {
      li.className = 'flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-gray-50/80 border border-gray-200 text-gray-400 text-sm transition-colors';
    }

    const leftDiv = document.createElement('div');
    leftDiv.className = 'flex items-center gap-2.5 min-w-0';

    const numBadge = document.createElement('span');
    if (isDone) {
      numBadge.className = 'w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
      numBadge.textContent = '✓';
    } else if (isCurrent) {
      numBadge.className = 'w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
      numBadge.textContent = String(idx + 1);
    } else {
      numBadge.className = 'w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0';
      numBadge.textContent = String(idx + 1);
    }

    const titleSpan = document.createElement('span');
    titleSpan.className = isDone
      ? 'font-medium text-emerald-900 truncate'
      : isCurrent
        ? 'font-semibold text-indigo-950 truncate'
        : 'font-medium text-gray-500 truncate';
    titleSpan.textContent = `Step ${idx + 1}: ${getStepObjectiveLabel(step.type)}`;

    const rolePill = document.createElement('span');
    rolePill.className = isFinal
      ? 'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0'
      : 'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 shrink-0';
    rolePill.textContent = isFinal ? 'Final' : 'Partial';

    leftDiv.appendChild(numBadge);
    leftDiv.appendChild(titleSpan);
    leftDiv.appendChild(rolePill);

    const rightDiv = document.createElement('div');
    rightDiv.className = 'shrink-0 flex items-center gap-2';

    if (isDone) {
      const mathSpan = document.createElement('span');
      mathSpan.className = 'math-step font-semibold text-emerald-950 bg-white px-2.5 py-0.5 rounded border border-emerald-200';
      window.MathRenderer.renderInline(step.latex, mathSpan);
      rightDiv.appendChild(mathSpan);
    } else if (isCurrent) {
      const activeBadge = document.createElement('span');
      activeBadge.className = 'text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded';
      activeBadge.textContent = isFinal ? 'Enter in Final Answer ↓' : 'Enter in Partial Result ↓';
      rightDiv.appendChild(activeBadge);
    } else {
      const pendingBadge = document.createElement('span');
      pendingBadge.className = 'text-xs text-gray-400 italic';
      pendingBadge.textContent = 'Pending';
      rightDiv.appendChild(pendingBadge);
    }

    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    historyList.appendChild(li);
  });
}

function setInputsSolvedState() {
  const stepInput = document.getElementById('step-input');
  const finalInput = document.getElementById('final-answer-input');
  if (stepInput) {
    stepInput.disabled = true;
    stepInput.placeholder = 'Equation fully solved!';
    stepInput.value = '';
    stepInput.classList.remove('border-green-500', 'border-red-500', 'focus:border-green-500', 'focus:border-red-500');
  }
  if (finalInput) {
    finalInput.disabled = true;
    finalInput.placeholder = 'Equation fully solved!';
    finalInput.value = '';
    finalInput.classList.remove('border-green-500', 'border-red-500', 'focus:border-green-500', 'focus:border-red-500');
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
  state.lastTabStepIdx = -1;

  // Render initial equation
  const equationLaTeX = `${state.currentEquation.initialLHS} = ${state.currentEquation.initialRHS}`;
  updateCurrentEquationDisplay(equationLaTeX);
  setTimeout(setupOperatorTooltips, 50);

  // Render upfront step progression list
  renderHistoryList();

  // Setup Hints objectives
  updateHints();
  hideVisualExplanation();

  // Show dev solution
  document.getElementById('dev-solution-display').textContent = `Solution: x = ${state.currentEquation.solution.toString()}`;

  // Render dev steps list
  const devList = document.getElementById('dev-steps-list');
  devList.replaceChildren();
  state.currentEquation.steps.forEach((s, idx) => {
    const row = document.createElement('div');
    row.className = 'flex items-center space-x-1.5 text-xs font-mono text-gray-600';
    const labelSpan = document.createElement('span');
    labelSpan.textContent = `Step ${idx + 1} (${s.type}):`;
    const mathSpan = document.createElement('span');
    mathSpan.className = 'math-step-latex';
    row.appendChild(labelSpan);
    row.appendChild(mathSpan);
    devList.appendChild(row);
    window.MathRenderer.renderInline(s.latex, mathSpan);
  });

  updateDevKeyVisibility();

  // Clear and enable both inputs
  const inputElem = document.getElementById('step-input');
  if (inputElem) {
    inputElem.value = '';
    inputElem.classList.remove('border-green-500', 'border-red-500', 'focus:border-green-500', 'focus:border-red-500');
    inputElem.disabled = false;
    inputElem.placeholder = 'e.g. 2x = 10 (Enter or Tab)';
  }

  const finalElem = document.getElementById('final-answer-input');
  if (finalElem) {
    finalElem.value = '';
    finalElem.classList.remove('border-green-500', 'border-red-500', 'focus:border-green-500', 'focus:border-red-500');
    finalElem.disabled = false;
    finalElem.placeholder = 'e.g. x = 5 (Enter or Tab)';
  }

  const errEl = document.getElementById('step-error-message');
  if (errEl) {
    errEl.classList.add('hidden');
    errEl.textContent = '';
  }
}

export function applyViewTransitionNames(container, prefix = '') {
  ViewTransitions.applyNames(container, prefix);
}

export function updateCurrentEquationDisplay(latex) {
  const display = document.getElementById('current-equation-display');
  ViewTransitions.update(display, 'eq_', () => {
    window.MathRenderer.renderBlock(latex, display);
    setupOperatorTooltips();
  });
}

export function updateAnimationButtons() {
  const btnPrev = document.getElementById('btn-anim-prev');
  const btnNext = document.getElementById('btn-anim-next');

  if (!state.currentEquation || !btnPrev || !btnNext) return;

  // Next button text
  if (state.animIndex === state.animFrames.length - 1 && state.hintStepIdx < state.currentEquation.steps.length - 1) {
    btnNext.textContent = `Step ${state.hintStepIdx + 2} \u2192`;
  } else {
    btnNext.textContent = 'Next \u2192';
  }

  // Back button text
  if (state.animIndex === 0 && state.hintStepIdx > state.currentStepIdx) {
    btnPrev.textContent = `\u2190 Step ${state.hintStepIdx}`;
  } else {
    btnPrev.textContent = '\u2190 Back';
  }
}

export async function autoSolve() {
  const sessionId = state.solveSessionId;
  const inputElem = document.getElementById('step-input');
  const finalElem = document.getElementById('final-answer-input');
  if (inputElem) inputElem.disabled = true;
  if (finalElem) finalElem.disabled = true;

  while (state.currentEquation && state.currentStepIdx < state.currentEquation.steps.length) {
    if (sessionId !== state.solveSessionId) break;
    const nextStep = state.currentEquation.steps[state.currentStepIdx];

    // 1. Show the step in the visual explanation box
    triggerVisualExplanation(state.currentStepIdx, false);

    // 2. Wait for a short duration to let the user see the animation
    await new Promise(resolve => setTimeout(resolve, 2500));
    if (sessionId !== state.solveSessionId) break;

    // 3. Advance step index & update upfront step progression list
    state.currentStepIdx++;
    state.hintStepIdx = state.currentStepIdx;
    renderHistoryList();

    // 4. Update main display
    if (state.currentStepIdx >= state.currentEquation.steps.length) {
      updateCurrentEquationDisplay(`x = ${state.currentEquation.solution.toLaTeX()}`);
      setInputsSolvedState();
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
        showTooltip(e, 'Parentheses: Distribute the multiplication outside into all terms inside.');
      } else {
        showTooltip(e, 'Parentheses: Groups elements together.');
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
      showTooltip(e, 'Fraction: Represents division. Multiply both sides by the denominator to clear it.');
    });
    el.addEventListener('mouseout', hideTooltip);
  });

  relOps.forEach(el => {
    el.classList.add('cursor-help', 'hover:text-indigo-600', 'transition-colors');
    el.addEventListener('mouseover', (e) => {
      showTooltip(e, 'Equals: Keep both sides balanced by applying identical operations to LHS and RHS.');
    });
    el.addEventListener('mouseout', hideTooltip);
  });
}

export function submitCurrentStepAsCorrect(keepHintsOpen = false) {
  if (!state.currentEquation || state.currentStepIdx >= state.currentEquation.steps.length) return;
  const nextStep = state.currentEquation.steps[state.currentStepIdx];
  const inputEl = document.getElementById('step-input');
  const finalEl = document.getElementById('final-answer-input');

  const errEl = document.getElementById('step-error-message');
  errEl.classList.add('hidden');
  errEl.textContent = '';

  // Advance state
  state.currentStepIdx++;
  state.hintStepIdx = state.currentStepIdx;
  state.lastTabStepIdx = -1;

  renderHistoryList();

  if (!keepHintsOpen) {
    hideVisualExplanation();
  }

  if (state.currentStepIdx >= state.currentEquation.steps.length) {
    setInputsSolvedState();
    updateCurrentEquationDisplay(`x = ${state.currentEquation.solution.toLaTeX()}`);
  } else {
    updateCurrentEquationDisplay(nextStep.latex);
    if (inputEl) {
      inputEl.value = '';
      inputEl.classList.remove('border-green-500', 'focus:border-green-500');
    }
    if (finalEl) {
      finalEl.value = '';
      finalEl.classList.remove('border-green-500', 'focus:border-green-500');
    }
    setTimeout(setupOperatorTooltips, 50);
  }
}

function handleTabOnSolverInput(e) {
  e.preventDefault();
  if (!state.currentEquation || state.currentStepIdx >= state.currentEquation.steps.length) return;

  const explanationContainer = document.getElementById('visual-explanation-container');
  const isAlreadyOpen = explanationContainer && !explanationContainer.classList.contains('hidden');

  // 1st Tab: Open visual explanation paused on Frame 1 (autoplay = false)
  if (!isAlreadyOpen || state.lastTabStepIdx !== state.currentStepIdx) {
    state.lastTabStepIdx = state.currentStepIdx;
    triggerVisualExplanation(state.hintStepIdx, false);
    return;
  }

  // Subsequent Tabs while not on the final frame: advance 1 frame manually
  if (state.animFrames && state.animIndex < state.animFrames.length - 1) {
    state.animPlaying = false;
    if (state.animInterval) {
      clearInterval(state.animInterval);
      state.animInterval = null;
    }
    state.animIndex++;
    showFrame(state.animIndex);
    return;
  }

  // Final Tab on the last frame: intelligently fill partial vs final input
  fillCurrentStepAnswer(e.target);
}

export function initSolverUIEvents() {
  document.getElementById('config-show-key').addEventListener('change', updateDevKeyVisibility);

  const stepInputEl = document.getElementById('step-input');
  const finalInputEl = document.getElementById('final-answer-input');

  stepInputEl.addEventListener('keydown', function(e) {
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

    if (e.key === 'Tab') {
      handleTabOnSolverInput(e);
    }
  });

  stepInputEl.addEventListener('input', function() {
    this.classList.remove('border-red-500', 'focus:border-red-500');
    const errEl = document.getElementById('step-error-message');
    errEl.classList.add('hidden');
    errEl.textContent = '';
  });

  if (finalInputEl) {
    finalInputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!state.currentEquation || state.currentStepIdx >= state.currentEquation.steps.length) return;

        const userInput = this.value.trim();
        if (userInput === '') return;

        if (userInput.toLowerCase() === 'solve') {
          this.value = '';
          autoSolve();
          return;
        }

        const finalStep = state.currentEquation.steps[state.currentEquation.steps.length - 1];
        const candidateInput = userInput.includes('=') ? userInput : `x = ${userInput}`;
        const validation = window.EquationGenerator.validateStep(candidateInput, finalStep);

        if (validation.valid) {
          const errEl = document.getElementById('step-error-message');
          errEl.classList.add('hidden');
          errEl.textContent = '';

          state.currentStepIdx = state.currentEquation.steps.length;
          state.hintStepIdx = state.currentStepIdx;
          state.lastTabStepIdx = -1;

          hideVisualExplanation();
          renderHistoryList();
          updateHints();
          setInputsSolvedState();
          updateCurrentEquationDisplay(`x = ${state.currentEquation.solution.toLaTeX()}`);
        } else {
          this.classList.remove('border-green-500', 'focus:border-green-500');
          this.classList.add('border-red-500', 'focus:border-red-500');
          const errEl = document.getElementById('step-error-message');
          errEl.textContent = 'Incorrect final answer. Work through the partial steps on the left or press Tab for a hint.';
          errEl.classList.remove('hidden');
        }
      }

      if (e.key === 'Tab') {
        handleTabOnSolverInput(e);
      }
    });

    finalInputEl.addEventListener('input', function() {
      this.classList.remove('border-red-500', 'focus:border-red-500');
      const errEl = document.getElementById('step-error-message');
      errEl.classList.add('hidden');
      errEl.textContent = '';
    });
  }

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
