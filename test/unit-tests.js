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
});

testSuite.describe("Equation Generator and Validator Suite", () => {
  testSuite.it("should generate equations with requested step size", () => {
    const eq = EquationGenerator.generate({ steps: 3, allowNegatives: true });
    assert.equal(eq.steps.length, 3);
    
    const eq5 = EquationGenerator.generate({ steps: 5, allowNegatives: true });
    assert.equal(eq5.steps.length, 5);
  });

  testSuite.it("should validate correct solver steps", () => {
    // Expected step: 3x = 18 (isolate variable, S = 6)
    const expected = {
      type: 'isolate',
      lhsCoeff: new Fraction(3), lhsConst: new Fraction(0),
      rhsCoeff: new Fraction(0), rhsConst: new Fraction(18)
    };
    
    // Test exact correct answer
    const valCorrect = EquationGenerator.validateStep("x = 6", expected);
    assert.ok(valCorrect.valid, "x = 6 should be valid");

    // Test algebraically equivalent but wrong structure for isolate step
    const valEquivStr = EquationGenerator.validateStep("3x = 18", expected);
    assert.ok(!valEquivStr.valid, "3x = 18 is not isolated yet and should fail isolate step");
    assert.equal(valEquivStr.errorMsg, "The final equation must isolate 'x' on the left (e.g. x = 5).");
  });

  testSuite.it("should reject algebraically incorrect steps", () => {
    const expected = {
      type: 'move_constants',
      lhsCoeff: new Fraction(3), lhsConst: new Fraction(0),
      rhsCoeff: new Fraction(0), rhsConst: new Fraction(18)
    };
    const validation = EquationGenerator.validateStep("3x = 15", expected);
    assert.ok(!validation.valid);
    assert.equal(validation.errorMsg, "This equation is not algebraically equivalent to the expected step.");
  });
});
