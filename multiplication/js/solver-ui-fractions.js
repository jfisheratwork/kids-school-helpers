import { generateFractionProblem } from './generator-fractions.js';
import { attachFractionsHintListener, hideFractionsAnimation } from './hints-player-fractions.js';
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
        stepInput.addEventListener('keydown', handleStepInput);
    }
    if (finalInput) {
        finalInput.addEventListener('keydown', handleFinalInput);
    }
    if (stepInput || finalInput) {
        attachFractionsHintListener(stepInput, finalInput, () => currentProblem, () => currentStepIndex);
    }

    startNewProblem();
}

function getFracStepLabel(step) {
    if (step.type === 'multiply') {
        return 'Multiply Numerators & Denominators';
    }
    if (step.type === 'simplify') {
        return 'Simplify to Lowest Terms';
    }
    return 'Solve Step';
}

function renderFractionsStepsList() {
    const listEl = document.getElementById('fractions-steps-list');
    const summaryEl = document.getElementById('fractions-steps-summary');
    if (!listEl || !currentProblem) return;

    const total = currentProblem.steps.length;
    const completed = Math.min(currentStepIndex, total);
    if (summaryEl) {
        summaryEl.textContent = `${completed} of ${total} completed`;
    }

    listEl.replaceChildren();

    currentProblem.steps.forEach((step, idx) => {
        const isDone = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isFinal = idx === total - 1;

        const li = document.createElement('li');
        if (isDone) {
            li.className = 'flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs';
        } else if (isCurrent) {
            li.className = 'flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-300 shadow-sm text-xs';
        } else {
            li.className = 'flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-gray-50/70 border border-gray-200 text-gray-400 text-xs';
        }

        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center gap-2 min-w-0';

        const badge = document.createElement('span');
        badge.className = isDone
            ? 'w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0'
            : isCurrent
                ? 'w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0'
                : 'w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center shrink-0';
        badge.textContent = isDone ? '✓' : String(idx + 1);

        const labelSpan = document.createElement('span');
        labelSpan.className = isDone
            ? 'font-medium text-emerald-900 truncate'
            : isCurrent
                ? 'font-semibold text-indigo-950 truncate'
                : 'text-gray-500 truncate';
        labelSpan.textContent = getFracStepLabel(step);

        leftDiv.appendChild(badge);
        leftDiv.appendChild(labelSpan);

        const rightSpan = document.createElement('span');
        if (isDone) {
            rightSpan.className = 'font-semibold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0';
            const cleanTex = (step.tex || step.expectedInput).replace('\\text{Simplify: } ', '');
            if (window.katex) {
                window.katex.render(cleanTex, rightSpan, { throwOnError: false, displayMode: false, trust: true });
            } else {
                rightSpan.textContent = step.expectedInput;
            }
        } else if (isCurrent) {
            rightSpan.className = 'font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded shrink-0';
            rightSpan.textContent = isFinal ? 'Enter in Final Answer ↓' : 'Enter in Partial Result ↓';
        } else {
            rightSpan.className = 'text-gray-400 italic shrink-0';
            rightSpan.textContent = 'Pending';
        }

        li.appendChild(leftDiv);
        li.appendChild(rightSpan);
        listEl.appendChild(li);
    });
}

function startNewProblem() {
    const type = document.getElementById('config-fraction-type').value;
    currentProblem = generateFractionProblem(type);
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;
    hideFractionsAnimation();

    renderMath();
    renderFractionsStepsList();

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

    const err = document.getElementById('fractions-step-error');
    if (err) err.classList.add('hidden');
    document.getElementById('fractions-hint-content').textContent =
        "Step 1: Multiply numerator by numerator, and denominator by denominator. Enter format like '3/4'.";
}

function renderMath() {
    const display = document.getElementById('fractions-math-display');
    if (!display) return;
    ViewTransitions.update(display, 'mult_frac_', () => {
        if (window.katex) {
            window.katex.render(historyTex, display, { throwOnError: false, displayMode: true, trust: true });
        } else {
            display.textContent = historyTex;
        }
    });
}

function disableFractionInputs() {
    const stepInput = document.getElementById('fractions-step-input');
    const finalInput = document.getElementById('fractions-final-input');
    if (stepInput) {
        stepInput.value = '';
        stepInput.disabled = true;
    }
    if (finalInput) {
        finalInput.value = '';
        finalInput.disabled = true;
    }
}

function handleStepInput(e) {
    if (e.key !== 'Enter') return;
    if (!currentProblem || !currentProblem.steps[currentStepIndex]) return;
    const val = e.target.value.trim().replace(/\s+/g, '');
    const expected = currentProblem.steps[currentStepIndex].expectedInput;

    if (val === expected) {
        document.getElementById('fractions-step-error').classList.add('hidden');
        hideFractionsAnimation();

        historyTex += ` = ${currentProblem.steps[currentStepIndex].tex.replace('\\text{Simplify: } ', '')}`;
        e.target.value = '';
        currentStepIndex++;

        renderMath();
        renderFractionsStepsList();

        if (currentStepIndex >= currentProblem.steps.length) {
            document.getElementById('fractions-hint-content').textContent = 'Great job! You solved it!';
            disableFractionInputs();
        } else {
            document.getElementById('fractions-hint-content').textContent =
                'Next Step: Simplify the fraction to its lowest terms.';
            if (currentStepIndex === currentProblem.steps.length - 1) {
                const finalInput = document.getElementById('fractions-final-input');
                if (finalInput) finalInput.focus();
            }
        }
    } else {
        const err = document.getElementById('fractions-step-error');
        err.textContent = 'Incorrect partial step, try again or press Tab for a hint.';
        err.classList.remove('hidden');
    }
}

function handleFinalInput(e) {
    if (e.key !== 'Enter') return;
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;
    const val = e.target.value.trim().replace(/\s+/g, '');
    const finalStep = currentProblem.steps[currentProblem.steps.length - 1];

    if (val === finalStep.expectedInput) {
        document.getElementById('fractions-step-error').classList.add('hidden');
        hideFractionsAnimation();

        for (let i = currentStepIndex; i < currentProblem.steps.length; i++) {
            historyTex += ` = ${currentProblem.steps[i].tex.replace('\\text{Simplify: } ', '')}`;
        }
        currentStepIndex = currentProblem.steps.length;

        renderMath();
        renderFractionsStepsList();
        document.getElementById('fractions-hint-content').textContent = 'Great job! You solved it!';
        disableFractionInputs();
    } else {
        const err = document.getElementById('fractions-step-error');
        err.textContent = 'Incorrect final answer. Work out the partial steps on the left or press Tab for a hint.';
        err.classList.remove('hidden');
    }
}
