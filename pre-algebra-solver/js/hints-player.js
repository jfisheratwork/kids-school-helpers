import { state } from './state.js';
import { updateAnimationButtons, submitCurrentStepAsCorrect, copyAnswerToInput } from './solver-ui.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';
import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

window.submitCurrentStepAsCorrect = submitCurrentStepAsCorrect;

export function updateHints(stepIdx = state.currentStepIdx) {
  const hintContent = document.getElementById('hint-content');
  if (!hintContent) return;
  hintContent.replaceChildren();

  if (!state.currentEquation || stepIdx >= state.currentEquation.steps.length) {
    const solvedP = document.createElement('p');
    solvedP.className = 'text-green-600 font-medium';
    solvedP.textContent = 'Equation Solved! Great job!';
    hintContent.appendChild(solvedP);
    return;
  }

  const nextStep = state.currentEquation.steps[stepIdx];
  const isFinalStep = (stepIdx === state.currentEquation.steps.length - 1);
  const stepNumDisplay = `Step ${stepIdx + 1} of ${state.currentEquation.steps.length}`;

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

  const headerDiv = document.createElement('div');
  headerDiv.className = 'flex items-center justify-between flex-wrap gap-2';

  const titleP = document.createElement('p');
  titleP.className = 'font-bold text-indigo-900';
  titleP.textContent = `${stepNumDisplay}: ${objectiveTitle}`;
  headerDiv.appendChild(titleP);

  if (isFinalStep) {
    const badge = document.createElement('span');
    badge.className = 'bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2 shadow-sm border border-green-200';
    badge.textContent = 'Final Step';
    headerDiv.appendChild(badge);
  }

  const bodyP = document.createElement('p');
  bodyP.className = 'mt-2 text-indigo-700';
  bodyP.textContent = hint;

  const tipP = document.createElement('p');
  tipP.className = 'mt-1 text-xs text-indigo-500 italic';
  tipP.textContent = 'Tip: Press Tab for visual animation, press Tab again to fill the answer.';

  hintContent.appendChild(headerDiv);
  hintContent.appendChild(bodyP);
  hintContent.appendChild(tipP);
}

function getFrameCaption(stepIdx, frameIdx) {
  if (!state.currentEquation || stepIdx >= state.currentEquation.steps.length) return '';
  const step = state.currentEquation.steps[stepIdx];
  if (step && Array.isArray(step.frameCaptions) && step.frameCaptions[frameIdx]) {
    return step.frameCaptions[frameIdx];
  }
  return '';
}

function syncPlayButtonUI() {
  const playBtn = document.getElementById('btn-anim-play');
  if (!playBtn) return;
  if (!state.animFrames || state.animFrames.length <= 1) {
    playBtn.classList.add('hidden');
    return;
  }
  playBtn.classList.remove('hidden');
  if (state.animPlaying) {
    playBtn.textContent = 'Pause';
  } else if (state.animIndex >= state.animFrames.length - 1) {
    playBtn.textContent = 'Replay';
  } else {
    playBtn.textContent = 'Play';
  }
}

export function playAnimation(frames, autoplay = false) {
  if (!frames || frames.length === 0) return;
  state.animFrames = frames;
  state.animIndex = 0;
  state.animPlaying = autoplay;

  showFrame(state.animIndex);
  if (state.animInterval) {
    clearInterval(state.animInterval);
    state.animInterval = null;
  }
  if (state.animPlaying) {
    startAnimTimer();
  } else {
    syncPlayButtonUI();
  }
}

export function showFrame(index) {
  const display = document.getElementById('visual-explanation-display');
  const counter = document.getElementById('anim-frame-counter');
  const captionEl = document.getElementById('anim-frame-caption');
  if (!display || !state.animFrames || index < 0 || index >= state.animFrames.length) return;

  const captionText = getFrameCaption(state.hintStepIdx, index);

  ViewTransitions.update(display, 'vis_', () => {
    window.MathRenderer.renderBlock(state.animFrames[index], display);
    if (counter) {
      counter.textContent = `${index + 1}/${state.animFrames.length}`;
    }
    if (captionEl) {
      captionEl.textContent = captionText;
      captionEl.classList.toggle('hidden', !captionText);
    }
    syncPlayButtonUI();
    updateAnimationButtons();
  });
}

export function startAnimTimer() {
  if (state.animInterval) {
    clearInterval(state.animInterval);
    state.animInterval = null;
  }
  const speedEl = document.getElementById('anim-speed');
  const speedSeconds = speedEl ? (parseFloat(speedEl.value) || 2.5) : 2.5;
  const speedDisplay = document.getElementById('anim-speed-display');
  if (speedDisplay) {
    speedDisplay.textContent = `${speedSeconds.toFixed(1)}s`;
  }
  syncPlayButtonUI();

  state.animInterval = setInterval(() => {
    if (!state.animPlaying) return;
    if (state.animIndex < state.animFrames.length - 1) {
      state.animIndex++;
      showFrame(state.animIndex);
    } else {
      state.animPlaying = false;
      clearInterval(state.animInterval);
      state.animInterval = null;
      syncPlayButtonUI();
    }
  }, speedSeconds * 1000);
}

export function fillCurrentStepAnswer() {
  if (!state.currentEquation) return;
  const targetIdx = state.currentStepIdx < state.currentEquation.steps.length
    ? state.currentStepIdx
    : state.hintStepIdx;
  const step = state.currentEquation.steps[targetIdx];
  if (!step) return;
  copyAnswerToInput(step.latex);
  const inputEl = document.getElementById('step-input');
  SharedAnimationPlayer.fillInputElement(inputEl, step.latex);
}

export function triggerVisualExplanation(stepIdx = state.currentStepIdx, autoplay = false) {
  if (!state.currentEquation || stepIdx >= state.currentEquation.steps.length) return;
  const targetStep = state.currentEquation.steps[stepIdx];
  if (!targetStep || !targetStep.animationFrames) return;

  state.hintStepIdx = stepIdx;
  const explanationContainer = document.getElementById('visual-explanation-container');
  const hintContainer = document.getElementById('hint-system-container');

  playAnimation(targetStep.animationFrames, autoplay);
  updateHints(stepIdx);

  if (state.hideTimeout) {
    clearTimeout(state.hideTimeout);
    state.hideTimeout = null;
  }

  explanationContainer.classList.remove('hidden');
  setTimeout(() => {
    explanationContainer.classList.remove('opacity-0');
  }, 30);

  hintContainer.classList.add('ring-4', 'ring-indigo-300', 'border-indigo-400');
  setTimeout(() => {
    hintContainer.classList.remove('ring-4', 'ring-indigo-300', 'border-indigo-400');
  }, 900);
}

export function hideVisualExplanation() {
  if (state.animInterval) {
    clearInterval(state.animInterval);
    state.animInterval = null;
  }
  state.animPlaying = false;
  syncPlayButtonUI();
  const explanationContainer = document.getElementById('visual-explanation-container');
  if (!explanationContainer) return;
  explanationContainer.classList.add('opacity-0');

  if (state.hideTimeout) clearTimeout(state.hideTimeout);
  state.hideTimeout = setTimeout(() => {
    explanationContainer.classList.add('hidden');
  }, 350);
}

export function initHintsPlayerEvents() {
  const speedEl = document.getElementById('anim-speed');
  if (speedEl) {
    speedEl.addEventListener('input', function() {
      const val = parseFloat(this.value) || 2.5;
      const speedDisplay = document.getElementById('anim-speed-display');
      if (speedDisplay) {
        speedDisplay.textContent = `${val.toFixed(1)}s`;
      }
      if (state.animPlaying) {
        startAnimTimer();
      }
    });
  }

  const playBtn = document.getElementById('btn-anim-play');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      if (!state.animFrames || state.animFrames.length <= 1) return;
      if (state.animPlaying) {
        state.animPlaying = false;
        if (state.animInterval) {
          clearInterval(state.animInterval);
          state.animInterval = null;
        }
        syncPlayButtonUI();
      } else {
        if (state.animIndex >= state.animFrames.length - 1) {
          state.animIndex = 0;
          showFrame(0);
        }
        state.animPlaying = true;
        startAnimTimer();
      }
    });
  }

  const fillBtn = document.getElementById('btn-anim-fill');
  if (fillBtn) {
    fillBtn.addEventListener('click', function() {
      fillCurrentStepAnswer();
    });
  }

  document.getElementById('btn-anim-prev').addEventListener('click', function() {
    state.animPlaying = false;
    if (state.animInterval) {
      clearInterval(state.animInterval);
      state.animInterval = null;
    }

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
    } else {
      syncPlayButtonUI();
    }
  });

  document.getElementById('btn-anim-next').addEventListener('click', function() {
    state.animPlaying = false;
    if (state.animInterval) {
      clearInterval(state.animInterval);
      state.animInterval = null;
    }

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
    } else {
      syncPlayButtonUI();
    }
  });
}
