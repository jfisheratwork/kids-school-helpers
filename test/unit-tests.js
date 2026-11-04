import { Fraction } from '../shared/js/fraction.js';
import { EquationGenerator } from '../pre-algebra-solver/js/generator.js';
import {
  buildFractionToDecimalProblem,
  generateFractionToDecimalProblem,
  parseCustomFractionToDecimalProblem
} from '../fractions-to-decimals/js/generator.js';
import {
  buildDecimalToFractionProblem,
  generateDecimalToFractionProblem,
  parseCustomDecimalToFractionProblem
} from '../decimals-to-fractions/js/generator.js';

// Simple browser assertion library
const assert = {
  ok(val, msg) {
    if (!val) throw new Error(msg || "Expected truthy value");
  },
  equal(actual, expected, msg) {
    if (actual !== expected) {
      throw new Error(msg || `Expected "${expected}" but got "${actual}"`);
    }
  },
  deepEqual(actual, expected, msg) {
    const actStr = JSON.stringify(actual);
    const expStr = JSON.stringify(expected);
    if (actStr !== expStr) {
      throw new Error(msg || `Expected ${expStr} but got ${actStr}`);
    }
  }
};

export const testSuite = {
  suites: {},
  currentSuite: null,
  
  describe(name, fn) {
    this.suites[name] = [];
    this.currentSuite = name;
    fn();
  },
  
  it(desc, fn) {
    if (!this.currentSuite) throw new Error("No active suite. Call describe first.");
    this.suites[this.currentSuite].push({ desc, fn });
  },
  
  run(onComplete) {
    const results = [];
    let total = 0;
    let passed = 0;
    let failed = 0;
    
    const suiteNames = Object.keys(this.suites);
    for (let suiteName of suiteNames) {
      const suiteResults = [];
      for (let test of this.suites[suiteName]) {
        total++;
        const start = performance.now();
        try {
          test.fn();
          passed++;
          suiteResults.push({ desc: test.desc, passed: true, time: performance.now() - start });
        } catch (err) {
          failed++;
          suiteResults.push({ desc: test.desc, passed: false, error: err.message, time: performance.now() - start });
        }
      }
      results.push({ name: suiteName, tests: suiteResults });
    }
    
    onComplete({ results, total, passed, failed });
  }
};

// Define Unit Tests
testSuite.describe("Fraction Arithmetic Suite", () => {
  testSuite.it("should simplify fractions on creation", () => {
    const f = new Fraction(2, 4);
    assert.equal(f.n, 1);
    assert.equal(f.d, 2);
    
    const fNeg = new Fraction(3, -9);
    assert.equal(fNeg.n, -1);
    assert.equal(fNeg.d, 3);
  });

  testSuite.it("should parse string integers and fractions", () => {
    const fInt = Fraction.parse("5");
    assert.equal(fInt.n, 5);
    assert.equal(fInt.d, 1);

    const fFrac = Fraction.parse("3/4");
    assert.equal(fFrac.n, 3);
    assert.equal(fFrac.d, 4);

    const fNeg = Fraction.parse("-1/2");
    assert.equal(fNeg.n, -1);
    assert.equal(fNeg.d, 2);
  });

  testSuite.it("should add fractions correctly", () => {
    const f1 = new Fraction(1, 2);
    const f2 = new Fraction(1, 3);
    const res = f1.add(f2);
    assert.equal(res.n, 5);
    assert.equal(res.d, 6);
  });

  testSuite.it("should subtract fractions correctly", () => {
    const f1 = new Fraction(1, 2);
    const f2 = new Fraction(1, 3);
    const res = f1.sub(f2);
    assert.equal(res.n, 1);
    assert.equal(res.d, 6);
  });

  testSuite.it("should multiply fractions correctly", () => {
    const f1 = new Fraction(2, 3);
    const f2 = new Fraction(3, 4);
    const res = f1.mul(f2);
    assert.equal(res.n, 1);
    assert.equal(res.d, 2);
  });

  testSuite.it("should divide fractions correctly", () => {
    const f1 = new Fraction(2, 3);
    const f2 = new Fraction(4, 3);
    const res = f1.div(f2);
    assert.equal(res.n, 1);
    assert.equal(res.d, 2);
  });
});

testSuite.describe("Linear Expression Parser Suite", () => {
  testSuite.it("should parse expressions with integers", () => {
    const expr = EquationGenerator.parseLinearExpression("3x - 6 + 4x");
    assert.equal(expr.coeff.toString(), "7");
    assert.equal(expr.constant.toString(), "-6");
  });

  testSuite.it("should parse expressions with fractions", () => {
    const expr = EquationGenerator.parseLinearExpression("1/2x + 1/4");
    assert.equal(expr.coeff.toString(), "1/2");
    assert.equal(expr.constant.toString(), "1/4");
  });

  testSuite.it("should handle variable terms without coefficients", () => {
    const expr1 = EquationGenerator.parseLinearExpression("x + 5");
    assert.equal(expr1.coeff.toString(), "1");
    assert.equal(expr1.constant.toString(), "5");

    const expr2 = EquationGenerator.parseLinearExpression("-x - 3");
    assert.equal(expr2.coeff.toString(), "-1");
    assert.equal(expr2.constant.toString(), "-3");
  });

  testSuite.it("should normalize Unicode minus and LaTeX formatting on parsing", () => {
    // 1. Unicode minus
    const expr1 = EquationGenerator.parseLinearExpression("−5x − 6");
    assert.equal(expr1.coeff.toString(), "-5");
    assert.equal(expr1.constant.toString(), "-6");

    // 2. LaTeX fraction and textcolor formatting
    const expr2 = EquationGenerator.parseLinearExpression("\\frac{-78}{\\textcolor{#4f46e5}{-13}}");
    assert.equal(expr2.coeff.toString(), "0");
    assert.equal(expr2.constant.toString(), "6");
  });

  testSuite.it("should handle LaTeX fraction sign bubbling and plain division sign bubbling", () => {
    // 1. \frac{-78}{\textcolor{#4f46e5}{-13}} -> coeff 0, constant 6
    const expr1 = EquationGenerator.parseLinearExpression("\\frac{-78}{\\textcolor{#4f46e5}{-13}}");
    assert.equal(expr1.coeff.toString(), "0");
    assert.equal(expr1.constant.toString(), "6");

    // 2. Components of x = \frac{5}{-2} (LHS and RHS respectively)
    const lhs = EquationGenerator.parseLinearExpression("x");
    const rhs = EquationGenerator.parseLinearExpression("\\frac{5}{-2}");
    assert.equal(lhs.coeff.toString(), "1");
    assert.equal(lhs.constant.toString(), "0");
    assert.equal(rhs.coeff.toString(), "0");
    assert.equal(rhs.constant.toString(), "-5/2");

    // 3. -x/-2 -> coeff 1/2, const 0
    const expr3 = EquationGenerator.parseLinearExpression("-x/-2");
    assert.equal(expr3.coeff.toString(), "1/2");
    assert.equal(expr3.constant.toString(), "0");

    // 4. 3x - 5/-2 -> coeff 3, const 5/2
    const expr4 = EquationGenerator.parseLinearExpression("3x - 5/-2");
    assert.equal(expr4.coeff.toString(), "3");
    assert.equal(expr4.constant.toString(), "5/2");

    // 5. -78/-13 -> coeff 0, const 6
    const expr5 = EquationGenerator.parseLinearExpression("-78/-13");
    assert.equal(expr5.coeff.toString(), "0");
    assert.equal(expr5.constant.toString(), "6");
  });
});

testSuite.describe("Equation Generator and Validator Suite", () => {
  testSuite.it("should generate equations with requested step size", () => {
    const eq = EquationGenerator.generate({ steps: 3, allowNegatives: true });
    assert.equal(eq.steps.length, 3);
    
    const eq5 = EquationGenerator.generate({ steps: 5, allowNegatives: true });
    assert.equal(eq5.steps.length, 5);
  });

  testSuite.it("should validate correct solver steps", () => {
    // Expected step: x = 6 (derived from 3x = 18, S = 6)
    const expected = {
      type: 'isolate',
      lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
      rhsCoeff: new Fraction(0), rhsConst: new Fraction(6),
      isolateCoeff: new Fraction(3),
      isolateConst: new Fraction(18)
    };
    
    // Test exact correct answer
    const valCorrect = EquationGenerator.validateStep("x = 6", expected);
    assert.ok(valCorrect.valid, "x = 6 should be valid");

    // Test algebraically equivalent but wrong structure for isolate step
    const valEquivStr = EquationGenerator.validateStep("3x = 18", expected);
    assert.ok(!valEquivStr.valid, "3x = 18 is not isolated yet and should fail isolate step");
    assert.equal(valEquivStr.errorMsg, "The final equation must isolate 'x' on the left (e.g. x = 5).");
  });

  testSuite.it("should reject algebraically incorrect steps with detailed diagnostics", () => {
    // 1. Distribute Step diagnostic
    const expectedDist = {
      type: 'distribute',
      lhsCoeff: new Fraction(0), lhsConst: new Fraction(-20),
      rhsCoeff: new Fraction(2), rhsConst: new Fraction(4),
      distributeCoeff: new Fraction(-2),
      distributeInsideConst: new Fraction(10),
      distributeOtherCoeff: new Fraction(2)
    };

    // Test correct answer (LHS coefficient sumAC = 0, LHS constant ab = -20)
    const valDistCorrect = EquationGenerator.validateStep("-2x - 20 + 2x = 2x + 4", expectedDist);
    assert.ok(valDistCorrect.valid, "Correct distribution step should be valid");

    // Test forgot to multiply constant
    const valDistForgotConst = EquationGenerator.validateStep("-2x - 10 + 2x = 2x + 4", expectedDist);
    assert.ok(!valDistForgotConst.valid);
    assert.ok(valDistForgotConst.errorMsg.includes("forgot to multiply the constant"));

    // Test sign error on constant
    const valDistSignConst = EquationGenerator.validateStep("-2x + 20 + 2x = 2x + 4", expectedDist);
    assert.ok(!valDistSignConst.valid);
    assert.ok(valDistSignConst.errorMsg.includes("Watch your signs"));

    // Test forgot to distribute to x
    const valDistForgotX = {
      type: 'distribute',
      lhsCoeff: new Fraction(2), lhsConst: new Fraction(20),
      rhsCoeff: new Fraction(0), rhsConst: new Fraction(4),
      distributeCoeff: new Fraction(2),
      distributeInsideConst: new Fraction(10),
      distributeOtherCoeff: new Fraction(0)
    };
    const valForgotX = EquationGenerator.validateStep("x + 20 = 4", valDistForgotX);
    assert.ok(!valForgotX.valid);
    assert.ok(valForgotX.errorMsg.includes("forgot to multiply the variable term"));

    // 2. Isolate step diagnostics
    const expectedIsolate = {
      type: 'isolate',
      lhsCoeff: new Fraction(1), lhsConst: new Fraction(0),
      rhsCoeff: new Fraction(0), rhsConst: new Fraction(5),
      isolateCoeff: new Fraction(3),
      isolateConst: new Fraction(15)
    };
    
    // Multiplied instead of divided
    const valIsolateMult = EquationGenerator.validateStep("x = 45", expectedIsolate);
    assert.ok(!valIsolateMult.valid);
    assert.ok(valIsolateMult.errorMsg.includes("multiplied instead of dividing"));

    // Subtracted instead of divided
    const valIsolateSub = EquationGenerator.validateStep("x = 12", expectedIsolate);
    assert.ok(!valIsolateSub.valid);
    assert.ok(valIsolateSub.errorMsg.includes("divide by the coefficient"));
  });

  testSuite.it("should generate 3-frame leaf htmlId animationFrames and frameCaptions on every Pre-Algebra step", () => {
    const eq = EquationGenerator.generate({ steps: 5, allowNegatives: true });
    assert.equal(eq.steps.length, 5);
    eq.steps.forEach((step, idx) => {
      assert.ok(Array.isArray(step.animationFrames), `Step ${idx} missing animationFrames`);
      assert.equal(step.animationFrames.length, 3, `Step ${idx} should have 3 animationFrames`);
      assert.ok(Array.isArray(step.frameCaptions), `Step ${idx} missing frameCaptions`);
      assert.equal(step.frameCaptions.length, 3, `Step ${idx} should have 3 frameCaptions`);
      step.animationFrames.forEach((frame, fIdx) => {
        assert.ok(frame.includes('\\htmlId{'), `Step ${idx} frame ${fIdx} missing leaf \\htmlId token`);
      });
    });
  });
});

testSuite.describe("Fractions to Decimals (Long Division) Suite", () => {
  testSuite.it("should build exact long-division steps for proper terminating fraction 3/4", () => {
    const p = buildFractionToDecimalProblem(3, 4, 'medium');
    assert.equal(p.quotientStr, "0.75");
    assert.equal(p.finalRemainder, 0);
    assert.equal(p.maxDecimalPlaces, 2);
    // 1 divide_whole + 2 decimal cycles * 4 steps = 9 steps
    assert.equal(p.steps.length, 9);
    assert.equal(p.steps[0].type, "divide_whole");
    assert.equal(p.steps[0].expectedInput, "0");
    assert.equal(p.steps[1].type, "bring_down_zero");
    assert.equal(p.steps[1].expectedInput, "30");
    assert.equal(p.steps[2].type, "divide_digit");
    assert.equal(p.steps[2].expectedInput, "7");
    assert.equal(p.steps[3].type, "multiply_back");
    assert.equal(p.steps[3].expectedInput, "28");
    assert.equal(p.steps[4].type, "subtract_down");
    assert.equal(p.steps[4].expectedInput, "2");
  });

  testSuite.it("should build exact long-division steps for improper fraction 7/4", () => {
    const p = buildFractionToDecimalProblem(7, 4, 'challenging');
    assert.equal(p.quotientStr, "1.75");
    assert.equal(p.finalRemainder, 0);
    assert.equal(p.steps[0].type, "divide_whole");
    assert.equal(p.steps[0].expectedInput, "1");
    assert.equal(p.steps[1].type, "multiply_back");
    assert.equal(p.steps[1].expectedInput, "4");
    assert.equal(p.steps[2].type, "subtract_down");
    assert.equal(p.steps[2].expectedInput, "3");
  });

  testSuite.it("should generate 3-frame htmlId animations across all 5 complexity levels including mixed_signed", () => {
    ['basic', 'medium', 'challenging', 'repeating', 'mixed_signed'].forEach((level) => {
      const p = generateFractionToDecimalProblem(level);
      assert.ok(p.steps.length >= 5, `Level ${level} should have at least 5 steps`);
      p.steps.forEach((step, idx) => {
        assert.equal(step.animationFrames.length, 3, `F2D ${level} step ${idx} needs 3 frames`);
        assert.equal(step.frameCaptions.length, 3, `F2D ${level} step ${idx} needs 3 captions`);
        step.animationFrames.forEach((f, fIdx) => {
          const mathStr = typeof f === 'string' ? f : f.math;
          assert.ok(mathStr.includes('\\htmlId{'), `F2D ${level} step ${idx} frame ${fIdx} missing \\htmlId`);
        });
      });
    });
  });

  testSuite.it("should parse and build exact long-division + combine steps for signed mixed number -5 7/12", () => {
    const p = parseCustomFractionToDecimalProblem("-5 7/12");
    assert.ok(p, "Should parse -5 7/12");
    assert.equal(p.isNegative, true);
    assert.equal(p.wholePart, 5);
    assert.equal(p.numerator, 7);
    assert.equal(p.denominator, 12);
    assert.equal(p.maxDecimalPlaces, 3);
    assert.equal(p.quotientStr, "0.583");
    assert.equal(p.finalAnswerStr, "-5.583");
    assert.ok(p.acceptedFinalAnswers.includes("-5.583"));
    assert.ok(p.acceptedFinalAnswers.includes("-5.583..."));
    assert.ok(p.acceptedFinalAnswers.includes("-5.58"));
    const finalStep = p.steps[p.steps.length - 1];
    assert.equal(finalStep.type, "combine_whole_and_sign");
    assert.equal(finalStep.expectedInput, "-5.583");
  });
});

testSuite.describe("Decimals to Fractions Suite", () => {
  testSuite.it("should build place-value and GCF reduction steps for 0.75", () => {
    const p = buildDecimalToFractionProblem("0.75", "basic");
    assert.equal(p.placeValueDenom, 100);
    assert.equal(p.gcf, 25);
    assert.equal(p.finalExpected, "3/4");
    assert.equal(p.steps.length, 4);
    assert.equal(p.steps[0].expectedInput, "100");
    assert.equal(p.steps[1].expectedInput, "75/100");
    assert.equal(p.steps[2].expectedInput, "25");
    assert.equal(p.steps[3].expectedInput, "3/4");
  });

  testSuite.it("should support mixed and improper answers for decimals greater than 1 (e.g. 1.25)", () => {
    const p = buildDecimalToFractionProblem("1.25", "challenging");
    assert.equal(p.placeValueDenom, 100);
    assert.equal(p.gcf, 25);
    assert.ok(p.acceptedFinalAnswers.includes("1 1/4"));
    assert.ok(p.acceptedFinalAnswers.includes("5/4"));
  });

  testSuite.it("should support negative mixed decimals (e.g. -5.75 -> -5 3/4 or -23/4)", () => {
    const p = parseCustomDecimalToFractionProblem("-5.75");
    assert.ok(p, "Should parse -5.75");
    assert.equal(p.isNegative, true);
    assert.equal(p.wholePart, 5);
    assert.equal(p.finalExpected, "-5 3/4");
    assert.ok(p.acceptedFinalAnswers.includes("-5 3/4"));
    assert.ok(p.acceptedFinalAnswers.includes("-23/4"));
  });

  testSuite.it("should generate 3-frame htmlId animations across all 3 complexity levels", () => {
    ['basic', 'medium', 'challenging'].forEach((level) => {
      const p = generateDecimalToFractionProblem(level);
      assert.ok(p.steps.length >= 2, `Level ${level} should have at least 2 steps`);
      p.steps.forEach((step, idx) => {
        assert.equal(step.animationFrames.length, 3, `D2F ${level} step ${idx} needs 3 frames`);
        assert.equal(step.frameCaptions.length, 3, `D2F ${level} step ${idx} needs 3 captions`);
        step.animationFrames.forEach((f, fIdx) => {
          const mathStr = typeof f === 'string' ? f : f.math;
          assert.ok(mathStr.includes('\\htmlId{'), `D2F ${level} step ${idx} frame ${fIdx} missing \\htmlId`);
        });
      });
    });
  });
});

if (typeof window !== 'undefined') {
  window.testSuite = testSuite;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testSuite };
}
