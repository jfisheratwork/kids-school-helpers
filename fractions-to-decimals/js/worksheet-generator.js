import { WorksheetLayout } from '../../shared/js/worksheet-layout.js';
import { generateFractionToDecimalProblem } from './generator.js';

export function initF2DWorksheetGenerator() {
    const btnGenerate = document.getElementById('btn-generate-worksheet');
    const btnPrint = document.getElementById('btn-print-worksheet');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateF2DWorksheet);
    }
    if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }
}

export function generateF2DWorksheet() {
    const complexityEl = document.getElementById('ws-complexity');
    const formatEl = document.getElementById('ws-format');
    const negEl = document.getElementById('ws-negatives');
    const countEl = document.getElementById('ws-count');
    const keyEl = document.getElementById('ws-key');
    const btnPrint = document.getElementById('btn-print-worksheet');

    const complexity = complexityEl ? complexityEl.value : 'basic';
    const format = formatEl ? formatEl.value : 'auto';
    const allowNegatives =
        complexity === 'mixed_signed' ? true : Boolean(negEl && negEl.checked);
    const count = countEl ? parseInt(countEl.value, 10) : 6;
    const includeKey = keyEl ? keyEl.checked : true;

    const problemsData = [];
    for (let i = 0; i < count; i++) {
        const p = generateFractionToDecimalProblem(complexity, {
            format,
            allowNegatives: allowNegatives && (complexity !== 'mixed_signed' ? Math.random() < 0.7 : true)
        });
        const tex = `${p.fractionTex} \\;\\rightarrow\\; ${p.divisor} \\overline{) ${p.dividendDisplay}}`;

        const totalNumericCols = p.numericColMap.length;
        const rows = [];
        rows.push(`\\textcolor{#16a34a}{\\mathbf{${p.fractionTex} = ${p.finalTex}}}`);
        rows.push(`\\phantom{${p.divisor} )} ${p.quotientStr}`);
        rows.push(`${p.divisor} \\overline{) ${p.dividendDisplay}}`);

        p.steps.forEach((step) => {
            const padCount = Math.max(0, totalNumericCols - 1 - step.numericIndex);
            const pad = padCount > 0 ? `\\phantom{${'0'.repeat(padCount)}}` : '';
            if (step.type === 'multiply_back') {
                rows.push(`\\underline{-${step.multBack}}${pad}`);
            } else if (step.type === 'bring_down_zero') {
                rows.push(`${step.newWorkingNum}${pad}`);
            }
        });
        rows.push(`${p.finalRemainder}`);

        const ansTex = `\\begin{array}{r} ${rows.join(' \\\\ ')} \\end{array}`;
        problemsData.push({ tex, ansTex });
    }

    const levelLabel = complexityEl
        ? complexityEl.options[complexityEl.selectedIndex].text
        : 'Level 1 — Tenths';

    WorksheetLayout.generate({
        containerId: 'worksheet-document',
        title: `Fractions to Decimals (Long Division): ${levelLabel}`,
        problems: problemsData,
        problemsPerPage: 6,
        includeKey
    });

    if (btnPrint) {
        btnPrint.classList.remove('hidden');
    }
}
