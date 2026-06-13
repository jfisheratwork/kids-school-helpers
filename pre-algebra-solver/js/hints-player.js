import { state } from './state.js';
import { applyViewTransitionNames, updateAnimationButtons, submitCurrentStepAsCorrect } from './solver-ui.js';

window.submitCurrentStepAsCorrect = submitCurrentStepAsCorrect; // Expose so we can call it if needed, or call directly

export function updateHints(stepIdx = state.currentStepIdx) {
  const hintContent = document.getElementById('hint-content');
  if (!state.currentEquation || stepIdx >= state.currentEquation.steps.length) {
    hintContent.innerHTML = '<p class="text-green-600 font-medium">Equation Solved! Great job!</p>';
    return;
  }
  const nextStep = state.currentEquation.steps[stepIdx];
  const isFinalStep = (stepIdx === state.currentEquation.steps.length - 1);
  const stepNumDisplay = `Step ${stepIdx + 1} of ${state.currentEquation.steps.length}`;
  const finalBadge = isFinalStep ? ` <span class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2 shadow-sm border border-green-200">Final Step</span>` : '';
  
  let objectiveTitle = '';
  let hint = '';
  switch (nextStep.type) {
    case 'distribute':
      objectiveTitle = 'Distribute';
      hint = 'Multiply the term outside the parentheses with all terms inside the parentheses.';
      break;
    case 'combine':
      objectiveTitle = 'Combine Like Terms';
      hint = 'Combine matching variable terms and matching constant terms on each side.';
      break;
    case 'move_variables':
      objectiveTitle = 'Move Variables';
      hint = 'Add or subtract variable terms to move them all to the left-hand side.';
      break;
    case 'move_constants':
      objectiveTitle = 'Move Constants';
      hint = 'Add or subtract constants to move them all to the right-hand side.';
      break;
    case 'isolate':
      objectiveTitle = 'Isolate Variable';
      hint = 'Divide both sides by the coefficient of x to find the final value.';
      break;
  }
  hintContent.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <p class="font-bold text-indigo-900">${stepNumDisplay}: ${objectiveTitle}</p>
      ${finalBadge}
    </div>
    <p class="mt-2 text-indigo-700">${hint}</p>
  `;
}

export function playAnimation(frames, autoplay = false) {
  if (!frames || frames.length === 0) return;
  state.animFrames = frames;
  state.animIndex = 0;
  state.animPlaying = autoplay;
  
  showFrame(state.animIndex);
  if (state.animInterval) clearInterval(state.animInterval);
  if (state.animPlaying) {
    startAnimTimer();
  }
}

export function showFrame(index) {
  const display = document.getElementById('visual-explanation-display');
  const counter = document.getElementById('anim-frame-counter');
  
  if (!document.startViewTransition) {
    window.MathRenderer.renderBlock(state.animFrames[index], display);
    applyViewTransitionNames(display, 'vis_');
    counter.textContent = `${index + 1}/${state.animFrames.length}`;
    updateAnimationButtons();
    return;
  }
  
  display.querySelectorAll('[id]').forEach(el => {
    el.style.viewTransitionName = 'vis_' + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  });

  document.documentElement.classList.add('slow-transition');
  const transition = document.startViewTransition(() => {
    window.MathRenderer.renderBlock(state.animFrames[index], display);
    applyViewTransitionNames(display, 'vis_');
    counter.textContent = `${index + 1}/${state.animFrames.length}`;
    updateAnimationButtons();
  });
  transition.finished.finally(() => {
    document.documentElement.classList.remove('slow-transition');
  });
}

export function startAnimTimer() {
  if (state.animInterval) clearInterval(state.animInterval);
  const speedSeconds = parseFloat(document.getElementById('anim-speed').value);
  document.getElementById('anim-speed-display').textContent = `${speedSeconds.toFixed(1)}s`;
  document.documentElement.style.setProperty('--transition-duration', speedSeconds + 's');
  
  state.animInterval = setInterval(() => {
    if (!state.animPlaying) return;
    if (state.animIndex < state.animFrames.length - 1) {
      state.animIndex++;
      showFrame(state.animIndex);
    } else {
      state.animPlaying = false;
      clearInterval(state.animInterval);
    }
  }, speedSeconds * 1000);
}

export function triggerVisualExplanation(stepIdx = state.currentStepIdx, autoplay = false) {
  if (!state.currentEquation || stepIdx >= state.currentEquation.steps.length) return;
  const targetStep = state.currentEquation.steps[stepIdx];
  if (!targetStep || !targetStep.animationFrames) return;

  const explanationContainer = document.getElementById('visual-explanation-container');
  const hintContainer = document.getElementById('hint-system-container');

  // Start animation playback
  playAnimation(targetStep.animationFrames, autoplay);

  // Update active hint to match visual explanation step
  updateHints(stepIdx);

  // Cancel any pending hide timeouts
  if (state.hideTimeout) {
    clearTimeout(state.hideTimeout);
    state.hideTimeout = null;
  }

  // Show visual explanation box
  explanationContainer.classList.remove('hidden');
  setTimeout(() => {
    explanationContainer.classList.remove('opacity-0');
  }, 50);

  // Visual pulse feedback on panel
  hintContainer.classList.add('ring-4', 'ring-indigo-300', 'border-indigo-400');
  setTimeout(() => {
    hintContainer.classList.remove('ring-4', 'ring-indigo-300', 'border-indigo-400');
  }, 1000);
}

export function hideVisualExplanation() {
  if (state.animInterval) clearInterval(state.animInterval);
  state.animPlaying = false;
  const explanationContainer = document.getElementById('visual-explanation-container');
  explanationContainer.classList.add('opacity-0');
  
  if (state.hideTimeout) clearTimeout(state.hideTimeout);
  state.hideTimeout = setTimeout(() => {
    explanationContainer.classList.add('hidden');
  }, 500);
}

// Event Listeners for controls
export function initHintsPlayerEvents() {
  document.getElementById('anim-speed').addEventListener('input', function() {
    const val = parseFloat(this.value);
    document.getElementById('anim-speed-display').textContent = `${val.toFixed(1)}s`;
    document.documentElement.style.setProperty('--transition-duration', val + 's');
    if (state.animPlaying) {
      startAnimTimer();
    }
  });

  document.getElementById('btn-anim-prev').addEventListener('click', function() {
    state.animPlaying = false;
    if (state.animInterval) clearInterval(state.animInterval);
    
    if (state.animIndex > 0) {
      state.animIndex--;
      showFrame(state.animIndex);
    } else if (state.animIndex === 0 && state.hintStepIdx > state.currentStepIdx) {
      state.hintStepIdx--;
      const targetStep = state.currentEquation.steps[state.hintStepIdx];
      state.animFrames = targetStep.animationFrames;
      state.animIndex = state.animFrames.length - 1;
      showFrame(state.animIndex);
      updateHints(state.hintStepIdx);
    }
  });

  document.getElementById('btn-anim-next').addEventListener('click', function() {
    state.animPlaying = false;
    if (state.animInterval) clearInterval(state.animInterval);
    
    if (state.animIndex < state.animFrames.length - 1) {
      state.animIndex++;
      showFrame(state.animIndex);
    } else if (state.animIndex === state.animFrames.length - 1 && state.hintStepIdx < state.currentEquation.steps.length - 1) {
      if (state.hintStepIdx === state.currentStepIdx) {
        window.submitCurrentStepAsCorrect(true);
      } else {
        state.hintStepIdx++;
      }
      
      const targetStep = state.currentEquation.steps[state.hintStepIdx];
      state.animFrames = targetStep.animationFrames;
      state.animIndex = 0;
      showFrame(state.animIndex);
      updateHints(state.hintStepIdx);
    }
  });
}
