import { WorksheetLayout } from '../../shared/js/worksheet-layout.js';
import { generateStandardProblem } from './generator-standard.js';
import { generateFractionProblem } from './generator-fractions.js';
import { generateTimesTableQuizProblem, generateReferenceTables } from './generator-timestables.js';

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
            document.getElementById('ws-standard-options').classList.add('hidden');
            document.getElementById('ws-fraction-options').classList.add('hidden');
            document.getElementById('ws-timestables-options').classList.add('hidden');
            
            if (typeSelect.value === 'standard') {
                document.getElementById('ws-standard-options').classList.remove('hidden');
            } else if (typeSelect.value === 'fractions') {
                document.getElementById('ws-fraction-options').classList.remove('hidden');
            } else if (typeSelect.value === 'timestables') {
                document.getElementById('ws-timestables-options').classList.remove('hidden');
            }
        });
    }
}

function generateWorksheet() {
    const type = document.getElementById('ws-type').value;
    const count = parseInt(document.getElementById('ws-count').value);
    const includeKey = document.getElementById('ws-key').checked;
    const btnPrint = document.getElementById('btn-print-sheet');

    if (type === 'timestables' && document.getElementById('ws-timestables-mode').value === 'reference') {
        const tables = generateReferenceTables();
        let htmlContent = '<div class="grid grid-cols-4 gap-x-4 gap-y-12 text-sm" id="ref-tables-grid"></div>';
        WorksheetLayout.renderCustomPage('worksheet-document', 'Multiplication Tables (1-12)', htmlContent, (pageDiv) => {
            const grid = pageDiv.querySelector('#ref-tables-grid');
            for(let i = 0; i < tables.length; i++) {
                const div = document.createElement('div');
                div.className = "flex justify-center";
                grid.appendChild(div);
                if (window.katex) {
                    katex.render(tables[i], div, { throwOnError: false, displayMode: true });
                }
            }
        });
        if (btnPrint) btnPrint.classList.remove('hidden');
        return;
    }

    const problemsData = [];
    for(let i = 1; i <= count; i++) {
        let tex = '';
        let ansTex = '';

        if (type === 'standard') {
            const topD = parseInt(document.getElementById('ws-top-digits').value);
            const botD = parseInt(document.getElementById('ws-bottom-digits').value);
            const dec = document.getElementById('ws-decimals').value;
            const p = generateStandardProblem(topD, botD, dec); 
            tex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline \\end{array}`;
            
            if (p.ppRows && p.ppRows.length > 1) {
                const ppLinesJoined = p.ppRows.join(' \\\\ ');
                ansTex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline ${ppLinesJoined} \\\\ \\hline ${p.finalProductDisplay} \\end{array}`;
            } else {
                ansTex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline ${p.finalProductDisplay} \\end{array}`;
            }
        } else if (type === 'fractions') {
            const fracType = document.getElementById('ws-fraction-type').value;
            const p = generateFractionProblem(fracType);
            tex = p.texInitial;
            const finalStep = p.steps[p.steps.length - 1];
            ansTex = `${p.texInitial} = ${finalStep.tex.replace('\\text{Simplify: } ', '')}`;
        } else if (type === 'timestables') {
            const p = generateTimesTableQuizProblem();
            tex = p.texInitial;
            ansTex = p.texAnswer;
        }
        
        problemsData.push({ tex, ansTex });
    }

    const typeName = document.getElementById('ws-type').options[document.getElementById('ws-type').selectedIndex].text;
    const problemsPerPage = type === 'standard' ? 12 : 16;

    WorksheetLayout.generate({
        containerId: 'worksheet-document',
        title: `Multiplication Practice: ${typeName}`,
        problems: problemsData,
        problemsPerPage: problemsPerPage,
        includeKey: includeKey
    });

    if (btnPrint) btnPrint.classList.remove('hidden');
}
