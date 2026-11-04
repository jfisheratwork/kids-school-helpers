import { generateFractionToDecimalProblem, parseCustomFractionToDecimalProblem } from './generator.js';
import { attachF2DHintListener, resetF2DHintPlayer } from './hints-player.js';
import { renderF2DGuide } from './guide.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;

export function initF2DSolver() {
    const btnGenerate = document.getElementById('btn-generate-f2d');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', handleGenerate);
    }

    const btnCustom = document.getElementById('btn-custom-f2d');
    const customInput = document.getElementById('custom-f2d-input');
    if (btnCustom) {
        btnCustom.addEventListener('click', handleCustomProblem);
    }
    if (customInput) {
        customInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleCustomProblem();
            }
        });
    }

    const complexitySelect = document.getElementById('config-complexity');
    if (complexitySelect) {
        complexitySelect.addEventListener('change', (e) => {
            renderF2DGuide(e.target.value);
            handleGenerate();
        });
    }

    const formatSelect = document.getElementById('config-format');
    if (formatSelect) {
        formatSelect.addEventListener('change', handleGenerate);
    }

    const negCheckbox = document.getElementById('config-negatives');
    if (negCheckbox) {
        negCheckbox.addEventListener('change', handleGenerate);
    }

    const stepInput = document.getElementById('f2d-step-input');
    const finalInput = document.getElementById('f2d-final-input');

    if (stepInput) {
        stepInput.addEventListener('keydown', (e) => handleInput(e, false));
    }
    if (finalInput) {
        finalInput.addEventListener('keydown', (e) => handleInput(e, true));
    }
    if (stepInput || finalInput) {
        attachF2DHintListener(stepInput, finalInput, () => currentProblem, () => currentStepIndex);
    }

    handleGenerate();
}

export function getCurrentF2DProblem() {
    return currentProblem;
}

export function loadF2DProblem(problem) {
    if (!problem) return;
    currentProblem = problem;
    currentStepIndex = 0;

    renderF2DGuide(problem.complexity || 'basic');
    resetF2DHintPlayer();
    renderFractionBanner(false);

    ViewTransitions.update(document.getElementById('f2d-math-grid'), 'f2d_', () => {
        renderGrid();
        setupCurrentStep();
    });
}

function handleCustomProblem() {
    const customInput = document.getElementById('custom-f2d-input');
    const customError = document.getElementById('custom-f2d-error');
    if (!customInput) return;

    const parsed = parseCustomFractionToDecimalProblem(customInput.value);
    if (!parsed) {
        if (customError) {
            customError.textContent = 'Enter a valid fraction or mixed number (e.g. -5 7/12, 3/8, or -7/4).';
            customError.classList.remove('hidden');
        }
        return;
    }

    if (customError) {
        customError.classList.add('hidden');
    }
    loadF2DProblem(parsed);
}

function handleGenerate() {
    const complexityEl = document.getElementById('config-complexity');
    const formatEl = document.getElementById('config-format');
    const negEl = document.getElementById('config-negatives');
    const customError = document.getElementById('custom-f2d-error');
    if (customError) customError.classList.add('hidden');

    const complexity = complexityEl ? complexityEl.value : 'basic';
    const format = formatEl ? formatEl.value : 'auto';
    const allowNegatives =
        complexity === 'mixed_signed' ? true : Boolean(negEl && negEl.checked);

    const problem = generateFractionToDecimalProblem(complexity, {
        format,
        allowNegatives
    });
    loadF2DProblem(problem);
}

function renderFractionBanner(isSolved) {
    const bannerEl = document.getElementById('f2d-fraction-display');
    if (!bannerEl || !currentProblem) return;

    const decompPart = currentProblem.decompositionTex
        ? ` = ${currentProblem.decompositionTex}`
        : '';

    const tex = isSolved
        ? `${currentProblem.fractionTex}${decompPart} = \\textcolor{#16a34a}{\\mathbf{${currentProblem.finalTex}}}`
        : `${currentProblem.fractionTex}${decompPart} = \\text{?}`;

    if (window.MathRenderer) {
        window.MathRenderer.renderBlock(tex, bannerEl);
    } else if (window.katex) {
        window.katex.render(tex, bannerEl, { throwOnError: false, displayMode: true });
    } else {
        bannerEl.textContent = currentProblem.problemLabel;
    }
}

function renderGrid() {
    const container = document.getElementById('f2d-math-grid');
    if (!container || !currentProblem) return;
    container.replaceChildren();

    const cols = currentProblem.dividendCols;
    const dotCol = currentProblem.dotCol;

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

    for (let c = 0; c < cols.length; c++) {
        const td = document.createElement('td');
        const isDot = c === dotCol;
        td.className = isDot
            ? 'py-2 text-center decimal-dot-cell text-blue-600 font-bold'
            : 'p-2 text-center w-11 text-blue-600 font-bold';
        td.id = `quotient-cell-${c}`;
        qRow.appendChild(td);
    }
    tbody.appendChild(qRow);

    // Row 1: Divisor & Dividend (with decimal point and trailing zeros)
    const divRow = document.createElement('tr');
    divRow.id = 'dividend-row';
    const divisorTd = document.createElement('td');
    divisorTd.className = 'p-2 text-right w-12 font-bold pr-3 text-gray-800';
    divisorTd.textContent = String(currentProblem.divisor);
    divRow.appendChild(divisorTd);

    for (let c = 0; c < cols.length; c++) {
        const isDot = c === dotCol;
        const isTrailingZero = c > dotCol;
        const borderClass = c === 0 ? 'border-t-2 border-l-2 border-gray-800' : 'border-t-2 border-gray-800';
        const td = document.createElement('td');
        td.className = isDot
            ? `py-2 text-center decimal-dot-cell font-bold text-indigo-700 ${borderClass}`
            : `p-2 text-center w-11 font-bold ${isTrailingZero ? 'text-slate-400' : 'text-gray-900'} ${borderClass}`;
        td.id = `dividend-cell-${c}`;
        td.textContent = cols[c];
        divRow.appendChild(td);
    }
    tbody.appendChild(divRow);

    // Prepare subtraction & remainder rows for each subtract_down cycle
    let cycle = 0;
    for (let i = 0; i < currentProblem.steps.length; i++) {
        if (currentProblem.steps[i].type === 'subtract_down') {
            const subRow = document.createElement('tr');
            subRow.id = `work-sub-${cycle}`;
            subRow.style.display = 'none';
            const minusTd = document.createElement('td');
            minusTd.className = 'p-2 w-12 text-right text-red-500 font-bold';
            minusTd.textContent = '-';
            subRow.appendChild(minusTd);

            for (let c = 0; c < cols.length; c++) {
                const isDot = c === dotCol;
                const td = document.createElement('td');
                td.className = isDot
                    ? 'py-2 text-center decimal-dot-cell border-b-2 border-gray-400'
                    : 'p-2 text-center w-11 text-red-500 font-bold border-b-2 border-gray-400';
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

            for (let c = 0; c < cols.length; c++) {
                const isDot = c === dotCol;
                const td = document.createElement('td');
                td.className = isDot ? 'py-2 text-center decimal-dot-cell' : 'p-2 text-center w-11 font-bold';
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

function getF2DStepLabel(step) {
    if (step.type === 'divide_whole') {
        return `Whole Part: Divide ${step.workingNum} ÷ ${step.divisor} (place ${step.qDigit}.)`;
    } else if (step.type === 'bring_down_zero') {
        return `Decimal Place #${step.decPlace}: Bring down 0 → ${step.newWorkingNum}`;
    } else if (step.type === 'divide_digit') {
        return `Divide ${step.workingNum} ÷ ${step.divisor}`;
    } else if (step.type === 'multiply_back') {
        return `Multiply ${step.qDigit} × ${step.divisor}`;
    } else if (step.type === 'subtract_down') {
        return `Subtract ${step.workingNum} - ${step.multBack}`;
    } else if (step.type === 'combine_whole_and_sign') {
        const wholeDesc = step.wholePart > 0 ? `whole number ${step.wholePart} & ` : '';
        const signDesc = step.isNegative ? 'negative sign (-)' : 'decimal';
        return `Combine ${wholeDesc}${signDesc} with ${step.longDivQuotient}`;
    }
    return 'Complete division step';
}

function renderStepsList() {
    const listEl = document.getElementById('f2d-steps-list');
    const summaryEl = document.getElementById('f2d-steps-summary');
    if (!listEl || !currentProblem) return;

    listEl.replaceChildren();
    const total = currentProblem.steps.length;
    const completedCount = Math.min(currentStepIndex, total);

    if (summaryEl) {
        summaryEl.textContent =
            currentStepIndex >= total
                ? `All ${total} steps completed`
                : `Step ${completedCount + 1} of ${total}`;
    }

    currentProblem.steps.forEach((step, idx) => {
        const isDone = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;
        const li = document.createElement('li');
        li.setAttribute('data-step-status', isDone ? 'completed' : isActive ? 'active' : 'pending');
        li.className = `flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
            isDone
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : isActive
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-sm'
                  : 'bg-gray-50/70 border-gray-200 text-gray-500'
        }`;

        const left = document.createElement('div');
        left.className = 'flex items-center gap-2';
        const badge = document.createElement('span');
        badge.className = `inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
            isDone
                ? 'bg-emerald-600 text-white'
                : isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
        }`;
        badge.textContent = isDone ? '✓' : String(idx + 1);
        const label = document.createElement('span');
        label.textContent = getF2DStepLabel(step);
        left.append(badge, label);

        const right = document.createElement('span');
        right.className = 'font-mono text-xs';
        right.textContent = isDone ? step.expectedInput : isActive ? 'Current Step' : 'Pending';

        li.append(left, right);
        listEl.appendChild(li);
    });
}

function getCycleForStep(index) {
    let cycle = 0;
    for (let i = 0; i < index; i++) {
        if (currentProblem.steps[i].type === 'subtract_down') {
            cycle++;
        }
    }
    return cycle;
}

function renderStepResult(step, stepIdx) {
    const cycle = getCycleForStep(stepIdx);
    const numMap = currentProblem.numericColMap;

    if (step.type === 'divide_whole') {
        const qCell = document.getElementById(`quotient-cell-${step.colIndex}`);
        const dotCell = document.getElementById(`quotient-cell-${step.dotColIndex}`);
        if (qCell) qCell.textContent = String(step.qDigit);
        if (dotCell) dotCell.textContent = '.';
    } else if (step.type === 'divide_digit') {
        const qCell = document.getElementById(`quotient-cell-${step.colIndex}`);
        if (qCell) qCell.textContent = String(step.qDigit);
    } else if (step.type === 'bring_down_zero') {
        const divZeroCell = document.getElementById(`dividend-cell-${step.colIndex}`);
        if (divZeroCell) {
            divZeroCell.classList.remove('text-slate-400');
            divZeroCell.classList.add('annexed-zero-active');
        }
        if (cycle > 0) {
            const remZeroCell = document.getElementById(`work-rem-cell-${cycle - 1}-${step.colIndex}`);
            if (remZeroCell) {
                remZeroCell.textContent = '0';
                remZeroCell.classList.add('text-blue-600');
            }
        }
    } else if (step.type === 'multiply_back') {
        const row = document.getElementById(`work-sub-${cycle}`);
        if (row) row.style.display = 'table-row';
        const multStr = String(step.multBack);
        for (let k = 0; k < multStr.length; k++) {
            const offset = multStr.length - 1 - k;
            const targetNumericIdx = step.numericIndex - offset;
            const tableCol = numMap[targetNumericIdx];
            if (tableCol !== undefined) {
                const cell = document.getElementById(`work-sub-cell-${cycle}-${tableCol}`);
                if (cell) cell.textContent = multStr[k];
            }
        }
    } else if (step.type === 'subtract_down') {
        const row = document.getElementById(`work-rem-${cycle}`);
        if (row) row.style.display = 'table-row';
        const remStr = String(step.remainder);
        for (let k = 0; k < remStr.length; k++) {
            const offset = remStr.length - 1 - k;
            const targetNumericIdx = step.numericIndex - offset;
            const tableCol = numMap[targetNumericIdx];
            if (tableCol !== undefined) {
                const cell = document.getElementById(`work-rem-cell-${cycle}-${tableCol}`);
                if (cell) cell.textContent = remStr[k];
            }
        }
    }
}

function setupCurrentStep() {
    const stepInput = document.getElementById('f2d-step-input');
    const finalInput = document.getElementById('f2d-final-input');
    const error = document.getElementById('f2d-step-error');
    if (stepInput) stepInput.value = '';
    if (error) error.classList.add('hidden');

    renderStepsList();

    if (currentStepIndex >= currentProblem.steps.length) {
        if (stepInput) {
            stepInput.disabled = true;
            stepInput.value = 'Done!';
        }
        if (finalInput) {
            finalInput.disabled = true;
            finalInput.value = String(currentProblem.finalAnswerStr);
        }
        renderFractionBanner(true);
        updateHint();
        return;
    }

    const activeStep = currentProblem.steps[currentStepIndex];
    if (stepInput) {
        stepInput.disabled = false;
    }
    if (finalInput) {
        finalInput.disabled = false;
        finalInput.value = '';
    }
    if (activeStep && activeStep.type === 'combine_whole_and_sign' && finalInput) {
        finalInput.focus();
    } else if (stepInput) {
        stepInput.focus();
    }
    updateHint();
}

function handleInput(e, isFinalBox) {
    if (e.key !== 'Enter') return;
    if (!currentProblem) return;

    const val = e.target.value.trim().replace(/\u2212/g, '-');
    const step = currentProblem.steps[currentStepIndex];
    if (!step) return;

    const isFinalMatch = currentProblem.acceptedFinalAnswers.includes(val);
    const allowedStepVals = step.acceptedInputs || [step.expectedInput];
    const isStepMatch = allowedStepVals.includes(val);

    if (isFinalBox && isFinalMatch) {
        document.getElementById('f2d-step-error').classList.add('hidden');
        resetF2DHintPlayer();

        ViewTransitions.update(document.getElementById('f2d-math-grid'), 'f2d_', () => {
            for (; currentStepIndex < currentProblem.steps.length; currentStepIndex++) {
                renderStepResult(currentProblem.steps[currentStepIndex], currentStepIndex);
            }
            setupCurrentStep();
        });
        return;
    }

    if (!isFinalBox && isStepMatch) {
        document.getElementById('f2d-step-error').classList.add('hidden');
        e.target.value = '';
        resetF2DHintPlayer();

        ViewTransitions.update(document.getElementById('f2d-math-grid'), 'f2d_', () => {
            renderStepResult(step, currentStepIndex);
            currentStepIndex++;
            setupCurrentStep();
        });
    } else {
        const errorDiv = document.getElementById('f2d-step-error');
        errorDiv.textContent = isFinalBox
            ? 'Not quite the final decimal yet. Work through the long-division steps or press Tab for a hint!'
            : 'Not quite right. Press Tab for a step-by-step visual hint!';
        errorDiv.classList.remove('hidden');
        e.target.select();
    }
}

function updateHint() {
    const step = currentProblem.steps[currentStepIndex];
    const hintDiv = document.getElementById('f2d-hint-content');
    if (!hintDiv) return;

    if (!step) {
        hintDiv.textContent = `Great job! ${currentProblem.problemLabel} = ${currentProblem.finalAnswerStr}${currentProblem.isRepeating ? '...' : ''}`;
        return;
    }

    if (step.type === 'divide_whole') {
        hintDiv.textContent = `Start before the decimal point: How many times does ${step.divisor} go into ${step.workingNum}? Type ${step.qDigit} to place ${step.qDigit}. in the quotient.`;
    } else if (step.type === 'bring_down_zero') {
        hintDiv.textContent = `Annex and bring down the next 0 after the decimal point next to ${step.prevRemainder}. Type the new working number (${step.newWorkingNum}).`;
    } else if (step.type === 'divide_digit') {
        hintDiv.textContent = `Divide ${step.workingNum} by ${step.divisor}. How many times does ${step.divisor} fit into ${step.workingNum}? Type the decimal quotient digit.`;
    } else if (step.type === 'multiply_back') {
        hintDiv.textContent = `Multiply the quotient digit you just wrote (${step.qDigit}) by the divisor (${step.divisor}). Type the product.`;
    } else if (step.type === 'subtract_down') {
        hintDiv.textContent = `Subtract ${step.multBack} from ${step.workingNum} to find the remainder.`;
    } else if (step.type === 'combine_whole_and_sign') {
        hintDiv.textContent = `Combine ${step.wholePart > 0 ? `the whole number (${step.wholePart}) and ` : ''}the fractional decimal (${step.longDivQuotient})${step.isNegative ? ' with the negative (-) sign' : ''} to write the final answer (${step.finalAnswerStr}).`;
    }
}
