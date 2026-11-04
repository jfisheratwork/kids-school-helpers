import { generateDecimalToFractionProblem, parseCustomDecimalToFractionProblem } from './generator.js';
import { attachD2FHintListener, hideD2FVisualExplanation } from './hints-player.js';
import { renderD2FGuide } from './guide.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;
let historyTex = '';

export function initD2FSolver() {
    const btnGenerate = document.getElementById('btn-generate-d2f');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }

    const btnCustom = document.getElementById('btn-custom-d2f');
    const customInput = document.getElementById('custom-d2f-input');
    if (btnCustom) {
        btnCustom.addEventListener('click', handleCustomDecimal);
    }
    if (customInput) {
        customInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleCustomDecimal();
            }
        });
    }

    const complexitySelect = document.getElementById('config-complexity');
    if (complexitySelect) {
        complexitySelect.addEventListener('change', (e) => {
            renderD2FGuide(e.target.value);
            startNewProblem();
        });
    }

    const negCheckbox = document.getElementById('config-negatives');
    if (negCheckbox) {
        negCheckbox.addEventListener('change', startNewProblem);
    }

    const stepInput = document.getElementById('d2f-step-input');
    const finalInput = document.getElementById('d2f-final-input');

    if (stepInput) {
        stepInput.addEventListener('keydown', handleStepInput);
    }
    if (finalInput) {
        finalInput.addEventListener('keydown', handleFinalInput);
    }
    if (stepInput || finalInput) {
        attachD2FHintListener(stepInput, finalInput, () => currentProblem, () => currentStepIndex);
    }

    startNewProblem();
}

export function getCurrentD2FProblem() {
    return currentProblem;
}

function getStepLabel(step) {
    switch (step.type) {
        case 'identify_place_value':
            return `Identify Place-Value Denominator (${step.placeValueName})`;
        case 'unsimplified_fraction':
            return `Write as Unsimplified Fraction over ${step.placeValueDenom}`;
        case 'find_gcf':
            return `Find Greatest Common Factor (GCF of ${step.rawNumerator} & ${step.placeValueDenom})`;
        case 'simplify_fraction':
            return `Divide by GCF (${step.gcf}) to Simplify`;
        default:
            return 'Solve Step';
    }
}

function appendStepToHistoryTex(step) {
    if (step.type === 'identify_place_value') {
        historyTex += ` \\quad (\\text{${step.placeValueName}: } ${step.placeValueDenom})`;
    } else if (step.type === 'find_gcf') {
        historyTex += ` \\quad (\\text{GCF} = ${step.gcf})`;
    } else {
        historyTex += ` = ${step.tex}`;
    }
}

function loadD2FProblem(problem) {
    if (!problem) return;
    hideD2FVisualExplanation();
    currentProblem = problem;
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;

    renderD2FGuide(currentProblem.complexity || 'basic');
    renderMath();
    renderStepsList();

    const stepInput = document.getElementById('d2f-step-input');
    const finalInput = document.getElementById('d2f-final-input');

    if (stepInput) {
        stepInput.value = '';
        stepInput.disabled = false;
        stepInput.focus();
    }
    if (finalInput) {
        finalInput.value = '';
        finalInput.disabled = false;
    }

    const err = document.getElementById('d2f-step-error');
    if (err) err.classList.add('hidden');

    updateHintText();
}

function handleCustomDecimal() {
    const customInput = document.getElementById('custom-d2f-input');
    const customError = document.getElementById('custom-d2f-error');
    if (!customInput) return;

    const parsed = parseCustomDecimalToFractionProblem(customInput.value);
    if (!parsed) {
        if (customError) {
            customError.textContent = 'Enter a valid decimal with 1–3 decimal places (e.g. -5.75, 0.375, or 2.4).';
            customError.classList.remove('hidden');
        }
        return;
    }
    if (customError) customError.classList.add('hidden');
    loadD2FProblem(parsed);
}

function startNewProblem() {
    const complexityEl = document.getElementById('config-complexity');
    const negEl = document.getElementById('config-negatives');
    const customError = document.getElementById('custom-d2f-error');
    if (customError) customError.classList.add('hidden');

    const complexity = complexityEl ? complexityEl.value : 'basic';
    const allowNegatives = Boolean(negEl && negEl.checked);

    const problem = generateDecimalToFractionProblem(complexity, { allowNegatives });
    loadD2FProblem(problem);
}

function renderMath() {
    const display = document.getElementById('d2f-math-display');
    if (!display) return;
    ViewTransitions.update(display, 'd2f_eq_', () => {
        if (window.MathRenderer) {
            window.MathRenderer.renderBlock(historyTex, display);
        } else if (window.katex) {
            window.katex.render(historyTex, display, { throwOnError: false, displayMode: true, trust: true });
        } else {
            display.textContent = historyTex;
        }
    });
}

function renderStepsList() {
    const listEl = document.getElementById('d2f-steps-list');
    const summaryEl = document.getElementById('d2f-steps-summary');
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
        li.setAttribute('data-step-status', isDone ? 'completed' : isCurrent ? 'active' : 'pending');
        if (isDone) {
            li.className = 'flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-sm transition-colors';
        } else if (isCurrent) {
            li.className = 'flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-300 shadow-sm text-sm transition-colors';
        } else {
            li.className = 'flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/60 border border-slate-200 text-slate-400 text-sm transition-colors';
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
            numBadge.className = 'w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0';
            numBadge.textContent = String(idx + 1);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = isDone
            ? 'font-medium text-emerald-900 truncate'
            : isCurrent
              ? 'font-semibold text-indigo-950 truncate'
              : 'font-medium text-slate-500 truncate';
        labelSpan.textContent = getStepLabel(step);

        const roleBadge = document.createElement('span');
        roleBadge.className = isFinal
            ? 'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0'
            : 'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 shrink-0';
        roleBadge.textContent = isFinal ? 'Final' : 'Partial';

        leftDiv.appendChild(numBadge);
        leftDiv.appendChild(labelSpan);
        leftDiv.appendChild(roleBadge);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'shrink-0 flex items-center gap-2';

        if (isDone) {
            const mathSpan = document.createElement('span');
            mathSpan.className = 'font-semibold text-emerald-900 bg-white px-2.5 py-0.5 rounded border border-emerald-200';
            const resTex = step.tex || step.expectedInput;
            if (window.MathRenderer) {
                window.MathRenderer.renderInline(resTex, mathSpan);
            } else if (window.katex) {
                window.katex.render(resTex, mathSpan, { throwOnError: false, displayMode: false, trust: true });
            } else {
                mathSpan.textContent = resTex;
            }
            rightDiv.appendChild(mathSpan);
        } else if (isCurrent) {
            const statusSpan = document.createElement('span');
            statusSpan.className = 'text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded';
            statusSpan.textContent = isFinal ? 'Enter in Final Answer ↓' : 'Enter in Partial Result ↓';
            rightDiv.appendChild(statusSpan);
        } else {
            const upcomingSpan = document.createElement('span');
            upcomingSpan.className = 'text-xs text-slate-400 italic';
            upcomingSpan.textContent = 'Pending';
            rightDiv.appendChild(upcomingSpan);
        }

        li.appendChild(leftDiv);
        li.appendChild(rightDiv);
        listEl.appendChild(li);
    });
}

function updateHintText() {
    const hintContent = document.getElementById('d2f-hint-content');
    if (!hintContent || !currentProblem) return;
    hintContent.replaceChildren();

    if (currentStepIndex >= currentProblem.steps.length) {
        const p = document.createElement('p');
        p.className = 'text-green-600 font-semibold';
        p.textContent = `Great job! ${currentProblem.decimalStr} = ${currentProblem.finalExpected}`;
        hintContent.appendChild(p);
        return;
    }

    const step = currentProblem.steps[currentStepIndex];
    const stepBadge = document.createElement('p');
    stepBadge.className = 'font-bold text-indigo-900';
    stepBadge.textContent = `Step ${currentStepIndex + 1} of ${currentProblem.steps.length}`;

    const promptP = document.createElement('p');
    promptP.className = 'mt-1 text-indigo-700';

    if (step.type === 'identify_place_value') {
        promptP.textContent = `How many decimal places are in ${currentProblem.decimalStr}? Enter the place-value denominator (10, 100, or 1000).`;
    } else if (step.type === 'unsimplified_fraction') {
        promptP.textContent = `Write ${currentProblem.decimalStr} as an unsimplified fraction over ${step.placeValueDenom} (e.g. ${step.expectedInput}).`;
    } else if (step.type === 'find_gcf') {
        promptP.textContent = `Find the Greatest Common Factor (GCF) of ${step.rawNumerator} and ${step.placeValueDenom}.`;
    } else if (step.type === 'simplify_fraction') {
        promptP.textContent = `Divide the numerator and denominator by ${step.gcf} to simplify the fraction to lowest terms.`;
    }

    hintContent.appendChild(stepBadge);
    hintContent.appendChild(promptP);
}

function normalizeAnswer(str) {
    return (str || '').trim().replace(/\s+/g, '').toLowerCase();
}

function completeProblemInputs() {
    const stepInput = document.getElementById('d2f-step-input');
    const finalInput = document.getElementById('d2f-final-input');
    if (stepInput) {
        stepInput.value = '';
        stepInput.disabled = true;
    }
    if (finalInput) {
        finalInput.value = currentProblem ? currentProblem.finalExpected : '';
        finalInput.disabled = true;
    }
}

function handleStepInput(e) {
    if (e.key !== 'Enter') return;
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;

    const val = normalizeAnswer(e.target.value);
    const step = currentProblem.steps[currentStepIndex];
    const allowed = (step.acceptedInputs || [step.expectedInput]).map(normalizeAnswer);

    if (allowed.includes(val)) {
        document.getElementById('d2f-step-error').classList.add('hidden');
        hideD2FVisualExplanation();

        appendStepToHistoryTex(step);
        e.target.value = '';
        currentStepIndex++;

        renderMath();
        renderStepsList();
        updateHintText();

        if (currentStepIndex >= currentProblem.steps.length) {
            completeProblemInputs();
        } else if (currentStepIndex === currentProblem.steps.length - 1) {
            const finalInput = document.getElementById('d2f-final-input');
            if (finalInput) finalInput.focus();
        }
    } else {
        const err = document.getElementById('d2f-step-error');
        err.textContent = 'Incorrect partial step, try again or press Tab for a step-by-step visual hint.';
        err.classList.remove('hidden');
    }
}

function handleFinalInput(e) {
    if (e.key !== 'Enter') return;
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;

    const val = normalizeAnswer(e.target.value);
    const allowedFinal = currentProblem.acceptedFinalAnswers.map(normalizeAnswer);

    if (allowedFinal.includes(val)) {
        document.getElementById('d2f-step-error').classList.add('hidden');
        hideD2FVisualExplanation();

        for (let i = currentStepIndex; i < currentProblem.steps.length; i++) {
            appendStepToHistoryTex(currentProblem.steps[i]);
        }
        currentStepIndex = currentProblem.steps.length;

        renderMath();
        renderStepsList();
        updateHintText();
        completeProblemInputs();
    } else {
        const err = document.getElementById('d2f-step-error');
        err.textContent = 'Incorrect final fraction. Make sure it is reduced to lowest terms, or press Tab for a hint.';
        err.classList.remove('hidden');
    }
}
