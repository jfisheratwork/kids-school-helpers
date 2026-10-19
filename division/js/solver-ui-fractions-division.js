import { generateFractionDivisionProblem } from './generator-fractions-division.js';
import { attachFractionsHintListener, hideFractionsDivisionAnimation } from './hints-player-fractions-division.js';
import { MathRenderer } from '../../shared/js/renderer.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;
let historyTex = '';

export function initFractionsSolver() {
    const btnGenerate = document.getElementById('btn-generate-fractions');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }

    const stepInput = document.getElementById('fractions-step-input');
    const finalInput = document.getElementById('fractions-final-input');

    if (stepInput) {
        stepInput.addEventListener('keydown', (e) => handleInput(e, false));
    }
    if (finalInput) {
        finalInput.addEventListener('keydown', (e) => handleInput(e, true));
    }
    if (stepInput || finalInput) {
        attachFractionsHintListener(stepInput, finalInput, () => currentProblem, () => currentStepIndex);
    }

    startNewProblem();
}

function getFractionDivisionStepLabel(step) {
    if (step.type === 'keep_change_flip') {
        return 'Keep-Change-Flip (flip the second fraction)';
    } else if (step.type === 'multiply') {
        return 'Multiply numerators & denominators';
    } else if (step.type === 'simplify') {
        return 'Simplify fraction to lowest terms';
    }
    return 'Complete fraction step';
}

function renderStepsList() {
    const listEl = document.getElementById('fractions-steps-list');
    const summaryEl = document.getElementById('fractions-steps-summary');
    if (!listEl || !currentProblem) return;

    listEl.replaceChildren();
    const total = currentProblem.steps.length;
    if (summaryEl) {
        summaryEl.textContent =
            currentStepIndex >= total
                ? `All ${total} steps completed`
                : `Step ${currentStepIndex + 1} of ${total}`;
    }

    currentProblem.steps.forEach((step, idx) => {
        const isDone = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;
        const li = document.createElement('li');
        li.className = `flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
            isDone
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : isActive
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-sm'
                  : 'bg-gray-50/70 border-gray-200 text-gray-500'
        }`;

        const left = document.createElement('div');
        left.className = 'flex items-center gap-2';
        const badge = document.createElement('span');
        badge.className = `inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
            isDone
                ? 'bg-emerald-600 text-white'
                : isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
        }`;
        badge.textContent = isDone ? '✓' : String(idx + 1);
        const label = document.createElement('span');
        label.textContent = getFractionDivisionStepLabel(step);
        left.append(badge, label);

        const right = document.createElement('span');
        right.className = 'font-mono text-xs';
        right.textContent = isDone ? step.expectedInput : isActive ? 'Current Step' : 'Pending';

        li.append(left, right);
        listEl.appendChild(li);
    });
}

function startNewProblem() {
    const typeSelect = document.getElementById('config-fraction-type');
    const type = typeSelect ? typeSelect.value : 'proper';
    currentProblem = generateFractionDivisionProblem(type);
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;
    hideFractionsDivisionAnimation();

    renderMath();
    renderStepsList();

    const stepInput = document.getElementById('fractions-step-input');
    const finalInput = document.getElementById('fractions-final-input');
    if (stepInput) {
        stepInput.value = '';
        stepInput.disabled = false;
    }
    if (finalInput) {
        finalInput.value = '';
        finalInput.disabled = false;
    }

    const errEl = document.getElementById('fractions-step-error');
    if (errEl) errEl.classList.add('hidden');

    const hintBox = document.getElementById('fractions-hint-content');
    if (hintBox) {
        hintBox.textContent = `Step 1: Keep-Change-Flip. Flip the second fraction to turn division into multiplication. Enter the flipped fraction (e.g. '${currentProblem.steps[0].expectedInput}').`;
    }
}

function renderMath() {
    const display = document.getElementById('fractions-math-display');
    if (display) {
        ViewTransitions.update(display, 'div_frac_', () => {
            MathRenderer.render(historyTex, display, true);
        });
    }
}

function completeAllSteps() {
    const stepInput = document.getElementById('fractions-step-input');
    const finalInput = document.getElementById('fractions-final-input');
    const finalStep = currentProblem.steps[currentProblem.steps.length - 1];

    if (stepInput) {
        stepInput.value = 'Done!';
        stepInput.disabled = true;
    }
    if (finalInput) {
        finalInput.value = finalStep.expectedInput;
        finalInput.disabled = true;
    }

    const hintBox = document.getElementById('fractions-hint-content');
    if (hintBox) hintBox.textContent = 'Great job! You solved it!';
}

function handleInput(e, isFinalBox) {
    if (e.key === 'Enter') {
        if (!currentProblem || !currentProblem.steps[currentStepIndex]) return;
        const val = e.target.value.trim().replace(/\s+/g, '');
        const currentStep = currentProblem.steps[currentStepIndex];
        const finalStep = currentProblem.steps[currentProblem.steps.length - 1];

        const isStepMatch =
            val === currentStep.expectedInput || (currentStep.altExpected && val === currentStep.altExpected);
        const isFinalMatch =
            val === finalStep.expectedInput || (finalStep.altExpected && val === finalStep.altExpected);

        if (isFinalBox && isFinalMatch) {
            const err = document.getElementById('fractions-step-error');
            if (err) err.classList.add('hidden');
            hideFractionsDivisionAnimation();

            for (let i = currentStepIndex; i < currentProblem.steps.length; i++) {
                historyTex += ` = ${currentProblem.steps[i].tex.replace('\\text{Simplify: } ', '')}`;
            }
            currentStepIndex = currentProblem.steps.length;
            renderMath();
            renderStepsList();
            completeAllSteps();
            return;
        }

        if (!isFinalBox && isStepMatch) {
            const err = document.getElementById('fractions-step-error');
            if (err) err.classList.add('hidden');
            hideFractionsDivisionAnimation();

            historyTex += ` = ${currentStep.tex.replace('\\text{Simplify: } ', '')}`;
            renderMath();

            e.target.value = '';
            currentStepIndex++;
            renderStepsList();

            const hintBox = document.getElementById('fractions-hint-content');
            if (currentStepIndex >= currentProblem.steps.length) {
                completeAllSteps();
            } else {
                const nextStep = currentProblem.steps[currentStepIndex];
                if (nextStep.type === 'multiply') {
                    if (hintBox) {
                        hintBox.textContent =
                            "Step 2: Multiply the numerators together and the denominators together. (e.g. 'numerator/denominator')";
                    }
                } else if (nextStep.type === 'simplify') {
                    if (hintBox) hintBox.textContent = 'Step 3: Simplify the fraction to lowest terms.';
                }
            }
        } else {
            const err = document.getElementById('fractions-step-error');
            if (err) {
                err.textContent = isFinalBox
                    ? 'Not quite the final simplified answer yet. Try solving the current step or press Tab for a hint.'
                    : 'Incorrect, try again or press Tab for a hint.';
                err.classList.remove('hidden');
            }
        }
    }
}
