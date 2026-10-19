import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';
import { attachFractionsHintListener, hideVisualExplanation } from './hints-player.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';
import { syncGuideTopic } from './guide.js';

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
}

export function generateProblemFromConfig() {
    const topic = document.getElementById('config-topic').value;
    const type = document.getElementById('config-fraction-type').value;
    const digits = parseInt(document.getElementById('config-digit-size')?.value || '1', 10);

    switch (topic) {
        case 'concepts':
            return generateConceptsProblem(digits);
        case 'addsub':
            return generateAddSubProblem(type, digits);
        case 'multiply':
            return generateMultProblem(type, digits);
        case 'divide':
            return generateDivProblem(type, digits);
        default:
            return generateAddSubProblem(type, digits);
    }
}

function getStepLabel(step) {
    switch (step.type) {
        case 'find_lcd':
            return 'Find Least Common Denominator (LCD)';
        case 'convert':
            return `Convert Fractions to LCD (${step.lcd})`;
        case 'operate':
            return 'Add / Subtract Numerators';
        case 'kcf':
            return 'Keep, Change, Flip (Reciprocal)';
        case 'multiply':
            return 'Multiply Numerators & Denominators';
        case 'simplify':
            return 'Simplify to Lowest Terms';
        case 'categorize':
            return 'Classify Proper vs. Improper';
        case 'convert_mixed':
            return 'Convert to Mixed Number';
        case 'find_lcm':
            return 'Find Least Common Multiple (LCM)';
        case 'find_gcd':
            return 'Find Greatest Common Factor (GCF)';
        case 'simplify_concept':
            return 'Simplify Fraction by GCF';
        default:
            return 'Solve Step';
    }
}

function getStepResultTex(step) {
    if (step.type === 'find_lcd') {
        return `\\text{LCD} = ${step.lcd}`;
    }
    if (step.type === 'find_lcm') {
        return `\\text{LCM} = ${step.lcd}`;
    }
    if (step.type === 'find_gcd') {
        return `\\text{GCF} = ${step.gcd}`;
    }
    if (step.type === 'categorize') {
        return `\\text{${step.expectedInput}}`;
    }
    return step.tex || step.expectedInput;
}

function appendStepToHistoryTex(step) {
    if (step.type === 'find_lcd') {
        historyTex += ` \\quad (\\text{LCD: } ${step.lcd})`;
    } else if (step.type === 'find_lcm') {
        historyTex += ` \\rightarrow ${step.lcd}`;
    } else if (step.type === 'find_gcd') {
        historyTex += ` \\rightarrow ${step.gcd}`;
    } else if (step.type === 'simplify_concept') {
        historyTex += ` = ${step.tex}`;
    } else if (step.type === 'categorize') {
        historyTex += ` \\quad \\rightarrow \\text{${step.expectedInput}}`;
    } else {
        historyTex += ` = ${step.tex}`;
    }
}

function startNewProblem() {
    hideVisualExplanation();

    currentProblem = generateProblemFromConfig();
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;

    const topicSelect = document.getElementById('config-topic');
    if (topicSelect) {
        syncGuideTopic(topicSelect.value);
    }

    renderMath();
    renderStepsList();

    const stepInput = document.getElementById('fractions-step-input');
    const finalInput = document.getElementById('fractions-final-input');
    const isSingleStep = currentProblem.steps.length === 1;

    if (stepInput) {
        stepInput.value = '';
        stepInput.disabled = false;
    }
    if (finalInput) {
        finalInput.value = '';
        finalInput.disabled = false;
    }

    if (isSingleStep && finalInput) {
        finalInput.focus();
    } else if (stepInput) {
        stepInput.focus();
    }

    const err = document.getElementById('fractions-step-error');
    if (err) err.classList.add('hidden');

    updateHintText();
}

function renderMath() {
    const display = document.getElementById('fractions-math-display');
    if (!display) return;
    ViewTransitions.update(display, 'frac_eq_', () => {
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
            const resTex = getStepResultTex(step);
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
    const hintContent = document.getElementById('fractions-hint-content');
    if (!hintContent) return;
    hintContent.replaceChildren();

    if (currentStepIndex >= currentProblem.steps.length) {
        const p = document.createElement('p');
        p.className = 'text-green-600 font-semibold';
        p.textContent = 'Great job! You solved it!';
        hintContent.appendChild(p);
        return;
    }

    const step = currentProblem.steps[currentStepIndex];
    const stepBadge = document.createElement('p');
    stepBadge.className = 'font-bold text-indigo-900';
    stepBadge.textContent = `Step ${currentStepIndex + 1} of ${currentProblem.steps.length}`;

    const promptP = document.createElement('p');
    promptP.className = 'mt-1 text-indigo-700';

    if (step.type === 'categorize') {
        promptP.textContent = 'Is this fraction proper or improper?';
    } else if (step.type === 'convert_mixed') {
        promptP.textContent = 'Convert this improper fraction to a mixed number (e.g. 1 1/4).';
    } else if (step.type === 'find_lcm') {
        promptP.textContent = 'Find the Least Common Multiple (LCM).';
    } else if (step.type === 'find_gcd') {
        promptP.textContent = 'Find the Greatest Common Factor (GCF).';
    } else if (step.type === 'simplify_concept') {
        promptP.textContent = 'Simplify the fraction by dividing top and bottom by their greatest common factor.';
    } else if (step.type === 'find_lcd') {
        promptP.textContent = 'Find the Least Common Denominator (LCD).';
    } else if (step.type === 'convert') {
        promptP.textContent = `Convert both fractions to have the LCD of ${step.lcd}.`;
    } else if (step.type === 'operate') {
        promptP.textContent = 'Add or subtract the numerators and keep the denominator.';
    } else if (step.type === 'kcf') {
        promptP.textContent = 'Keep the first fraction, Change division to multiplication, Flip the second fraction.';
    } else if (step.type === 'multiply') {
        promptP.textContent = 'Multiply straight across.';
    } else if (step.type === 'simplify') {
        promptP.textContent = 'Simplify the fraction to its lowest terms.';
    }

    hintContent.appendChild(stepBadge);
    hintContent.appendChild(promptP);
}

function normalizeAnswer(str) {
    return (str || '').trim().replace(/\s+/g, '').toLowerCase();
}

function completeProblemInputs() {
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
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;

    const val = normalizeAnswer(e.target.value);
    const step = currentProblem.steps[currentStepIndex];
    const expected = normalizeAnswer(step.expectedInput);

    if (val === expected) {
        document.getElementById('fractions-step-error').classList.add('hidden');
        hideVisualExplanation();

        appendStepToHistoryTex(step);
        e.target.value = '';
        currentStepIndex++;

        renderMath();
        renderStepsList();
        updateHintText();

        if (currentStepIndex >= currentProblem.steps.length) {
            completeProblemInputs();
        } else if (currentStepIndex === currentProblem.steps.length - 1) {
            const finalInput = document.getElementById('fractions-final-input');
            if (finalInput) finalInput.focus();
        }
    } else {
        const err = document.getElementById('fractions-step-error');
        err.textContent = 'Incorrect partial step, try again or press Tab for a step-by-step hint.';
        err.classList.remove('hidden');
    }
}

function handleFinalInput(e) {
    if (e.key !== 'Enter') return;
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;

    const val = normalizeAnswer(e.target.value);
    const finalStep = currentProblem.steps[currentProblem.steps.length - 1];
    const expectedFinal = normalizeAnswer(finalStep.expectedInput);

    if (val === expectedFinal) {
        document.getElementById('fractions-step-error').classList.add('hidden');
        hideVisualExplanation();

        for (let i = currentStepIndex; i < currentProblem.steps.length; i++) {
            appendStepToHistoryTex(currentProblem.steps[i]);
        }
        currentStepIndex = currentProblem.steps.length;

        renderMath();
        renderStepsList();
        updateHintText();
        completeProblemInputs();
    } else {
        const err = document.getElementById('fractions-step-error');
        err.textContent = 'Incorrect final answer. Try working out the partial steps on the left, or press Tab for a hint.';
        err.classList.remove('hidden');
    }
}
