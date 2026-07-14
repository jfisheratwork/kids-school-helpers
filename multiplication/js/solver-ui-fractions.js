import { generateFractionProblem } from './generator-fractions.js';
import { attachFractionsHintListener, playNextFractionsHint } from './hints-player-fractions.js';

let currentProblem = null;
let currentStepIndex = 0;
let historyTex = "";

export function initFractionsSolver() {
    const btnGenerate = document.getElementById('btn-generate-fractions');
    if(btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }
    
    const input = document.getElementById('fractions-step-input');
    if(input) {
        input.addEventListener('keydown', handleInput);
        attachFractionsHintListener(input, () => currentProblem, () => currentStepIndex);
    }
}

function startNewProblem() {
    const type = document.getElementById('config-fraction-type').value;
    currentProblem = generateFractionProblem(type);
    currentStepIndex = 0;
    historyTex = currentProblem.texInitial;

    renderMath();
    
    const input = document.getElementById('fractions-step-input');
    input.value = '';
    input.focus();
    input.disabled = false;
    
    document.getElementById('fractions-step-error').classList.add('hidden');
    document.getElementById('fractions-hint-content').innerHTML = `Step 1: Multiply numerator by numerator, and denominator by denominator. Enter format like '3/4'.`;
}

function renderMath() {
    const display = document.getElementById('fractions-math-display');
    if (window.katex) {
        katex.render(historyTex, display, { throwOnError: false, displayMode: true });
    } else {
        display.innerHTML = `$$${historyTex}$$`;
    }
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim().replace(/\s+/g, '');
        const expected = currentProblem.steps[currentStepIndex].expectedInput;
        
        if (val === expected) {
            document.getElementById('fractions-step-error').classList.add('hidden');
            
            // Add to history
            historyTex += ` = ${currentProblem.steps[currentStepIndex].tex.replace('\\text{Simplify: } ', '')}`;
            renderMath();

            e.target.value = '';
            currentStepIndex++;
            
            if (currentStepIndex >= currentProblem.steps.length) {
                document.getElementById('fractions-hint-content').innerHTML = `Great job! You solved it!`;
                e.target.disabled = true;
            } else {
                document.getElementById('fractions-hint-content').innerHTML = `Next Step: Simplify the fraction to its lowest terms.`;
            }
        } else {
            const err = document.getElementById('fractions-step-error');
            err.textContent = "Incorrect, try again or press Tab for a hint.";
            err.classList.remove('hidden');
        }
    }
}
