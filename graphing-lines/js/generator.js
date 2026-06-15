import { state } from './state.js';

/**
 * Utility function to get a random integer between min and max (inclusive)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simplifies a fraction to its lowest terms
 */
function simplifyFraction(num, den) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(num), Math.abs(den));
  
  num = num / divisor;
  den = den / divisor;
  
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

/**
 * Generates a random equation based on current state config.
 */
export function generateEquation() {
  const eqType = state.config.equationType;
  const slopeType = state.config.slopeType;
  
  let mNum, mDen, b;

  // Generate b (y-intercept) between -8 and 8
  b = getRandomInt(-8, 8);

  // Generate slope
  const isFraction = slopeType === 'fraction' || (slopeType === 'mixed' && Math.random() > 0.5);
  
  if (isFraction) {
    do {
      mNum = getRandomInt(-5, 5);
      mDen = getRandomInt(2, 5); // Avoid 0 and 1 for denominator to ensure it's a true fraction
    } while (mNum === 0 || Math.abs(mNum) === mDen);
    
    const simplified = simplifyFraction(mNum, mDen);
    mNum = simplified.num;
    mDen = simplified.den;
  } else {
    // Integer slope
    do {
      mNum = getRandomInt(-4, 4);
    } while (mNum === 0);
    mDen = 1;
  }

  // Build the equation object
  const equation = {
    m: { num: mNum, den: mDen },
    b: b,
    latex: '',
    type: eqType
  };

  // Generate LaTeX string based on type
  if (eqType === 'slope-intercept') {
    equation.latex = formatSlopeIntercept(mNum, mDen, b);
  } else if (eqType === 'standard') {
    // Convert y = (mNum/mDen)x + b  ->  mDen*y = mNum*x + mDen*b  ->  -mNum*x + mDen*y = mDen*b
    // To match Ax + By = C, where A is usually positive:
    let A = -mNum;
    let B = mDen;
    let C = mDen * b;
    
    // Ensure A is positive
    if (A < 0) {
      A = -A;
      B = -B;
      C = -C;
    }
    
    equation.A = A;
    equation.B = B;
    equation.C = C;
    equation.latex = formatStandard(A, B, C);
  }

  state.currentEquation = equation;
  state.notify();
  return equation;
}

function formatSlopeIntercept(mNum, mDen, b) {
  let slopeStr = '';
  if (mDen === 1) {
    if (mNum === 1) slopeStr = 'x';
    else if (mNum === -1) slopeStr = '-x';
    else slopeStr = `${mNum}x`;
  } else {
    // Fraction
    if (mNum < 0) {
      slopeStr = `-\\frac{${-mNum}}{${mDen}}x`;
    } else {
      slopeStr = `\\frac{${mNum}}{${mDen}}x`;
    }
  }

  let bStr = '';
  if (b > 0) bStr = `+ ${b}`;
  else if (b < 0) bStr = `- ${Math.abs(b)}`;

  return `y = ${slopeStr} ${bStr}`.trim();
}

function formatStandard(A, B, C) {
  let aStr = '';
  if (A === 1) aStr = 'x';
  else if (A === -1) aStr = '-x';
  else if (A !== 0) aStr = `${A}x`;

  let bStr = '';
  if (B === 1) bStr = A === 0 ? 'y' : '+ y';
  else if (B === -1) bStr = '- y';
  else if (B > 0) bStr = A === 0 ? `${B}y` : `+ ${B}y`;
  else if (B < 0) bStr = `- ${Math.abs(B)}y`;

  return `${aStr} ${bStr} = ${C}`.trim();
}
