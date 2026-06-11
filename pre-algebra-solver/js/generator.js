// Requires Fraction class to be loaded first.

class EquationGenerator {
  static formatLaTeXTerm(coeff, varSymbol, isLeading) {
    coeff = Fraction.cast(coeff);
    if (coeff.n === 0) return '';
    
    let str = '';
    let absCoeff = new Fraction(Math.abs(coeff.n), coeff.d);
    
    if (coeff.n < 0) {
      str += '-';
    } else if (!isLeading) {
      str += '+';
    }
    
    if (varSymbol) {
      if (absCoeff.equals(1)) {
        str += varSymbol;
      } else {
        str += absCoeff.toLaTeX() + varSymbol;
      }
    } else {
      str += absCoeff.toLaTeX();
    }
    
    return str;
  }

  static formatLaTeXSide(coeff, constant) {
    coeff = Fraction.cast(coeff);
    constant = Fraction.cast(constant);
    
    if (coeff.n === 0 && constant.n === 0) return '0';
    
    let term1 = EquationGenerator.formatLaTeXTerm(coeff, 'x', true);
    let term2 = EquationGenerator.formatLaTeXTerm(constant, '', term1 === '');
    
    return term1 + term2;
  }

  static formatLaTeXParenthesis(a, b) {
    a = Fraction.cast(a);
    b = Fraction.cast(b);
    
    let prefix = '';
    if (a.equals(-1)) {
      prefix = '-';
    } else if (!a.equals(1)) {
      prefix = a.toLaTeX();
    }
    
    let inner = EquationGenerator.formatLaTeXSide(new Fraction(1), b);
    return `${prefix}(${inner})`;
  }

  static randomVal(allowNegatives, allowFractions) {
    let val;
    if (allowFractions && Math.random() < 0.3) {
      const den = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      let num = Math.floor(Math.random() * 5) + 1;
      if (allowNegatives && Math.random() < 0.5) {
        num = -num;
      }
      val = new Fraction(num, den);
    } else {
      let num = Math.floor(Math.random() * 8) + 1;
      if (allowNegatives && Math.random() < 0.5) {
        num = -num;
      }
      val = new Fraction(num);
    }
    return val;
  }

  static generate(options = {}) {
    const steps = options.steps || 3;
    const allowNegatives = options.allowNegatives !== false;
    const allowFractions = !!options.allowFractions;
    let allowParenthesis = options.allowParenthesis !== false;

    if (steps >= 5) {
      allowParenthesis = true;
    }

    const S = EquationGenerator.randomVal(allowNegatives, allowFractions);

    let initialLHS = '';
    let initialRHS = '';
    let stepStates = [];

    if (steps === 1) {
      const useMult = Math.random() < 0.5;
      if (useMult) {
        const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const b = a.mul(S);
        initialLHS = EquationGenerator.formatLaTeXSide(a, 0);
        initialRHS = EquationGenerator.formatLaTeXSide(0, b);
        
        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by dividing both sides by the coefficient.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${b.toLaTeX()} \\\\ \\frac{${initialLHS}}{\\color{indigo}{${a.toLaTeX()}}} &= \\frac{${b.toLaTeX()}}{\\color{indigo}{${a.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
        });
      } else {
        const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const b = S.add(a);
        initialLHS = EquationGenerator.formatLaTeXSide(1, a);
        initialRHS = EquationGenerator.formatLaTeXSide(0, b);

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by subtracting the constant from both sides.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${b.toLaTeX()} \\\\ x ${a.n < 0 ? '+' : '-'} ${Math.abs(a.toLaTeX())} \\color{indigo}{${a.n < 0 ? '+' : '-'} ${Math.abs(a.toLaTeX())}} &= ${b.toLaTeX()} \\color{indigo}{${a.n < 0 ? '+' : '-'} ${Math.abs(a.toLaTeX())}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
        });
      }
    } else if (steps === 2) {
      const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const c = a.mul(S).add(b);

      initialLHS = EquationGenerator.formatLaTeXSide(a, b);
      initialRHS = EquationGenerator.formatLaTeXSide(0, c);

      const intermediateConst = a.mul(S);

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: a, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(a, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${c.toLaTeX()} \\\\ ${initialLHS} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} &= ${c.toLaTeX()} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} \\\\ ${EquationGenerator.formatLaTeXSide(a, 0)} &= ${intermediateConst.toLaTeX()} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by dividing both sides by the coefficient.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(a, 0)} &= ${intermediateConst.toLaTeX()} \\\\ \\frac{${EquationGenerator.formatLaTeXSide(a, 0)}}{\\color{indigo}{${a.toLaTeX()}}} &= \\frac{${intermediateConst.toLaTeX()}}{\\color{indigo}{${a.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
      });
    } else if (steps === 3) {
      const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
      let c = EquationGenerator.randomVal(allowNegatives, allowFractions);
      while (c.equals(a)) {
        c = EquationGenerator.randomVal(allowNegatives, allowFractions);
      }
      const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const d = a.sub(c).mul(S).add(b);

      initialLHS = EquationGenerator.formatLaTeXSide(a, b);
      initialRHS = EquationGenerator.formatLaTeXSide(c, d);

      const netCoeff = a.sub(c);
      const intermediateConst = netCoeff.mul(S);

      stepStates.push({
        stepNum: 3,
        type: 'move_variables',
        description: 'Move all variables to the left side.',
        lhsCoeff: netCoeff, lhsConst: b,
        rhsCoeff: new Fraction(0), rhsConst: d,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, b)} = ${d.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\\\ ${initialLHS} \\color{indigo}{${c.n < 0 ? '+' : '-'} ${Math.abs(c.toLaTeX())}x} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\color{indigo}{${c.n < 0 ? '+' : '-'} ${Math.abs(c.toLaTeX())}x} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, b)} &= ${d.toLaTeX()} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: netCoeff, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, b)} &= ${d.toLaTeX()} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, b)} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} &= ${d.toLaTeX()} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by dividing both sides.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\\\ \\frac{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}}{\\color{indigo}{${netCoeff.toLaTeX()}}} &= \\frac{${intermediateConst.toLaTeX()}}{\\color{indigo}{${netCoeff.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
      });
    } else if (steps === 4) {
      if (allowParenthesis) {
        const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
        let c = EquationGenerator.randomVal(allowNegatives, allowFractions);
        while (c.equals(a)) {
          c = EquationGenerator.randomVal(allowNegatives, allowFractions);
        }
        const ab = a.mul(b);
        const d = a.sub(c).mul(S).add(ab);

        initialLHS = EquationGenerator.formatLaTeXParenthesis(a, b);
        initialRHS = EquationGenerator.formatLaTeXSide(c, d);

        const netCoeff = a.sub(c);
        const intermediateConst = netCoeff.mul(S);

        stepStates.push({
          stepNum: 1,
          type: 'distribute',
          description: 'Distribute the multiplication through the parenthesis.',
          lhsCoeff: a, lhsConst: ab,
          rhsCoeff: c, rhsConst: d,
          latex: `${EquationGenerator.formatLaTeXSide(a, ab)} = ${EquationGenerator.formatLaTeXSide(c, d)}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\\\ \\color{indigo}{${a.toLaTeX()} \\cdot x ${b.n < 0 ? '-' : '+'} ${Math.abs(a.toLaTeX())} \\cdot ${Math.abs(b.toLaTeX())}} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\\\ ${EquationGenerator.formatLaTeXSide(a, ab)} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 3,
          type: 'move_variables',
          description: 'Move all variables to the left side.',
          lhsCoeff: netCoeff, lhsConst: ab,
          rhsCoeff: new Fraction(0), rhsConst: d,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, ab)} = ${d.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(a, ab)} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\\\ ${EquationGenerator.formatLaTeXSide(a, ab)} \\color{indigo}{${c.n < 0 ? '+' : '-'} ${Math.abs(c.toLaTeX())}x} &= ${EquationGenerator.formatLaTeXSide(c, d)} \\color{indigo}{${c.n < 0 ? '+' : '-'} ${Math.abs(c.toLaTeX())}x} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} &= ${d.toLaTeX()} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 4,
          type: 'move_constants',
          description: 'Move constants to the right side.',
          lhsCoeff: netCoeff, lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} &= ${d.toLaTeX()} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} \\color{indigo}{${ab.n < 0 ? '+' : '-'} ${Math.abs(ab.toLaTeX())}} &= ${d.toLaTeX()} \\color{indigo}{${ab.n < 0 ? '+' : '-'} ${Math.abs(ab.toLaTeX())}} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by division.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\\\ \\frac{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}}{\\color{indigo}{${netCoeff.toLaTeX()}}} &= \\frac{${intermediateConst.toLaTeX()}}{\\color{indigo}{${netCoeff.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
        });
      } else {
        const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const c = EquationGenerator.randomVal(allowNegatives, allowFractions);
        let d = EquationGenerator.randomVal(allowNegatives, allowFractions);
        while (d.equals(a.add(c))) {
          d = EquationGenerator.randomVal(allowNegatives, allowFractions);
        }
        const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const sumAC = a.add(c);
        const e = sumAC.sub(d).mul(S).add(b);

        initialLHS = `${EquationGenerator.formatLaTeXTerm(a, 'x', true)}${EquationGenerator.formatLaTeXTerm(b, '', false)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)}`;
        initialRHS = EquationGenerator.formatLaTeXSide(d, e);

        const netCoeff = sumAC.sub(d);
        const intermediateConst = netCoeff.mul(S);

        stepStates.push({
          stepNum: 2,
          type: 'combine',
          description: 'Combine like terms on the left side.',
          lhsCoeff: sumAC, lhsConst: b,
          rhsCoeff: d, rhsConst: e,
          latex: `${EquationGenerator.formatLaTeXSide(sumAC, b)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ \\color{indigo}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)} ${c.n < 0 ? '-' : '+'} ${Math.abs(c.toLaTeX())}x} ${b.n < 0 ? '-' : '+'} ${Math.abs(b.toLaTeX())} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ ${EquationGenerator.formatLaTeXSide(sumAC, b)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 3,
          type: 'move_variables',
          description: 'Move all variables to the left side.',
          lhsCoeff: netCoeff, lhsConst: b,
          rhsCoeff: new Fraction(0), rhsConst: e,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, b)} = ${e.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(sumAC, b)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ ${EquationGenerator.formatLaTeXSide(sumAC, b)} \\color{indigo}{${d.n < 0 ? '+' : '-'} ${Math.abs(d.toLaTeX())}x} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\color{indigo}{${d.n < 0 ? '+' : '-'} ${Math.abs(d.toLaTeX())}x} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, b)} &= ${e.toLaTeX()} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 4,
          type: 'move_constants',
          description: 'Move constants to the right side.',
          lhsCoeff: netCoeff, lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, b)} &= ${e.toLaTeX()} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, b)} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} &= ${e.toLaTeX()} \\color{indigo}{${b.n < 0 ? '+' : '-'} ${Math.abs(b.toLaTeX())}} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\end{aligned}`
        });

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by division.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\\\ \\frac{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}}{\\color{indigo}{${netCoeff.toLaTeX()}}} &= \\frac{${intermediateConst.toLaTeX()}}{\\color{indigo}{${netCoeff.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
        });
      }
    } else {
      const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const c = EquationGenerator.randomVal(allowNegatives, allowFractions);
      let d = EquationGenerator.randomVal(allowNegatives, allowFractions);
      while (d.equals(a.add(c))) {
        d = EquationGenerator.randomVal(allowNegatives, allowFractions);
      }
      const ab = a.mul(b);
      const sumAC = a.add(c);
      const e = sumAC.sub(d).mul(S).add(ab);

      initialLHS = `${EquationGenerator.formatLaTeXParenthesis(a, b)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)}`;
      initialRHS = EquationGenerator.formatLaTeXSide(d, e);

      const netCoeff = sumAC.sub(d);
      const intermediateConst = netCoeff.mul(S);

      stepStates.push({
        stepNum: 1,
        type: 'distribute',
        description: 'Distribute the multiplication through the parenthesis.',
        lhsCoeff: a, lhsConst: ab,
        rhsCoeff: d, rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXTerm(a, 'x', true)}${EquationGenerator.formatLaTeXTerm(ab, '', false)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ \\color{indigo}{${a.toLaTeX()}\\cdot x ${b.n < 0 ? '-' : '+'} ${Math.abs(a.toLaTeX())}\\cdot ${Math.abs(b.toLaTeX())}} ${c.n < 0 ? '-' : '+'} ${Math.abs(c.toLaTeX())}x &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ ${EquationGenerator.formatLaTeXTerm(a, 'x', true)}${EquationGenerator.formatLaTeXTerm(ab, '', false)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 2,
        type: 'combine',
        description: 'Combine like terms on the left side.',
        lhsCoeff: sumAC, lhsConst: ab,
        rhsCoeff: d, rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXSide(sumAC, ab)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXTerm(a, 'x', true)}${EquationGenerator.formatLaTeXTerm(ab, '', false)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ \\color{indigo}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)} ${c.n < 0 ? '-' : '+'} ${Math.abs(c.toLaTeX())}x} ${ab.n < 0 ? '-' : '+'} ${Math.abs(ab.toLaTeX())} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ ${EquationGenerator.formatLaTeXSide(sumAC, ab)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 3,
        type: 'move_variables',
        description: 'Move all variables to the left side.',
        lhsCoeff: netCoeff, lhsConst: ab,
        rhsCoeff: new Fraction(0), rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, ab)} = ${e.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(sumAC, ab)} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\\\ ${EquationGenerator.formatLaTeXSide(sumAC, ab)} \\color{indigo}{${d.n < 0 ? '+' : '-'} ${Math.abs(d.toLaTeX())}x} &= ${EquationGenerator.formatLaTeXSide(d, e)} \\color{indigo}{${d.n < 0 ? '+' : '-'} ${Math.abs(d.toLaTeX())}x} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} &= ${e.toLaTeX()} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: netCoeff, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} &= ${e.toLaTeX()} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, ab)} \\color{indigo}{${ab.n < 0 ? '+' : '-'} ${Math.abs(ab.toLaTeX())}} &= ${e.toLaTeX()} \\color{indigo}{${ab.n < 0 ? '+' : '-'} ${Math.abs(ab.toLaTeX())}} \\\\ ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\end{aligned}`
      });

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by division.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${EquationGenerator.formatLaTeXSide(netCoeff, 0)} &= ${intermediateConst.toLaTeX()} \\\\ \\frac{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}}{\\color{indigo}{${netCoeff.toLaTeX()}}} &= \\frac{${intermediateConst.toLaTeX()}}{\\color{indigo}{${netCoeff.toLaTeX()}}} \\\\ x &= ${S.toLaTeX()} \\end{aligned}`
      });
    }

    return {
      initialLHS,
      initialRHS,
      solution: S,
      steps: stepStates
    };
  }

  static parseLinearExpression(str) {
    str = str.replace(/\s+/g, '').replace(/\*/g, '');
    
    const terms = str.split(/(?=[+-])/);
    
    let coeff = new Fraction(0);
    let constant = new Fraction(0);
    
    for (let term of terms) {
      if (!term || term === '+' || term === '-') continue;
      
      if (term.includes('x')) {
        if (term.includes('x/')) {
          const parts = term.split('x/');
          const numStr = parts[0] === '' ? '1' : parts[0] === '+' ? '1' : parts[0] === '-' ? '-1' : parts[0];
          const denStr = parts[1];
          coeff = coeff.add(new Fraction(parseInt(numStr, 10), parseInt(denStr, 10)));
        } else {
          let valStr = term.replace('x', '');
          if (valStr === '' || valStr === '+') {
            coeff = coeff.add(1);
          } else if (valStr === '-') {
            coeff = coeff.sub(1);
          } else {
            coeff = coeff.add(Fraction.parse(valStr));
          }
        }
      } else {
        constant = constant.add(Fraction.parse(term));
      }
    }
    
    return { coeff, constant };
  }

  static validateStep(userInput, expectedState) {
    if (!userInput.includes('=')) {
      return { valid: false, errorMsg: "An equation must contain an '=' sign." };
    }
    
    const parts = userInput.split('=');
    if (parts.length !== 2) {
      return { valid: false, errorMsg: "An equation must contain exactly one '=' sign." };
    }
    
    let userLHS, userRHS;
    try {
      userLHS = EquationGenerator.parseLinearExpression(parts[0]);
      userRHS = EquationGenerator.parseLinearExpression(parts[1]);
    } catch (e) {
      return { valid: false, errorMsg: "Could not parse equation. Make sure terms are formatted like '2x' or '3/2'." };
    }

    const userNetCoeff = userLHS.coeff.sub(userRHS.coeff);
    const userNetConst = userLHS.constant.sub(userRHS.constant);
    
    const expectedNetCoeff = expectedState.lhsCoeff.sub(expectedState.rhsCoeff);
    const expectedNetConst = expectedState.lhsConst.sub(expectedState.rhsConst);

    if (!userNetCoeff.equals(expectedNetCoeff) || !userNetConst.equals(expectedNetConst)) {
      return { valid: false, errorMsg: "This equation is not algebraically equivalent to the expected step." };
    }

    const cleanedInput = userInput.replace(/\s+/g, '');
    
    switch (expectedState.type) {
      case 'distribute':
        if (cleanedInput.includes('(') || cleanedInput.includes(')')) {
          return { valid: false, errorMsg: "You must distribute to remove parenthesis." };
        }
        break;
      case 'combine':
        if (cleanedInput.includes('(') || cleanedInput.includes(')')) {
          return { valid: false, errorMsg: "No parenthesis should be present." };
        }
        const lhsTerms = parts[0].replace(/\s+/g, '').split(/(?=[+-])/).filter(t => t && t !== '+' && t !== '-');
        const rhsTerms = parts[1].replace(/\s+/g, '').split(/(?=[+-])/).filter(t => t && t !== '+' && t !== '-');
        if (lhsTerms.length > 2 || rhsTerms.length > 2) {
          return { valid: false, errorMsg: "You still have like terms to combine on the same side." };
        }
        break;
      case 'move_variables':
        if (userRHS.coeff.n !== 0) {
          return { valid: false, errorMsg: "Move all variable terms to the left side." };
        }
        break;
      case 'move_constants':
        if (userLHS.constant.n !== 0) {
          return { valid: false, errorMsg: "Move all constant terms to the right side." };
        }
        break;
      case 'isolate':
        if (!userLHS.coeff.equals(1) || userLHS.constant.n !== 0 || userRHS.coeff.n !== 0) {
          return { valid: false, errorMsg: "The final equation must isolate 'x' on the left (e.g. x = 5)." };
        }
        break;
    }

    return { valid: true };
  }
}

window.EquationGenerator = EquationGenerator;
