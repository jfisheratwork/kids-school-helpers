---
name: math-engine-audit
description: >-
  Audits Kids School Helpers mathematical engines for fraction reduction, zero-denominator guards,
  long-division / GCF / equation step-by-step parity, fail-fast input validation, and unit test verification.
  Activate whenever creating, modifying, or debugging math models, problem generators, parsers, or solver state machines.
---

# Math Engine Audit Skill

Use this skill whenever auditing, implementing, or debugging mathematical logic in **Kids School Helpers** (`shared/js/fraction.js`, `<module>/js/generator*.js`, `<module>/js/solver*.js`, and `test/unit-tests.js`).

---

## 1. Grounding & Symbol Mapping

1. Read the active architecture and module specs:
   - [01-architecture-and-standards.md](../../../spec/01-architecture-and-standards.md)
   - Target module spec under `<module>/specs/` (when present).
2. Map all callsites and exports before editing shared math utilities using `lsp-bridge` (`lsp_file_exports`, `lsp_find_references`) or `ast-grep` (`find_code`).

---

## 2. Core Mathematical Invariants Checklist

### A. Fraction Arithmetic & Normalization (`shared/js/fraction.js`)
- **Zero-Denominator Guard**: Constructing `new Fraction(n, 0)`, dividing by `0`, or taking the reciprocal of `0` MUST throw an explicit error—never silently return `0`, `NaN`, or `Infinity`.
- **Canonical Sign**: Negative signs MUST be normalized to the numerator (`den > 0`); zero MUST normalize to `0 / 1`.
- **Lowest Terms**: Numerator and denominator MUST be reduced by `gcd(|num|, |den|)` on construction and after every arithmetic operation (`add`, `sub`, `mul`, `div`).
- **Exactness**: Avoid converting `Fraction` values to IEEE-754 floats during intermediate rational steps.

### B. Long Division, Multiplication, GCF/LCM, & Decimal Conversions
- **Long Division (`division/`)**: Verify every bring-down, partial quotient, subtraction, and remainder step satisfies `dividend === quotient * divisor + remainder` with `0 <= remainder < divisor` (or exact terminating/repeating decimal expansion).
- **Multi-Digit Multiplication (`multiplication/`)**: Verify partial products align with place values and sum exactly to the final product, including zeros in interior digits.
- **Fractions & Decimals (`fractions/`, `decimals-to-fractions/`, `fractions-to-decimals/`)**: Verify GCD/LCM reduction steps, mixed-number conversions, and terminating vs. repeating decimal boundaries.
- **Pre-Algebra & Graphing (`pre-algebra-solver/`, `graphing-lines/`, `geometry/`)**: Verify inverse operations preserve equation equivalence at every step, vertical lines (`run === 0`) handle undefined slope explicitly, and generated problems never yield degenerate or unintended `0 = 0` / division-by-zero states.

### C. Fail-Fast Parsing & Boundary Validation
- Reject malformed custom inputs (empty strings, non-numeric tokens, `a/0`, stray symbols) at parser boundaries with clear student-facing feedback.
- Never use empty `catch` blocks or return silent dummy fallback values (`null`, `[]`, `{}`).

---

## 3. Systemic Pattern Sweep

If a math bug is found in one module (e.g., direct `NaN` comparison, unguarded zero denominator, unsimplified fraction, floating-point drift), search the **entire repository** with `ast-grep` or `rg` to ensure the same pattern does not exist in sibling modules.

---

## 4. Verification Commands

Run targeted verification before reporting completion:

```bash
node -c <modified-file.js>
node test/unit-tests.js
make lint
make lint-rules
```

For major multi-module math changes, also run the full headless integration suite:

```bash
make test
```

---

## 5. Structured Audit Handoff

Report results using the standard structure:
- **Changes Applied**
- **Test/Lint Results**
- **Edge Cases Found** (with specific failing/boundary inputs tested)
- **Immediate Next Steps**
