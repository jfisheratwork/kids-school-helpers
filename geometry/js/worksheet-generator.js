import { generateAreaPerimeterProblem, generateVolumeProblem, generateAnglesProblem, generatePythagoreanProblem } from './generator-geometry.js';
import { renderShapeSVG } from './renderer-shapes.js';

export function initWorksheetGenerator() {
    const btnGenerate = document.getElementById('btn-generate-worksheet');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateWorksheet);
    }
    
    const topicSelect = document.getElementById('ws-topic');
    if (topicSelect) {
        topicSelect.addEventListener('change', (e) => {
            const adv = document.getElementById('ws-advanced-options');
            if (e.target.value === 'area') {
                adv.classList.remove('hidden');
                adv.classList.add('flex');
            } else {
                adv.classList.add('hidden');
                adv.classList.remove('flex');
            }
        });
    }
}

function generateWorksheet() {
    const topic = document.getElementById('ws-topic').value;
    const numProblems = parseInt(document.getElementById('ws-num-problems').value);
    
    // Read checkbox arrays
    const shapes = [];
    if (document.getElementById('chk-shape-rect')?.checked) shapes.push('rect');
    if (document.getElementById('chk-shape-triangle')?.checked) shapes.push('triangle');
    if (document.getElementById('chk-shape-circle')?.checked) shapes.push('circle');
    // Default fallback if they unchecked everything
    if (shapes.length === 0) shapes.push('rect');
    
    const calcs = [];
    if (document.getElementById('chk-calc-area')?.checked) calcs.push('area');
    if (document.getElementById('chk-calc-perimeter')?.checked) calcs.push('perimeter');
    if (document.getElementById('chk-calc-diameter')?.checked) calcs.push('diameter');
    if (calcs.length === 0) calcs.push('area');

    const documentContainer = document.getElementById('worksheet-document');
    const btnPrint = document.getElementById('btn-print-worksheet');
    
    documentContainer.innerHTML = '';
    
    const problems = [];
    
    for (let i = 1; i <= numProblems; i++) {
        let p;
        if (topic === 'area') {
            p = generateAreaPerimeterProblem(shapes, calcs);
        } else if (topic === 'volume') {
            p = generateVolumeProblem(); // will upgrade this later
        } else if (topic === 'angles') {
            p = generateAnglesProblem();
        } else if (topic === 'pythagorean') {
            p = generatePythagoreanProblem();
        }
        problems.push(p);
    }
    
    // Pagination logic (6 per page)
    const PROBLEMS_PER_PAGE = 6;
    const numPages = Math.ceil(numProblems / PROBLEMS_PER_PAGE);
    
    // Generate Worksheet Pages
    for (let page = 0; page < numPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page print:break-after-page relative pb-10 p-8";
        
        let headerHtml = '';
        if (page === 0) {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                    <div><h2 class="text-2xl font-bold text-gray-900">Geometry Practice</h2></div>
                    <div class="text-right text-sm text-gray-700 space-y-1">
                        <p>Name: ________________________</p>
                        <p>Date: ________________________</p>
                    </div>
                </div>
            `;
        } else {
            headerHtml = `
                <div class="border-b-2 border-gray-900 pb-4 mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Geometry Practice (Page ${page + 1})</h2>
                </div>
            `;
        }
        
        const gridDiv = document.createElement('div');
        gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-12";
        
        const startIndex = page * PROBLEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, numProblems);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            
            const div = document.createElement('div');
            div.className = "flex flex-col items-center space-y-4";
            div.innerHTML = `
                <div class="w-full font-bold text-gray-500 text-left">${probNum}.</div>
                <div id="ws-prob-visual-${probNum}" class="w-48 h-48"></div>
                <div class="text-xl w-full text-center" id="ws-prob-tex-${probNum}"></div>
                <div class="w-full border-b border-gray-300 mt-8 mb-4"></div>
                <div class="w-full border-b border-gray-300 mb-4"></div>
                <div class="w-full border-b border-gray-300 mb-4"></div>
            `;
            gridDiv.appendChild(div);
        }
        
        pageDiv.innerHTML = headerHtml;
        pageDiv.appendChild(gridDiv);
        documentContainer.appendChild(pageDiv);
        
        // Render SVGs and Katex for this page
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            renderShapeSVG(p.shapeType, p.params, `ws-prob-visual-${probNum}`);
            if (window.katex) {
                const cleanTex = p.initialTex.replace(/\\htmlId{[^}]+}{([^}]+)}/g, '$1');
                katex.render(cleanTex, pageDiv.querySelector(`#ws-prob-tex-${probNum}`), { throwOnError: false, displayMode: true });
            }
        }
    }
    
    // Generate Answer Key Pages
    for (let page = 0; page < numPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page relative pt-10 p-8";
        // Force break after page unless it's the very last page
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
            keyDiv.className = "flex items-start space-x-4";
            
            const finalStep = p.steps[p.steps.length - 1];
            const cleanAnsTex = finalStep.tex.replace(/\\htmlId{[^}]+}{([^}]+)}/g, '$1');
            
            keyDiv.innerHTML = `<span class="font-bold text-gray-500">${probNum}.</span> <div class="text-xl text-emerald-700" id="ws-ans-${probNum}"></div>`;
            gridDiv.appendChild(keyDiv);
        }
        
        pageDiv.appendChild(gridDiv);
        documentContainer.appendChild(pageDiv);
        
        for (let i = startIndex; i < endIndex; i++) {
            const probNum = i + 1;
            const p = problems[i];
            const finalStep = p.steps[p.steps.length - 1];
            const cleanAnsTex = finalStep.tex.replace(/\\htmlId{[^}]+}{([^}]+)}/g, '$1');
            if (window.katex) {
                katex.render(cleanAnsTex, pageDiv.querySelector(`#ws-ans-${probNum}`), { throwOnError: false, displayMode: true });
            }
        }
    }
    
    btnPrint.classList.remove('hidden');
}
