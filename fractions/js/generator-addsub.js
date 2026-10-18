import { Fraction } from '../../shared/js/fraction.js';

export function generateAddSubProblem(fractionType) {
    let f1, f2;
    const isSub = Math.random() < 0.5;

    if (fractionType === 'proper') {
        const d1 = Math.floor(Math.random() * 5) + 2;
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        f1 = new Fraction(n1, d1);

        const d2 = Math.floor(Math.random() * 5) + 2;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        f2 = new Fraction(n2, d2);
    } else {
        // mixed/improper
        f1 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 5) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 10) + 3, Math.floor(Math.random() * 5) + 2);
    }

    // For subtraction, ensure f1 >= f2 so we don't get negative answers
    if (isSub) {
        const val1 = f1.n / f1.d;
        const val2 = f2.n / f2.d;
        if (val2 > val1) {
            const temp = f1;
            f1 = f2;
            f2 = temp;
        }
    }

    const steps = [];
    const lcd = Fraction.lcm(f1.d, f2.d);

    const mult1 = lcd / f1.d;
    const mult2 = lcd / f2.d;
    const newN1 = f1.n * mult1;
    const newN2 = f2.n * mult2;

    const op = isSub ? '-' : '+';

    if (f1.d !== f2.d) {
        steps.push({
            type: 'find_lcd',
            lcd: lcd,
            tex: `\\text{LCD: } ${lcd}`,
            expectedInput: lcd.toString(),
            animationFrames: [
                `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} ${op} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}`,
                `\\frac{\\htmlId{n1}{${f1.n}}}{\\textcolor{#dc2626}{\\htmlId{d1}{${f1.d}}}} ${op} \\frac{\\htmlId{n2}{${f2.n}}}{\\textcolor{#dc2626}{\\htmlId{d2}{${f2.d}}}}`,
                `\\text{LCD}(\\textcolor{#dc2626}{\\htmlId{d1}{${f1.d}}}, \\textcolor{#dc2626}{\\htmlId{d2}{${f2.d}}}) = \\textcolor{#4f46e5}{\\htmlId{lcd}{${lcd}}}`
            ],
            frameCaptions: [
                '1. Start with the two fractions',
                `2. Inspect denominators ${f1.d} and ${f2.d}`,
                `3. The Least Common Denominator (LCD) is ${lcd}`
            ]
        });

        steps.push({
            type: 'convert',
            newN1, newN2, lcd,
            tex: `\\frac{${newN1}}{${lcd}} ${op} \\frac{${newN2}}{${lcd}}`,
            expectedInput: `${newN1}/${lcd} ${op} ${newN2}/${lcd}`,
            animationFrames: [
                `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}} ${op} \\frac{\\htmlId{n2}{${f2.n}}}{\\htmlId{d2}{${f2.d}}}`,
                `\\frac{\\htmlId{n1}{${f1.n}} \\textcolor{#4f46e5}{\\times \\htmlId{m1t}{${mult1}}}}{\\htmlId{d1}{${f1.d}} \\textcolor{#4f46e5}{\\times \\htmlId{m1b}{${mult1}}}} ${op} \\frac{\\htmlId{n2}{${f2.n}} \\textcolor{#4f46e5}{\\times \\htmlId{m2t}{${mult2}}}}{\\htmlId{d2}{${f2.d}} \\textcolor{#4f46e5}{\\times \\htmlId{m2b}{${mult2}}}}`,
                `\\frac{\\htmlId{n1}{${newN1}}}{\\htmlId{d1}{${lcd}}} ${op} \\frac{\\htmlId{n2}{${newN2}}}{\\htmlId{d2}{${lcd}}}`
            ],
            frameCaptions: [
                `1. Convert both fractions to denominator ${lcd}`,
                `2. Multiply first by ${mult1}/${mult1} and second by ${mult2}/${mult2}`,
                `3. Equivalent fractions with common denominator ${lcd}`
            ]
        });
    }

    // Step 3: Add / Sub
    const finalN = isSub ? newN1 - newN2 : newN1 + newN2;
    steps.push({
        type: 'operate',
        finalN, lcd,
        tex: `\\frac{${finalN}}{${lcd}}`,
        expectedInput: `${finalN}/${lcd}`,
        animationFrames: [
            `\\frac{\\htmlId{n1}{${newN1}}}{\\htmlId{d1}{${lcd}}} \\htmlId{op}{${op}} \\frac{\\htmlId{n2}{${newN2}}}{\\htmlId{d2}{${lcd}}}`,
            `\\frac{\\textcolor{#4f46e5}{\\htmlId{n1}{${newN1}} \\htmlId{op}{${op}} \\htmlId{n2}{${newN2}}}}{\\htmlId{d1}{${lcd}}}`,
            `\\frac{\\htmlId{n1}{${finalN}}}{\\htmlId{d1}{${lcd}}}`
        ],
        frameCaptions: [
            `1. Both fractions share the denominator ${lcd}`,
            `2. ${isSub ? 'Subtract' : 'Add'} the numerators (${newN1} ${op} ${newN2}) over ${lcd}`,
            `3. Result is ${finalN}/${lcd}`
        ]
    });

    // Step 4: Simplify
    const finalFraction = isSub ? new Fraction(finalN, lcd) : f1.add(f2);
    if (finalN !== finalFraction.n || lcd !== finalFraction.d) {
        const gcf = finalN / finalFraction.n;
        steps.push({
            type: 'simplify',
            finalN: finalFraction.n, finalD: finalFraction.d,
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: finalFraction.d === 1 ? finalFraction.n.toString() : `${finalFraction.n}/${finalFraction.d}`,
            animationFrames: [
                `\\frac{\\htmlId{n1}{${finalN}}}{\\htmlId{d1}{${lcd}}}`,
                `\\frac{\\htmlId{n1}{${finalN}} \\textcolor{#4f46e5}{\\div \\htmlId{gcf1}{${gcf}}}}{\\htmlId{d1}{${lcd}} \\textcolor{#4f46e5}{\\div \\htmlId{gcf2}{${gcf}}}}`,
                finalFraction.d === 1
                    ? `\\htmlId{n1}{${finalFraction.n}}`
                    : `\\frac{\\htmlId{n1}{${finalFraction.n}}}{\\htmlId{d1}{${finalFraction.d}}}`
            ],
            frameCaptions: [
                `1. Check if ${finalN}/${lcd} can be simplified`,
                `2. Divide numerator and denominator by GCF (${gcf})`,
                `3. Simplified result: ${finalFraction.d === 1 ? finalFraction.n : `${finalFraction.n}/${finalFraction.d}`}`
            ]
        });
    } else if (finalFraction.n >= finalFraction.d && finalFraction.d !== 1 && fractionType !== 'proper') {
        const w = Math.floor(finalFraction.n / finalFraction.d);
        const r = finalFraction.n % finalFraction.d;
        steps.push({
            type: 'simplify',
            finalN: finalFraction.n, finalD: finalFraction.d,
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: `${w} ${r}/${finalFraction.d}`,
            animationFrames: [
                `\\frac{\\htmlId{n1}{${finalFraction.n}}}{\\htmlId{d1}{${finalFraction.d}}}`,
                `\\textcolor{#4f46e5}{\\htmlId{w}{${w}}} \\text{ with remainder } \\textcolor{#4f46e5}{\\htmlId{n1}{${r}}} \\text{ over } \\htmlId{d1}{${finalFraction.d}}`,
                `\\htmlId{w}{${w}} \\frac{\\htmlId{n1}{${r}}}{\\htmlId{d1}{${finalFraction.d}}}`
            ],
            frameCaptions: [
                `1. Improper fraction ${finalFraction.n}/${finalFraction.d}`,
                `2. Divide ${finalFraction.n} by ${finalFraction.d}: quotient ${w}, remainder ${r}`,
                `3. Mixed number: ${w} ${r}/${finalFraction.d}`
            ]
        });
    }

    return {
        topic: 'addsub',
        f1,
        f2,
        isSub,
        steps,
        texInitial: `${f1.toTeX()} ${op} ${f2.toTeX()}`,
        finalFraction
    };
}
