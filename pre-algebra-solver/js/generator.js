// Requires Fraction class to be loaded first.

class EquationGenerator {
  static formatLaTeXTerm(coeff, varSymbol, isLeading, idPrefix) {
    coeff = Fraction.cast(coeff);
    if (coeff.n === 0) return '';
    
    let str = '';
    let absCoeff = new Fraction(Math.abs(coeff.n), coeff.d);
    
    if (coeff.n < 0) {
      str += '-';
    } else if (!isLeading) {
      str += '+';
    }
    
    let termContent = '';
    if (varSymbol) {
      if (absCoeff.equals(1)) {
        termContent = varSymbol;
      } else {
        termContent = absCoeff.toLaTeX() + varSymbol;
      }
    } else {
      termContent = absCoeff.toLaTeX();
    }
    
    if (idPrefix) {
      str += `\\htmlId{${idPrefix}}{${termContent}}`;
    } else {
      str += termContent;
    }
    
    return str;
  }

  static formatLaTeXSide(coeff, constant, prefix) {
    coeff = Fraction.cast(coeff);
    constant = Fraction.cast(constant);
    
    if (coeff.n === 0 && constant.n === 0) return '0';
    
    let term1 = EquationGenerator.formatLaTeXTerm(coeff, 'x', true, prefix ? `${prefix}-var` : null);
    let term2 = EquationGenerator.formatLaTeXTerm(constant, '', term1 === '', prefix ? `${prefix}-const` : null);
    
    return term1 + term2;
  }

  static formatLaTeXParenthesis(a, b, prefix) {
    a = Fraction.cast(a);
    b = Fraction.cast(b);
    
    let signPrefix = '';
    let termPrefix = '';
    if (a.equals(-1)) {
      signPrefix = '-';
    } else if (!a.equals(1)) {
      if (a.n < 0) {
        signPrefix = '-';
        termPrefix = a.abs().toLaTeX();
      } else {
        termPrefix = a.toLaTeX();
      }
    }
    
    let inside = EquationGenerator.formatLaTeXSide(new Fraction(1), b, prefix ? `${prefix}-inner` : null);
    
    if (prefix) {
      let outsideTerm = termPrefix ? `\\htmlId{${prefix}-out-coeff}{${termPrefix}}` : '';
      return `${signPrefix}${outsideTerm}(\\htmlId{${prefix}-in}{${inside}})`;
    } else {
      let outsideTerm = termPrefix ? termPrefix : '';
      return `${signPrefix}${outsideTerm}(${inside})`;
    }
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
        initialLHS = EquationGenerator.formatLaTeXSide(a, 0, 'lhs');
        initialRHS = EquationGenerator.formatLaTeXSide(0, b, 'rhs');
        
        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by dividing both sides by the coefficient.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ \\frac{${initialLHS}}{\\color{indigo}{\\htmlId{div-lhs}{${a.toLaTeX()}}}} &= \\frac{${initialRHS}}{\\color{indigo}{\\htmlId{div-rhs}{${a.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`
        });
      } else {
        const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
        const b = S.add(a);
        initialLHS = EquationGenerator.formatLaTeXSide(1, a, 'lhs');
        initialRHS = EquationGenerator.formatLaTeXSide(0, b, 'rhs');

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by subtracting the constant from both sides.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{x} ${a.n < 0 ? '+' : '-'} \\htmlId{lhs-const}{${a.abs().toLaTeX()}} \\color{indigo}{${a.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${a.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${b.toLaTeX()}} \\color{indigo}{${a.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${a.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
          isolateCoeff: new Fraction(1),
          isolateConst: b,
          isolateAddConst: a
        });
      }
    } else if (steps === 2) {
      const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const c = a.mul(S).add(b);

      initialLHS = EquationGenerator.formatLaTeXSide(a, b, 'lhs');
      initialRHS = EquationGenerator.formatLaTeXSide(0, c, 'rhs');

      const intermediateConst = a.mul(S);

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: a, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(a, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(a, 0)}} ${b.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{${b.abs().toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${b.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${c.toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${b.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(a, 0)}} &= \\htmlId{rhs-const}{${intermediateConst.toLaTeX()}} \\end{aligned}`,
        originalLHSConst: b,
        originalRHSConst: c,
      });

      const LHS_isolate = EquationGenerator.formatLaTeXSide(a, 0, 'lhs');
      const RHS_isolate = EquationGenerator.formatLaTeXSide(0, intermediateConst, 'rhs');

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by dividing both sides by the coefficient.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${LHS_isolate} &= ${RHS_isolate} \\\\ \\frac{${LHS_isolate}}{\\color{indigo}{\\htmlId{div-lhs}{${a.toLaTeX()}}}} &= \\frac{${RHS_isolate}}{\\color{indigo}{\\htmlId{div-rhs}{${a.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
        isolateCoeff: a,
        isolateConst: intermediateConst,
      });
    } else if (steps === 3) {
      const a = EquationGenerator.randomVal(allowNegatives, allowFractions);
      let c = EquationGenerator.randomVal(allowNegatives, allowFractions);
      while (c.equals(a)) {
        c = EquationGenerator.randomVal(allowNegatives, allowFractions);
      }
      const b = EquationGenerator.randomVal(allowNegatives, allowFractions);
      const d = a.sub(c).mul(S).add(b);

      initialLHS = EquationGenerator.formatLaTeXSide(a, b, 'lhs');
      initialRHS = EquationGenerator.formatLaTeXSide(c, d, 'rhs');

      const netCoeff = a.sub(c);
      const intermediateConst = netCoeff.mul(S);

      stepStates.push({
        stepNum: 3,
        type: 'move_variables',
        description: 'Move all variables to the left side.',
        lhsCoeff: netCoeff, lhsConst: b,
        rhsCoeff: new Fraction(0), rhsConst: d,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, b)} = ${d.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(c.neg(), 'x', false, 'add-lhs')}} &= \\htmlId{rhs-var}{${EquationGenerator.formatLaTeXTerm(c, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(d, '', false, 'rhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(c.neg(), 'x', false, 'add-rhs')}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} &= \\htmlId{rhs-const}{${d.toLaTeX()}} \\end{aligned}`,
        originalLHSCoeff: a,
        originalRHSCoeff: c,
      });

      const LHS_move = EquationGenerator.formatLaTeXSide(netCoeff, b, 'lhs');
      const RHS_move = EquationGenerator.formatLaTeXSide(0, d, 'rhs');

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: netCoeff, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${LHS_move} &= ${RHS_move} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${b.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{${b.abs().toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${b.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${d.toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${b.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} &= \\htmlId{rhs-const}{${intermediateConst.toLaTeX()}} \\end{aligned}`,
        originalLHSConst: b,
        originalRHSConst: d,
      });

      const LHS_isolate = EquationGenerator.formatLaTeXSide(netCoeff, 0, 'lhs');
      const RHS_isolate = EquationGenerator.formatLaTeXSide(0, intermediateConst, 'rhs');

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by dividing both sides.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${LHS_isolate} &= ${RHS_isolate} \\\\ \\frac{${LHS_isolate}}{\\color{indigo}{\\htmlId{div-lhs}{${netCoeff.toLaTeX()}}}} &= \\frac{${RHS_isolate}}{\\color{indigo}{\\htmlId{div-rhs}{${netCoeff.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
        isolateCoeff: netCoeff,
        isolateConst: intermediateConst,
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

        initialLHS = EquationGenerator.formatLaTeXParenthesis(a, b, 'lhs');
        initialRHS = EquationGenerator.formatLaTeXSide(c, d, 'rhs');

        const netCoeff = a.sub(c);
        const intermediateConst = netCoeff.mul(S);

        stepStates.push({
          stepNum: 1,
          type: 'distribute',
          description: 'Distribute the multiplication through the parenthesis.',
          lhsCoeff: a, lhsConst: ab,
          rhsCoeff: c, rhsConst: d,
          latex: `${EquationGenerator.formatLaTeXSide(a, ab)} = ${EquationGenerator.formatLaTeXSide(c, d)}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ ${a.n < 0 ? '-' : ''} \\htmlId{lhs-var}{\\htmlId{lhs-out-coeff}{${a.abs().toLaTeX()}} \\cdot \\htmlId{lhs-inner-var}{x}} ${ab.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{\\htmlId{lhs-out-coeff2}{${a.abs().toLaTeX()}} \\cdot \\htmlId{lhs-inner-const}{${b.abs().toLaTeX()}}} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= ${initialRHS} \\end{aligned}`,
          distributeCoeff: a,
          distributeInsideConst: b,
          distributeOtherCoeff: new Fraction(0),
        });

        stepStates.push({
          stepNum: 3,
          type: 'move_variables',
          description: 'Move all variables to the left side.',
          lhsCoeff: netCoeff, lhsConst: ab,
          rhsCoeff: new Fraction(0), rhsConst: d,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, ab)} = ${d.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(c.neg(), 'x', false, 'add-lhs')}} &= \\htmlId{rhs-var}{${EquationGenerator.formatLaTeXTerm(c, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(d, '', false, 'rhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(c.neg(), 'x', false, 'add-rhs')}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= \\htmlId{rhs-const}{${d.toLaTeX()}} \\end{aligned}`,
          originalLHSCoeff: a,
          originalRHSCoeff: c,
        });

        const LHS_move = EquationGenerator.formatLaTeXSide(netCoeff, ab, 'lhs');
        const RHS_move = EquationGenerator.formatLaTeXSide(0, d, 'rhs');

        stepStates.push({
          stepNum: 4,
          type: 'move_constants',
          description: 'Move constants to the right side.',
          lhsCoeff: netCoeff, lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${LHS_move} &= ${RHS_move} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${ab.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{${ab.abs().toLaTeX()}} \\color{indigo}{${ab.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${ab.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${d.toLaTeX()}} \\color{indigo}{${ab.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${ab.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} &= \\htmlId{rhs-const}{${intermediateConst.toLaTeX()}} \\end{aligned}`,
          originalLHSConst: ab,
          originalRHSConst: d,
        });

        const LHS_isolate = EquationGenerator.formatLaTeXSide(netCoeff, 0, 'lhs');
        const RHS_isolate = EquationGenerator.formatLaTeXSide(0, intermediateConst, 'rhs');

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by division.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${LHS_isolate} &= ${RHS_isolate} \\\\ \\frac{${LHS_isolate}}{\\color{indigo}{\\htmlId{div-lhs}{${netCoeff.toLaTeX()}}}} &= \\frac{${RHS_isolate}}{\\color{indigo}{\\htmlId{div-rhs}{${netCoeff.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
          isolateCoeff: netCoeff,
          isolateConst: intermediateConst,
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

        initialLHS = `${EquationGenerator.formatLaTeXTerm(a, 'x', true, 'lhs-var-1')}${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')}${EquationGenerator.formatLaTeXTerm(c, 'x', false, 'lhs-var-2')}`;
        initialRHS = EquationGenerator.formatLaTeXSide(d, e, 'rhs');

        const netCoeff = sumAC.sub(d);
        const intermediateConst = netCoeff.mul(S);

        stepStates.push({
          stepNum: 2,
          type: 'combine',
          description: 'Combine like terms on the left side.',
          lhsCoeff: sumAC, lhsConst: b,
          rhsCoeff: d, rhsConst: e,
          latex: `${EquationGenerator.formatLaTeXSide(sumAC, b)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
          visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{\\htmlId{lhs-var-1}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(c, 'x', false, 'lhs-var-2')}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} &= ${initialRHS} \\end{aligned}`,
          combineLHSCoeff1: a,
          combineLHSCoeff2: c,
        });

        stepStates.push({
          stepNum: 3,
          type: 'move_variables',
          description: 'Move all variables to the left side.',
          lhsCoeff: netCoeff, lhsConst: b,
          rhsCoeff: new Fraction(0), rhsConst: e,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, b)} = ${e.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(d.neg(), 'x', false, 'add-lhs')}} &= \\htmlId{rhs-var}{${EquationGenerator.formatLaTeXTerm(d, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(e, '', false, 'rhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(d.neg(), 'x', false, 'add-rhs')}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${EquationGenerator.formatLaTeXTerm(b, '', false, 'lhs-const')} &= \\htmlId{rhs-const}{${e.toLaTeX()}} \\end{aligned}`,
          originalLHSCoeff: sumAC,
          originalRHSCoeff: d,
        });

        const LHS_move = EquationGenerator.formatLaTeXSide(netCoeff, b, 'lhs');
        const RHS_move = EquationGenerator.formatLaTeXSide(0, e, 'rhs');

        stepStates.push({
          stepNum: 4,
          type: 'move_constants',
          description: 'Move constants to the right side.',
          lhsCoeff: netCoeff, lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
          latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${LHS_move} &= ${RHS_move} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${b.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{${b.abs().toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${b.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${e.toLaTeX()}} \\color{indigo}{${b.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${b.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} &= \\htmlId{rhs-const}{${intermediateConst.toLaTeX()}} \\end{aligned}`,
          originalLHSConst: b,
          originalRHSConst: e,
        });

        const LHS_isolate = EquationGenerator.formatLaTeXSide(netCoeff, 0, 'lhs');
        const RHS_isolate = EquationGenerator.formatLaTeXSide(0, intermediateConst, 'rhs');

        stepStates.push({
          stepNum: 5,
          type: 'isolate',
          description: 'Isolate the variable by division.',
          lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
          rhsCoeff: new Fraction(0), rhsConst: S,
          latex: `x = ${S.toLaTeX()}`,
          visualLaTeX: `\\begin{aligned} ${LHS_isolate} &= ${RHS_isolate} \\\\ \\frac{${LHS_isolate}}{\\color{indigo}{\\htmlId{div-lhs}{${netCoeff.toLaTeX()}}}} &= \\frac{${RHS_isolate}}{\\color{indigo}{\\htmlId{div-rhs}{${netCoeff.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
          isolateCoeff: netCoeff,
          isolateConst: intermediateConst,
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

      initialLHS = `${EquationGenerator.formatLaTeXParenthesis(a, b, 'lhs')} ${EquationGenerator.formatLaTeXTerm(c, 'x', false, 'lhs-other-var')}`;
      initialRHS = EquationGenerator.formatLaTeXSide(d, e, 'rhs');

      const netCoeff = sumAC.sub(d);
      const intermediateConst = netCoeff.mul(S);

      stepStates.push({
        stepNum: 1,
        type: 'distribute',
        description: 'Distribute the multiplication through the parenthesis.',
        lhsCoeff: sumAC,
        lhsConst: ab,
        rhsCoeff: d,
        rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXTerm(a, 'x', true)}${EquationGenerator.formatLaTeXTerm(ab, '', false)}${EquationGenerator.formatLaTeXTerm(c, 'x', false)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
        visualLaTeX: `\\begin{aligned} ${initialLHS} &= ${initialRHS} \\\\ ${a.n < 0 ? '-' : ''} \\htmlId{lhs-var}{\\htmlId{lhs-out-coeff}{${a.abs().toLaTeX()}} \\cdot \\htmlId{lhs-inner-var}{x}} ${ab.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{\\htmlId{lhs-out-coeff2}{${a.abs().toLaTeX()}} \\cdot \\htmlId{lhs-inner-const}{${b.abs().toLaTeX()}}} ${EquationGenerator.formatLaTeXTerm(c, 'x', false, 'lhs-other-var')} &= ${initialRHS} \\\\ \\htmlId{lhs-var-1}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} \\htmlId{lhs-var-2}{${EquationGenerator.formatLaTeXTerm(c, 'x', false)}} &= ${initialRHS} \\end{aligned}`,
        distributeCoeff: a,
        distributeInsideConst: b,
        distributeOtherCoeff: c,
      });

      stepStates.push({
        stepNum: 2,
        type: 'combine',
        description: 'Combine like terms on the left side.',
        lhsCoeff: sumAC, lhsConst: ab,
        rhsCoeff: d, rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXSide(sumAC, ab)} = ${EquationGenerator.formatLaTeXSide(d, e)}`,
        visualLaTeX: `\\begin{aligned} \\htmlId{lhs-var-1}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} \\htmlId{lhs-var-2}{${EquationGenerator.formatLaTeXTerm(c, 'x', false)}} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{\\htmlId{lhs-var-1}{${EquationGenerator.formatLaTeXTerm(a, 'x', true)}} \\htmlId{lhs-var-2}{${EquationGenerator.formatLaTeXTerm(c, 'x', false)}}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= ${initialRHS} \\end{aligned}`,
        combineLHSCoeff1: a,
        combineLHSCoeff2: c,
      });

      stepStates.push({
        stepNum: 3,
        type: 'move_variables',
        description: 'Move all variables to the left side.',
        lhsCoeff: netCoeff, lhsConst: ab,
        rhsCoeff: new Fraction(0), rhsConst: e,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, ab)} = ${e.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= ${initialRHS} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(sumAC, 0)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(d.neg(), 'x', false, 'add-lhs')}} &= \\htmlId{rhs-var}{${EquationGenerator.formatLaTeXTerm(d, 'x', true)}} ${EquationGenerator.formatLaTeXTerm(e, '', false, 'rhs-const')} \\color{indigo}{${EquationGenerator.formatLaTeXTerm(d.neg(), 'x', false, 'add-rhs')}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${EquationGenerator.formatLaTeXTerm(ab, '', false, 'lhs-const')} &= \\htmlId{rhs-const}{${e.toLaTeX()}} \\end{aligned}`,
        originalLHSCoeff: sumAC,
        originalRHSCoeff: d,
      });

      const LHS_move = EquationGenerator.formatLaTeXSide(netCoeff, ab, 'lhs');
      const RHS_move = EquationGenerator.formatLaTeXSide(0, e, 'rhs');

      stepStates.push({
        stepNum: 4,
        type: 'move_constants',
        description: 'Move constants to the right side.',
        lhsCoeff: netCoeff, lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: intermediateConst,
        latex: `${EquationGenerator.formatLaTeXSide(netCoeff, 0)} = ${intermediateConst.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${LHS_move} &= ${RHS_move} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} ${ab.n < 0 ? '-' : '+'} \\htmlId{lhs-const}{${ab.abs().toLaTeX()}} \\color{indigo}{${ab.n < 0 ? '+' : '-'} \\htmlId{add-lhs}{${ab.abs().toLaTeX()}}} &= \\htmlId{rhs-const}{${e.toLaTeX()}} \\color{indigo}{${ab.n < 0 ? '+' : '-'} \\htmlId{add-rhs}{${ab.abs().toLaTeX()}}} \\\\ \\htmlId{lhs-var}{${EquationGenerator.formatLaTeXSide(netCoeff, 0)}} &= \\htmlId{rhs-const}{${intermediateConst.toLaTeX()}} \\end{aligned}`,
        originalLHSConst: ab,
        originalRHSConst: e,
      });

      const LHS_isolate = EquationGenerator.formatLaTeXSide(netCoeff, 0, 'lhs');
      const RHS_isolate = EquationGenerator.formatLaTeXSide(0, intermediateConst, 'rhs');

      stepStates.push({
        stepNum: 5,
        type: 'isolate',
        description: 'Isolate the variable by division.',
        lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
        rhsCoeff: new Fraction(0), rhsConst: S,
        latex: `x = ${S.toLaTeX()}`,
        visualLaTeX: `\\begin{aligned} ${LHS_isolate} &= ${RHS_isolate} \\\\ \\frac{${LHS_isolate}}{\\color{indigo}{\\htmlId{div-lhs}{${netCoeff.toLaTeX()}}}} &= \\frac{${RHS_isolate}}{\\color{indigo}{\\htmlId{div-rhs}{${netCoeff.toLaTeX()}}}} \\\\ \\htmlId{lhs-var}{x} &= \\htmlId{rhs-const}{${S.toLaTeX()}} \\end{aligned}`,
        isolateCoeff: netCoeff,
        isolateConst: intermediateConst,
      });
    }

    // Automatically generate animationFrames from visualLaTeX for each step
    stepStates.forEach(step => {
      // Replace invalid \color{indigo} with \textcolor{#4f46e5} for KaTeX compatibility
      step.visualLaTeX = step.visualLaTeX.replace(/\\color{indigo}/g, '\\textcolor{#4f46e5}');

      let cleaned = step.visualLaTeX
        .replace('\\begin{aligned}', '')
        .replace('\\end{aligned}', '')
        .trim();

      let rawFrames = cleaned.split('\\\\');

      step.animationFrames = rawFrames.map(frame => {
        let f = frame.trim();
        if (f.endsWith('\\\\')) {
          f = f.slice(0, -2);
        }
        // Replace alignment operator '&=' with '=' for clean display
        f = f.replace(/&=/g, '=');
        // Normalize any double-escaped backslashes to a single backslash
        f = f.replace(/\\{2,}/g, '\\');
        return f.trim();
      }).filter(f => f.length > 0);
    });

    return {
      initialLHS,
      initialRHS,
      solution: S,
      steps: stepStates
    };
  }

  static parseLinearExpression(str) {
    // 1. Normalize unicode minus sign (often copied from KaTeX or web elements)
    str = str.replace(/\u2212/g, '-');
    
    // 2. Clean up LaTeX formatting (e.g. \frac{a}{b}, \textcolor, \color, \cdot)
    str = str.replace(/\\textcolor\s*\{[^{}]*\}\s*\{([^{}]+)\}/g, '$1');
    
    // Replace LaTeX \frac{num}{den} with normalized sign bubbling
    str = str.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (match, num, den) => {
      num = num.trim();
      den = den.trim();
      if (num.startsWith('+')) num = num.substring(1).trim();
      if (den.startsWith('+')) den = den.substring(1).trim();
      let isNeg = false;
      if (num.startsWith('-')) {
        isNeg = !isNeg;
        num = num.substring(1).trim();
      }
      if (den.startsWith('-')) {
        isNeg = !isNeg;
        den = den.substring(1).trim();
      }
      return (isNeg ? '-' : '') + num + '/' + den;
    });

    str = str.replace(/\\cdot/g, '');
    str = str.replace(/\\color\s*\{[^{}]*\}/g, '');
    str = str.replace(/[{}]/g, '');
    str = str.replace(/\\/g, '');

    // 3. Remove spaces and multiplication symbols
    str = str.replace(/\s+/g, '').replace(/\*/g, '');

    // 4. Bubble signs for plain division (e.g. 5/-2, -x/-2, -78/-13)
    str = str.replace(/([+-]?)([0-9x]+)\/([+-])([0-9]+)/gi, (match, numSign, numVal, denSign, denVal) => {
      let isNeg = false;
      if (numSign === '-') isNeg = !isNeg;
      if (denSign === '-') isNeg = !isNeg;
      return (isNeg ? '-' : '+') + numVal + '/' + denVal;
    });
    
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
      // Algebraic equivalence failed. Generate detailed diagnostics.
      if (expectedState.type === 'distribute') {
        const coeff = expectedState.distributeCoeff;
        const insideConst = expectedState.distributeInsideConst;
        const otherCoeff = expectedState.distributeOtherCoeff;
        
        if (coeff && insideConst) {
          const expectedConst = coeff.mul(insideConst);

          // Check if they forgot to multiply the constant
          if (userLHS.constant.equals(insideConst) || userLHS.constant.equals(insideConst.neg())) {
            return {
              valid: false,
              errorMsg: `It looks like you forgot to multiply the constant inside the parentheses (${insideConst.toString()}) by the outside coefficient (${coeff.toString()}). Remember to distribute the outside number to both terms inside.`
            };
          }

          // Check if they had a sign error on the constant
          if (userLHS.constant.equals(expectedConst.neg())) {
            return {
              valid: false,
              errorMsg: `Watch your signs! Multiplying ${coeff.toString()} by ${insideConst.toString()} should result in ${expectedConst.toString()}.`
            };
          }

          // Check if they forgot to distribute the coefficient to the variable term
          const userDistCoeff = userLHS.coeff.sub(otherCoeff || 0);
          if ((userDistCoeff.equals(1) || userDistCoeff.equals(-1)) && !coeff.equals(1) && !coeff.equals(-1)) {
            return {
              valid: false,
              errorMsg: `It looks like you forgot to multiply the variable term 'x' by the outside coefficient (${coeff.toString()}). Remember to distribute to both terms.`
            };
          }

          // Check if they had a sign error on the variable term
          if (userDistCoeff.equals(coeff.neg())) {
            return {
              valid: false,
              errorMsg: `Watch your signs on the variable term! Multiplying ${coeff.toString()} by 'x' should result in ${coeff.toString()}x.`
            };
          }
        }
      }

      if (expectedState.type === 'combine') {
        const c1 = expectedState.combineLHSCoeff1;
        const c2 = expectedState.combineLHSCoeff2;
        if (c1 && c2) {
          // If they wrote c1 instead of combining them
          if (userLHS.coeff.equals(c1) || userLHS.coeff.equals(c2)) {
            return {
              valid: false,
              errorMsg: `It looks like you didn't add the like terms ${c1.toString()}x and ${c2.toString()}x on the left side.`
            };
          }
          // If they subtracted them instead of adding them (or vice-versa)
          if (userLHS.coeff.equals(c1.sub(c2)) || userLHS.coeff.equals(c2.sub(c1))) {
            return {
              valid: false,
              errorMsg: `Check your signs when combining the x terms: ${c1.toString()}x and ${c2.toString()}x.`
            };
          }
        }
      }

      if (expectedState.type === 'move_variables') {
        const origL = expectedState.originalLHSCoeff;
        const origR = expectedState.originalRHSCoeff;
        if (origL && origR) {
          // Expected is origL - origR. If they added origR instead (origL + origR):
          if (userLHS.coeff.equals(origL.add(origR))) {
            return {
              valid: false,
              errorMsg: `Remember to change the sign of a term when moving it to the other side. Since we had ${origR.toString()}x on the right, we should subtract it from both sides.`
            };
          }
        }
      }

      if (expectedState.type === 'move_constants') {
        const origL = expectedState.originalLHSConst;
        const origR = expectedState.originalRHSConst;
        if (origL && origR) {
          // Expected is origR - origL. If they added origL instead (origR + origL):
          const userRHSConst = userRHS.constant;
          if (userRHSConst.equals(origR.add(origL))) {
            return {
              valid: false,
              errorMsg: `Remember to change the sign of a term when moving it to the other side. Since we had ${origL.toString()} on the left, we should subtract it from both sides.`
            };
          }
        }
      }

      if (expectedState.type === 'isolate') {
        if (userNetConst.mul(expectedNetCoeff).equals(expectedNetConst.mul(userNetCoeff))) {
          return { valid: false, errorMsg: "The final equation must isolate 'x' on the left (e.g. x = 5)." };
        }

        const coeff = expectedState.isolateCoeff;
        const constVal = expectedState.isolateConst;
        const addConst = expectedState.isolateAddConst;

        if (addConst && constVal) {
          // x + addConst = constVal. If they did targetConst + addConst instead of subtracting:
          if (userRHS.constant.equals(constVal.add(addConst))) {
            return {
              valid: false,
              errorMsg: `Remember to change the sign of the constant when moving it to the other side. Since we had ${addConst.toString()} on the left, we should subtract it from both sides.`
            };
          }
        }

        if (coeff && constVal) {
          // If they multiplied instead of dividing:
          if (userRHS.constant.equals(constVal.mul(coeff))) {
            return {
              valid: false,
              errorMsg: `It looks like you multiplied instead of dividing. To isolate 'x', divide both sides by the coefficient ${coeff.toString()}.`
            };
          }
          // If they subtracted/added instead of dividing:
          if (userRHS.constant.equals(constVal.sub(coeff)) || userRHS.constant.equals(constVal.add(coeff))) {
            return {
              valid: false,
              errorMsg: `To isolate 'x', you must divide by the coefficient ${coeff.toString()}, not subtract it.`
            };
          }
          // If they divided the coefficient by the constant instead (flipped fraction):
          if (userRHS.constant.equals(coeff.div(constVal))) {
            return {
              valid: false,
              errorMsg: `Check your division: you should divide the right-side constant (${constVal.toString()}) by the coefficient (${coeff.toString()}), not the other way around.`
            };
          }
        }
      }

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
