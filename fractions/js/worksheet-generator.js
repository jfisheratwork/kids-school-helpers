import { generateConceptsProblem } from './generator-concepts.js';
import { generateAddSubProblem } from './generator-addsub.js';
import { generateMultProblem } from './generator-mult.js';
import { generateDivProblem } from './generator-div.js';

export function generateWorksheet() {
    const topic = document.getElementById('ws-topic').value;
    const type = document.getElementById('ws-fraction-type').value;
    const numProblemsStr = document.getElementById('ws-num-problems')?.value || "10";
    const numProblems = parseInt(numProblemsStr, 10);
    
    const documentContainer = document.getElementById('worksheet-document');
    const btnPrint = document.getElementById('btn-print-worksheet');
    if (!documentContainer) return;
    
    documentContainer.innerHTML = '';
    
    const problems = [];
    for (let i = 0; i < numProblems; i++) {
        let p;
        switch(topic) {
            case 'concepts': p = generateConceptsProblem(); break;
            case 'addsub': p = generateAddSubProblem(type); break;
            case 'multiply': p = generateMultProblem(type); break;
            case 'divide': p = generateDivProblem(type); break;
            default: p = generateAddSubProblem(type);
        }
        problems.push(p);
    }
    
    // Pagination logic (10 per page)
    const PROBLEMS_PER_PAGE = 10;
    const numPages = Math.ceil(numProblems / PROBLEMS_PER_PAGE);
    
    const topicName = document.getElementById('ws-topic').options[document.getElementById('ws-topic').selectedIndex].text;
    
    // Generate Worksheet Pages
    for (let page = 0; page < numPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page print:break-after-page relative pb-10 p-8";
        
        let headerHtml = '';
        if (page === 0) {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                    <div><h2 class="text-2xl font-bold text-gray-900">Fractions Practice: ${topicName}</h2></div>
                    <div class="text-right text-sm text-gray-700 space-y-1">
                        <p>Name: ________________________</p>
                        <p>Date: ________________________</p>
                    </div>
                </div>
            `;
        } else {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Fractions Practice: ${topicName} (Page ${page + 1})</h2>
                </div>
            `;
        }
        
        const gridDiv = document.createElement('div');
        gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-16";
        
        const startIndex = page * PROBLEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, numProblems);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            
            const div = document.createElement('div');
            div.className = "flex flex-col mb-4";
            
            let problemTex = `${p.texInitial}`;
            if (topic !== 'concepts') {
                problemTex += ' = ';
            } else {
                problemTex += ' \\rightarrow \\text{ ?}';
            }
            
            div.innerHTML = `
                <div class="font-bold text-gray-500 mb-6">${probNum}.</div>
                <div class="text-3xl font-medium px-4 text-center" id="ws-prob-tex-${probNum}"></div>
            `;
            gridDiv.appendChild(div);
        }
        
        pageDiv.innerHTML = headerHtml;
        pageDiv.appendChild(gridDiv);
        documentContainer.appendChild(pageDiv);
        
        // Render math for this page
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            
            let problemTex = `${p.texInitial}`;
            if (topic !== 'concepts') {
                problemTex += ' = ';
            } else {
                problemTex += ' \\rightarrow \\text{ ?}';
            }
            
            const eqDiv = pageDiv.querySelector(`#ws-prob-tex-${probNum}`);
            if (window.MathRenderer) {
                window.MathRenderer.renderBlock(problemTex, eqDiv);
            } else if (window.katex) {
                katex.render(problemTex, eqDiv, { throwOnError: false, displayMode: true });
            }
        }
    }
    
    // Generate Answer Key Pages
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
        const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, numProblems);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            
            const keyDiv = document.createElement('div');
            keyDiv.className = "flex items-start space-x-4 mb-4";
            
            keyDiv.innerHTML = `
                <div class="font-bold text-gray-500">${probNum}.</div>
                <div class="text-xl font-medium text-blue-600" id="ws-ans-tex-${probNum}"></div>
            `;
            gridDiv.appendChild(keyDiv);
        }
        
        pageDiv.appendChild(gridDiv);
        documentContainer.appendChild(pageDiv);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            
            let ansTex = `${p.texInitial}`;
            if (topic !== 'concepts') {
                ansTex += ' = ';
                let stepsTex = p.steps.filter(s => s.type !== 'find_lcd' && s.type !== 'categorize').map(s => s.tex).join(' = ');
                ansTex += stepsTex;
            } else {
                let stepsTex = p.steps.map(s => s.tex).join(' \\rightarrow ');
                ansTex += ` \\rightarrow ${stepsTex}`;
            }
            
            const keyEq = pageDiv.querySelector(`#ws-ans-tex-${probNum}`);
            if (window.MathRenderer) {
                window.MathRenderer.renderBlock(ansTex, keyEq);
            } else if (window.katex) {
                katex.render(ansTex, keyEq, { throwOnError: false, displayMode: true });
            }
        }
    }
    
    if (btnPrint) btnPrint.classList.remove('hidden');
}
