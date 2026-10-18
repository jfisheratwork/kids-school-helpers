import { Fraction } from '../../shared/js/fraction.js';

export function generateDivProblem(fractionType) {
    let f1, f2;

    if (fractionType === 'proper') {
        const d1 = Math.floor(Math.random() * 4) + 2;
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        f1 = new Fraction(n1, d1);

        const d2 = Math.floor(Math.random() * 4) + 2;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        f2 = new Fraction(n2, d2);
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 4) + 2);
    }

    const steps = [];

    // Step 1: Keep Change Flip (leaf \htmlId{n2} and \htmlId{d2} physically swap!)
    steps.push({
        type: 'kcf',
        tex: `\\frac{${f1.n}}{${f1.d}} \\times \\frac{${f2.d}}{${f2.n}}`,
        expectedInput: `${f1.n}/${f1.d} * ${f2.d}/${f2.n}`,
        animationFrames: [
            `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\htmlId{op}{\\div} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}`,
            `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\textcolor{#dc2626}{\\htmlId{op}{\\times}} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}`,
            `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\htmlId{op}{\\times} \\frac{\\textcolor{#4f46e5}{\\htmlId{d2}{${f2.d}}}}{\\textcolor{#4f46e5}{\\htmlId{n2}{${f2.n}}}}`
        ],
        frameCaptions: [
            `1. Keep the first fraction (${f1.n}/${f1.d})`,
            '2. Change division (÷) to multiplication (×)',
            `3. Flip the second fraction (${f2.n}/${f2.d} → ${f2.d}/${f2.n})`
        ]
    });

    const rawN = f1.n * f2.d;
    const rawD = f1.d * f2.n;

    steps.push({
        type: 'multiply',
        tex: `\\frac{${rawN}}{${rawD}}`,
        expectedInput: `${rawN}/${rawD}`,
        animationFrames: [
            `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\htmlId{op}{\\times} \\frac{\\htmlId{n2}{${f2.d}}}{\\htmlId{d2}{${f2.n}}}`,
            `\\frac{\\htmlId{n1}{${f1.n}} \\textcolor{#4f46e5}{\\htmlId{op}{\\times}} \\htmlId{n2}{${f2.d}}}{\\htmlId{d1}{${f1.d}} \\textcolor{#4f46e5}{\\htmlId{op2}{\\times}} \\htmlId{d2}{${f2.n}}}`,
            `\\frac{\\htmlId{n1}{${rawN}}}{\\htmlId{d1}{${rawD}}}`
        ],
        frameCaptions: [
            '1. Ready to multiply straight across',
            `2. Multiply numerators (${f1.n} × ${f2.d}) and denominators (${f1.d} × ${f2.n})`,
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
                `1. Unsimplified fraction ${rawN}/${rawD}`,
                `2. Divide top and bottom by GCF (${gcf})`,
                `3. Simplified result: ${finalFraction.d === 1 ? finalFraction.n : `${finalFraction.n}/${finalFraction.d}`}`
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
