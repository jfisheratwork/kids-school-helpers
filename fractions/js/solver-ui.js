import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';
import { attachFractionsHintListener, hideVisualExplanation } from './hints-player.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;
let historyTex = '';

export function initFractionsSolver() {
    const btnGenerate = document.getElementById('btn-generate-fractions');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }

    const input = document.getElementById('fractions-step-input');
    if (input) {
        input.addEventListener('keydown', handleInput);
        attachFractionsHintListener(input, () => currentProblem, () => currentStepIndex);
    }
}

export function generateProblemFromConfig() {
    const topic = document.getElementById('config-topic').value;
    const type = document.getElementById('config-fraction-type').value;

    switch (topic) {
        case 'concepts':
            return generateConceptsProblem();
        case 'addsub':
            return generateAddSubProblem(type);
        case 'multiply':
            return generateMultProblem(type);
        case 'divide':
            return generateDivProblem(type);
        default:
            return generateAddSubProblem(type);
    }
}

function startNewProblem() {
    hideVisualExplanation();

    currentProblem = generateProblemFromConfig();
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;

    renderMath();

    const input = document.getElementById('fractions-step-input');
    input.value = '';
    input.focus();
    input.disabled = false;

    document.getElementById('fractions-step-error').classList.add('hidden');

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

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim().replace(/\s+/g, '');
        const expected = currentProblem.steps[currentStepIndex].expectedInput.replace(/\s+/g, '');

        if (val.toLowerCase() === expected.toLowerCase()) {
            document.getElementById('fractions-step-error').classList.add('hidden');
            hideVisualExplanation();

            const step = currentProblem.steps[currentStepIndex];

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
                historyTex = historyTex.replace(/ \\quad \(\\text\{LCD: \}.*?\)/, '');
                historyTex += ` = ${step.tex}`;
            }

            renderMath();

            e.target.value = '';
            currentStepIndex++;

            if (currentStepIndex >= currentProblem.steps.length) {
                updateHintText();
                e.target.disabled = true;
            } else {
                updateHintText();
            }
        } else {
            const err = document.getElementById('fractions-step-error');
            err.textContent = 'Incorrect, try again or press Tab for a hint.';
            err.classList.remove('hidden');
        }
    }
}
