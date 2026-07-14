import { generateLongDivisionProblem } from './generator-long-division.js';
import { playNextHint, resetHintPlayer } from './hints-player-long-division.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initLongDivisionSolver() {
    const btnGenerate = document.getElementById('btn-generate-long-division');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', handleGenerate);
    }
    
    // Global key listener for the interactive solver
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('mode-long-division-container').classList.contains('hidden')) return;
        
        // Tab for hint
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextHint(currentProblem, currentStepIndex);
        }
    });

    const stepInput = document.getElementById('long-division-step-input');
    if (stepInput) {
        stepInput.addEventListener('keydown', handleInput);
    }
}

function handleGenerate() {
    const topDigits = document.getElementById('config-top-digits').value; // Dividend digits
    const bottomDigits = document.getElementById('config-bottom-digits').value; // Divisor digits
    
    // Using existing config selects, but repurposing them: top=dividend, bottom=divisor
    currentProblem = generateLongDivisionProblem(parseInt(topDigits), parseInt(bottomDigits), '0');
    currentStepIndex = 0;
    
    resetHintPlayer();
    renderGrid();
    setupCurrentStep();
}

function renderGrid() {
    const container = document.getElementById('long-division-math-grid');
    if (!container) return;

    const divStr = currentProblem.dividendStr;
    const colCount = divStr.length + 1; // +1 for divisor
    
    // We don't know exactly how many rows yet because of skips, but we can dynamically append rows
    // as steps progress, or render them all hidden. Rendering them all hidden is easier.
    
    let html = `<table class="font-mono text-3xl mx-auto border-collapse" style="border-spacing: 0;"><tbody>`;
    
    // Row 0: Quotient
    html += `<tr id="quotient-row">`;
    html += `<td class="p-2 w-12"></td>`; // above divisor
    for (let i = 0; i < divStr.length; i++) {
        html += `<td class="p-2 text-center w-12 text-blue-600 font-bold" id="quotient-cell-${i}"></td>`;
    }
    html += `</tr>`;
    
    // Row 1: Divisor & Dividend
    html += `<tr id="dividend-row">`;
    html += `<td class="p-2 text-right w-12 font-bold pr-3">${currentProblem.divisor}</td>`;
    for (let i = 0; i < divStr.length; i++) {
        let borderClass = i === 0 ? 'border-t-2 border-l-2 border-gray-800' : 'border-t-2 border-gray-800';
        html += `<td class="p-2 text-center w-12 font-bold ${borderClass}" id="dividend-cell-${i}">${divStr[i]}</td>`;
    }
    html += `</tr>`;
    
    // Prepare rows for work (subtractions and bring downs)
    let cycle = 0;
    for (let i = 0; i < currentProblem.steps.length; i++) {
        if (currentProblem.steps[i].type === 'subtract_down') {
            html += `<tr id="work-sub-${cycle}" style="display: none;">`;
            html += `<td class="p-2 w-12 text-right">-</td>`;
            for (let c = 0; c < divStr.length; c++) {
                html += `<td class="p-2 text-center w-12 text-red-500 font-bold border-b-2 border-gray-400" id="work-sub-cell-${cycle}-${c}"></td>`;
            }
            html += `</tr>`;
            
            html += `<tr id="work-rem-${cycle}" style="display: none;">`;
            html += `<td class="p-2 w-12"></td>`;
            for (let c = 0; c < divStr.length; c++) {
                html += `<td class="p-2 text-center w-12 font-bold" id="work-rem-cell-${cycle}-${c}"></td>`;
            }
            html += `</tr>`;
            
            cycle++;
        }
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function setupCurrentStep() {
    const input = document.getElementById('long-division-step-input');
    const error = document.getElementById('long-division-step-error');
    input.value = '';
    error.classList.add('hidden');

    processAutoSteps();
    
    if (currentStepIndex >= currentProblem.steps.length) {
        input.disabled = true;
        input.value = "Done!";
        updateHint();
        return;
    }

    input.disabled = false;
    input.focus();
    updateHint();
}

function processAutoSteps() {
    let step = currentProblem.steps[currentStepIndex];
    while(step && step.isSkip) {
        // Skip over steps that have no expected input, e.g. leading 0s
        if (step.type === 'divide_digit' && document.getElementById(`quotient-cell-${step.dividendIndex}`)) {
            // we could choose to not print leading 0, or print it. We'll leave blank.
        }
        currentStepIndex++;
        step = currentProblem.steps[currentStepIndex];
    }
}

function getCycleForStep(index) {
    let cycle = 0;
    for (let i = 0; i < index; i++) {
        if (currentProblem.steps[i].type === 'subtract_down') cycle++;
    }
    return cycle;
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        const step = currentProblem.steps[currentStepIndex];
        if (!step) return;

        if (val === step.expectedInput) {
            // Correct!
            document.getElementById('long-division-step-error').classList.add('hidden');
            renderStepResult(step);
            
            currentStepIndex++;
            setupCurrentStep();
            resetHintPlayer();
        } else {
            // Incorrect
            const errorDiv = document.getElementById('long-division-step-error');
            errorDiv.textContent = "Not quite right. Press Tab for a hint!";
            errorDiv.classList.remove('hidden');
            e.target.select();
        }
    }
}

function renderStepResult(step) {
    let cycle = getCycleForStep(currentStepIndex);
    
    if (step.type === 'divide_digit') {
        document.getElementById(`quotient-cell-${step.dividendIndex}`).innerText = step.qDigit;
    } else if (step.type === 'multiply_back') {
        document.getElementById(`work-sub-${cycle}`).style.display = 'table-row';
        let multStr = step.multBack.toString();
        for(let k=0; k<multStr.length; k++) {
            let offset = multStr.length - 1 - k;
            let cellIdx = step.dividendIndex - offset;
            let cell = document.getElementById(`work-sub-cell-${cycle}-${cellIdx}`);
            if(cell) cell.innerText = multStr[k];
        }
    } else if (step.type === 'subtract_down') {
        document.getElementById(`work-rem-${cycle}`).style.display = 'table-row';
        let remStr = step.remainder.toString();
        for(let k=0; k<remStr.length; k++) {
            let offset = remStr.length - 1 - k;
            let cellIdx = step.dividendIndex - offset;
            let cell = document.getElementById(`work-rem-cell-${cycle}-${cellIdx}`);
            if(cell) cell.innerText = remStr[k];
        }
    } else if (step.type === 'bring_down') {
        // cycle is actually the previous one, because subtract_down incremented it for future steps, 
        // wait, getCycleForStep counts previous subtract_downs. Since this is AFTER subtract_down, cycle is cycle.
        // Actually, subtract_down is in the past, so getCycleForStep returns the current cycle block.
        // Let's use cycle-1 because subtract_down incremented the visual block logically.
        let prevCycle = cycle - 1; 
        let cell = document.getElementById(`work-rem-cell-${prevCycle}-${step.dividendIndex}`);
        if(cell) {
            cell.innerText = step.nextDigit;
            cell.classList.add('text-blue-500'); 
        }
    }
}

function updateHint() {
    const step = currentProblem.steps[currentStepIndex];
    const hintDiv = document.getElementById('long-division-hint-content');

    if (!step) {
        hintDiv.innerHTML = `Great job! You solved it!`;
        return;
    }

    if (step.type === 'divide_digit') {
        hintDiv.innerHTML = `Divide ${step.workingNum} by ${step.divisor}. How many times does it go in? Type the quotient digit above.`;
    } else if (step.type === 'multiply_back') {
        hintDiv.innerHTML = `Multiply the digit you just wrote (${step.qDigit}) by the divisor (${step.divisor}). Type the result below.`;
    } else if (step.type === 'subtract_down') {
        hintDiv.innerHTML = `Subtract ${step.multBack} from ${step.workingNum}. Type the remainder.`;
    } else if (step.type === 'bring_down') {
        hintDiv.innerHTML = `Bring down the next digit of the dividend. Type the digit to bring down.`;
    }
}
