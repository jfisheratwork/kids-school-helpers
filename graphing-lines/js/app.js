import { state } from './state.js';
import { generateEquation } from './generator.js';
import { initGraph, drawInfiniteLine, clearGraph } from './graph-renderer.js';
import { initSolverUI, updateUI } from './solver-ui.js';
import { initHintsPlayer } from './hints-player.js';
import { generateWorksheet } from './worksheet-generator.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Math Renderer Bridge (use KaTeX global)
  window.MathRenderer = {
    renderInline: (latex, element) => katex.render(latex, element, { displayMode: false }),
    renderBlock: (latex, element) => katex.render(latex, element, { displayMode: true })
  };

  // 2. Initialize Graph Renderer
  initGraph('graph-container');

  // 3. Initialize Solver UI & Hints
  initSolverUI();
  initHintsPlayer();

  // 4. Setup Lesson Toggle
  const btnToggleLesson = document.getElementById('btn-toggle-lesson');
  const lessonSection = document.getElementById('lesson-section');
  const iconOpen = document.getElementById('icon-lesson-open');
  const iconClosed = document.getElementById('icon-lesson-closed');
  const textToggle = document.getElementById('text-lesson-toggle');

  if (btnToggleLesson && lessonSection) {
    btnToggleLesson.addEventListener('click', () => {
      const isHidden = lessonSection.classList.contains('hidden');
      if (isHidden) {
        lessonSection.classList.remove('hidden');
        iconOpen.classList.remove('hidden');
        iconClosed.classList.add('hidden');
        textToggle.textContent = 'Hide Lesson';
      } else {
        lessonSection.classList.add('hidden');
        iconOpen.classList.add('hidden');
        iconClosed.classList.remove('hidden');
        textToggle.textContent = 'Show Lesson: Coordinate Planes & Lines';
      }
    });
  }

  // 3. Setup Mode Tabs
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update UI active state
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active', 'bg-white', 'text-indigo-700', 'shadow-sm');
        b.classList.add('text-gray-600');
      });
      e.target.classList.remove('text-gray-600');
      e.target.classList.add('active', 'bg-white', 'text-indigo-700', 'shadow-sm');

      // Update State
      const id = e.target.id;
      if (id === 'btn-mode-interactive') state.currentMode = 'interactive';
      else if (id === 'btn-mode-determine') state.currentMode = 'determine';
      else if (id === 'btn-mode-worksheet') state.currentMode = 'worksheet';
      
      toggleWorkspaces();
      generateNew();
    });
  });

  // 5. Setup Config Sync
  document.getElementById('config-equation-type').addEventListener('change', e => {
    state.config.equationType = e.target.value;
  });
  document.getElementById('config-slope-type').addEventListener('change', e => {
    state.config.slopeType = e.target.value;
  });
  document.getElementById('config-worksheet-type').addEventListener('change', e => {
    state.config.worksheetType = e.target.value;
    if (state.currentMode === 'worksheet') generateWorksheet();
  });
  document.getElementById('config-show-key').addEventListener('change', e => {
    state.config.showKey = e.target.checked;
    if (state.currentMode === 'worksheet') generateWorksheet();
  });

  // 6. Generate Button
  document.getElementById('btn-generate').addEventListener('click', () => {
    generateNew();
  });

  // Initial setup
  generateNew();
});

function generateNew() {
  if (state.currentMode === 'worksheet') {
    generateWorksheet();
  } else {
    clearGraph();
    document.getElementById('history-list').innerHTML = '';
    const eqInput = document.getElementById('equation-input');
    if (eqInput) {
      eqInput.value = '';
      eqInput.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50');
    }
    
    const eq = generateEquation();
    state.resetInteractive(); // Sets step to 0, clears plotted points
    
    // Update Target Equation display
    const targetDisp = document.getElementById('target-equation-display');
    if (targetDisp) {
      window.MathRenderer.renderBlock(eq.latex, targetDisp);
    }

    if (state.currentMode === 'determine') {
      // In determine mode, we just draw the line immediately
      let mNum = 0, mDen = 1, b = 0;
      if (eq.type === 'slope-intercept') {
        mNum = eq.m.num; mDen = eq.m.den; b = eq.b;
      } else {
        mNum = -eq.A; mDen = eq.B; b = eq.C / eq.B;
      }
      drawInfiniteLine(mNum, mDen, b, '#10b981');
    }
    
    updateUI();
  }
}

function toggleWorkspaces() {
  const interactiveWp = document.getElementById('interactive-workspace');
  const worksheetWp = document.getElementById('worksheet-workspace');
  const worksheetTypeContainer = document.getElementById('worksheet-type-container');

  if (state.currentMode === 'worksheet') {
    interactiveWp.classList.add('hidden');
    worksheetWp.classList.remove('hidden');
    worksheetTypeContainer.classList.remove('hidden');
  } else {
    worksheetWp.classList.add('hidden');
    worksheetTypeContainer.classList.add('hidden');
    interactiveWp.classList.remove('hidden');
    
    // Toggle input field for determine mode
    const tgtEq = document.getElementById('target-equation-container');
    if (state.currentMode === 'determine') {
      tgtEq.classList.add('hidden');
    } else {
      tgtEq.classList.remove('hidden');
    }
  }
}
