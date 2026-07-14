import { Fraction } from './fraction.js';

export function generateMultProblem(fractionType) {
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
    
    const rawN = f1.n * f2.n;
    const rawD = f1.d * f2.d;

    steps.push({
        type: 'multiply',
        tex: `\\frac{${rawN}}{${rawD}}`,
        expectedInput: `${rawN}/${rawD}`,
        animationFrames: [
            `\\htmlId{f1}{\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}}} \\times \\htmlId{f2}{\\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}}`,
            `\\frac{\\htmlId{n1}{${f1.n}} \\times \\htmlId{n2}{${f2.n}}}{\\htmlId{d1}{${f1.d}} \\times \\htmlId{d2}{${f2.d}}}`,
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
        topic: 'multiply',
        f1,
        f2,
        steps,
        texInitial: `${f1.toTeX()} \\times ${f2.toTeX()}`,
        finalFraction
    };
}
