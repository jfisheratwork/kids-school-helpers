import { Fraction } from './fraction.js';

export function generateConceptsProblem() {
    // Randomly choose between fraction categorization, LCM, GCD, and Simplify
    const rand = Math.random();

    if (rand < 0.25) {
        // Generate two numbers for LCM between 2 and 12
        let num1 = Math.floor(Math.random() * 8) + 2;
        let num2 = Math.floor(Math.random() * 8) + 2;
        while (num1 === num2) {
            num2 = Math.floor(Math.random() * 8) + 2;
        }

        const lcm = Fraction.lcm(num1, num2);
        
        const steps = [];
        steps.push({
            type: 'find_lcm',
            lcd: lcm,
            tex: `\\text{LCM of } ${num1} \\text{ and } ${num2} \\text{ is } ${lcm}`,
            expectedInput: lcm.toString(),
            animationFrames: [
                `\\text{LCM}(${num1}, ${num2})`,
                `\\text{LCM}(\\color{red}{${num1}}, \\color{blue}{${num2}}) \\rightarrow ${lcm}`
            ]
        });

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Find LCM of } ${num1} \\text{ and } ${num2}`
        };
    } else if (rand < 0.50) {
        // Generate two numbers for GCD
        const factor = Math.floor(Math.random() * 5) + 2; // 2 to 6
        let n1 = Math.floor(Math.random() * 5) + 1;
        let n2 = Math.floor(Math.random() * 5) + 1;
        while (n1 === n2 || Fraction.gcd(n1, n2) > 1) { // Ensure no other common factors
            n2 = Math.floor(Math.random() * 5) + 1;
        }
        
        let num1 = n1 * factor;
        let num2 = n2 * factor;

        const gcd = Fraction.gcd(num1, num2);
        
        const steps = [];
        steps.push({
            type: 'find_gcd',
            gcd: gcd,
            tex: `\\text{GCF of } ${num1} \\text{ and } ${num2} \\text{ is } ${gcd}`,
            expectedInput: gcd.toString(),
            animationFrames: [
                `\\text{GCF}(${num1}, ${num2})`,
                `\\text{GCF}(\\color{red}{${num1}}, \\color{blue}{${num2}}) \\rightarrow ${gcd}`
            ]
        });

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Find GCF of } ${num1} \\text{ and } ${num2}`
        };
    } else if (rand < 0.75) {
        // Simplify fraction
        let den = Math.floor(Math.random() * 8) + 4; // 4 to 11
        let num = Math.floor(Math.random() * (den - 2)) + 2; // 2 to den-1
        
        // Ensure they have a common factor by multiplying both by a random factor
        const factor = Math.floor(Math.random() * 3) + 2; // 2 to 4
        num *= factor;
        den *= factor;

        const f1 = new Fraction(num, den); // This simplifies it internally
        
        const steps = [];
        steps.push({
            type: 'simplify_concept',
            tex: `${f1.toTeX()}`,
            expectedInput: f1.d === 1 ? f1.n.toString() : `${f1.n}/${f1.d}`,
            animationFrames: [
                `\\frac{${num}}{${den}}`,
                `\\frac{${num} \\div \\color{blue}{${factor}}}{${den} \\div \\color{blue}{${factor}}}`,
                `${f1.toTeX()}`
            ]
        });

        return {
            topic: 'concepts',
            steps,
            texInitial: `\\text{Simplify } \\frac{${num}}{${den}}`
        };
    }

    // Original fraction categorization logic
    const isProper = Math.random() < 0.5;
    let f1;
    
    if (isProper) {
        f1 = new Fraction(Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 5) + 3);
        if (f1.n >= f1.d) f1.n = f1.d - 1;
    } else {
        f1 = new Fraction(Math.floor(Math.random() * 10) + 5, Math.floor(Math.random() * 4) + 2);
        if (f1.n < f1.d) f1.n += f1.d; // Ensure improper
    }
    
    // Ensure it's fully simplified for the prompt
    f1.simplify();
    
    const steps = [];
    
    // Step 1: Categorize
    steps.push({
        type: 'categorize',
        tex: `\\text{This is an } \\textbf{${isProper ? 'proper' : 'improper'}} \\text{ fraction.}`,
        expectedInput: isProper ? 'proper' : 'improper',
        animationFrames: [
            // Frame 1: show the fraction
            `\\htmlId{frac}{\\frac{${f1.n}}{${f1.d}}}`,
            // Frame 2: highlight numerator
            `\\htmlId{frac}{\\frac{\\htmlId{num}{\\color{red}{${f1.n}}}}{${f1.d}}}`,
            // Frame 3: highlight denominator
            `\\htmlId{frac}{\\frac{${f1.n}}{\\htmlId{den}{\\color{blue}{${f1.d}}}}}`
        ]
    });
    
    if (!isProper) {
        // Step 2: Convert to mixed
        const w = Math.floor(f1.n / f1.d);
        const rem = f1.n % f1.d;
        
        let finalInput = w.toString();
        if (rem !== 0) finalInput += ` ${rem}/${f1.d}`;
        
        steps.push({
            type: 'convert_mixed',
            tex: f1.toTeX(true),
            expectedInput: finalInput, // e.g. "2 1/4"
            animationFrames: [
                `\\htmlId{frac}{\\frac{${f1.n}}{${f1.d}}}`,
                `\\htmlId{w}{${w}} \\htmlId{frac}{\\frac{${rem}}{${f1.d}}}`
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
