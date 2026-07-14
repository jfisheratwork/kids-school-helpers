import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';

export function generateWorksheet() {
    const grid = document.getElementById('worksheet-grid');
    const keyGrid = document.getElementById('worksheet-key-grid');
    if (!grid || !keyGrid) return;
    
    grid.innerHTML = '';
    keyGrid.innerHTML = '';
    
    const topic = document.getElementById('ws-topic').value;
    const type = document.getElementById('ws-fraction-type').value;
    const numProblems = 10;
    
    for (let i = 0; i < numProblems; i++) {
        let p;
        switch(topic) {
            case 'concepts':
                p = generateConceptsProblem();
                break;
            case 'addsub':
                p = generateAddSubProblem(type);
                break;
            case 'multiply':
                p = generateMultProblem(type);
                break;
            case 'divide':
                p = generateDivProblem(type);
                break;
            default:
                p = generateAddSubProblem(type);
        }
        
        // Problem Card
        const card = document.createElement('div');
        card.className = 'flex flex-col mb-12 print:mb-16 print:break-inside-avoid';
        
        const header = document.createElement('div');
        header.className = 'font-bold text-gray-500 mb-4';
        header.textContent = `${i + 1}.`;
        
        const eqDiv = document.createElement('div');
        eqDiv.className = 'text-3xl font-medium px-4';
        
        let problemTex = `${p.texInitial}`;
        if (topic !== 'concepts') {
            problemTex += ' = ';
        } else {
            problemTex += ' \\rightarrow \\text{ ?}';
        }
        
        if (window.MathRenderer) {
            window.MathRenderer.renderBlock(problemTex, eqDiv);
        } else if (window.katex) {
            katex.render(problemTex, eqDiv, { throwOnError: false, displayMode: true });
        }
        
        card.appendChild(header);
        card.appendChild(eqDiv);
        grid.appendChild(card);
        
        // Answer Key Card
        const keyCard = document.createElement('div');
        keyCard.className = 'flex flex-col print:break-inside-avoid mb-8';
        
        const keyHeader = document.createElement('div');
        keyHeader.className = 'font-bold text-gray-500 mb-2';
        keyHeader.textContent = `${i + 1}.`;
        
        const keyEq = document.createElement('div');
        keyEq.className = 'text-xl font-medium text-blue-600';
        
        let ansTex = `${p.texInitial}`;
        if (topic !== 'concepts') {
            ansTex += ' = ';
            let stepsTex = p.steps.filter(s => s.type !== 'find_lcd' && s.type !== 'categorize').map(s => s.tex).join(' = ');
            ansTex += stepsTex;
        } else {
            let stepsTex = p.steps.map(s => s.tex).join(' \\rightarrow ');
            ansTex += ` \\rightarrow ${stepsTex}`;
        }
        
        if (window.MathRenderer) {
            window.MathRenderer.renderBlock(ansTex, keyEq);
        } else if (window.katex) {
            katex.render(ansTex, keyEq, { throwOnError: false, displayMode: true });
        }
        
        keyCard.appendChild(keyHeader);
        keyCard.appendChild(keyEq);
        keyGrid.appendChild(keyCard);
    }
}
