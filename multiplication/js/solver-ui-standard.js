import { generateStandardProblem } from './generator-standard.js';
import { attachHintListener, hideStandardAnimation } from './hints-player-standard.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initStandardSolver() {
    const btnGenerate = document.getElementById('btn-generate-standard');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', startNewProblem);
    }

    const input = document.getElementById('standard-step-input');
    if (input) {
        input.addEventListener('keydown', handleInput);
        attachHintListener(input, () => currentProblem, () => currentStepIndex);
    }
}

function startNewProblem() {
    const topDigits = parseInt(document.getElementById('config-top-digits').value, 10);
    const bottomDigits = parseInt(document.getElementById('config-bottom-digits').value, 10);
    const decimalConfig = document.getElementById('config-decimals').value;

    currentProblem = generateStandardProblem(topDigits, bottomDigits, decimalConfig);
    currentStepIndex = 0;
    hideStandardAnimation();

    ViewTransitions.update(document.getElementById('standard-math-grid'), 'mult_', () => {
        renderGrid();
        processAutoSteps();
        updateHint();
    });

    const input = document.getElementById('standard-step-input');
    input.value = '';
    input.disabled = false;
    input.focus();

    document.getElementById('standard-step-error').classList.add('hidden');
}

function renderGrid() {
    const gridContainer = document.getElementById('standard-math-grid');
    gridContainer.replaceChildren();

    const totalCols = currentProblem.gridCols + 1;

    const table = document.createElement('table');
    table.className = 'border-collapse mx-auto';
    table.style.tableLayout = 'fixed';
    const tbody = document.createElement('tbody');

    // Carries row
    const carryTr = document.createElement('tr');
    for (let i = 1; i <= totalCols; i++) {
        const td = document.createElement('td');
        td.className = 'p-0 pb-1 align-bottom h-10 w-8';
        td.id = `carry-col-${i}`;
        const inner = document.createElement('div');
        inner.className = 'flex flex-col-reverse items-center justify-start h-full gap-0';
        td.appendChild(inner);
        carryTr.appendChild(td);
    }
    tbody.appendChild(carryTr);

    // Top Number
    const topTr = document.createElement('tr');
    const topStartCol = totalCols - currentProblem.topStr.length + 1;
    for (let i = 1; i <= totalCols; i++) {
        const td = document.createElement('td');
        td.id = `top-digit-${i}`;
        td.className = 'p-0 text-center align-middle h-10 w-8 text-2xl';
        if (i >= topStartCol && i < topStartCol + currentProblem.topStr.length) {
            const idx = i - topStartCol;
            let text = currentProblem.topStr[idx];
            if (currentProblem.decTop > 0 && idx === currentProblem.topStr.length - currentProblem.decTop - 1) {
                text += '.';
            }
            td.textContent = text;
        }
        topTr.appendChild(td);
    }
    tbody.appendChild(topTr);

    // Bottom Number
    const bottomTr = document.createElement('tr');
    const bottomStartCol = totalCols - currentProblem.bottomStr.length + 1;
    let signCol = Math.min(topStartCol, bottomStartCol) - 1;
    if (signCol < 1) signCol = 1;
    const borderStartCol = Math.min(topStartCol, bottomStartCol);

    for (let i = 1; i <= totalCols; i++) {
        const borderClass = (i >= borderStartCol) ? 'border-b-2 border-gray-700' : '';
        const td = document.createElement('td');
        td.className = `p-0 text-center align-middle h-10 w-8 text-2xl ${borderClass}`.trim();

        if (i === signCol) {
            td.textContent = '×';
        } else if (i >= bottomStartCol && i < bottomStartCol + currentProblem.bottomStr.length) {
            td.id = `bottom-digit-${i}`;
            const idx = i - bottomStartCol;
            let text = currentProblem.bottomStr[idx];
            if (currentProblem.decBottom > 0 && idx === currentProblem.bottomStr.length - currentProblem.decBottom - 1) {
                text += '.';
            }
            td.textContent = text;
        } else {
            td.id = `bottom-digit-${i}`;
        }
        bottomTr.appendChild(td);
    }
    tbody.appendChild(bottomTr);

    // Empty containers for partial products
    for (let rowIdx = 0; rowIdx < currentProblem.bottomStr.length; rowIdx++) {
        const ppTr = document.createElement('tr');
        ppTr.id = `pp-row-${rowIdx}`;
        for (let c = 1; c <= totalCols; c++) {
            const td = document.createElement('td');
            td.className = 'p-0 text-center align-middle h-10 w-8 text-xl text-blue-600 font-medium';
            td.id = `pp-cell-${rowIdx}-${c}`;
            ppTr.appendChild(td);
        }
        tbody.appendChild(ppTr);
    }

    if (currentProblem.bottomStr.length > 1) {
        const addCarryTr = document.createElement('tr');
        addCarryTr.id = 'add-carry-row';
        for (let c = 1; c <= totalCols; c++) {
            const td = document.createElement('td');
            td.className = 'p-0 text-center align-bottom h-4 w-8 text-xs text-red-500 font-bold';
            td.id = `add-carry-cell-${c}`;
            addCarryTr.appendChild(td);
        }
        tbody.appendChild(addCarryTr);
    }

    // Final sum containers
    const finalTr = document.createElement('tr');
    finalTr.id = 'final-row';
    finalTr.style.display = 'none';
    for (let c = 1; c <= totalCols; c++) {
        const td = document.createElement('td');
        td.className = 'p-0 text-center align-middle h-10 w-8 text-2xl text-green-600 font-bold border-t-2 border-gray-700';
        td.id = `final-cell-${c}`;
        finalTr.appendChild(td);
    }
    tbody.appendChild(finalTr);

    table.appendChild(tbody);
    gridContainer.appendChild(table);
}

function processAutoSteps() {
    let step = currentProblem.steps[currentStepIndex];
    while (step && step.type === 'strike_carries') {
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
        hintDiv.textContent = 'Great job! You solved it!';
        return;
    }

    if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
        hintDiv.textContent = step.type === 'multiply_digit_last'
            ? `Multiply ${step.bDigit} × ${step.tDigit}${step.carryIn ? ` and add the carry ${step.carryIn}` : ''}. Type the full result below.`
            : `Multiply ${step.bDigit} × ${step.tDigit}${step.carryIn ? ` and add the carry ${step.carryIn}` : ''}. Type the ones digit below.`;
    } else if (step.type === 'add_placeholder') {
        hintDiv.textContent = 'Moving to the next row. We need a zero placeholder! Type 0.';
    } else if (step.type === 'final_add_digit') {
        hintDiv.textContent = `Add the column${step.carryIn > 0 ? ` including the carry of ${step.carryIn}` : ''}. Type the ones digit below.`;
    } else if (step.type === 'place_decimal') {
        hintDiv.textContent = `Now place the decimal! There are ${step.decCount} decimal places total in the problem. Type the final answer with the decimal point.`;
    }
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const val = e.target.value.trim();
        const step = currentProblem.steps[currentStepIndex];
        if (!step) return;

        if (val === step.expectedInput) {
            document.getElementById('standard-step-error').classList.add('hidden');
            e.target.value = '';
            hideStandardAnimation();

            const gridContainer = document.getElementById('standard-math-grid');

            ViewTransitions.update(gridContainer, 'mult_', () => {
                if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
                    if (step.type === 'multiply_digit_last') {
                        const resStr = step.fullResult;
                        let targetCol = step.targetCol + 1;
                        for (let i = resStr.length - 1; i >= 0; i--) {
                            const cell = document.getElementById(`pp-cell-${step.rowIndex}-${targetCol}`);
                            if (cell) cell.textContent = resStr[i];
                            targetCol--;
                        }
                    } else {
                        const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol + 1}`);
                        if (cell) cell.textContent = step.resultDigit;

                        if (step.carryOut > 0 && step.carryCol) {
                            const carryContainer = document.getElementById(`carry-col-${step.carryCol + 1}`);
                            if (carryContainer) {
                                const carrySpan = document.createElement('span');
                                carrySpan.className = 'carry-digit carry-active carry-animate font-bold';
                                carrySpan.textContent = step.carryOut;
                                carryContainer.appendChild(carrySpan);
                            }
                        }
                    }
                } else if (step.type === 'add_placeholder') {
                    const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol + 1}`);
                    if (cell) {
                        const span = document.createElement('span');
                        span.className = 'placeholder-animate';
                        span.textContent = step.expectedInput;
                        cell.replaceChildren(span);
                    }
                } else if (step.type === 'final_add_digit') {
                    document.getElementById('final-row').style.display = 'table-row';
                    const cell = document.getElementById(`final-cell-${step.targetCol + 1}`);
                    if (cell) cell.textContent = step.resultDigit;

                    if (step.carryOut > 0 && step.carryCol) {
                        const carryCell = document.getElementById(`add-carry-cell-${step.carryCol + 1}`);
                        if (carryCell) {
                            carryCell.textContent = step.carryOut;
                            carryCell.classList.add('carry-animate');
                        }
                    }
                } else if (step.type === 'place_decimal') {
                    if (step.isSingleRow) {
                        const cell = document.getElementById(`pp-cell-0-${step.targetCol + 1}`);
                        if (cell) cell.textContent += '.';
                    } else {
                        const cell = document.getElementById(`final-cell-${step.targetCol + 1}`);
                        if (cell) cell.textContent += '.';
                    }
                }

                currentStepIndex++;
                processAutoSteps();
                updateHint();

                if (currentStepIndex >= currentProblem.steps.length) {
                    e.target.disabled = true;
                }
            });
        } else {
            const err = document.getElementById('standard-step-error');
            err.textContent = 'Incorrect, try again or press Tab for a hint.';
            err.classList.remove('hidden');
        }
    }
}

function highlightActiveDigits(step) {
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
