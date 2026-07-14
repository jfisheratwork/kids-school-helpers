// Core App Initialization
import { initLongDivisionSolver } from './solver-ui-long-division.js';
import { initFractionsSolver } from './solver-ui-fractions-division.js';
import { initWorksheetGenerator } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    initLongDivisionSolver();
    initFractionsSolver();
    initWorksheetGenerator();

    // Mode Switching Logic
    const btnLongDivision = document.getElementById('btn-mode-long-division');
    const btnFractions = document.getElementById('btn-mode-fractions');
    const btnWorksheet = document.getElementById('btn-mode-worksheet');

    const containerLongDivision = document.getElementById('mode-long-division-container');
    const containerFractions = document.getElementById('mode-fractions-container');
    const containerWorksheet = document.getElementById('mode-worksheet-container');
    
    const guideLongDivision = document.getElementById('guide-long-division');

    function switchMode(mode) {
        // Reset buttons
        [btnLongDivision, btnFractions, btnWorksheet].forEach(btn => {
            btn.className = "px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 font-medium hover:bg-gray-50 transition";
        });

        // Hide all containers
        [containerLongDivision, containerFractions, containerWorksheet].forEach(container => {
            if (container) container.classList.add('hidden');
        });

        // Show selected mode
        if (mode === 'long-division') {
            btnLongDivision.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerLongDivision.classList.remove('hidden');
            if (guideLongDivision) guideLongDivision.style.display = 'block';
            // guideFractions.style.display = 'none';
        } else if (mode === 'fractions') {
            btnFractions.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerFractions.classList.remove('hidden');
            if (guideLongDivision) guideLongDivision.style.display = 'none';
        } else if (mode === 'worksheet') {
            btnWorksheet.className = "px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-secondary transition";
            containerWorksheet.classList.remove('hidden');
            if (guideLongDivision) guideLongDivision.style.display = 'none';
        }
    }

    btnLongDivision.addEventListener('click', () => switchMode('long-division'));
    btnFractions.addEventListener('click', () => switchMode('fractions'));
    btnWorksheet.addEventListener('click', () => switchMode('worksheet'));
});
