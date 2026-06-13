export const state = {
  currentEquation: null,
  currentStepIdx: 0,
  hintStepIdx: 0,
  solveSessionId: 0,

  // Animation Player State
  animInterval: null,
  animFrames: [],
  animIndex: 0,
  animPlaying: false
};

// Expose to window for integration testing
Object.defineProperty(window, 'currentEquation', {
  get: () => state.currentEquation,
  set: (val) => { state.currentEquation = val; }
});
Object.defineProperty(window, 'currentStepIdx', {
  get: () => state.currentStepIdx,
  set: (val) => { state.currentStepIdx = val; }
});
Object.defineProperty(window, 'hintStepIdx', {
  get: () => state.hintStepIdx,
  set: (val) => { state.hintStepIdx = val; }
});
Object.defineProperty(window, 'animIndex', {
  get: () => state.animIndex,
  set: (val) => { state.animIndex = val; }
});
Object.defineProperty(window, 'animFrames', {
  get: () => state.animFrames,
  set: (val) => { state.animFrames = val; }
});
Object.defineProperty(window, 'animPlaying', {
  get: () => state.animPlaying,
  set: (val) => { state.animPlaying = val; }
});
