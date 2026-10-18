import { Fraction } from '../../shared/js/fraction.js';

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
            `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\htmlId{op}{\\times} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}`,
            `\\frac{\\htmlId{n1}{${f1.n}} \\textcolor{#4f46e5}{\\htmlId{op}{\\times}} \\htmlId{n2}{${f2.n}}}{\\htmlId{d1}{${f1.d}} \\textcolor{#4f46e5}{\\htmlId{op2}{\\times}} \\htmlId{d2}{${f2.d}}}`,
            `\\frac{\\htmlId{n1}{${rawN}}}{\\htmlId{d1}{${rawD}}}`
        ],
        frameCaptions: [
            '1. Start with the two fractions to multiply',
            `2. Multiply numerators (${f1.n} × ${f2.n}) and denominators (${f1.d} × ${f2.d})`,
            `3. Product is ${rawN}/${rawD}`
        ]
    });

    const finalFraction = new Fraction(rawN, rawD);
    if (rawN !== finalFraction.n || rawD !== finalFraction.d) {
        const gcf = rawN / finalFraction.n;
        steps.push({
            type: 'simplify',
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: finalFraction.d === 1 ? finalFraction.n.toString() : `${finalFraction.n}/${finalFraction.d}`,
            animationFrames: [
                `\\frac{\\htmlId{n1}{${rawN}}}{\\htmlId{d1}{${rawD}}}`,
                `\\frac{\\htmlId{n1}{${rawN}} \\textcolor{#4f46e5}{\\div \\htmlId{gcf1}{${gcf}}}}{\\htmlId{d1}{${rawD}} \\textcolor{#4f46e5}{\\div \\htmlId{gcf2}{${gcf}}}}`,
                finalFraction.d === 1
                    ? `\\htmlId{n1}{${finalFraction.n}}`
                    : `\\frac{\\htmlId{n1}{${finalFraction.n}}}{\\htmlId{d1}{${finalFraction.d}}}`
            ],
            frameCaptions: [
                `1. Unsimplified product ${rawN}/${rawD}`,
                `2. Divide top and bottom by GCF (${gcf})`,
                `3. Simplified answer: ${finalFraction.d === 1 ? finalFraction.n : `${finalFraction.n}/${finalFraction.d}`}`
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
