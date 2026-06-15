/**
 * Graphing & Lines - Central State Management
 * Follows the singleton pattern to ensure all modules share the same state.
 */

export const state = {
  // Application Mode: 'interactive', 'determine', 'worksheet'
  currentMode: 'interactive',

  // Configuration options from UI
  config: {
    equationType: 'slope-intercept', // 'slope-intercept' or 'standard'
    slopeType: 'integer', // 'integer', 'fraction', 'mixed'
    worksheetType: 'graph', // 'graph' or 'find'
    showKey: false,
  },

  // Active Equation Data
  currentEquation: null, // Holds { m, b, latex, type } or { A, B, C, latex, type }

  // Interactive Graphing State
  interactive: {
    step: 0, // 0 = Find y-intercept, 1 = Plot second point, 2 = Done
    yInterceptPlotted: false,
    secondPointPlotted: false,
    points: [], // Array of plotted {x, y} coordinates
  },

  // Determine Equation State
  determine: {
    step: 0, // 0 = Click y-int, 1 = Click second point, 2 = Type equation
    yInterceptIdentified: false,
    secondPointIdentified: false,
    points: [],
  },

  // State listeners to trigger UI updates
  listeners: [],
  
  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify() {
    this.listeners.forEach(cb => cb(this));
  },

  resetInteractive() {
    this.interactive = {
      step: 0,
      yInterceptPlotted: false,
      secondPointPlotted: false,
      points: []
    };
    this.determine = {
      step: 0,
      yInterceptIdentified: false,
      secondPointIdentified: false,
      points: []
    };
    this.notify();
  }
};

// Make state globally accessible for integration testing
window.state = state;
