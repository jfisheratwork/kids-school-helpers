import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';
import { attachFractionsHintListener, hideVisualExplanation } from './hints-player.js';

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

export function generateProblemFromConfig() {
    const topic = document.getElementById('config-topic').value;
    const type = document.getElementById('config-fraction-type').value;

    switch(topic) {
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
    if (window.MathRenderer) {
        window.MathRenderer.renderBlock(historyTex, display);
    } else if (window.katex) {
        katex.render(historyTex, display, { throwOnError: false, displayMode: true });
    } else {
        display.innerHTML = `$$${historyTex}$$`;
    }
}

function updateHintText() {
    const hintContent = document.getElementById('fractions-hint-content');
    if (currentStepIndex >= currentProblem.steps.length) {
        hintContent.innerHTML = `Great job! You solved it!`;
        return;
    }
    
    const step = currentProblem.steps[currentStepIndex];
    if (step.type === 'categorize') {
        hintContent.innerHTML = `Is this fraction proper or improper?`;
    } else if (step.type === 'convert_mixed') {
        hintContent.innerHTML = `Convert this improper fraction to a mixed number (e.g. 1 1/4).`;
    } else if (step.type === 'find_lcm') {
        hintContent.innerHTML = `Find the Least Common Multiple (LCM).`;
    } else if (step.type === 'find_gcd') {
        hintContent.innerHTML = `Find the Greatest Common Factor (GCF).`;
    } else if (step.type === 'simplify_concept') {
        hintContent.innerHTML = `Simplify the fraction by dividing top and bottom by their greatest common factor.`;
    } else if (step.type === 'find_lcd') {
        hintContent.innerHTML = `Find the Least Common Denominator (LCD).`;
    } else if (step.type === 'convert') {
        hintContent.innerHTML = `Convert both fractions to have the LCD of ${step.lcd}.`;
    } else if (step.type === 'operate') {
        hintContent.innerHTML = `Add or subtract the numerators and keep the denominator.`;
    } else if (step.type === 'kcf') {
        hintContent.innerHTML = `Keep the first fraction, Change division to multiplication, Flip the second fraction.`;
    } else if (step.type === 'multiply') {
        hintContent.innerHTML = `Multiply straight across.`;
    } else if (step.type === 'simplify') {
        hintContent.innerHTML = `Simplify the fraction to its lowest terms.`;
    }
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim().replace(/\s+/g, '');
        const expected = currentProblem.steps[currentStepIndex].expectedInput.replace(/\s+/g, '');
        
        // For mixed numbers, students might type space, but we stripped spaces.
        // The expected string has spaces stripped too, so it should match `11/4`.
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
            err.textContent = "Incorrect, try again or press Tab for a hint.";
            err.classList.remove('hidden');
        }
    }
}
