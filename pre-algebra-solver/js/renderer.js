class MathRenderer {
  /**
   * Safely renders a LaTeX expression to the given element using KaTeX.
   * If displayMode is true, it renders in block mode, otherwise inline.
   */
  static render(latex, element, displayMode = false) {
    if (!element) return;
    try {
      if (typeof katex === 'undefined') {
        element.textContent = latex;
        return;
      }
      katex.render(latex, element, {
        throwOnError: false,
        displayMode: displayMode,
        trust: true
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      element.textContent = latex;
    }
  }

  /**
   * Helper to format inline equations for standard display.
   */
  static renderInline(latex, element) {
    MathRenderer.render(latex, element, false);
  }

  /**
   * Helper to format display/block equations.
   */
  static renderBlock(latex, element) {
    MathRenderer.render(latex, element, true);
  }
}

window.MathRenderer = MathRenderer;
