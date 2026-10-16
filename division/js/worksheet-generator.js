import { WorksheetLayout } from '../../shared/js/worksheet-layout.js';
import { generateLongDivisionProblem } from './generator-long-division.js';
import { generateFractionDivisionProblem } from './generator-fractions-division.js';

export function initWorksheetGenerator() {
    const btnGenerate = document.getElementById('btn-generate-sheet');
    const btnPrint = document.getElementById('btn-print-sheet');

    if(btnGenerate) {
        btnGenerate.addEventListener('click', generateWorksheet);
    }
    if(btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }

    const typeSelect = document.getElementById('ws-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'long-division' || typeSelect.value === 'standard') {
                document.getElementById('ws-standard-options').classList.remove('hidden');
                document.getElementById('ws-fraction-options').classList.add('hidden');
            } else {
                document.getElementById('ws-standard-options').classList.add('hidden');
                document.getElementById('ws-fraction-options').classList.remove('hidden');
            }
        });
    }
}

function generateWorksheet() {
    const type = document.getElementById('ws-type').value;
    const count = parseInt(document.getElementById('ws-count').value);
    const includeKey = document.getElementById('ws-key').checked;
    const btnPrint = document.getElementById('btn-print-sheet');

    const problemsData = [];
    for(let i = 1; i <= count; i++) {
        let tex = '';
        let ansTex = '';

        if (type === 'long-division' || type === 'standard') {
            const topD = parseInt(document.getElementById('ws-top-digits').value) || 3;
            const botD = parseInt(document.getElementById('ws-bottom-digits').value) || 1;
            const dec = document.getElementById('ws-decimals').value || '0';
            
            const p = generateLongDivisionProblem(topD, botD, dec); 
            
            tex = `${p.divisor} \\overline{) ${p.dividend}}`;
            
            let rows = [];
            let L = p.dividend.toString().length;
            
            let remainderStr = p.finalRemainder > 0 ? ` \\rlap{\\text{ R } ${p.finalRemainder}}` : '';
            rows.push(`\\phantom{${p.divisor} )} ${p.quotientStr}${remainderStr}`);
            rows.push(`${p.divisor} \\overline{) ${p.dividend}}`);
            
            p.steps.forEach(step => {
                let padCount = L - 1 - step.dividendIndex;
                let pad = padCount > 0 ? `\\phantom{${"0".repeat(padCount)}}` : '';
                
                if (step.type === 'multiply_back') {
                    rows.push(`\\underline{-${step.multBack}}${pad}`);
                } else if (step.type === 'bring_down') {
                    rows.push(`${step.newWorkingStr}${pad}`);
                }
            });
            rows.push(`${p.finalRemainder}`);
            
            ansTex = `\\begin{array}{r} ${rows.join(' \\\\ ')} \\end{array}`;
        } else {
            const fracType = document.getElementById('ws-fraction-type').value || 'proper';
            const p = generateFractionDivisionProblem(fracType);
            tex = p.texInitial;
            
            let fullAns = p.texInitial;
            p.steps.forEach(s => {
                if (s.type === 'keep_change_flip') {
                    fullAns += ` = ${s.tex}`;
                } else if (s.type === 'multiply') {
                    let parts = s.tex.split('=');
                    if (parts.length > 1) {
                        fullAns += ` = ${parts[1].trim()}`;
                    } else {
                        fullAns += ` = ${s.tex}`;
                    }
                } else if (s.type === 'simplify') {
                    let parts = s.tex.split('=');
                    if (parts.length > 1) {
                        fullAns += ` = ${parts[1].trim()}`;
                    }
                }
            });
            ansTex = fullAns;
        }

        problemsData.push({ tex, ansTex });
    }

    const typeName = document.getElementById('ws-type').options[document.getElementById('ws-type').selectedIndex].text;
    const problemsPerPage = type === 'long-division' || type === 'standard' ? 6 : 10;

    WorksheetLayout.generate({
        containerId: 'worksheet-document',
        title: `Division Practice: ${typeName}`,
        problems: problemsData,
        problemsPerPage: problemsPerPage,
        includeKey: includeKey
    });

    if (btnPrint) btnPrint.classList.remove('hidden');
}
