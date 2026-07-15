import { initSolverUI } from './solver-ui.js';
import { initWorksheetGenerator } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    initSolverUI();
    initWorksheetGenerator();

    const btnInteractive = document.getElementById('tab-interactive');
    const btnWorksheet = document.getElementById('tab-worksheet');

    const containerInteractive = document.getElementById('interactive-workspace');
    const containerWorksheet = document.getElementById('worksheet-workspace');

    function switchTab(tab) {
        // Reset buttons
        [btnInteractive, btnWorksheet].forEach(btn => {
            btn.className = "px-4 py-2 rounded-md bg-white text-gray-700 border border-transparent font-medium hover:text-gray-700 hover:border-gray-300 transition";
        });

        // Hide all containers
        [containerInteractive, containerWorksheet].forEach(container => {
            if (container) container.classList.add('hidden');
        });

        if (tab === 'interactive') {
            btnInteractive.className = "px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-500 font-medium transition";
            containerInteractive.classList.remove('hidden');
        } else if (tab === 'worksheet') {
            btnWorksheet.className = "px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-500 font-medium transition";
            containerWorksheet.classList.remove('hidden');
        }
    }

    btnInteractive.addEventListener('click', () => switchTab('interactive'));
    btnWorksheet.addEventListener('click', () => switchTab('worksheet'));
});
