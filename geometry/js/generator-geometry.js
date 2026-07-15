// Generator for Geometry Problems

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateAreaPerimeterProblem(allowedShapes = ['rect', 'triangle', 'circle'], allowedCalcs = ['area', 'perimeter', 'diameter']) {
    // If empty array passed by accident, default to all
    if (allowedShapes.length === 0) allowedShapes = ['rect', 'triangle', 'circle'];
    if (allowedCalcs.length === 0) allowedCalcs = ['area', 'perimeter', 'diameter'];

    const type = allowedShapes[randInt(0, allowedShapes.length - 1)];
    
    // Choose a calculation type from allowed that applies to the shape
    let calcType = 'area';
    let possibleCalcs = [];
    if (type === 'rect') {
        possibleCalcs = allowedCalcs.filter(c => c === 'area' || c === 'perimeter');
    } else if (type === 'triangle') {
        // We only support Area for triangles right now to keep it simple
        possibleCalcs = allowedCalcs.filter(c => c === 'area');
    } else if (type === 'circle') {
        possibleCalcs = allowedCalcs.filter(c => c === 'area' || c === 'perimeter' || c === 'diameter');
    }
    
    // Fallback if none of the allowed calcs apply to this shape (e.g. user chose Triangle but only Perimeter)
    if (possibleCalcs.length === 0) {
        if (type === 'triangle') calcType = 'area';
        else if (type === 'rect') calcType = 'perimeter';
        else if (type === 'circle') calcType = 'perimeter';
    } else {
        calcType = possibleCalcs[randInt(0, possibleCalcs.length - 1)];
    }
    
    let shapeType = '';
    let params = {};
    let steps = [];
    let initialTex = '';
    
    if (type === 'rect') {
        shapeType = 'rect';
        const w = randInt(3, 12);
        const h = randInt(2, 10);
        params = { w, h, labelW: w, labelH: h };
        
        if (calcType === 'perimeter') {
            initialTex = `\\text{Find the Perimeter: } P = ?`;
            steps = [
                { tex: `P = 2\\htmlId{f1}{w} + 2\\htmlId{f2}{h}`, hint: "The formula for the perimeter of a rectangle is two times the width plus two times the height." },
                { tex: `P = 2(\\htmlId{v1}{${w}}) + 2(\\htmlId{v2}{${h}})`, hint: "Substitute the width and height into the formula." },
                { tex: `P = \\htmlId{v3}{${2*w}} + \\htmlId{v4}{${2*h}}`, hint: "Multiply." },
                { tex: `P = \\htmlId{ans}{${2*w + 2*h}}`, hint: "Add them together to get the total perimeter." }
            ];
        } else {
            initialTex = `\\text{Find the Area: } A = ?`;
            steps = [
                { tex: `A = \\htmlId{f1}{w} \\times \\htmlId{f2}{h}`, hint: "The formula for the area of a rectangle is width times height." },
                { tex: `A = \\htmlId{v1}{${w}} \\times \\htmlId{v2}{${h}}`, hint: "Substitute the width and height into the formula." },
                { tex: `A = \\htmlId{ans}{${w * h}}`, hint: "Multiply them together to get the area." }
            ];
        }
    } else if (type === 'triangle') {
        shapeType = 'triangle';
        const b = randInt(4, 12);
        const h = randInt(3, 10);
        // For simplicity with triangle perimeter, we would need 3 sides. We only have base and height (and hypotenuse if right).
        // Let's just always do Area for triangles to keep it clean.
        const isRight = Math.random() > 0.5;
        params = { b, h, labelB: b, labelH: h, isRight };
        
        initialTex = `\\text{Find the Area: } A = ?`;
        steps = [
            { tex: `A = \\htmlId{f0}{\\frac{1}{2}} \\htmlId{f1}{b} \\htmlId{f2}{h}`, hint: "The formula for the area of a triangle is half the base times the height." },
            { tex: `A = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{v1}{${b}}) (\\htmlId{v2}{${h}})`, hint: "Substitute the base and height into the formula." },
            { tex: `A = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{v3}{${b * h}})`, hint: "Multiply the base and height first." },
            { tex: `A = \\htmlId{ans}{${0.5 * b * h}}`, hint: "Multiply by one-half (or divide by 2) to get the area." }
        ];
    } else {
        shapeType = 'circle';
        const r = randInt(2, 9);
        params = { r, labelR: r };
        const pi = 3.14;
        
        if (calcType === 'perimeter') {
            initialTex = `\\text{Find the Circumference: } C = ?`;
            const ans = Math.round(2 * pi * r * 100) / 100;
            steps = [
                { tex: `C = 2\\htmlId{f0}{\\pi} \\htmlId{f1}{r}`, hint: "The formula for circumference is 2 times pi times the radius." },
                { tex: `C = 2 \\times \\htmlId{v0}{3.14} \\times \\htmlId{v1}{${r}}`, hint: "Substitute 3.14 for pi and the radius." },
                { tex: `C = \\htmlId{v2}{6.28} \\times \\htmlId{v1}{${r}}`, hint: "Multiply 2 times 3.14 first." },
                { tex: `C = \\htmlId{ans}{${ans}}`, hint: "Multiply by the radius to get the final circumference." }
            ];
        } else if (calcType === 'diameter') {
            initialTex = `\\text{Find the Diameter: } d = ?`;
            steps = [
                { tex: `d = 2\\htmlId{f1}{r}`, hint: "The diameter is simply two times the radius." },
                { tex: `d = 2 \\times \\htmlId{v1}{${r}}`, hint: "Substitute the radius into the formula." },
                { tex: `d = \\htmlId{ans}{${2*r}}`, hint: "Multiply by 2 to get the diameter." }
            ];
        } else {
            initialTex = `\\text{Find the Area: } A = ?`;
            const r2 = r * r;
            const ans = Math.round(pi * r2 * 100) / 100;
            steps = [
                { tex: `A = \\htmlId{f0}{\\pi} \\htmlId{f1}{r^2}`, hint: "The formula for the area of a circle is pi times the radius squared." },
                { tex: `A = \\htmlId{v0}{3.14} \\times \\htmlId{v1}{${r}^2}`, hint: "Substitute 3.14 for pi and the radius into the formula." },
                { tex: `A = \\htmlId{v0}{3.14} \\times \\htmlId{v2}{${r2}}`, hint: "Square the radius first." },
                { tex: `A = \\htmlId{ans}{${ans}}`, hint: "Multiply by 3.14 to get the final area." }
            ];
        }
    }
    
    return {
        topic: 'Area',
        shapeType,
        params,
        initialTex,
        steps
    };
}

export function generateVolumeProblem() {
    const types = ['prism', 'cylinder'];
    const type = types[randInt(0, 1)];
    
    let shapeType = '';
    let params = {};
    let steps = [];
    
    if (type === 'prism') {
        shapeType = 'prism';
        const l = randInt(3, 8);
        const w = randInt(2, 6);
        const h = randInt(4, 10);
        params = { l, w, h, labelL: l, labelW: w, labelH: h };
        steps = [
            { tex: `V = \\htmlId{f1}{l} \\times \\htmlId{f2}{w} \\times \\htmlId{f3}{h}`, hint: "The volume of a rectangular prism is length times width times height." },
            { tex: `V = \\htmlId{v1}{${l}} \\times \\htmlId{v2}{${w}} \\times \\htmlId{v3}{${h}}`, hint: "Substitute the length, width, and height." },
            { tex: `V = \\htmlId{v4}{${l * w}} \\times \\htmlId{v3}{${h}}`, hint: "Multiply the first two numbers." },
            { tex: `V = \\htmlId{ans}{${l * w * h}}`, hint: "Multiply by the height to get the total volume." }
        ];
    } else {
        shapeType = 'cylinder';
        const r = randInt(2, 5);
        const h = randInt(5, 12);
        params = { r, h, labelR: r, labelH: h };
        const pi = 3.14;
        const r2 = r * r;
        const ans = Math.round(pi * r2 * h * 100) / 100;
        steps = [
            { tex: `V = \\htmlId{f0}{\\pi} \\htmlId{f1}{r^2} \\htmlId{f2}{h}`, hint: "The volume of a cylinder is pi times the radius squared times the height." },
            { tex: `V = \\htmlId{v0}{3.14} \\times \\htmlId{v1}{${r}^2} \\times \\htmlId{v2}{${h}}`, hint: "Substitute 3.14 for pi, the radius, and the height." },
            { tex: `V = \\htmlId{v0}{3.14} \\times \\htmlId{v3}{${r2}} \\times \\htmlId{v2}{${h}}`, hint: "Square the radius first." },
            { tex: `V = \\htmlId{v4}{${Math.round(pi*r2*100)/100}} \\times \\htmlId{v2}{${h}}`, hint: "Multiply pi by the radius squared to find the area of the base." },
            { tex: `V = \\htmlId{ans}{${ans}}`, hint: "Multiply the base area by the height for the volume." }
        ];
    }
    
    return {
        topic: 'Volume',
        shapeType,
        params,
        initialTex: `\\text{Find the Volume: } V = ?`,
        steps
    };
}

export function generateAnglesProblem() {
    const types = ['complementary', 'supplementary', 'triangle'];
    const type = types[randInt(0, 2)];
    
    let shapeType = 'angle';
    let params = {};
    let steps = [];
    
    if (type === 'complementary') {
        const a = randInt(15, 75);
        const b = 90 - a;
        params = { isComplementary: true, label1: `${a}^\\circ`, label2: `x^\\circ` };
        steps = [
            { tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{90}`, hint: "Complementary angles add up to 90 degrees." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{f3}{90} - \\htmlId{f2}{${a}}`, hint: "Subtract the known angle from 90." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${b}}`, hint: "Calculate the final angle." }
        ];
    } else if (type === 'supplementary') {
        const a = randInt(30, 150);
        const b = 180 - a;
        params = { isSupplementary: true, label1: `${a}^\\circ`, label2: `x^\\circ` };
        steps = [
            { tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{180}`, hint: "Supplementary angles on a straight line add up to 180 degrees." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{f3}{180} - \\htmlId{f2}{${a}}`, hint: "Subtract the known angle from 180." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${b}}`, hint: "Calculate the final angle." }
        ];
    } else {
        const a = randInt(30, 90);
        const b = randInt(30, 90);
        const c = 180 - a - b;
        params = { label1: `${a}^\\circ`, label2: `${b}^\\circ`, label3: `x^\\circ` };
        steps = [
            { tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\htmlId{f4}{180}`, hint: "The angles in a triangle always add up to 180 degrees." },
            { tex: `\\htmlId{f1}{x} + \\htmlId{f5}{${a + b}} = \\htmlId{f4}{180}`, hint: "Add the two known angles together." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{f4}{180} - \\htmlId{f5}{${a + b}}`, hint: "Subtract the sum from 180." },
            { tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${c}}`, hint: "Calculate the final missing angle." }
        ];
    }
    
    return {
        topic: 'Missing Angles',
        shapeType,
        params,
        initialTex: `\\text{Find } x:`,
        steps
    };
}

export function generatePythagoreanProblem() {
    // We will use Pythagorean triples to keep answers clean
    const triples = [
        [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
        [6, 8, 10], [9, 12, 15], [10, 24, 26]
    ];
    const t = triples[randInt(0, triples.length - 1)];
    
    const solveForHypotenuse = Math.random() > 0.5;
    
    let shapeType = 'triangle';
    let params = {};
    let steps = [];
    
    if (solveForHypotenuse) {
        params = { b: t[0], h: t[1], labelB: t[0], labelH: t[1], labelC: 'c', isRight: true };
        steps = [
            { tex: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}`, hint: "The Pythagorean Theorem relates the legs (a, b) to the hypotenuse (c)." },
            { tex: `\\htmlId{v1}{${t[0]}^2} + \\htmlId{v2}{${t[1]}^2} = \\htmlId{f3}{c^2}`, hint: "Substitute the known legs into the formula." },
            { tex: `\\htmlId{v3}{${t[0]*t[0]}} + \\htmlId{v4}{${t[1]*t[1]}} = \\htmlId{f3}{c^2}`, hint: "Square both of the numbers." },
            { tex: `\\htmlId{v5}{${t[0]*t[0] + t[1]*t[1]}} = \\htmlId{f3}{c^2}`, hint: "Add them together." },
            { tex: `\\htmlId{v6}{\\sqrt{${t[2]*t[2]}}} = \\htmlId{ans}{c}`, hint: "Take the square root of both sides to find c." },
            { tex: `\\htmlId{v7}{${t[2]}} = \\htmlId{ans}{c}`, hint: "The hypotenuse is the final answer." }
        ];
    } else {
        const isB = Math.random() > 0.5;
        if (isB) {
            params = { b: t[0], h: t[1], labelB: 'b', labelH: t[0], labelC: t[2], isRight: true };
            steps = [
                { tex: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}`, hint: "The Pythagorean Theorem relates the legs (a, b) to the hypotenuse (c)." },
                { tex: `\\htmlId{v1}{${t[0]}^2} + \\htmlId{f2}{b^2} = \\htmlId{v3}{${t[2]}^2}`, hint: "Substitute the known leg and the hypotenuse into the formula." },
                { tex: `\\htmlId{v4}{${t[0]*t[0]}} + \\htmlId{f2}{b^2} = \\htmlId{v5}{${t[2]*t[2]}}`, hint: "Square both of the numbers." },
                { tex: `\\htmlId{f2}{b^2} = \\htmlId{v5}{${t[2]*t[2]}} - \\htmlId{v4}{${t[0]*t[0]}}`, hint: "Subtract the known square from the hypotenuse squared." },
                { tex: `\\htmlId{f2}{b^2} = \\htmlId{v6}{${t[1]*t[1]}}`, hint: "Calculate the difference." },
                { tex: `\\htmlId{ans}{b} = \\htmlId{v7}{\\sqrt{${t[1]*t[1]}}}`, hint: "Take the square root of both sides to find the missing leg." },
                { tex: `\\htmlId{ans}{b} = \\htmlId{v8}{${t[1]}}`, hint: "The leg is the final answer." }
            ];
        } else {
            params = { b: t[0], h: t[1], labelB: t[1], labelH: 'a', labelC: t[2], isRight: true };
            steps = [
                { tex: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}`, hint: "The Pythagorean Theorem relates the legs (a, b) to the hypotenuse (c)." },
                { tex: `\\htmlId{f1}{a^2} + \\htmlId{v2}{${t[1]}^2} = \\htmlId{v3}{${t[2]}^2}`, hint: "Substitute the known leg and the hypotenuse into the formula." },
                { tex: `\\htmlId{f1}{a^2} + \\htmlId{v4}{${t[1]*t[1]}} = \\htmlId{v5}{${t[2]*t[2]}}`, hint: "Square both of the numbers." },
                { tex: `\\htmlId{f1}{a^2} = \\htmlId{v5}{${t[2]*t[2]}} - \\htmlId{v4}{${t[1]*t[1]}}`, hint: "Subtract the known square from the hypotenuse squared." },
                { tex: `\\htmlId{f1}{a^2} = \\htmlId{v6}{${t[0]*t[0]}}`, hint: "Calculate the difference." },
                { tex: `\\htmlId{ans}{a} = \\htmlId{v7}{\\sqrt{${t[0]*t[0]}}}`, hint: "Take the square root of both sides to find the missing leg." },
                { tex: `\\htmlId{ans}{a} = \\htmlId{v8}{${t[0]}}`, hint: "The leg is the final answer." }
            ];
        }
    }
    
    return {
        topic: 'Pythagorean Theorem',
        shapeType,
        params,
        initialTex: `a^2 + b^2 = c^2`,
        steps
    };
}
