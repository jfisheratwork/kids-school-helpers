import { Fraction } from '../../shared/js/fraction.js';

export function generateConceptsProblem() {
    const rand = Math.random();

    if (rand < 0.25) {
        let num1 = Math.floor(Math.random() * 8) + 2;
        let num2 = Math.floor(Math.random() * 8) + 2;
        while (num1 === num2) {
            num2 = Math.floor(Math.random() * 8) + 2;
        }

        const lcm = Fraction.lcm(num1, num2);
        const m1 = lcm / num1;
        const m2 = lcm / num2;

        const steps = [{
            type: 'find_lcm',
            lcd: lcm,
            tex: `\\text{LCM of } ${num1} \\text{ and } ${num2} \\text{ is } ${lcm}`,
            expectedInput: lcm.toString(),
            animationFrames: [
                `\\text{LCM}(\\htmlId{a}{${num1}}, \\htmlId{b}{${num2}})`,
                `\\htmlId{a}{${num1}} \\textcolor{#4f46e5}{\\times ${m1}} = \\textcolor{#4f46e5}{\\htmlId{lcm1}{${lcm}}}, \\quad \\htmlId{b}{${num2}} \\textcolor{#4f46e5}{\\times ${m2}} = \\textcolor{#4f46e5}{\\htmlId{lcm2}{${lcm}}}`,
                `\\text{LCM}(\\htmlId{a}{${num1}}, \\htmlId{b}{${num2}}) = \\textcolor{#4f46e5}{\\htmlId{lcm1}{${lcm}}}`
            ],
            frameCaptions: [
                `1. Find the Least Common Multiple of ${num1} and ${num2}`,
                `2. ${num1} × ${m1} = ${lcm} and ${num2} × ${m2} = ${lcm}`,
                `3. Smallest shared multiple is ${lcm}`
            ]
        }];

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Find LCM of } ${num1} \\text{ and } ${num2}`
        };
    } else if (rand < 0.50) {
        const factor = Math.floor(Math.random() * 5) + 2;
        let n1 = Math.floor(Math.random() * 5) + 1;
        let n2 = Math.floor(Math.random() * 5) + 1;
        while (n1 === n2 || Fraction.gcd(n1, n2) > 1) {
            n2 = Math.floor(Math.random() * 5) + 1;
        }

        const num1 = n1 * factor;
        const num2 = n2 * factor;
        const gcd = Fraction.gcd(num1, num2);

        const steps = [{
            type: 'find_gcd',
            gcd: gcd,
            tex: `\\text{GCF of } ${num1} \\text{ and } ${num2} \\text{ is } ${gcd}`,
            expectedInput: gcd.toString(),
            animationFrames: [
                `\\text{GCF}(\\htmlId{a}{${num1}}, \\htmlId{b}{${num2}})`,
                `\\htmlId{a}{${num1}} = \\textcolor{#4f46e5}{\\htmlId{g1}{${gcd}}} \\times ${n1}, \\quad \\htmlId{b}{${num2}} = \\textcolor{#4f46e5}{\\htmlId{g2}{${gcd}}} \\times ${n2}`,
                `\\text{GCF}(\\htmlId{a}{${num1}}, \\htmlId{b}{${num2}}) = \\textcolor{#4f46e5}{\\htmlId{g1}{${gcd}}}`
            ],
            frameCaptions: [
                `1. Find the Greatest Common Factor of ${num1} and ${num2}`,
                `2. Factor both numbers by ${gcd}`,
                `3. Greatest Common Factor is ${gcd}`
            ]
        }];

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Find GCF of } ${num1} \\text{ and } ${num2}`
        };
    } else if (rand < 0.75) {
        let den = Math.floor(Math.random() * 8) + 4;
        let num = Math.floor(Math.random() * (den - 2)) + 2;
        const factor = Math.floor(Math.random() * 3) + 2;
        num *= factor;
        den *= factor;

        const f1 = new Fraction(num, den);

        const steps = [{
            type: 'simplify_concept',
            tex: `${f1.toTeX()}`,
            expectedInput: f1.d === 1 ? f1.n.toString() : `${f1.n}/${f1.d}`,
            animationFrames: [
                `\\frac{\\htmlId{n1}{${num}}}{\\htmlId{d1}{${den}}}`,
                `\\frac{\\htmlId{n1}{${num}} \\textcolor{#4f46e5}{\\div \\htmlId{f1}{${factor}}}}{\\htmlId{d1}{${den}} \\textcolor{#4f46e5}{\\div \\htmlId{f2}{${factor}}}}`,
                `\\frac{\\htmlId{n1}{${f1.n}}}{\\htmlId{d1}{${f1.d}}}`
            ],
            frameCaptions: [
                `1. Start with fraction ${num}/${den}`,
                `2. Divide top and bottom by GCF (${factor})`,
                `3. Simplified fraction is ${f1.n}/${f1.d}`
            ]
        }];

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Simplify } \\frac{${num}}{${den}}`
        };
    }

    const isProper = Math.random() < 0.5;
    let f1;

    if (isProper) {
        const d = Math.floor(Math.random() * 5) + 3;
        const n = Math.floor(Math.random() * (d - 1)) + 1;
        f1 = new Fraction(n, d);
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 4) + 2);
        if (f1.n < f1.d) f1.n += f1.d;
    }

    f1.simplify();

    const steps = [];
    const cmpSymbol = isProper ? '<' : '\\ge';

    steps.push({
        type: 'categorize',
        tex: `\\text{This is an } \\textbf{${isProper ? 'proper' : 'improper'}} \\text{ fraction.}`,
        expectedInput: isProper ? 'proper' : 'improper',
        animationFrames: [
            `\\frac{\\htmlId{num}{${f1.n}}}{\\htmlId{den}{${f1.d}}}`,
            `\\textcolor{#dc2626}{\\htmlId{num}{${f1.n}}} ${cmpSymbol} \\textcolor{#4f46e5}{\\htmlId{den}{${f1.d}}}`,
            `\\frac{\\htmlId{num}{${f1.n}}}{\\htmlId{den}{${f1.d}}} \\rightarrow \\textcolor{#4f46e5}{\\text{${isProper ? 'proper' : 'improper'}}}`
        ],
        frameCaptions: [
            `1. Examine numerator (${f1.n}) and denominator (${f1.d})`,
            `2. Compare top (${f1.n}) vs. bottom (${f1.d})`,
            `3. Since ${f1.n} ${isProper ? '<' : '≥'} ${f1.d}, it is ${isProper ? 'proper' : 'improper'}`
        ]
    });

    if (!isProper) {
        const w = Math.floor(f1.n / f1.d);
        const rem = f1.n % f1.d;

        let finalInput = w.toString();
        if (rem !== 0) finalInput += ` ${rem}/${f1.d}`;

        steps.push({
            type: 'convert_mixed',
            tex: f1.toTeX(true),
            expectedInput: finalInput,
            animationFrames: [
                `\\frac{\\htmlId{num}{${f1.n}}}{\\htmlId{den}{${f1.d}}}`,
                `\\htmlId{num}{${f1.n}} \\div \\htmlId{den}{${f1.d}} = \\textcolor{#4f46e5}{\\htmlId{w}{${w}}} \\text{ R } \\textcolor{#4f46e5}{\\htmlId{rem}{${rem}}}`,
                rem !== 0
                    ? `\\htmlId{w}{${w}} \\frac{\\htmlId{rem}{${rem}}}{\\htmlId{den}{${f1.d}}}`
                    : `\\htmlId{w}{${w}}`
            ],
            frameCaptions: [
                `1. Start with improper fraction ${f1.n}/${f1.d}`,
                `2. Divide ${f1.n} ÷ ${f1.d} = ${w} with remainder ${rem}`,
                `3. Write as mixed number: ${finalInput}`
            ]
        });
    }

    return {
        topic: 'concepts',
        f1,
        steps,
        texInitial: f1.toTeX()
    };
}
