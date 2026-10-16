export class WorksheetLayout {
    static generate(options) {
        const {
            containerId,
            title,
            problems, // Array of { tex, ansTex }
            problemsPerPage = 12,
            includeKey = true
        } = options;

        const doc = document.getElementById(containerId);
        if (!doc) return;
        doc.innerHTML = '';

        const numProblems = problems.length;
        const numPages = Math.ceil(numProblems / problemsPerPage);

        // Render Problems
        for (let page = 0; page < numPages; page++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = "worksheet-page print:break-after-page relative pb-10 p-8";
            
            let headerHtml = '';
            if (page === 0) {
                headerHtml = `
                    <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                        <div><h2 class="text-2xl font-bold text-gray-900">${title}</h2></div>
                        <div class="text-right text-sm text-gray-700 space-y-1">
                            <p>Name: ________________________</p>
                            <p>Date: ________________________</p>
                        </div>
                    </div>
                `;
            } else {
                headerHtml = `
                    <div class="border-b-2 border-gray-900 pb-4 mb-6">
                        <h2 class="text-xl font-bold text-gray-900">${title} (Page ${page + 1})</h2>
                    </div>
                `;
            }
            
            const gridDiv = document.createElement('div');
            gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-12";
            
            const startIndex = page * problemsPerPage;
            const endIndex = Math.min(startIndex + problemsPerPage, numProblems);
            
            for (let i = startIndex; i < endIndex; i++) {
                const probNum = i + 1;
                const div = document.createElement('div');
                div.className = "flex items-start space-x-4 mb-4 w-full";
                div.innerHTML = `
                    <div class="font-bold text-gray-500">${probNum}.</div>
                    <div class="text-2xl font-medium px-4 text-center overflow-x-auto w-full" id="ws-prob-tex-${probNum}"></div>
                `;
                gridDiv.appendChild(div);
            }
            
            pageDiv.innerHTML = headerHtml;
            pageDiv.appendChild(gridDiv);
            doc.appendChild(pageDiv);
            
            // Render Math
            for (let i = startIndex; i < endIndex; i++) {
                const probNum = i + 1;
                const p = problems[i];
                const eqDiv = pageDiv.querySelector(`#ws-prob-tex-${probNum}`);
                if (window.MathRenderer) {
                    window.MathRenderer.renderBlock(p.tex, eqDiv);
                } else if (window.katex) {
                    katex.render(p.tex, eqDiv, { throwOnError: false, displayMode: true });
                }
            }
        }

        // Render Key
        if (includeKey) {
            for (let page = 0; page < numPages; page++) {
                const pageDiv = document.createElement('div');
                pageDiv.className = "worksheet-page relative pt-10 p-8";
                if (page < numPages - 1) {
                    pageDiv.classList.add('print:break-after-page');
                }
                
                pageDiv.innerHTML = `
                    <div class="border-b-2 border-gray-900 pb-4 mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Answer Key: ${title} (Page ${page + 1})</h2>
                    </div>
                `;
                
                const gridDiv = document.createElement('div');
                gridDiv.className = "grid grid-cols-2 gap-x-8 gap-y-12";
                
                const startIndex = page * problemsPerPage;
                const endIndex = Math.min(startIndex + problemsPerPage, numProblems);
                
                for (let i = startIndex; i < endIndex; i++) {
                    const probNum = i + 1;
                    const keyDiv = document.createElement('div');
                    keyDiv.className = "flex items-start space-x-4 mb-4 w-full";
                    keyDiv.innerHTML = `
                        <div class="font-bold text-gray-500">${probNum}.</div>
                        <div class="text-xl font-medium text-blue-700 text-center overflow-x-auto w-full" id="ws-ans-tex-${probNum}"></div>
                    `;
                    gridDiv.appendChild(keyDiv);
                }
                
                pageDiv.appendChild(gridDiv);
                doc.appendChild(pageDiv);
                
                for (let i = startIndex; i < endIndex; i++) {
                    const probNum = i + 1;
                    const p = problems[i];
                    const keyEq = pageDiv.querySelector(`#ws-ans-tex-${probNum}`);
                    if (window.MathRenderer) {
                        window.MathRenderer.renderBlock(p.ansTex, keyEq);
                    } else if (window.katex) {
                        katex.render(p.ansTex, keyEq, { throwOnError: false, displayMode: true });
                    }
                }
            }
        }

        doc.classList.remove('hidden');
    }

    static renderCustomPage(containerId, title, htmlContent, renderMath = null) {
        const doc = document.getElementById(containerId);
        if (!doc) return;
        
        const pageDiv = document.createElement('div');
        pageDiv.className = "worksheet-page relative pb-10 p-8";
        pageDiv.innerHTML = `
            <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                <div><h2 class="text-2xl font-bold text-gray-900">${title}</h2></div>
            </div>
            ${htmlContent}
        `;
        doc.appendChild(pageDiv);
        doc.classList.remove('hidden');
        if (renderMath) renderMath(pageDiv);
    }
}
