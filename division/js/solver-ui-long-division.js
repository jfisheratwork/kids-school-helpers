import { generateLongDivisionProblem } from './generator-long-division.js';
import { playNextHint, resetHintPlayer } from './hints-player-long-division.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initLongDivisionSolver() {
    const btnGenerate = document.getElementById('btn-generate-long-division');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', handleGenerate);
    }

    document.addEventListener('keydown', (e) => {
        const container = document.getElementById('mode-long-division-container');
        if (!container || container.classList.contains('hidden')) return;

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
    const topDigits = document.getElementById('config-top-digits').value;
    const bottomDigits = document.getElementById('config-bottom-digits').value;

    currentProblem = generateLongDivisionProblem(parseInt(topDigits, 10), parseInt(bottomDigits, 10), '0');
    currentStepIndex = 0;

    resetHintPlayer();

    ViewTransitions.update(document.getElementById('long-division-math-grid'), 'div_', () => {
        renderGrid();
        setupCurrentStep();
    });
}

function renderGrid() {
    const container = document.getElementById('long-division-math-grid');
    if (!container) return;
    container.replaceChildren();

    const divStr = currentProblem.dividendStr;

    const table = document.createElement('table');
    table.className = 'font-mono text-3xl mx-auto border-collapse';
    table.style.borderSpacing = '0';
    const tbody = document.createElement('tbody');

    // Row 0: Quotient
    const qRow = document.createElement('tr');
    qRow.id = 'quotient-row';
    const emptyAboveDivisor = document.createElement('td');
    emptyAboveDivisor.className = 'p-2 w-12';
    qRow.appendChild(emptyAboveDivisor);

    for (let i = 0; i < divStr.length; i++) {
        const td = document.createElement('td');
        td.className = 'p-2 text-center w-12 text-blue-600 font-bold';
        td.id = `quotient-cell-${i}`;
        qRow.appendChild(td);
    }
    tbody.appendChild(qRow);

    // Row 1: Divisor & Dividend
    const divRow = document.createElement('tr');
    divRow.id = 'dividend-row';
    const divisorTd = document.createElement('td');
    divisorTd.className = 'p-2 text-right w-12 font-bold pr-3';
    divisorTd.textContent = String(currentProblem.divisor);
    divRow.appendChild(divisorTd);

    for (let i = 0; i < divStr.length; i++) {
        const borderClass = i === 0 ? 'border-t-2 border-l-2 border-gray-800' : 'border-t-2 border-gray-800';
        const td = document.createElement('td');
        td.className = `p-2 text-center w-12 font-bold ${borderClass}`;
        td.id = `dividend-cell-${i}`;
        td.textContent = divStr[i];
        divRow.appendChild(td);
    }
    tbody.appendChild(divRow);

    // Prepare rows for work (subtractions and bring downs)
    let cycle = 0;
    for (let i = 0; i < currentProblem.steps.length; i++) {
        if (currentProblem.steps[i].type === 'subtract_down') {
            const subRow = document.createElement('tr');
            subRow.id = `work-sub-${cycle}`;
            subRow.style.display = 'none';
            const minusTd = document.createElement('td');
            minusTd.className = 'p-2 w-12 text-right';
            minusTd.textContent = '-';
            subRow.appendChild(minusTd);

            for (let c = 0; c < divStr.length; c++) {
                const td = document.createElement('td');
                td.className = 'p-2 text-center w-12 text-red-500 font-bold border-b-2 border-gray-400';
                td.id = `work-sub-cell-${cycle}-${c}`;
                subRow.appendChild(td);
            }
            tbody.appendChild(subRow);

            const remRow = document.createElement('tr');
            remRow.id = `work-rem-${cycle}`;
            remRow.style.display = 'none';
            const blankTd = document.createElement('td');
            blankTd.className = 'p-2 w-12';
            remRow.appendChild(blankTd);

            for (let c = 0; c < divStr.length; c++) {
                const td = document.createElement('td');
                td.className = 'p-2 text-center w-12 font-bold';
                td.id = `work-rem-cell-${cycle}-${c}`;
                remRow.appendChild(td);
            }
            tbody.appendChild(remRow);

            cycle++;
        }
    }

    table.appendChild(tbody);
    container.appendChild(table);
}

function setupCurrentStep() {
    const input = document.getElementById('long-division-step-input');
    const error = document.getElementById('long-division-step-error');
    input.value = '';
    error.classList.add('hidden');

    processAutoSteps();

    if (currentStepIndex >= currentProblem.steps.length) {
        input.disabled = true;
        input.value = 'Done!';
        updateHint();
        return;
    }

    input.disabled = false;
    input.focus();
    updateHint();
}

function processAutoSteps() {
    let step = currentProblem.steps[currentStepIndex];
    while (step && step.isSkip) {
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
            document.getElementById('long-division-step-error').classList.add('hidden');
            e.target.value = '';
            resetHintPlayer();

            ViewTransitions.update(document.getElementById('long-division-math-grid'), 'div_', () => {
                renderStepResult(step);

                currentStepIndex++;
                setupCurrentStep();
            });
        } else {
            const errorDiv = document.getElementById('long-division-step-error');
            errorDiv.textContent = 'Not quite right. Press Tab for a hint!';
            errorDiv.classList.remove('hidden');
            e.target.select();
        }
    }
}

function renderStepResult(step) {
    const cycle = getCycleForStep(currentStepIndex);

    if (step.type === 'divide_digit') {
        const cell = document.getElementById(`quotient-cell-${step.dividendIndex}`);
        if (cell) cell.textContent = String(step.qDigit);
    } else if (step.type === 'multiply_back') {
        const row = document.getElementById(`work-sub-${cycle}`);
        if (row) row.style.display = 'table-row';
        const multStr = step.multBack.toString();
        for (let k = 0; k < multStr.length; k++) {
            const offset = multStr.length - 1 - k;
            const cellIdx = step.dividendIndex - offset;
            const cell = document.getElementById(`work-sub-cell-${cycle}-${cellIdx}`);
            if (cell) cell.textContent = multStr[k];
        }
    } else if (step.type === 'subtract_down') {
        const row = document.getElementById(`work-rem-${cycle}`);
        if (row) row.style.display = 'table-row';
        const remStr = step.remainder.toString();
        for (let k = 0; k < remStr.length; k++) {
            const offset = remStr.length - 1 - k;
            const cellIdx = step.dividendIndex - offset;
            const cell = document.getElementById(`work-rem-cell-${cycle}-${cellIdx}`);
            if (cell) cell.textContent = remStr[k];
        }
    } else if (step.type === 'bring_down') {
        const prevCycle = cycle - 1;
        const cell = document.getElementById(`work-rem-cell-${prevCycle}-${step.dividendIndex}`);
        if (cell) {
            cell.textContent = step.nextDigit;
            cell.classList.add('text-blue-500');
        }
    }
}

function updateHint() {
    const step = currentProblem.steps[currentStepIndex];
    const hintDiv = document.getElementById('long-division-hint-content');
    if (!hintDiv) return;

    if (!step) {
        hintDiv.textContent = 'Great job! You solved it!';
        return;
    }

    if (step.type === 'divide_digit') {
        hintDiv.textContent = `Divide ${step.workingNum} by ${step.divisor}. How many times does it go in? Type the quotient digit above.`;
    } else if (step.type === 'multiply_back') {
        hintDiv.textContent = `Multiply the digit you just wrote (${step.qDigit}) by the divisor (${step.divisor}). Type the result below.`;
    } else if (step.type === 'subtract_down') {
        hintDiv.textContent = `Subtract ${step.multBack} from ${step.workingNum}. Type the remainder.`;
    } else if (step.type === 'bring_down') {
        hintDiv.textContent = 'Bring down the next digit of the dividend. Type the digit to bring down.';
    }
}
