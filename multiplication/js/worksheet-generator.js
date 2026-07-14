import { generateStandardProblem } from './generator-standard.js';
import { generateFractionProblem } from './generator-fractions.js';

export function initWorksheetGenerator() {
    const btnGenerate = document.getElementById('btn-generate-sheet');
    const btnPrint = document.getElementById('btn-print-sheet');

    if(btnGenerate) {
        btnGenerate.addEventListener('click', generateWorksheet);
    }
    if(btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
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

    for(let i = 1; i <= count; i++) {
        let tex = '';
        let ansTex = '';

        if (type === 'standard') {
            // Uses standard config from the other panel for now, or just defaults to 2x2.
            const p = generateStandardProblem(2, 2, '0'); 
            tex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline \\end{array}`;
            
            if (p.ppRows && p.ppRows.length > 1) {
                const ppLinesJoined = p.ppRows.join(' \\\\ ');
                ansTex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline ${ppLinesJoined} \\\\ \\hline ${p.finalProductDisplay} \\end{array}`;
            } else {
                ansTex = `\\begin{array}{r} ${p.displayTop} \\\\ \\times\\; ${p.displayBottom} \\\\ \\hline ${p.finalProductDisplay} \\end{array}`;
            }
        } else {
            const p = generateFractionProblem('proper');
            tex = p.texInitial;
            const finalStep = p.steps[p.steps.length - 1];
            ansTex = `${p.texInitial} = ${finalStep.tex.replace('\\text{Simplify: } ', '')}`;
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
