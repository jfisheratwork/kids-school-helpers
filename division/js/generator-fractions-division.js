import { Fraction } from './fraction.js';

export function generateFractionDivisionProblem(type) {
    let f1, f2;
    
    if (type === 'proper') {
        f1 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        // Ensure proper
        if (f1.n >= f1.d) f1.n = f1.d - 1;
        if (f2.n >= f2.d) f2.n = f2.d - 1;
    } else {
        // mixed / improper
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 4) + 2);
    }

    const steps = [];
    
    // Step 0: Keep Change Flip
    const f2Flipped = new Fraction(f2.d, f2.n);
    steps.push({
        type: 'keep_change_flip',
        tex: `${f1.toTeX()} \\times ${f2Flipped.toTeX()}`
    });
    
    // Step 1: multiply num and denom directly (unsimplified)
    const rawN = f1.n * f2Flipped.n;
    const rawD = f1.d * f2Flipped.d;
    
    steps.push({
        type: 'multiply',
        expectedInput: `${rawN}/${rawD}`, // simple format for user to type
        tex: `\\frac{${f1.n} \\times ${f2Flipped.n}}{${f1.d} \\times ${f2Flipped.d}} = \\frac{${rawN}}{${rawD}}`
    });

    const finalFraction = f1.multiply(f2Flipped);
    
    if (rawN !== finalFraction.n || rawD !== finalFraction.d) {
        steps.push({
            type: 'simplify',
            expectedInput: finalFraction.d === 1 ? `${finalFraction.n}` : `${finalFraction.n}/${finalFraction.d}`,
            tex: `\\text{Simplify: } \\frac{${rawN}}{${rawD}} = ${finalFraction.toTeX()}`
        });
    }

    return {
        f1,
        f2,
        steps,
        texInitial: `${f1.toTeX()} \\div ${f2.toTeX()}`
    };
}
