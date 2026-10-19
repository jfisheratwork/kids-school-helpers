import { WorksheetLayout } from '../../shared/js/worksheet-layout.js';
import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';

export function generateWorksheet() {
    const topic = document.getElementById('ws-topic').value;
    const type = document.getElementById('ws-fraction-type').value;
    const digits = parseInt(document.getElementById('ws-digit-size')?.value || "1", 10);
    const numProblemsStr = document.getElementById('ws-num-problems')?.value || "10";
    const numProblems = parseInt(numProblemsStr, 10);
    const btnPrint = document.getElementById('btn-print-worksheet');
    
    const problemsData = [];
    for (let i = 0; i < numProblems; i++) {
        let p;
        switch(topic) {
            case 'concepts': p = generateConceptsProblem(digits); break;
            case 'addsub': p = generateAddSubProblem(type, digits); break;
            case 'multiply': p = generateMultProblem(type, digits); break;
            case 'divide': p = generateDivProblem(type, digits); break;
            default: p = generateAddSubProblem(type, digits);
        }
        
        let problemTex = p.texInitial;
        if (topic !== 'concepts') {
            problemTex += ' = ';
        } else {
            problemTex += ' \\rightarrow \\text{ ?}';
        }
        
        let ansTex = p.texInitial;
        if (topic !== 'concepts') {
            ansTex += ' = ';
            let stepsTex = p.steps.filter(s => s.type !== 'find_lcd' && s.type !== 'categorize').map(s => s.tex).join(' = ');
            ansTex += stepsTex;
        } else {
            let stepsTex = p.steps.map(s => s.tex).join(' \\rightarrow ');
            ansTex += ` \\rightarrow ${stepsTex}`;
        }
        
        problemsData.push({ tex: problemTex, ansTex: ansTex });
    }
    
    const topicName = document.getElementById('ws-topic').options[document.getElementById('ws-topic').selectedIndex].text;
    
    WorksheetLayout.generate({
        containerId: 'worksheet-document',
        title: `Fractions Practice: ${topicName}`,
        problems: problemsData,
        problemsPerPage: 10,
        includeKey: true
    });
    
    if (btnPrint) btnPrint.classList.remove('hidden');
}
