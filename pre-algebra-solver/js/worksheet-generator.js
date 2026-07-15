export function generateWorksheet() {
  const count = parseInt(document.getElementById('gen-count').value, 10);
  const steps = parseInt(document.getElementById('gen-steps').value, 10);
  const allowNegatives = document.getElementById('gen-negatives').checked;
  const allowFractions = document.getElementById('gen-fractions').checked;
  const allowParenthesis = document.getElementById('gen-parenthesis').checked;

  const documentWrapper = document.getElementById('worksheet-document');
  documentWrapper.innerHTML = ''; // Clear previous pages

  // Generate all equations
  const equations = [];
  for (let i = 0; i < count; i++) {
    equations.push(window.EquationGenerator.generate({
      steps,
      allowNegatives,
      allowFractions,
      allowParenthesis
    }));
  }

  // Generate Problem Pages (6 problems per page: 3 rows x 2 cols)
  const problemsPerPage = 6;
  const numProblemPages = Math.ceil(count / problemsPerPage);

  for (let p = 0; p < numProblemPages; p++) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'worksheet-page print:break-after-page relative pb-10 p-8';
    
    // Header
    const header = document.createElement('div');
    let headerHtml = '';
    if (p === 0) {
        headerHtml = `
            <div class="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                <div><h2 class="text-2xl font-bold text-gray-900">Pre-Algebra Practice</h2></div>
                <div class="text-right text-sm text-gray-700 space-y-1">
                    <p>Name: ________________________</p>
                    <p>Date: ________________________</p>
                </div>
            </div>
        `;
    } else {
        headerHtml = `
            <div class="border-b-2 border-gray-900 pb-4 mb-6">
                <h2 class="text-xl font-bold text-gray-900">Pre-Algebra Practice (Page ${p + 1})</h2>
            </div>
        `;
    }
    pageDiv.innerHTML = headerHtml;

    // Grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-x-8 gap-y-10 min-h-[7.5in]';

    const startIdx = p * problemsPerPage;
    const endIdx = Math.min(startIdx + problemsPerPage, count);

    for (let i = startIdx; i < endIdx; i++) {
      const eq = equations[i];
      const cell = document.createElement('div');
      cell.className = 'border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col justify-between';
      
      const workspaceBr = '<br>'.repeat(eq.steps.length * 2);

      cell.innerHTML = `
        <div class="font-bold text-gray-600 text-sm mb-2 select-none">Problem ${i + 1}</div>
        <div class="math-problem-display text-center text-xl mb-2"></div>
        <div class="font-mono text-sm text-gray-300 select-none leading-relaxed">${workspaceBr}</div>
        <div class="text-[10px] text-gray-300 uppercase tracking-wider text-right mt-2 font-semibold select-none">Show work here</div>
      `;
      grid.appendChild(cell);

      const eqLaTeX = `${eq.initialLHS} = ${eq.initialRHS}`;
      window.MathRenderer.renderBlock(eqLaTeX, cell.querySelector('.math-problem-display'));
    }

    pageDiv.appendChild(grid);
    documentWrapper.appendChild(pageDiv);
  }

  // Generate Answer Key Pages (8 answers per page: 4 rows x 2 cols)
  const answersPerPage = 8;
  const numAnswerPages = Math.ceil(count / answersPerPage);

  for (let p = 0; p < numAnswerPages; p++) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'worksheet-page worksheet-key-page relative pt-10 p-8';
    if (p < numAnswerPages - 1) {
        pageDiv.classList.add('print:break-after-page');
    }
    pageDiv.id = p === 0 ? 'worksheet-key-page-first' : ''; // Use for toggling visibility of all keys
    
    // Header
    const headerHtml = `
        <div class="border-b-2 border-gray-900 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Answer Key (Page ${p + 1})</h2>
        </div>
    `;
    pageDiv.innerHTML = headerHtml;

    // Grid
    const keyGrid = document.createElement('div');
    keyGrid.className = 'grid grid-cols-2 gap-x-8 gap-y-6';

    const startIdx = p * answersPerPage;
    const endIdx = Math.min(startIdx + answersPerPage, count);

    for (let i = startIdx; i < endIdx; i++) {
      const eq = equations[i];
      const answerCell = document.createElement('div');
      answerCell.className = 'border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2';
      answerCell.innerHTML = `
        <div class="font-bold text-gray-700 text-sm">Problem ${i + 1}</div>
        <div class="math-key-display text-md font-semibold text-indigo-700"></div>
        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2 border-t border-gray-200/50 pt-2">Steps:</div>
        <div class="math-key-steps space-y-1"></div>
      `;
      keyGrid.appendChild(answerCell);

      const eqLaTeX = `${eq.initialLHS} = ${eq.initialRHS}`;
      window.MathRenderer.renderInline(`${eqLaTeX} \\implies x = ${eq.solution.toLaTeX()}`, answerCell.querySelector('.math-key-display'));

      const stepsList = answerCell.querySelector('.math-key-steps');
      eq.steps.forEach((s, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'flex items-center space-x-1.5 text-xs font-mono text-gray-600';
        stepDiv.innerHTML = `<span>Step ${idx + 1} (${s.type}):</span> <span class="math-step-latex"></span>`;
        stepsList.appendChild(stepDiv);
        window.MathRenderer.renderInline(s.latex, stepDiv.querySelector('.math-step-latex'));
      });
    }

    pageDiv.appendChild(keyGrid);
    documentWrapper.appendChild(pageDiv);
  }

  updateAnswerKeyVisibility();
}

export function updateAnswerKeyVisibility() {
  const includeKey = document.getElementById('gen-show-key').checked;
  const keyPages = document.querySelectorAll('.worksheet-key-page');
  
  keyPages.forEach(page => {
    if (includeKey) {
      page.classList.remove('hidden');
      page.classList.remove('no-print');
    } else {
      page.classList.add('hidden');
      page.classList.add('no-print');
    }
  });
}

export function initWorksheetEvents() {
  document.getElementById('gen-show-key').addEventListener('change', updateAnswerKeyVisibility);
  document.getElementById('btn-generate-sheet').addEventListener('click', generateWorksheet);
  document.getElementById('btn-print-sheet').addEventListener('click', () => {
    window.print();
  });
}
