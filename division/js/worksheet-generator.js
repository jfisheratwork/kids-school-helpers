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

    const doc = document.getElementById('worksheet-document');
    const btnPrint = document.getElementById('btn-print-sheet');

    doc.innerHTML = '';

    const problems = [];
    for(let i = 1; i <= count; i++) {
        let tex = '';
        let ansTex = '';

        if (type === 'long-division' || type === 'standard') {
            const topD = parseInt(document.getElementById('ws-top-digits').value) || 3;
            const botD = parseInt(document.getElementById('ws-bottom-digits').value) || 1;
            const dec = document.getElementById('ws-decimals').value || '0';
            
            const p = generateLongDivisionProblem(topD, botD, dec); 
            
            // Format for long division: divisor | dividend
            tex = `${p.divisor} \\overline{) ${p.dividend}}`;
            
            // Build the full long division staircase for the answer key
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
            
            // Build the full step-by-step answer for fractions
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

        problems.push({ tex, ansTex });
    }

    // Pagination logic
    const PROBLEMS_PER_PAGE = type === 'long-division' || type === 'standard' ? 6 : 10;
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
                    <div><h2 class="text-2xl font-bold text-gray-900">Division Practice: ${typeName}</h2></div>
                    <div class="text-right text-sm text-gray-700 space-y-1">
                        <p>Name: ________________________</p>
                        <p>Date: ________________________</p>
                    </div>
                </div>
            `;
        } else {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Division Practice: ${typeName} (Page ${page + 1})</h2>
                </div>
            `;
        }
        
        const gridDiv = document.createElement('div');
        gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-16";
        
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
