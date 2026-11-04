import { initF2DSolver } from './solver-ui.js';
import { initF2DGuide, renderF2DGuide } from './guide.js';
import { initF2DWorksheetGenerator } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabInteractive = document.getElementById('tab-interactive');
    const tabWorksheet = document.getElementById('tab-worksheet');
    const viewInteractive = document.getElementById('interactive-workspace');
    const viewWorksheet = document.getElementById('worksheet-workspace');

    if (tabInteractive && tabWorksheet) {
        tabInteractive.addEventListener('click', () => {
            tabInteractive.className = 'px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-500 transition';
            tabWorksheet.className = 'px-4 py-2 rounded-md bg-white text-gray-500 border border-transparent font-medium hover:bg-gray-50 hover:text-gray-700 transition';
            viewInteractive.classList.remove('hidden');
            viewWorksheet.classList.add('hidden');
        });

        tabWorksheet.addEventListener('click', () => {
            tabWorksheet.className = 'px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-500 transition';
            tabInteractive.className = 'px-4 py-2 rounded-md bg-white text-gray-500 border border-transparent font-medium hover:bg-gray-50 hover:text-gray-700 transition';
            viewWorksheet.classList.remove('hidden');
            viewInteractive.classList.add('hidden');
        });
    }

    const wsComplexity = document.getElementById('ws-complexity');
    if (wsComplexity) {
        wsComplexity.addEventListener('change', (e) => {
            renderF2DGuide(e.target.value);
        });
    }

    initF2DGuide();
    initF2DSolver();
    initF2DWorksheetGenerator();
});
