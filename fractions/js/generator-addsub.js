import { Fraction } from './fraction.js';

export function generateAddSubProblem(fractionType) {
    let f1, f2;
    const isSub = Math.random() < 0.5;
    
    if (fractionType === 'proper') {
        f1 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        f2 = new Fraction(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 2);
        if (f1.n >= f1.d) f1.n = f1.d - 1;
        if (f2.n >= f2.d) f2.n = f2.d - 1;
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
                `\\htmlId{f1}{\\frac{${f1.n}}{\\htmlId{d1}{${f1.d}}}} ${op} \\htmlId{f2}{\\frac{${f2.n}}{\\htmlId{d2}{${f2.d}}}}`,
                `\\htmlId{f1}{\\frac{${f1.n}}{\\htmlId{d1}{\\color{red}{${f1.d}}}}} ${op} \\htmlId{f2}{\\frac{${f2.n}}{\\htmlId{d2}{\\color{red}{${f2.d}}}}}`,
                `\\text{LCD of } \\color{red}{${f1.d}} \\text{ and } \\color{red}{${f2.d}} \\text{ is } \\color{blue}{${lcd}}`
            ]
        });
        
        steps.push({
            type: 'convert',
            newN1, newN2, lcd,
            tex: `\\frac{${newN1}}{${lcd}} ${op} \\frac{${newN2}}{${lcd}}`,
            expectedInput: `${newN1}/${lcd} ${op} ${newN2}/${lcd}`,
            animationFrames: [
                `\\htmlId{f1}{\\frac{${f1.n} \\times \\color{green}{${mult1}}}{${f1.d} \\times \\color{green}{${mult1}}}} ${op} \\htmlId{f2}{\\frac{${f2.n} \\times \\color{purple}{${mult2}}}{${f2.d} \\times \\color{purple}{${mult2}}}}`,
                `\\htmlId{f1}{\\frac{${newN1}}{${lcd}}} ${op} \\htmlId{f2}{\\frac{${newN2}}{${lcd}}}`
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
            `\\htmlId{f1}{\\frac{\\htmlId{n1}{${newN1}}}{${lcd}}} ${op} \\htmlId{f2}{\\frac{\\htmlId{n2}{${newN2}}}{${lcd}}}`,
            `\\frac{\\htmlId{n1}{${newN1}} ${op} \\htmlId{n2}{${newN2}}}{${lcd}}`,
            `\\frac{${finalN}}{${lcd}}`
        ]
    });
    
    // Step 4: Simplify
    const finalFraction = isSub ? new Fraction(finalN, lcd) : f1.add(f2);
    if (finalN !== finalFraction.n || lcd !== finalFraction.d) {
        steps.push({
            type: 'simplify',
            finalN: finalFraction.n, finalD: finalFraction.d,
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: finalFraction.d === 1 ? finalFraction.n.toString() : `${finalFraction.n}/${finalFraction.d}`,
            animationFrames: [
                `\\frac{${finalN}}{${lcd}}`,
                `\\frac{${finalN} \\div \\color{blue}{${finalN/finalFraction.n}}}{${lcd} \\div \\color{blue}{${lcd/finalFraction.d}}}`,
                `${finalFraction.toTeX(true)}`
            ]
        });
    } else if (finalFraction.n >= finalFraction.d && finalFraction.d !== 1 && fractionType !== 'proper') {
        // Can convert to mixed
        steps.push({
            type: 'simplify',
            finalN: finalFraction.n, finalD: finalFraction.d,
            tex: `${finalFraction.toTeX(true)}`,
            expectedInput: finalFraction.toTeX(true).replace(/\\frac{|}/g, '').replace(/ /g, ''), // very simplified validation
            // Actually let's just make them type "1 1/4"
            // Wait, standardizing inputs is tricky. 
            // Better to expect standard format:
            // "1 1/4"
        });
        const w = Math.floor(finalFraction.n / finalFraction.d);
        const r = finalFraction.n % finalFraction.d;
        steps[steps.length - 1].expectedInput = `${w} ${r}/${finalFraction.d}`;
        steps[steps.length - 1].animationFrames = [
            `\\frac{${finalFraction.n}}{${finalFraction.d}}`,
            `${w} \\frac{${r}}{${finalFraction.d}}`
        ];
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
