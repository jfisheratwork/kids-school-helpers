import { Fraction } from '../../shared/js/fraction.js';

export function generateFractionDivisionProblem(type) {
    let f1, f2;

    if (type === 'proper') {
        f1 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        if (f1.n >= f1.d) f1.n = f1.d - 1;
        if (f2.n >= f2.d) f2.n = f2.d - 1;
        if (f1.n === 0) f1.n = 1;
        if (f2.n === 0) f2.n = 1;
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 4) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 4) + 2);
    }

    const steps = [];

    // Step 0: Keep Change Flip
    const f2Flipped = new Fraction(f2.d, f2.n);
    const flippedExpected = f2Flipped.d === 1 ? `${f2Flipped.n}` : `${f2Flipped.n}/${f2Flipped.d}`;
    steps.push({
        type: 'keep_change_flip',
        expectedInput: flippedExpected,
        altExpected: `${f1.n}/${f1.d}*${f2Flipped.n}/${f2Flipped.d}`,
        tex: `${f1.toTeX()} \\times ${f2Flipped.toTeX()}`,
        animationFrames: [
            { math: `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\htmlId{op}{\\div} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}` },
            { math: `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\textcolor{#4f46e5}{\\htmlId{op}{\\times}} \\frac{\\textcolor{#4f46e5}{\\htmlId{d2}{${f2.d}}}}{\\textcolor{#4f46e5}{\\htmlId{n2}{${f2.n}}}}` },
            {
                math: f2Flipped.d === 1
                    ? `\\text{Reciprocal: } \\textcolor{#16a34a}{\\htmlId{d2}{${f2Flipped.n}}}`
                    : `\\text{Reciprocal: } \\frac{\\textcolor{#16a34a}{\\htmlId{d2}{${f2Flipped.n}}}}{\\textcolor{#16a34a}{\\htmlId{n2}{${f2Flipped.d}}}}`
            }
        ],
        frameCaptions: [
            'Step 1: Keep the first fraction as it is',
            'Step 2: Change ÷ to × and flip the second fraction',
            `Step 3: Enter the flipped fraction (${flippedExpected})`
        ]
    });

    // Step 1: multiply num and denom directly (unsimplified)
    const rawN = f1.n * f2Flipped.n;
    const rawD = f1.d * f2Flipped.d;

    steps.push({
        type: 'multiply',
        expectedInput: `${rawN}/${rawD}`,
        tex: `\\frac{${f1.n} \\times ${f2Flipped.n}}{${f1.d} \\times ${f2Flipped.d}} = \\frac{${rawN}}{${rawD}}`,
        animationFrames: [
            { math: `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} \\times \\frac{\\htmlId{fn2}{${f2Flipped.n}}}{\\htmlId{fd2}{${f2Flipped.d}}}` },
            { math: `\\frac{\\htmlId{n1}{${f1.n}} \\textcolor{#4f46e5}{\\times} \\htmlId{fn2}{${f2Flipped.n}}}{\\htmlId{d1}{${f1.d}} \\textcolor{#4f46e5}{\\times} \\htmlId{fd2}{${f2Flipped.d}}}` },
            { math: `\\frac{\\htmlId{rn}{${rawN}}}{\\htmlId{rd}{${rawD}}}` }
        ],
        frameCaptions: [
            'Step 1: Set up fraction multiplication',
            'Step 2: Multiply numerators and multiply denominators',
            `Step 3: Unsimplified product is ${rawN}/${rawD}`
        ]
    });

    const finalFraction = f1.mul(f2Flipped);
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
        f2Flipped,
        steps,
        texInitial: `${f1.toTeX()} \\div ${f2.toTeX()}`
    };
}
