// Standard Solver UI

import { generateStandardProblem } from './generator-standard.js';
import { attachHintListener, playNextHint } from './hints-player-standard.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initStandardSolver() {
    const btnGenerate = document.getElementById('btn-generate-standard');
    if(btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }
    
    const input = document.getElementById('standard-step-input');
    if(input) {
        input.addEventListener('keydown', handleInput);
        attachHintListener(input, () => currentProblem, () => currentStepIndex);
    }
}

function startNewProblem() {
    const topDigits = parseInt(document.getElementById('config-top-digits').value);
    const bottomDigits = parseInt(document.getElementById('config-bottom-digits').value);
    const decimalConfig = document.getElementById('config-decimals').value;

    currentProblem = generateStandardProblem(topDigits, bottomDigits, decimalConfig);
    currentStepIndex = 0;

    renderGrid();
    processAutoSteps();
    updateHint();
    
    const input = document.getElementById('standard-step-input');
    input.value = '';
    input.disabled = false;
    input.focus();
    
    document.getElementById('standard-step-error').classList.add('hidden');
}

function renderGrid() {
    const gridContainer = document.getElementById('standard-math-grid');
    gridContainer.innerHTML = '';
    
    const totalCols = currentProblem.gridCols + 1;
    
    // Create Table
    let html = `<table class="border-collapse mx-auto" style="table-layout: fixed;"><tbody>`;

    // Carries row
    html += `<tr>`;
    for(let i=1; i<=totalCols; i++) {
        html += `<td class="p-0 pb-1 align-bottom h-10 w-8" id="carry-col-${i}"><div class="flex flex-col-reverse items-center justify-start h-full gap-0"></div></td>`;
    }
    html += `</tr>`;

    // Top Number
    html += `<tr>`;
    let topStartCol = totalCols - currentProblem.topStr.length + 1;
    for(let i=1; i<=totalCols; i++) {
        if (i >= topStartCol && i < topStartCol + currentProblem.topStr.length) {
            let idx = i - topStartCol;
            let text = currentProblem.topStr[idx];
            if (currentProblem.decTop > 0 && idx === currentProblem.topStr.length - currentProblem.decTop - 1) {
                text += '.';
            }
            html += `<td id="top-digit-${i}" class="p-0 text-center align-middle h-10 w-8 text-2xl">${text}</td>`;
        } else {
            html += `<td id="top-digit-${i}" class="p-0 text-center align-middle h-10 w-8 text-2xl"></td>`;
        }
    }
    html += `</tr>`;

    // Bottom Number
    html += `<tr>`;
    let bottomStartCol = totalCols - currentProblem.bottomStr.length + 1;
    let signCol = Math.min(topStartCol, bottomStartCol) - 1;
    if (signCol < 1) signCol = 1;
    
    let borderStartCol = Math.min(topStartCol, bottomStartCol);

    for(let i=1; i<=totalCols; i++) {
        let borderClass = (i >= borderStartCol) ? "border-b-2 border-gray-700" : "";
        
        if (i === signCol) {
            html += `<td class="p-0 text-center align-middle h-10 w-8 text-2xl ${borderClass}">&times;</td>`;
        } else if (i >= bottomStartCol && i < bottomStartCol + currentProblem.bottomStr.length) {
            let idx = i - bottomStartCol;
            let text = currentProblem.bottomStr[idx];
            if (currentProblem.decBottom > 0 && idx === currentProblem.bottomStr.length - currentProblem.decBottom - 1) {
                text += '.';
            }
            html += `<td id="bottom-digit-${i}" class="p-0 text-center align-middle h-10 w-8 text-2xl ${borderClass}">${text}</td>`;
        } else {
            html += `<td id="bottom-digit-${i}" class="p-0 text-center align-middle h-10 w-8 text-2xl ${borderClass}"></td>`;
        }
    }
    html += `</tr>`;

    // Empty containers for partial products
    for(let rowIdx=0; rowIdx<currentProblem.bottomStr.length; rowIdx++) {
        html += `<tr id="pp-row-${rowIdx}">`;
        for(let c=1; c<=totalCols; c++) {
            html += `<td class="p-0 text-center align-middle h-10 w-8 text-xl text-blue-600 font-medium" id="pp-cell-${rowIdx}-${c}"></td>`;
        }
        html += `</tr>`;
    }

    if (currentProblem.bottomStr.length > 1) {
        // Addition carries row
        html += `<tr id="add-carry-row">`;
        for(let c=1; c<=totalCols; c++) {
            html += `<td class="p-0 text-center align-bottom h-4 w-8 text-xs text-red-500 font-bold" id="add-carry-cell-${c}"></td>`;
        }
        html += `</tr>`;
    }

    // Final sum containers
    html += `<tr id="final-row" style="display: none;">`;
    for(let c=1; c<=totalCols; c++) {
        let extraClass = "border-t-2 border-gray-700";
        html += `<td class="p-0 text-center align-middle h-10 w-8 text-2xl text-green-600 font-bold ${extraClass}" id="final-cell-${c}"></td>`;
    }
    html += `</tr>`;

    html += `</tbody></table>`;
    gridContainer.innerHTML = html;
}

function processAutoSteps() {
    let step = currentProblem.steps[currentStepIndex];
    while(step && step.type === 'strike_carries') {
        document.querySelectorAll('.carry-active').forEach(el => {
            el.classList.remove('carry-active');
            el.classList.add('strike-through', 'text-gray-400');
        });
        currentStepIndex++;
        step = currentProblem.steps[currentStepIndex];
    }
}

function updateHint() {
    const step = currentProblem.steps[currentStepIndex];
    const hintDiv = document.getElementById('standard-hint-content');
    
    highlightActiveDigits(step);
    
    if (!step) {
        hintDiv.innerHTML = `Great job! You solved it!`;
        return;
    }

    if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
        hintDiv.innerHTML = `Multiply ${step.bDigit} &times; ${step.tDigit}${step.carryIn ? ` and add the carry ${step.carryIn}` : ''}. Type the ones digit below.`;
        if (step.type === 'multiply_digit_last') {
            hintDiv.innerHTML = `Multiply ${step.bDigit} &times; ${step.tDigit}${step.carryIn ? ` and add the carry ${step.carryIn}` : ''}. Type the full result below.`;
        }
    } else if (step.type === 'add_placeholder') {
        hintDiv.innerHTML = `Moving to the next row. We need a zero placeholder! Type 0.`;
    } else if (step.type === 'final_add_digit') {
        hintDiv.innerHTML = `Add the column ${step.carryIn > 0 ? `including the carry of ${step.carryIn}` : ''}. Type the ones digit below.`;
    } else if (step.type === 'place_decimal') {
        hintDiv.innerHTML = `Now place the decimal! There are ${step.decCount} decimal places total in the problem. Type the final answer with the decimal point.`;
    }
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        const step = currentProblem.steps[currentStepIndex];
        
        if (val === step.expectedInput) {
            // Correct!
            document.getElementById('standard-step-error').classList.add('hidden');
            
            // Adjust col indices by +1 because we added a column on the left
            if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
                if (step.type === 'multiply_digit_last') {
                    // Populate full result spanning cells
                    let resStr = step.fullResult; 
                    let targetCol = step.targetCol + 1; 
                    for (let i = resStr.length - 1; i >= 0; i--) {
                        const cell = document.getElementById(`pp-cell-${step.rowIndex}-${targetCol}`);
                        if(cell) cell.textContent = resStr[i];
                        targetCol--;
                    }
                } else {
                    const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol + 1}`);
                    if(cell) cell.textContent = step.resultDigit;
                    
                    if (step.carryOut > 0 && step.carryCol) {
                        const carryContainer = document.getElementById(`carry-col-${step.carryCol + 1}`);
                        if(carryContainer) {
                            const carrySpan = document.createElement('span');
                            carrySpan.className = 'carry-digit carry-active carry-animate font-bold';
                            carrySpan.textContent = step.carryOut;
                            carryContainer.appendChild(carrySpan);
                        }
                    }
                }
            } else if (step.type === 'add_placeholder') {
                const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol + 1}`);
                if(cell) cell.innerHTML = `<span class="placeholder-animate">${step.expectedInput}</span>`;
            } else if (step.type === 'final_add_digit') {
                document.getElementById('final-row').style.display = 'table-row';
                const cell = document.getElementById(`final-cell-${step.targetCol + 1}`);
                if(cell) cell.textContent = step.resultDigit;
                
                if (step.carryOut > 0 && step.carryCol) {
                    const carryCell = document.getElementById(`add-carry-cell-${step.carryCol + 1}`);
                    if(carryCell) {
                        carryCell.textContent = step.carryOut;
                        carryCell.classList.add('carry-animate');
                    }
                }
            } else if (step.type === 'place_decimal') {
                if (step.isSingleRow) {
                    // For single row, place the decimal in the first partial product row
                    const cell = document.getElementById(`pp-cell-0-${step.targetCol + 1}`);
                    if(cell) cell.textContent += '.';
                } else {
                    const cell = document.getElementById(`final-cell-${step.targetCol + 1}`);
                    if(cell) cell.textContent += '.';
                }
            }

            e.target.value = '';
            currentStepIndex++;
            processAutoSteps();
            updateHint();
            
            if (currentStepIndex >= currentProblem.steps.length) {
                e.target.disabled = true;
            }
        } else {
            const err = document.getElementById('standard-step-error');
            err.textContent = "Incorrect, try again or press Tab for a hint.";
            err.classList.remove('hidden');
        }
    }
}

function highlightActiveDigits(step) {
    // Clear previous highlights
    document.querySelectorAll('.active-digit-highlight').forEach(el => {
        el.classList.remove('active-digit-highlight', 'bg-orange-200/75', 'rounded-md');
    });
    
    if (!step || (step.type !== 'multiply_digit' && step.type !== 'multiply_digit_last')) return;
    
    const topCell = document.getElementById(`top-digit-${step.topCol + 1}`);
    const bottomCell = document.getElementById(`bottom-digit-${step.bottomCol + 1}`);
    
    if (topCell) {
        topCell.classList.add('active-digit-highlight', 'bg-orange-200/75', 'rounded-md');
    }
    if (bottomCell) {
        bottomCell.classList.add('active-digit-highlight', 'bg-orange-200/75', 'rounded-md');
    }
}
