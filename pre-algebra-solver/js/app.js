import './state.js';
import { initHintsPlayerEvents } from './hints-player.js';
import { initSolverUIEvents, generateNew, copyAnswerToInput } from './solver-ui.js';
import { initWorksheetEvents, generateWorksheet } from './worksheet-generator.js';

// Expose explicitly for inline HTML event handlers and tests
window.copyAnswerToInput = copyAnswerToInput;
window.generateNew = generateNew;

import { triggerVisualExplanation } from './hints-player.js';
window.triggerVisualExplanation = triggerVisualExplanation;

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
  initSolverUIEvents();
  initHintsPlayerEvents();
  initWorksheetEvents();

  // Initial render
  generateNew();
  generateWorksheet();
});
