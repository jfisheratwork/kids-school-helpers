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

    const doc = document.getElementById('worksheet-document');
    const btnPrint = document.getElementById('btn-print-sheet');

    doc.innerHTML = '';

    if (type === 'timestables' && document.getElementById('ws-timestables-mode').value === 'reference') {
        // Render 1-12 Reference Tables
        const tables = generateReferenceTables();
        
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page relative pb-10 p-8";
        pageDiv.innerHTML = `
            <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                <div><h2 class="text-2xl font-bold text-gray-900">Multiplication Tables (1-12)</h2></div>
            </div>
            <div class="grid grid-cols-4 gap-x-4 gap-y-12 text-sm" id="ref-tables-grid"></div>
        `;
        doc.appendChild(pageDiv);
        
        const grid = pageDiv.querySelector('#ref-tables-grid');
        for(let i = 0; i < tables.length; i++) {
            const div = document.createElement('div');
            div.className = "flex justify-center";
            grid.appendChild(div);
            if (window.katex) {
                katex.render(tables[i], div, { throwOnError: false, displayMode: true });
            }
        }
        
        doc.classList.remove('hidden');
        btnPrint.classList.remove('hidden');
        return;
    }

    const problems = [];
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
        
        problems.push({ tex, ansTex });
    }

    // Pagination logic
    const PROBLEMS_PER_PAGE = type === 'standard' ? 12 : 16;
    const numPages = Math.ceil(count / PROBLEMS_PER_PAGE);

    const typeName = document.getElementById('ws-type').options[document.getElementById('ws-type').selectedIndex].text;

    // Generate Worksheet Pages
    for (let page = 0; page < numPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page print:break-after-page relative pb-10 p-8";
        
        let headerHtml = '';
        if (page === 0) {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                    <div><h2 class="text-2xl font-bold text-gray-900">Multiplication Practice: ${typeName}</h2></div>
                    <div class="text-right text-sm text-gray-700 space-y-1">
                        <p>Name: ________________________</p>
                        <p>Date: ________________________</p>
                    </div>
                </div>
            `;
        } else {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Multiplication Practice: ${typeName} (Page ${page + 1})</h2>
                </div>
            `;
        }
        
        const gridDiv = document.createElement('div');
        gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-12";
        
        const startIndex = page * PROBLEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, count);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            
            const div = document.createElement('div');
            div.className = "flex items-start space-x-4 mb-4";
            div.innerHTML = `
                <div class="font-bold text-gray-500">${probNum}.</div>
                <div class="text-2xl font-medium px-4" id="ws-prob-tex-${probNum}"></div>
            `;
            gridDiv.appendChild(div);
        }
        
        pageDiv.innerHTML = headerHtml;
        pageDiv.appendChild(gridDiv);
        doc.appendChild(pageDiv);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            const eqDiv = pageDiv.querySelector(`#ws-prob-tex-${probNum}`);
            if (window.katex) katex.render(p.tex, eqDiv, { throwOnError: false, displayMode: true });
        }
    }

    // Generate Answer Key Pages
    if (includeKey) {
        for (let page = 0; page < numPages; page++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = "worksheet-page relative pt-10 p-8";
            if (page < numPages - 1) {
                pageDiv.classList.add('print:break-after-page');
            }
            
            pageDiv.innerHTML = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Answer Key (Page ${page + 1})</h2>
                </div>
            `;
            
            const gridDiv = document.createElement('div');
            gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-12";
            
            const startIndex = page * PROBLEMS_PER_PAGE;
            const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, count);
            
            for (let i = startIndex; i < endIndex; i++) {
                const probNum = i + 1;
                
                const keyDiv = document.createElement('div');
                keyDiv.className = "flex items-start space-x-4 mb-4";
                keyDiv.innerHTML = `
                    <div class="font-bold text-gray-500">${probNum}.</div>
                    <div class="text-xl font-medium text-blue-700" id="ws-ans-tex-${probNum}"></div>
                `;
                gridDiv.appendChild(keyDiv);
            }
            
            pageDiv.appendChild(gridDiv);
            doc.appendChild(pageDiv);
            
            for (let i = startIndex; i < endIndex; i++) {
                const probNum = i + 1;
                const p = problems[i];
                const keyEq = pageDiv.querySelector(`#ws-ans-tex-${probNum}`);
                if (window.katex) katex.render(p.ansTex, keyEq, { throwOnError: false, displayMode: true });
            }
        }
    }

    doc.classList.remove('hidden');
    btnPrint.classList.remove('hidden');
}
