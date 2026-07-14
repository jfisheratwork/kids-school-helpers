import { initFractionsSolver } from './solver-ui.js';
import { generateWorksheet } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    // Mode Switching
    const tabInteractive = document.getElementById('tab-interactive');
    const tabWorksheet = document.getElementById('tab-worksheet');
    const viewInteractive = document.getElementById('interactive-workspace');
    const viewWorksheet = document.getElementById('worksheet-workspace');
    
    // Config Panels
    const configInteractive = document.getElementById('config-interactive');
    const configWorksheet = document.getElementById('config-worksheet');

    tabInteractive.addEventListener('click', () => {
        tabInteractive.classList.add('bg-indigo-50', 'text-indigo-700', 'border-indigo-500');
        tabInteractive.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        
        tabWorksheet.classList.remove('bg-indigo-50', 'text-indigo-700', 'border-indigo-500');
        tabWorksheet.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        
        viewInteractive.classList.remove('hidden');
        viewWorksheet.classList.add('hidden');
        
        configInteractive.classList.remove('hidden');
        configWorksheet.classList.add('hidden');
    });

    tabWorksheet.addEventListener('click', () => {
        tabWorksheet.classList.add('bg-indigo-50', 'text-indigo-700', 'border-indigo-500');
        tabWorksheet.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        
        tabInteractive.classList.remove('bg-indigo-50', 'text-indigo-700', 'border-indigo-500');
        tabInteractive.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        
        viewWorksheet.classList.remove('hidden');
        viewInteractive.classList.add('hidden');
        
        configWorksheet.classList.remove('hidden');
        configInteractive.classList.add('hidden');
    });

    // Handle Topic Dropdown logic (hide fraction type when concepts is selected)
    const topicSelect = document.getElementById('config-topic');
    const fracTypeContainer = document.getElementById('config-fraction-type-container');
    topicSelect.addEventListener('change', (e) => {
        if (e.target.value === 'concepts') {
            fracTypeContainer.classList.add('hidden');
        } else {
            fracTypeContainer.classList.remove('hidden');
        }
    });

    const wsTopicSelect = document.getElementById('ws-topic');
    const wsFracTypeContainer = document.getElementById('ws-fraction-type-container');
    wsTopicSelect.addEventListener('change', (e) => {
        if (e.target.value === 'concepts') {
            wsFracTypeContainer.classList.add('hidden');
        } else {
            wsFracTypeContainer.classList.remove('hidden');
        }
    });

    // Initialize Interactive Solver
    initFractionsSolver();
    
    // Trigger initial generation
    const btnGen = document.getElementById('btn-generate-fractions');
    if (btnGen) btnGen.click();

    // Initialize Worksheet Generator
    const btnGenWs = document.getElementById('btn-generate-worksheet');
    if(btnGenWs) {
        btnGenWs.addEventListener('click', () => {
            generateWorksheet();
            document.getElementById('btn-print-worksheet').classList.remove('hidden');
        });
    }
});
