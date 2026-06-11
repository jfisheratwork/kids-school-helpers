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

const testSuite = {
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
});
