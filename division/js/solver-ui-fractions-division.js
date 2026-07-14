import { generateFractionDivisionProblem } from './generator-fractions-division.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initFractionsSolver() {
    const btnGenerate = document.getElementById('btn-generate-fractions');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', handleGenerate);
    }
}

function handleGenerate() {
    const type = document.getElementById('fraction-type').value;
    currentProblem = generateFractionDivisionProblem(type);
    currentStepIndex = 0;
    
    renderUI();
}

function renderUI() {
    const container = document.getElementById('fraction-equation-container');
    if (!container) return;
    
    // Simplistic render for now
    let tex = currentProblem.texInitial;
    currentProblem.steps.forEach((step, index) => {
        if (index < currentStepIndex) {
            tex += ` = ${step.tex.replace('\\text{Simplify: } ', '')}`;
        }
    });
    
    if (window.katex) {
        katex.render(tex, container, { throwOnError: false, displayMode: true });
    }
}
