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

    const input = document.getElementById('fractions-step-input');
    if (input) {
        input.addEventListener('keydown', handleInput);
        attachFractionsHintListener(input, () => currentProblem, () => currentStepIndex);
    }
}

function startNewProblem() {
    const typeSelect = document.getElementById('config-fraction-type');
    const type = typeSelect ? typeSelect.value : 'proper';
    currentProblem = generateFractionDivisionProblem(type);
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;
    hideFractionsDivisionAnimation();

    renderMath();

    const input = document.getElementById('fractions-step-input');
    if (input) {
        input.value = '';
        input.focus();
        input.disabled = false;
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

function handleInput(e) {
    if (e.key === 'Enter') {
        if (!currentProblem || !currentProblem.steps[currentStepIndex]) return;
        const val = e.target.value.trim().replace(/\s+/g, '');
        const currentStep = currentProblem.steps[currentStepIndex];
        const isMatch = val === currentStep.expectedInput || (currentStep.altExpected && val === currentStep.altExpected);

        if (isMatch) {
            const err = document.getElementById('fractions-step-error');
            if (err) err.classList.add('hidden');
            hideFractionsDivisionAnimation();

            historyTex += ` = ${currentStep.tex.replace('\\text{Simplify: } ', '')}`;
            renderMath();

            e.target.value = '';
            currentStepIndex++;

            const hintBox = document.getElementById('fractions-hint-content');
            if (currentStepIndex >= currentProblem.steps.length) {
                if (hintBox) hintBox.textContent = 'Great job! You solved it!';
                e.target.disabled = true;
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
                err.textContent = 'Incorrect, try again or press Tab for a hint.';
                err.classList.remove('hidden');
            }
        }
    }
}
