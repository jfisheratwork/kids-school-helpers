import { Fraction } from './fraction.js';

export function generateDivProblem(fractionType) {
    let f1, f2;
    
    if (fractionType === 'proper') {
        f1 = new Fraction(Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 2);
        if (f1.n >= f1.d) f1.n = f1.d - 1;
        if (f2.n >= f2.d) f2.n = f2.d - 1;
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 4) + 2);
    }

    const steps = [];
    
    // Step 1: Keep Change Flip
    steps.push({
        type: 'kcf',
        tex: `\\frac{${f1.n}}{${f1.d}} \\times \\frac{${f2.d}}{${f2.n}}`,
        expectedInput: `${f1.n}/${f1.d} * ${f2.d}/${f2.n}`,
        animationFrames: [
            `\\htmlId{keep}{\\frac{${f1.n}}{${f1.d}}} \\htmlId{change}{\\div} \\htmlId{flip}{\\frac{${f2.n}}{${f2.d}}}`,
            `\\htmlId{keep}{\\frac{${f1.n}}{${f1.d}}} \\htmlId{change}{\\color{red}{\\times}} \\htmlId{flip}{\\frac{${f2.n}}{${f2.d}}}`,
            `\\htmlId{keep}{\\frac{${f1.n}}{${f1.d}}} \\htmlId{change}{\\times} \\htmlId{flip}{\\frac{\\color{blue}{${f2.d}}}{\\color{blue}{${f2.n}}}}`
        ]
    });
    
    const rawN = f1.n * f2.d;
    const rawD = f1.d * f2.n;

    steps.push({
        type: 'multiply',
        tex: `\\frac{${rawN}}{${rawD}}`,
        expectedInput: `${rawN}/${rawD}`,
        animationFrames: [
            `\\htmlId{keep}{\\frac{${f1.n}}{${f1.d}}} \\times \\htmlId{flip}{\\frac{${f2.d}}{${f2.n}}}`,
            `\\frac{${f1.n} \\times ${f2.d}}{${f1.d} \\times ${f2.n}}`,
            `\\frac{${rawN}}{${rawD}}`
        ]
    });

    const finalFraction = new Fraction(rawN, rawD);
    if (rawN !== finalFraction.n || rawD !== finalFraction.d) {
        steps.push({
            type: 'simplify',
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: finalFraction.d === 1 ? finalFraction.n.toString() : `${finalFraction.n}/${finalFraction.d}`,
            animationFrames: [
                `\\frac{${rawN}}{${rawD}}`,
                `\\frac{${rawN} \\div \\color{blue}{${rawN/finalFraction.n}}}{${rawD} \\div \\color{blue}{${rawD/finalFraction.d}}}`,
                `${finalFraction.toTeX(true)}`
            ]
        });
    }

    return {
        topic: 'divide',
        f1,
        f2,
        steps,
        texInitial: `${f1.toTeX()} \\div ${f2.toTeX()}`,
        finalFraction
    };
}
