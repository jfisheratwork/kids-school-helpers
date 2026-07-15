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

    const grid = document.getElementById('worksheet-grid');
    const keyGrid = document.getElementById('worksheet-key-grid');
    const doc = document.getElementById('worksheet-document');
    const keyPage = document.getElementById('worksheet-key-page');
    const btnPrint = document.getElementById('btn-print-sheet');

    grid.innerHTML = '';
    keyGrid.innerHTML = '';

    if (type === 'timestables' && document.getElementById('ws-timestables-mode').value === 'reference') {
        // Render 1-12 Reference Tables
        const tables = generateReferenceTables();
        
        // We will inject a beautiful 4-column grid
        grid.className = "grid grid-cols-4 gap-x-4 gap-y-12 text-sm";
        keyGrid.className = "grid grid-cols-4 gap-x-4 gap-y-12 text-sm";
        
        for(let i = 0; i < tables.length; i++) {
            const div = document.createElement('div');
            div.className = "flex justify-center";
            grid.appendChild(div);
            
            if (window.katex) {
                katex.render(tables[i], div, { throwOnError: false, displayMode: true });
            }
        }
        
        // Answer key doesn't make sense for reference tables, so we hide it
        doc.classList.remove('hidden');
        btnPrint.classList.remove('hidden');
        keyPage.classList.add('hidden');
        return;
    }

    // Reset grid layout for standard problems
    grid.className = "grid grid-cols-2 gap-x-8 gap-y-10";
    keyGrid.className = "grid grid-cols-2 gap-x-8 gap-y-6";

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

        // Add to main worksheet
        const div = document.createElement('div');
        div.className = "flex items-start space-x-4";
        div.innerHTML = `<span class="font-bold text-gray-500">${i}.</span> <div class="text-2xl" id="ws-prob-${i}"></div>`;
        grid.appendChild(div);
        
        // Add to answer key
        const keyDiv = document.createElement('div');
        keyDiv.className = "flex items-start space-x-4";
        keyDiv.innerHTML = `<span class="font-bold text-gray-500">${i}.</span> <div class="text-xl text-blue-700" id="ws-ans-${i}"></div>`;
        keyGrid.appendChild(keyDiv);
        
        if (window.katex) {
            katex.render(tex, div.querySelector(`#ws-prob-${i}`), { throwOnError: false, displayMode: true });
            katex.render(ansTex, keyDiv.querySelector(`#ws-ans-${i}`), { throwOnError: false, displayMode: true });
        }
    }

    doc.classList.remove('hidden');
    btnPrint.classList.remove('hidden');

    if (includeKey) {
        keyPage.classList.remove('hidden');
    } else {
        keyPage.classList.add('hidden');
    }
}
