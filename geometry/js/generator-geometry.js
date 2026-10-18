// Generator for Geometry Problems

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateAreaPerimeterProblem(allowedShapes = ['rect', 'triangle', 'circle'], allowedCalcs = ['area', 'perimeter', 'diameter']) {
    if (allowedShapes.length === 0) allowedShapes = ['rect', 'triangle', 'circle'];
    if (allowedCalcs.length === 0) allowedCalcs = ['area', 'perimeter', 'diameter'];

    const type = allowedShapes[randInt(0, allowedShapes.length - 1)];

    let calcType = 'area';
    let possibleCalcs = [];
    if (type === 'rect') {
        possibleCalcs = allowedCalcs.filter(c => c === 'area' || c === 'perimeter');
    } else if (type === 'triangle') {
        possibleCalcs = allowedCalcs.filter(c => c === 'area');
    } else if (type === 'circle') {
        possibleCalcs = allowedCalcs.filter(c => c === 'area' || c === 'perimeter' || c === 'diameter');
    }

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
                {
                    tex: `\\htmlId{lhs}{P} = 2\\htmlId{t1}{w} + 2\\htmlId{t2}{h}`,
                    expectedInput: 'P = 2w + 2h',
                    altInput: '2w + 2h',
                    hint: 'The formula for the perimeter of a rectangle is two times the width plus two times the height.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{P} = \\text{?}` },
                        { math: `\\htmlId{lhs}{P} = \\textcolor{#4f46e5}{2\\htmlId{t1}{w}} + \\textcolor{#4f46e5}{2\\htmlId{t2}{h}}` },
                        { math: `\\htmlId{lhs}{P} = 2\\htmlId{t1}{w} + 2\\htmlId{t2}{h}` }
                    ],
                    frameCaptions: [
                        'Step 1: Recall the rectangle perimeter formula',
                        'Step 2: Sum twice the width and twice the height',
                        'Step 3: Write P = 2w + 2h'
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{P} = 2(\\htmlId{t1}{${w}}) + 2(\\htmlId{t2}{${h}})`,
                    expectedInput: `P = 2(${w}) + 2(${h})`,
                    altInput: `2(${w}) + 2(${h})`,
                    hint: 'Substitute the width and height into the formula.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{P} = 2\\htmlId{t1}{w} + 2\\htmlId{t2}{h}` },
                        { math: `\\htmlId{lhs}{P} = 2(\\textcolor{#4f46e5}{\\htmlId{t1}{${w}}}) + 2(\\textcolor{#4f46e5}{\\htmlId{t2}{${h}}})` },
                        { math: `\\htmlId{lhs}{P} = 2(\\htmlId{t1}{${w}}) + 2(\\htmlId{t2}{${h}})` }
                    ],
                    frameCaptions: [
                        'Step 1: Start with P = 2w + 2h',
                        `Step 2: Substitute w = ${w} and h = ${h}`,
                        `Step 3: Write P = 2(${w}) + 2(${h})`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{P} = \\htmlId{t1}{${2 * w}} + \\htmlId{t2}{${2 * h}}`,
                    expectedInput: `P = ${2 * w} + ${2 * h}`,
                    altInput: `${2 * w} + ${2 * h}`,
                    hint: 'Multiply each side pair.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{P} = 2(\\htmlId{t1}{${w}}) + 2(\\htmlId{t2}{${h}})` },
                        { math: `\\htmlId{lhs}{P} = \\textcolor{#4f46e5}{\\htmlId{t1}{${2 * w}}} + \\textcolor{#4f46e5}{\\htmlId{t2}{${2 * h}}}` },
                        { math: `\\htmlId{lhs}{P} = \\htmlId{t1}{${2 * w}} + \\htmlId{t2}{${2 * h}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Multiply 2(${w}) and 2(${h})`,
                        `Step 2: 2 × ${w} = ${2 * w} and 2 × ${h} = ${2 * h}`,
                        `Step 3: Write P = ${2 * w} + ${2 * h}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{P} = \\htmlId{ans}{${2 * w + 2 * h}}`,
                    expectedInput: `${2 * w + 2 * h}`,
                    altInput: `P = ${2 * w + 2 * h}`,
                    hint: 'Add them together to get the total perimeter.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{P} = \\htmlId{t1}{${2 * w}} + \\htmlId{t2}{${2 * h}}` },
                        { math: `\\htmlId{lhs}{P} = \\textcolor{#4f46e5}{\\htmlId{ans}{${2 * w + 2 * h}}}` },
                        { math: `\\htmlId{lhs}{P} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${2 * w + 2 * h}}}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Add ${2 * w} + ${2 * h}`,
                        `Step 2: Sum equals ${2 * w + 2 * h}`,
                        `Step 3: Final perimeter is ${2 * w + 2 * h}`
                    ]
                }
            ];
        } else {
            initialTex = `\\text{Find the Area: } A = ?`;
            steps = [
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{t1}{w} \\times \\htmlId{t2}{h}`,
                    expectedInput: 'A = w * h',
                    altInput: 'w * h',
                    hint: 'The formula for the area of a rectangle is width times height.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\text{?}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{t1}{w}} \\times \\textcolor{#4f46e5}{\\htmlId{t2}{h}}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{t1}{w} \\times \\htmlId{t2}{h}` }
                    ],
                    frameCaptions: [
                        'Step 1: Recall the rectangle area formula',
                        'Step 2: Multiply width (w) by height (h)',
                        'Step 3: Write A = w * h'
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{t1}{${w}} \\times \\htmlId{t2}{${h}}`,
                    expectedInput: `A = ${w} * ${h}`,
                    altInput: `${w} * ${h}`,
                    hint: 'Substitute the width and height into the formula.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\htmlId{t1}{w} \\times \\htmlId{t2}{h}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{t1}{${w}}} \\times \\textcolor{#4f46e5}{\\htmlId{t2}{${h}}}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{t1}{${w}} \\times \\htmlId{t2}{${h}}` }
                    ],
                    frameCaptions: [
                        'Step 1: Start with A = w × h',
                        `Step 2: Substitute w = ${w} and h = ${h}`,
                        `Step 3: Write A = ${w} * ${h}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{ans}{${w * h}}`,
                    expectedInput: `${w * h}`,
                    altInput: `A = ${w * h}`,
                    hint: 'Multiply them together to get the area.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\htmlId{t1}{${w}} \\times \\htmlId{t2}{${h}}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{ans}{${w * h}}}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${w * h}}}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Multiply ${w} × ${h}`,
                        `Step 2: Product equals ${w * h}`,
                        `Step 3: Final area is ${w * h}`
                    ]
                }
            ];
        }
    } else if (type === 'triangle') {
        shapeType = 'triangle';
        const b = randInt(4, 12);
        const h = randInt(3, 10);
        const isRight = Math.random() > 0.5;
        params = { b, h, labelB: b, labelH: h, isRight };

        initialTex = `\\text{Find the Area: } A = ?`;
        steps = [
            {
                tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} \\htmlId{t1}{b} \\htmlId{t2}{h}`,
                expectedInput: 'A = 0.5 * b * h',
                altInput: '1/2 * b * h',
                hint: 'The formula for the area of a triangle is half the base times the height.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{A} = \\text{?}` },
                    { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{f0}{\\frac{1}{2}}} \\htmlId{t1}{b} \\htmlId{t2}{h}` },
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} \\htmlId{t1}{b} \\htmlId{t2}{h}` }
                ],
                frameCaptions: [
                    'Step 1: Recall the triangle area formula',
                    'Step 2: Area is half of base times height',
                    'Step 3: Write A = 0.5 * b * h'
                ]
            },
            {
                tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t1}{${b}}) (\\htmlId{t2}{${h}})`,
                expectedInput: `A = 0.5 * ${b} * ${h}`,
                altInput: `0.5 * ${b} * ${h}`,
                hint: 'Substitute the base and height into the formula.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} \\htmlId{t1}{b} \\htmlId{t2}{h}` },
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\textcolor{#4f46e5}{\\htmlId{t1}{${b}}}) (\\textcolor{#4f46e5}{\\htmlId{t2}{${h}}})` },
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t1}{${b}}) (\\htmlId{t2}{${h}})` }
                ],
                frameCaptions: [
                    'Step 1: Start with the triangle area formula',
                    `Step 2: Substitute b = ${b} and h = ${h}`,
                    `Step 3: Write A = 0.5 * ${b} * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t3}{${b * h}})`,
                expectedInput: `A = 0.5 * ${b * h}`,
                altInput: `${b * h}`,
                hint: 'Multiply the base and height first.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t1}{${b}}) (\\htmlId{t2}{${h}})` },
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\textcolor{#4f46e5}{\\htmlId{t3}{${b * h}}})` },
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t3}{${b * h}})` }
                ],
                frameCaptions: [
                    `Step 1: Multiply base and height (${b} × ${h})`,
                    `Step 2: ${b} × ${h} = ${b * h}`,
                    `Step 3: Write A = 0.5 * ${b * h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{A} = \\htmlId{ans}{${0.5 * b * h}}`,
                expectedInput: `${0.5 * b * h}`,
                altInput: `A = ${0.5 * b * h}`,
                hint: 'Multiply by one-half (or divide by 2) to get the area.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\frac{1}{2}} (\\htmlId{t3}{${b * h}})` },
                    { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{ans}{${0.5 * b * h}}}` },
                    { math: `\\htmlId{lhs}{A} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${0.5 * b * h}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Divide ${b * h} by 2`,
                    `Step 2: ${b * h} ÷ 2 = ${0.5 * b * h}`,
                    `Step 3: Final area is ${0.5 * b * h}`
                ]
            }
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
                {
                    tex: `\\htmlId{lhs}{C} = 2\\htmlId{f0}{\\pi} \\htmlId{t1}{r}`,
                    expectedInput: 'C = 2 * pi * r',
                    altInput: '2 * pi * r',
                    hint: 'The formula for circumference is 2 times pi times the radius.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{C} = \\text{?}` },
                        { math: `\\htmlId{lhs}{C} = 2\\textcolor{#4f46e5}{\\htmlId{f0}{\\pi}} \\textcolor{#4f46e5}{\\htmlId{t1}{r}}` },
                        { math: `\\htmlId{lhs}{C} = 2\\htmlId{f0}{\\pi} \\htmlId{t1}{r}` }
                    ],
                    frameCaptions: [
                        'Step 1: Recall the circle circumference formula',
                        'Step 2: Circumference is 2 × π × r',
                        'Step 3: Write C = 2 * pi * r'
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{C} = 2 \\times \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}}`,
                    expectedInput: `C = 2 * 3.14 * ${r}`,
                    altInput: `2 * 3.14 * ${r}`,
                    hint: 'Substitute 3.14 for pi and the radius.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{C} = 2\\htmlId{f0}{\\pi} \\htmlId{t1}{r}` },
                        { math: `\\htmlId{lhs}{C} = 2 \\times \\textcolor{#4f46e5}{\\htmlId{f0}{3.14}} \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r}}}` },
                        { math: `\\htmlId{lhs}{C} = 2 \\times \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}}` }
                    ],
                    frameCaptions: [
                        'Step 1: Start with C = 2πr',
                        `Step 2: Substitute π ≈ 3.14 and r = ${r}`,
                        `Step 3: Write C = 2 * 3.14 * ${r}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{C} = \\htmlId{f0}{6.28} \\times \\htmlId{t1}{${r}}`,
                    expectedInput: `C = 6.28 * ${r}`,
                    altInput: `6.28 * ${r}`,
                    hint: 'Multiply 2 times 3.14 first.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{C} = 2 \\times \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}}` },
                        { math: `\\htmlId{lhs}{C} = \\textcolor{#4f46e5}{\\htmlId{f0}{6.28}} \\times \\htmlId{t1}{${r}}` },
                        { math: `\\htmlId{lhs}{C} = \\htmlId{f0}{6.28} \\times \\htmlId{t1}{${r}}` }
                    ],
                    frameCaptions: [
                        'Step 1: Multiply 2 × 3.14',
                        'Step 2: 2 × 3.14 = 6.28',
                        `Step 3: Write C = 6.28 * ${r}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{C} = \\htmlId{ans}{${ans}}`,
                    expectedInput: `${ans}`,
                    altInput: `C = ${ans}`,
                    hint: 'Multiply by the radius to get the final circumference.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{C} = \\htmlId{f0}{6.28} \\times \\htmlId{t1}{${r}}` },
                        { math: `\\htmlId{lhs}{C} = \\textcolor{#4f46e5}{\\htmlId{ans}{${ans}}}` },
                        { math: `\\htmlId{lhs}{C} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${ans}}}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Multiply 6.28 × ${r}`,
                        `Step 2: Product equals ${ans}`,
                        `Step 3: Final circumference is ${ans}`
                    ]
                }
            ];
        } else if (calcType === 'diameter') {
            initialTex = `\\text{Find the Diameter: } d = ?`;
            steps = [
                {
                    tex: `\\htmlId{lhs}{d} = 2\\htmlId{t1}{r}`,
                    expectedInput: 'd = 2r',
                    altInput: '2r',
                    hint: 'The diameter is simply two times the radius.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{d} = \\text{?}` },
                        { math: `\\htmlId{lhs}{d} = 2\\textcolor{#4f46e5}{\\htmlId{t1}{r}}` },
                        { math: `\\htmlId{lhs}{d} = 2\\htmlId{t1}{r}` }
                    ],
                    frameCaptions: [
                        'Step 1: Recall the circle diameter formula',
                        'Step 2: Diameter is twice the radius',
                        'Step 3: Write d = 2r'
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{d} = 2 \\times \\htmlId{t1}{${r}}`,
                    expectedInput: `d = 2 * ${r}`,
                    altInput: `2 * ${r}`,
                    hint: 'Substitute the radius into the formula.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{d} = 2\\htmlId{t1}{r}` },
                        { math: `\\htmlId{lhs}{d} = 2 \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r}}}` },
                        { math: `\\htmlId{lhs}{d} = 2 \\times \\htmlId{t1}{${r}}` }
                    ],
                    frameCaptions: [
                        'Step 1: Start with d = 2r',
                        `Step 2: Substitute r = ${r}`,
                        `Step 3: Write d = 2 * ${r}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{d} = \\htmlId{ans}{${2 * r}}`,
                    expectedInput: `${2 * r}`,
                    altInput: `d = ${2 * r}`,
                    hint: 'Multiply by 2 to get the diameter.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{d} = 2 \\times \\htmlId{t1}{${r}}` },
                        { math: `\\htmlId{lhs}{d} = \\textcolor{#4f46e5}{\\htmlId{ans}{${2 * r}}}` },
                        { math: `\\htmlId{lhs}{d} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${2 * r}}}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Multiply 2 × ${r}`,
                        `Step 2: Product equals ${2 * r}`,
                        `Step 3: Final diameter is ${2 * r}`
                    ]
                }
            ];
        } else {
            initialTex = `\\text{Find the Area: } A = ?`;
            const r2 = r * r;
            const ans = Math.round(pi * r2 * 100) / 100;
            steps = [
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2}`,
                    expectedInput: 'A = pi * r^2',
                    altInput: 'pi * r^2',
                    hint: 'The formula for the area of a circle is pi times the radius squared.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\text{?}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{f0}{\\pi}} \\textcolor{#4f46e5}{\\htmlId{t1}{r^2}}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2}` }
                    ],
                    frameCaptions: [
                        'Step 1: Recall the circle area formula',
                        'Step 2: Area is π times radius squared',
                        'Step 3: Write A = pi * r^2'
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2}`,
                    expectedInput: `A = 3.14 * ${r}^2`,
                    altInput: `3.14 * ${r}^2`,
                    hint: 'Substitute 3.14 for pi and the radius into the formula.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{f0}{3.14}} \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r}^2}}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2}` }
                    ],
                    frameCaptions: [
                        'Step 1: Start with A = πr²',
                        `Step 2: Substitute π ≈ 3.14 and r = ${r}`,
                        `Step 3: Write A = 3.14 * ${r}^2`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}}`,
                    expectedInput: `A = 3.14 * ${r2}`,
                    altInput: `3.14 * ${r2}`,
                    hint: 'Square the radius first.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r2}}}` },
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Evaluate the exponent ${r}²`,
                        `Step 2: ${r} × ${r} = ${r2}`,
                        `Step 3: Write A = 3.14 * ${r2}`
                    ]
                },
                {
                    tex: `\\htmlId{lhs}{A} = \\htmlId{ans}{${ans}}`,
                    expectedInput: `${ans}`,
                    altInput: `A = ${ans}`,
                    hint: 'Multiply by 3.14 to get the final area.',
                    animationFrames: [
                        { math: `\\htmlId{lhs}{A} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#4f46e5}{\\htmlId{ans}{${ans}}}` },
                        { math: `\\htmlId{lhs}{A} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${ans}}}}` }
                    ],
                    frameCaptions: [
                        `Step 1: Multiply 3.14 × ${r2}`,
                        `Step 2: Product equals ${ans}`,
                        `Step 3: Final area is ${ans}`
                    ]
                }
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
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{t1}{l} \\times \\htmlId{t2}{w} \\times \\htmlId{t3}{h}`,
                expectedInput: 'V = l * w * h',
                altInput: 'l * w * h',
                hint: 'The volume of a rectangular prism is length times width times height.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\text{?}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{t1}{l}} \\times \\textcolor{#4f46e5}{\\htmlId{t2}{w}} \\times \\textcolor{#4f46e5}{\\htmlId{t3}{h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{l} \\times \\htmlId{t2}{w} \\times \\htmlId{t3}{h}` }
                ],
                frameCaptions: [
                    'Step 1: Recall prism volume formula',
                    'Step 2: Multiply length × width × height',
                    'Step 3: Write V = l * w * h'
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l}} \\times \\htmlId{t2}{${w}} \\times \\htmlId{t3}{${h}}`,
                expectedInput: `V = ${l} * ${w} * ${h}`,
                altInput: `${l} * ${w} * ${h}`,
                hint: 'Substitute the length, width, and height.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{l} \\times \\htmlId{t2}{w} \\times \\htmlId{t3}{h}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{t1}{${l}}} \\times \\textcolor{#4f46e5}{\\htmlId{t2}{${w}}} \\times \\textcolor{#4f46e5}{\\htmlId{t3}{${h}}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l}} \\times \\htmlId{t2}{${w}} \\times \\htmlId{t3}{${h}}` }
                ],
                frameCaptions: [
                    'Step 1: Start with V = l × w × h',
                    `Step 2: Substitute l = ${l}, w = ${w}, h = ${h}`,
                    `Step 3: Write V = ${l} * ${w} * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l * w}} \\times \\htmlId{t3}{${h}}`,
                expectedInput: `V = ${l * w} * ${h}`,
                altInput: `${l * w} * ${h}`,
                hint: 'Multiply the first two numbers.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l}} \\times \\htmlId{t2}{${w}} \\times \\htmlId{t3}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{t1}{${l * w}}} \\times \\htmlId{t3}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l * w}} \\times \\htmlId{t3}{${h}}` }
                ],
                frameCaptions: [
                    `Step 1: Multiply base area ${l} × ${w}`,
                    `Step 2: ${l} × ${w} = ${l * w}`,
                    `Step 3: Write V = ${l * w} * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{ans}{${l * w * h}}`,
                expectedInput: `${l * w * h}`,
                altInput: `V = ${l * w * h}`,
                hint: 'Multiply by the height to get the total volume.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${l * w}} \\times \\htmlId{t3}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{ans}{${l * w * h}}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${l * w * h}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Multiply ${l * w} × ${h}`,
                    `Step 2: Product equals ${l * w * h}`,
                    `Step 3: Final volume is ${l * w * h}`
                ]
            }
        ];
    } else {
        shapeType = 'cylinder';
        const r = randInt(2, 5);
        const h = randInt(5, 12);
        params = { r, h, labelR: r, labelH: h };
        const pi = 3.14;
        const r2 = r * r;
        const baseArea = Math.round(pi * r2 * 100) / 100;
        const ans = Math.round(pi * r2 * h * 100) / 100;
        steps = [
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2} \\htmlId{t2}{h}`,
                expectedInput: 'V = pi * r^2 * h',
                altInput: 'pi * r^2 * h',
                hint: 'The volume of a cylinder is pi times the radius squared times the height.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\text{?}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{f0}{\\pi}} \\textcolor{#4f46e5}{\\htmlId{t1}{r^2}} \\textcolor{#4f46e5}{\\htmlId{t2}{h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2} \\htmlId{t2}{h}` }
                ],
                frameCaptions: [
                    'Step 1: Recall cylinder volume formula',
                    'Step 2: Base area (πr²) times height (h)',
                    'Step 3: Write V = pi * r^2 * h'
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2} \\times \\htmlId{t2}{${h}}`,
                expectedInput: `V = 3.14 * ${r}^2 * ${h}`,
                altInput: `3.14 * ${r}^2 * ${h}`,
                hint: 'Substitute 3.14 for pi, the radius, and the height.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{\\pi} \\htmlId{t1}{r^2} \\htmlId{t2}{h}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{f0}{3.14}} \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r}^2}} \\times \\textcolor{#4f46e5}{\\htmlId{t2}{${h}}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2} \\times \\htmlId{t2}{${h}}` }
                ],
                frameCaptions: [
                    'Step 1: Start with V = πr²h',
                    `Step 2: Substitute π ≈ 3.14, r = ${r}, h = ${h}`,
                    `Step 3: Write V = 3.14 * ${r}^2 * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}} \\times \\htmlId{t2}{${h}}`,
                expectedInput: `V = 3.14 * ${r2} * ${h}`,
                altInput: `3.14 * ${r2} * ${h}`,
                hint: 'Square the radius first.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r}^2} \\times \\htmlId{t2}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\textcolor{#4f46e5}{\\htmlId{t1}{${r2}}} \\times \\htmlId{t2}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}} \\times \\htmlId{t2}{${h}}` }
                ],
                frameCaptions: [
                    `Step 1: Square the radius ${r}²`,
                    `Step 2: ${r} × ${r} = ${r2}`,
                    `Step 3: Write V = 3.14 * ${r2} * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{t1}{${baseArea}} \\times \\htmlId{t2}{${h}}`,
                expectedInput: `V = ${baseArea} * ${h}`,
                altInput: `${baseArea} * ${h}`,
                hint: 'Multiply pi by the radius squared to find the area of the base.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{f0}{3.14} \\times \\htmlId{t1}{${r2}} \\times \\htmlId{t2}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{t1}{${baseArea}}} \\times \\htmlId{t2}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${baseArea}} \\times \\htmlId{t2}{${h}}` }
                ],
                frameCaptions: [
                    `Step 1: Multiply 3.14 × ${r2}`,
                    `Step 2: Circular base area is ${baseArea}`,
                    `Step 3: Write V = ${baseArea} * ${h}`
                ]
            },
            {
                tex: `\\htmlId{lhs}{V} = \\htmlId{ans}{${ans}}`,
                expectedInput: `${ans}`,
                altInput: `V = ${ans}`,
                hint: 'Multiply the base area by the height for the volume.',
                animationFrames: [
                    { math: `\\htmlId{lhs}{V} = \\htmlId{t1}{${baseArea}} \\times \\htmlId{t2}{${h}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#4f46e5}{\\htmlId{ans}{${ans}}}` },
                    { math: `\\htmlId{lhs}{V} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${ans}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Multiply ${baseArea} × ${h}`,
                    `Step 2: Product equals ${ans}`,
                    `Step 3: Final cylinder volume is ${ans}`
                ]
            }
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
            {
                tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{90}`,
                expectedInput: `x + ${a} = 90`,
                altInput: `90 - ${a}`,
                hint: 'Complementary angles add up to 90 degrees.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}^\\circ} = \\text{?}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\textcolor{#4f46e5}{\\htmlId{f3}{90}}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{90}` }
                ],
                frameCaptions: [
                    'Step 1: Identify complementary angle relationship',
                    'Step 2: Complementary angles sum to 90°',
                    `Step 3: Write x + ${a} = 90`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{f3}{90} - \\htmlId{f2}{${a}}`,
                expectedInput: `x = 90 - ${a}`,
                altInput: `90 - ${a}`,
                hint: 'Subtract the known angle from 90.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{90}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{90} \\textcolor{#4f46e5}{- \\htmlId{f2}{${a}}}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{90} - \\htmlId{f2}{${a}}` }
                ],
                frameCaptions: [
                    `Step 1: Isolate x by subtracting ${a}`,
                    `Step 2: Move ${a} to the right-hand side`,
                    `Step 3: Write x = 90 - ${a}`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${b}}`,
                expectedInput: `${b}`,
                altInput: `x = ${b}`,
                hint: 'Calculate the final angle.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{90} - \\htmlId{f2}{${a}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#4f46e5}{\\htmlId{ans}{${b}}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${b}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Compute 90 - ${a}`,
                    `Step 2: Difference equals ${b}`,
                    `Step 3: Final angle x = ${b}`
                ]
            }
        ];
    } else if (type === 'supplementary') {
        const a = randInt(30, 150);
        const b = 180 - a;
        params = { isSupplementary: true, label1: `${a}^\\circ`, label2: `x^\\circ` };
        steps = [
            {
                tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{180}`,
                expectedInput: `x + ${a} = 180`,
                altInput: `180 - ${a}`,
                hint: 'Supplementary angles on a straight line add up to 180 degrees.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}^\\circ} = \\text{?}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\textcolor{#4f46e5}{\\htmlId{f3}{180}}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{180}` }
                ],
                frameCaptions: [
                    'Step 1: Identify supplementary angle relationship',
                    'Step 2: Angles on a straight line sum to 180°',
                    `Step 3: Write x + ${a} = 180`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{f3}{180} - \\htmlId{f2}{${a}}`,
                expectedInput: `x = 180 - ${a}`,
                altInput: `180 - ${a}`,
                hint: 'Subtract the known angle from 180.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} = \\htmlId{f3}{180}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{180} \\textcolor{#4f46e5}{- \\htmlId{f2}{${a}}}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{180} - \\htmlId{f2}{${a}}` }
                ],
                frameCaptions: [
                    `Step 1: Isolate x by subtracting ${a}`,
                    `Step 2: Move ${a} to the right-hand side`,
                    `Step 3: Write x = 180 - ${a}`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${b}}`,
                expectedInput: `${b}`,
                altInput: `x = ${b}`,
                hint: 'Calculate the final angle.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} = \\htmlId{f3}{180} - \\htmlId{f2}{${a}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#4f46e5}{\\htmlId{ans}{${b}}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${b}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Compute 180 - ${a}`,
                    `Step 2: Difference equals ${b}`,
                    `Step 3: Final angle x = ${b}`
                ]
            }
        ];
    } else {
        const a = randInt(30, 90);
        const b = randInt(30, 90);
        const c = 180 - a - b;
        params = { label1: `${a}^\\circ`, label2: `${b}^\\circ`, label3: `x^\\circ` };
        steps = [
            {
                tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\htmlId{f4}{180}`,
                expectedInput: `x + ${a} + ${b} = 180`,
                altInput: `${a} + ${b}`,
                hint: 'The angles in a triangle always add up to 180 degrees.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\text{?}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\textcolor{#4f46e5}{\\htmlId{f4}{180}}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\htmlId{f4}{180}` }
                ],
                frameCaptions: [
                    'Step 1: Recall triangle angle sum theorem',
                    'Step 2: Interior angles of a triangle sum to 180°',
                    `Step 3: Write x + ${a} + ${b} = 180`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} + \\htmlId{f2}{${a + b}} = \\htmlId{f4}{180}`,
                expectedInput: `x + ${a + b} = 180`,
                altInput: `${a + b}`,
                hint: 'Add the two known angles together.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a}} + \\htmlId{f3}{${b}} = \\htmlId{f4}{180}` },
                    { math: `\\htmlId{f1}{x} + \\textcolor{#4f46e5}{\\htmlId{f2}{${a + b}}} = \\htmlId{f4}{180}` },
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a + b}} = \\htmlId{f4}{180}` }
                ],
                frameCaptions: [
                    `Step 1: Combine known angles ${a} + ${b}`,
                    `Step 2: ${a} + ${b} = ${a + b}`,
                    `Step 3: Write x + ${a + b} = 180`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{f4}{180} - \\htmlId{f2}{${a + b}}`,
                expectedInput: `x = 180 - ${a + b}`,
                altInput: `180 - ${a + b}`,
                hint: 'Subtract the sum from 180.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} + \\htmlId{f2}{${a + b}} = \\htmlId{f4}{180}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f4}{180} \\textcolor{#4f46e5}{- \\htmlId{f2}{${a + b}}}` },
                    { math: `\\htmlId{f1}{x} = \\htmlId{f4}{180} - \\htmlId{f2}{${a + b}}` }
                ],
                frameCaptions: [
                    `Step 1: Subtract ${a + b} from both sides`,
                    `Step 2: Move ${a + b} to the right side`,
                    `Step 3: Write x = 180 - ${a + b}`
                ]
            },
            {
                tex: `\\htmlId{f1}{x} = \\htmlId{ans}{${c}}`,
                expectedInput: `${c}`,
                altInput: `x = ${c}`,
                hint: 'Calculate the final missing angle.',
                animationFrames: [
                    { math: `\\htmlId{f1}{x} = \\htmlId{f4}{180} - \\htmlId{f2}{${a + b}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#4f46e5}{\\htmlId{ans}{${c}}}` },
                    { math: `\\htmlId{f1}{x} = \\textcolor{#16a34a}{\\htmlId{ans}{\\mathbf{${c}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Compute 180 - ${a + b}`,
                    `Step 2: Difference equals ${c}`,
                    `Step 3: Final angle x = ${c}`
                ]
            }
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
        const a2 = t[0] * t[0];
        const b2 = t[1] * t[1];
        const c2 = t[2] * t[2];
        steps = [
            {
                tex: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}`,
                expectedInput: 'a^2 + b^2 = c^2',
                altInput: `${t[0]}^2 + ${t[1]}^2 = c^2`,
                hint: 'The Pythagorean Theorem relates the legs (a, b) to the hypotenuse (c).',
                animationFrames: [
                    { math: `\\text{Right Triangle Legs } a, b \\text{ and Hypotenuse } c` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{a^2}} + \\textcolor{#4f46e5}{\\htmlId{f2}{b^2}} = \\textcolor{#4f46e5}{\\htmlId{f3}{c^2}}` },
                    { math: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}` }
                ],
                frameCaptions: [
                    'Step 1: Recall the Pythagorean Theorem',
                    'Step 2: Sum of leg squares equals hypotenuse squared',
                    'Step 3: Write a^2 + b^2 = c^2'
                ]
            },
            {
                tex: `\\htmlId{f1}{${t[0]}^2} + \\htmlId{f2}{${t[1]}^2} = \\htmlId{f3}{c^2}`,
                expectedInput: `${t[0]}^2 + ${t[1]}^2 = c^2`,
                altInput: `${a2} + ${b2} = c^2`,
                hint: 'Substitute the known legs into the formula.',
                animationFrames: [
                    { math: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{${t[0]}^2}} + \\textcolor{#4f46e5}{\\htmlId{f2}{${t[1]}^2}} = \\htmlId{f3}{c^2}` },
                    { math: `\\htmlId{f1}{${t[0]}^2} + \\htmlId{f2}{${t[1]}^2} = \\htmlId{f3}{c^2}` }
                ],
                frameCaptions: [
                    'Step 1: Start with a² + b² = c²',
                    `Step 2: Substitute a = ${t[0]} and b = ${t[1]}`,
                    `Step 3: Write ${t[0]}^2 + ${t[1]}^2 = c^2`
                ]
            },
            {
                tex: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{${b2}} = \\htmlId{f3}{c^2}`,
                expectedInput: `${a2} + ${b2} = c^2`,
                altInput: `${a2} + ${b2}`,
                hint: 'Square both of the numbers.',
                animationFrames: [
                    { math: `\\htmlId{f1}{${t[0]}^2} + \\htmlId{f2}{${t[1]}^2} = \\htmlId{f3}{c^2}` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{${a2}}} + \\textcolor{#4f46e5}{\\htmlId{f2}{${b2}}} = \\htmlId{f3}{c^2}` },
                    { math: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{${b2}} = \\htmlId{f3}{c^2}` }
                ],
                frameCaptions: [
                    `Step 1: Evaluate ${t[0]}² and ${t[1]}²`,
                    `Step 2: ${t[0]}² = ${a2} and ${t[1]}² = ${b2}`,
                    `Step 3: Write ${a2} + ${b2} = c^2`
                ]
            },
            {
                tex: `\\htmlId{f1}{${c2}} = \\htmlId{f3}{c^2}`,
                expectedInput: `${c2} = c^2`,
                altInput: `${c2}`,
                hint: 'Add them together.',
                animationFrames: [
                    { math: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{${b2}} = \\htmlId{f3}{c^2}` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{${c2}}} = \\htmlId{f3}{c^2}` },
                    { math: `\\htmlId{f1}{${c2}} = \\htmlId{f3}{c^2}` }
                ],
                frameCaptions: [
                    `Step 1: Add ${a2} + ${b2}`,
                    `Step 2: Sum equals ${c2}`,
                    `Step 3: Write ${c2} = c^2`
                ]
            },
            {
                tex: `\\htmlId{ans}{c} = \\htmlId{f1}{${t[2]}}`,
                expectedInput: `${t[2]}`,
                altInput: `c = ${t[2]}`,
                hint: 'Take the square root of both sides to find c.',
                animationFrames: [
                    { math: `\\htmlId{f3}{c^2} = \\htmlId{f1}{${c2}}` },
                    { math: `\\htmlId{ans}{c} = \\textcolor{#4f46e5}{\\sqrt{\\htmlId{f1}{${c2}}}}` },
                    { math: `\\htmlId{ans}{c} = \\textcolor{#16a34a}{\\htmlId{f1}{\\mathbf{${t[2]}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Take the square root of ${c2}`,
                    `Step 2: √${c2} = ${t[2]}`,
                    `Step 3: Final hypotenuse c = ${t[2]}`
                ]
            }
        ];
    } else {
        const aVal = t[0];
        const bVal = t[1];
        const cVal = t[2];
        const a2 = aVal * aVal;
        const b2 = bVal * bVal;
        const c2 = cVal * cVal;
        params = { b: aVal, h: bVal, labelB: 'b', labelH: aVal, labelC: cVal, isRight: true };
        steps = [
            {
                tex: `\\htmlId{f1}{${aVal}^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${cVal}^2}`,
                expectedInput: `${aVal}^2 + b^2 = ${cVal}^2`,
                altInput: `${a2} + b^2 = ${c2}`,
                hint: 'Substitute the known leg and the hypotenuse into a² + b² = c².',
                animationFrames: [
                    { math: `\\htmlId{f1}{a^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{c^2}` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{${aVal}^2}} + \\htmlId{f2}{b^2} = \\textcolor{#4f46e5}{\\htmlId{f3}{${cVal}^2}}` },
                    { math: `\\htmlId{f1}{${aVal}^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${cVal}^2}` }
                ],
                frameCaptions: [
                    'Step 1: Start with a² + b² = c²',
                    `Step 2: Substitute a = ${aVal} and c = ${cVal}`,
                    `Step 3: Write ${aVal}^2 + b^2 = ${cVal}^2`
                ]
            },
            {
                tex: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}}`,
                expectedInput: `${a2} + b^2 = ${c2}`,
                altInput: `${c2} - ${a2}`,
                hint: 'Square both of the known numbers.',
                animationFrames: [
                    { math: `\\htmlId{f1}{${aVal}^2} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${cVal}^2}` },
                    { math: `\\textcolor{#4f46e5}{\\htmlId{f1}{${a2}}} + \\htmlId{f2}{b^2} = \\textcolor{#4f46e5}{\\htmlId{f3}{${c2}}}` },
                    { math: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}}` }
                ],
                frameCaptions: [
                    `Step 1: Square ${aVal}² and ${cVal}²`,
                    `Step 2: ${aVal}² = ${a2} and ${cVal}² = ${c2}`,
                    `Step 3: Write ${a2} + b^2 = ${c2}`
                ]
            },
            {
                tex: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}} - \\htmlId{f1}{${a2}}`,
                expectedInput: `b^2 = ${c2} - ${a2}`,
                altInput: `${b2}`,
                hint: 'Subtract the known square from the hypotenuse squared.',
                animationFrames: [
                    { math: `\\htmlId{f1}{${a2}} + \\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}}` },
                    { math: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}} \\textcolor{#4f46e5}{- \\htmlId{f1}{${a2}}}` },
                    { math: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}} - \\htmlId{f1}{${a2}}` }
                ],
                frameCaptions: [
                    `Step 1: Subtract ${a2} from both sides`,
                    `Step 2: Isolate b² on the left`,
                    `Step 3: Write b^2 = ${c2} - ${a2}`
                ]
            },
            {
                tex: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${b2}}`,
                expectedInput: `b^2 = ${b2}`,
                altInput: `${b2}`,
                hint: 'Calculate the difference.',
                animationFrames: [
                    { math: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${c2}} - \\htmlId{f1}{${a2}}` },
                    { math: `\\htmlId{f2}{b^2} = \\textcolor{#4f46e5}{\\htmlId{f3}{${b2}}}` },
                    { math: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${b2}}` }
                ],
                frameCaptions: [
                    `Step 1: Compute ${c2} - ${a2}`,
                    `Step 2: Difference equals ${b2}`,
                    `Step 3: Write b^2 = ${b2}`
                ]
            },
            {
                tex: `\\htmlId{ans}{b} = \\htmlId{f3}{${bVal}}`,
                expectedInput: `${bVal}`,
                altInput: `b = ${bVal}`,
                hint: 'Take the square root of both sides to find the missing leg.',
                animationFrames: [
                    { math: `\\htmlId{f2}{b^2} = \\htmlId{f3}{${b2}}` },
                    { math: `\\htmlId{ans}{b} = \\textcolor{#4f46e5}{\\sqrt{\\htmlId{f3}{${b2}}}}` },
                    { math: `\\htmlId{ans}{b} = \\textcolor{#16a34a}{\\htmlId{f3}{\\mathbf{${bVal}}}}` }
                ],
                frameCaptions: [
                    `Step 1: Take the square root of ${b2}`,
                    `Step 2: √${b2} = ${bVal}`,
                    `Step 3: Final leg b = ${bVal}`
                ]
            }
        ];
    }

    return {
        topic: 'Pythagorean Theorem',
        shapeType,
        params,
        initialTex: `a^2 + b^2 = c^2`,
        steps
    };
}
