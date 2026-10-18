import { Fraction } from '../../shared/js/fraction.js';

export function generateFractionProblem(type) {
    let f1, f2;

    if (type === 'proper') {
        const d1 = Math.floor(Math.random() * 5) + 2;
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        f1 = new Fraction(n1, d1);

        const d2 = Math.floor(Math.random() * 5) + 2;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        f2 = new Fraction(n2, d2);
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 4) + 2);
    }

    const steps = [];

    const rawN = f1.n * f2.n;
    const rawD = f1.d * f2.d;

    steps.push({
        type: 'multiply',
        expectedInput: `${rawN}/${rawD}`,
        tex: `\\frac{${f1.n} \\times ${f2.n}}{${f1.d} \\times ${f2.d}} = \\frac{${rawN}}{${rawD}}`,
        animationFrames: [
            { math: `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\times \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}` },
            { math: `\\frac{\\htmlId{n1}{${f1.n}} \\textcolor{#4f46e5}{\\times} \\htmlId{n2}{${f2.n}}}{\\htmlId{d1}{${f1.d}} \\textcolor{#4f46e5}{\\times} \\htmlId{d2}{${f2.d}}}` },
            { math: `\\frac{\\htmlId{rn}{${rawN}}}{\\htmlId{rd}{${rawD}}}` }
        ],
        frameCaptions: [
            'Step 1: Start with the two fractions',
            'Step 2: Multiply numerator × numerator and denominator × denominator',
            `Step 3: Unsimplified product is ${rawN}/${rawD}`
        ]
    });

    const finalFraction = f1.mul(f2);
    const gcdVal = Math.round(rawN / finalFraction.n) || 1;

    if (rawN !== finalFraction.n || rawD !== finalFraction.d) {
        steps.push({
            type: 'simplify',
            expectedInput: finalFraction.d === 1 ? `${finalFraction.n}` : `${finalFraction.n}/${finalFraction.d}`,
            tex: `\\text{Simplify: } \\frac{${rawN}}{${rawD}} = ${finalFraction.toTeX()}`,
            animationFrames: [
                { math: `\\frac{\\htmlId{rn}{${rawN}}}{\\htmlId{rd}{${rawD}}}` },
                { math: `\\frac{\\htmlId{rn}{${rawN}} \\textcolor{#4f46e5}{\\div \\htmlId{g1}{${gcdVal}}}}{\\htmlId{rd}{${rawD}} \\textcolor{#4f46e5}{\\div \\htmlId{g2}{${gcdVal}}}}` },
                {
                    math: finalFraction.d === 1
                        ? `\\htmlId{fn}{${finalFraction.n}}`
                        : `\\frac{\\htmlId{fn}{${finalFraction.n}}}{\\htmlId{fd}{${finalFraction.d}}}`
                }
            ],
            frameCaptions: [
                `Step 1: Start with ${rawN}/${rawD}`,
                `Step 2: Divide top and bottom by GCD (${gcdVal})`,
                'Step 3: Simplified final fraction'
            ]
        });
    }

    return {
        f1,
        f2,
        steps,
        texInitial: `${f1.toTeX()} \\times ${f2.toTeX()}`
    };
}
