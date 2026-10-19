import { Fraction } from '../../shared/js/fraction.js';

function getDigitRange(digits) {
    if (digits === 2) return { min: 10, max: 99 };
    if (digits === 3) return { min: 100, max: 999 };
    return { min: 2, max: 9 };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMultProblem(fractionType, digits = 1) {
    let f1, f2;
    const range = getDigitRange(digits);

    if (fractionType === 'proper') {
        const d1 = getRandomInt(Math.max(range.min, 2), range.max);
        const n1 = getRandomInt(1, d1 - 1);
        f1 = new Fraction(n1, d1);

        const d2 = getRandomInt(Math.max(range.min, 2), range.max);
        const n2 = getRandomInt(1, d2 - 1);
        f2 = new Fraction(n2, d2);
    } else {
        const d1 = getRandomInt(Math.max(range.min, 2), range.max);
        const n1 = d1 + getRandomInt(1, range.max);
        f1 = new Fraction(n1, d1);

        const d2 = getRandomInt(Math.max(range.min, 2), range.max);
        const n2 = d2 + getRandomInt(1, range.max);
        f2 = new Fraction(n2, d2);
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
