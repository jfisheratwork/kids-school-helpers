// Core App Initialization
import { initStandardSolver } from './solver-ui-standard.js';
import { initFractionsSolver } from './solver-ui-fractions.js';
import { initWorksheetGenerator } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    initStandardSolver();
    initFractionsSolver();
    initWorksheetGenerator();

    // Mode Switching Logic
    const btnStandard = document.getElementById('btn-mode-standard');
    const btnFractions = document.getElementById('btn-mode-fractions');
    const btnWorksheet = document.getElementById('btn-mode-worksheet');

    const containerStandard = document.getElementById('mode-standard-container');
    const containerFractions = document.getElementById('mode-fractions-container');
    const containerWorksheet = document.getElementById('mode-worksheet-container');
    
    const guideStandard = document.getElementById('guide-standard');

    function switchMode(mode) {
        // Reset buttons
        [btnStandard, btnFractions, btnWorksheet].forEach(btn => {
            btn.className = "px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 font-medium hover:bg-gray-50 transition";
        });

        // Hide all containers
        [containerStandard, containerFractions, containerWorksheet].forEach(container => {
            if (container) container.classList.add('hidden');
        });

        // Show selected mode
        if (mode === 'standard') {
            btnStandard.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerStandard.classList.remove('hidden');
            if (guideStandard) guideStandard.style.display = 'block';
            // guideFractions.style.display = 'none';
        } else if (mode === 'fractions') {
            btnFractions.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerFractions.classList.remove('hidden');
            if (guideStandard) guideStandard.style.display = 'none';
        } else if (mode === 'worksheet') {
            btnWorksheet.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerWorksheet.classList.remove('hidden');
            if (guideStandard) guideStandard.style.display = 'none';
        }
    }

    btnStandard.addEventListener('click', () => switchMode('standard'));
    btnFractions.addEventListener('click', () => switchMode('fractions'));
    btnWorksheet.addEventListener('click', () => switchMode('worksheet'));
});
