import { Fraction } from './js/fraction.js';
import { EquationGenerator } from './js/generator.js';
// Add window mock
global.window = {
  Fraction, EquationGenerator, 
  MathRenderer: { renderBlock: () => {}, renderInline: () => {} }
};
EquationGenerator.Fraction = Fraction;

const eq = EquationGenerator.generate({steps:2});
const iso = eq.steps[eq.steps.length - 1];
console.log(JSON.stringify(iso.animationFrames, null, 2));
