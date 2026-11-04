import { WorksheetLayout } from '../../shared/js/worksheet-layout.js';
import { generateDecimalToFractionProblem } from './generator.js';

export function initD2FWorksheetGenerator() {
    const btnGenerate = document.getElementById('btn-generate-worksheet');
    const btnPrint = document.getElementById('btn-print-worksheet');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateD2FWorksheet);
    }
    if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }
}

export function generateD2FWorksheet() {
    const complexityEl = document.getElementById('ws-complexity');
    const negEl = document.getElementById('ws-negatives');
    const countEl = document.getElementById('ws-num-problems');
    const keyEl = document.getElementById('ws-key');
    const btnPrint = document.getElementById('btn-print-worksheet');

    const complexity = complexityEl ? complexityEl.value : 'basic';
    const allowNegatives = Boolean(negEl && negEl.checked);
    const numProblems = countEl ? parseInt(countEl.value, 10) : 10;
    const includeKey = keyEl ? keyEl.checked : true;

    const problemsData = [];
    for (let i = 0; i < numProblems; i++) {
        const p = generateDecimalToFractionProblem(complexity, {
            allowNegatives: allowNegatives && Math.random() < 0.7
        });
        const problemTex = `${p.decimalStr} = `;
        const signPrefix = p.isNegative ? '-' : '';

        const unsimpTex =
            p.wholePart > 0
                ? `${signPrefix}${p.wholePart}\\frac{${p.rawNumerator}}{${p.placeValueDenom}}`
                : `${signPrefix}\\frac{${p.rawNumerator}}{${p.placeValueDenom}}`;

        let ansTex = `${p.decimalStr} = ${unsimpTex}`;
        if (p.gcf > 1) {
            const divStepTex =
                p.wholePart > 0
                    ? `${signPrefix}${p.wholePart}\\frac{${p.rawNumerator} \\div ${p.gcf}}{${p.placeValueDenom} \\div ${p.gcf}}`
                    : `${signPrefix}\\frac{${p.rawNumerator} \\div ${p.gcf}}{${p.placeValueDenom} \\div ${p.gcf}}`;
            ansTex += ` = ${divStepTex} = \\mathbf{${p.finalTex}}`;
        } else {
            ansTex = `${p.decimalStr} = \\mathbf{${p.finalTex}}`;
        }

        problemsData.push({ tex: problemTex, ansTex });
    }

    const levelName = complexityEl
        ? complexityEl.options[complexityEl.selectedIndex].text
        : 'Level 1 — Basic';

    WorksheetLayout.generate({
        containerId: 'worksheet-document',
        title: `Decimals to Fractions: ${levelName}`,
        problems: problemsData,
        problemsPerPage: 10,
        includeKey
    });

    if (btnPrint) {
        btnPrint.classList.remove('hidden');
    }
}
