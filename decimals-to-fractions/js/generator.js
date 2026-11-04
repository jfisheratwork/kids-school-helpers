import { Fraction } from '../../shared/js/fraction.js';

const DECIMAL_POOLS = {
    basic: [
        '0.1',
        '0.2',
        '0.3',
        '0.4',
        '0.5',
        '0.6',
        '0.7',
        '0.8',
        '0.9',
        '0.25',
        '0.50',
        '0.75',
        '0.20',
        '0.40',
        '0.60',
        '0.80'
    ],
    medium: [
        '0.04',
        '0.05',
        '0.08',
        '0.12',
        '0.15',
        '0.16',
        '0.18',
        '0.22',
        '0.24',
        '0.28',
        '0.32',
        '0.35',
        '0.36',
        '0.42',
        '0.44',
        '0.45',
        '0.48',
        '0.55',
        '0.56',
        '0.64',
        '0.65',
        '0.68',
        '0.72',
        '0.76',
        '0.84',
        '0.85',
        '0.88',
        '0.92',
        '0.95',
        '0.96'
    ],
    challenging: [
        '0.125',
        '0.375',
        '0.625',
        '0.875',
        '0.025',
        '0.075',
        '0.175',
        '0.225',
        '0.275',
        '0.325',
        '0.425',
        '0.008',
        '0.016',
        '0.040',
        '1.25',
        '1.5',
        '1.75',
        '2.4',
        '2.35',
        '2.75',
        '3.2',
        '3.6',
        '3.75',
        '5.75',
        '1.125',
        '1.375',
        '2.625'
    ]
};

export function generateDecimalToFractionProblem(complexity = 'basic', options = {}) {
    const pool = DECIMAL_POOLS[complexity] || DECIMAL_POOLS.basic;
    const baseStr = pool[Math.floor(Math.random() * pool.length)];
    const signedStr = options.allowNegatives ? `-${baseStr}` : baseStr;
    return buildDecimalToFractionProblem(signedStr, complexity);
}

export function parseCustomDecimalToFractionProblem(rawStr) {
    const cleaned = (rawStr || '').trim().replace(/\u2212/g, '-');
    const match = cleaned.match(/^([+-])?(\d*)\.(\d{1,3})$/);
    if (!match) return null;

    const isNeg = match[1] === '-';
    const wholeDigits = match[2] || '0';
    const fracDigits = match[3];
    if (parseInt(fracDigits, 10) === 0) return null;

    const normalized = `${isNeg ? '-' : ''}${parseInt(wholeDigits, 10)}.${fracDigits}`;
    const level =
        fracDigits.length === 3 || parseInt(wholeDigits, 10) > 0
            ? 'challenging'
            : fracDigits.length === 2
              ? 'medium'
              : 'basic';
    return buildDecimalToFractionProblem(normalized, level);
}

export function buildDecimalToFractionProblem(decimalStr, complexity = 'basic') {
    const cleaned = String(decimalStr).trim().replace(/\u2212/g, '-');
    const isNegative = cleaned.startsWith('-');
    const signPrefix = isNegative ? '-' : '';
    const unsignedStr = cleaned.replace(/^[+-]/, '');

    const [wholeStr, fracDigitsStr] = unsignedStr.split('.');
    const wholePart = parseInt(wholeStr, 10);
    const decimalPlaces = fracDigitsStr.length;
    const placeValueDenom = Math.pow(10, decimalPlaces);
    const placeValueName =
        decimalPlaces === 1 ? 'Tenths' : decimalPlaces === 2 ? 'Hundredths' : 'Thousandths';

    const rawNumerator = parseInt(fracDigitsStr, 10);
    const totalRawNumerator = wholePart * placeValueDenom + rawNumerator;
    const gcf = Fraction.gcd(rawNumerator, placeValueDenom);

    const simpNum = rawNumerator / gcf;
    const simpDen = placeValueDenom / gcf;
    const totalSimpNum = totalRawNumerator / gcf;

    const steps = [];

    // Step 1: Identify Place-Value Denominator
    steps.push({
        type: 'identify_place_value',
        decimalPlaces,
        placeValueDenom,
        placeValueName,
        expectedInput: String(placeValueDenom),
        acceptedInputs: [String(placeValueDenom), placeValueName.toLowerCase()],
        tex: `\\text{${placeValueName}} \\; (${placeValueDenom})`,
        animationFrames: [
            { math: `${signPrefix}\\htmlId{w}{${wholeStr}}.\\textcolor{#4f46e5}{\\htmlId{dec}{${fracDigitsStr}}}` },
            {
                math: `\\textcolor{#4f46e5}{\\htmlId{dec}{${decimalPlaces}\\text{ decimal place${decimalPlaces > 1 ? 's' : ''}}}} \\implies 10^{${decimalPlaces}} = \\htmlId{pv}{${placeValueDenom}} \\text{ (${placeValueName})}`
            },
            { math: `\\text{Place-Value Denominator} = \\textcolor{#16a34a}{\\htmlId{pv}{\\mathbf{${placeValueDenom}}}}` }
        ],
        frameCaptions: [
            `Step 1: Count the digits to the right of the decimal point in ${cleaned}`,
            `Step 2: ${decimalPlaces} digit${decimalPlaces > 1 ? 's' : ''} after the decimal point means ${placeValueName} (${placeValueDenom})`,
            `Step 3: Enter ${placeValueDenom} as the starting denominator`
        ]
    });

    // Step 2: Write as Unsimplified Fraction over 10^k
    const unsimpExpected =
        wholePart > 0
            ? `${signPrefix}${wholePart} ${rawNumerator}/${placeValueDenom}`
            : `${signPrefix}${rawNumerator}/${placeValueDenom}`;
    const unsimpAccepted =
        wholePart > 0
            ? [
                  `${signPrefix}${wholePart} ${rawNumerator}/${placeValueDenom}`,
                  `${signPrefix}${totalRawNumerator}/${placeValueDenom}`
              ]
            : [`${signPrefix}${rawNumerator}/${placeValueDenom}`];
    const unsimpTex =
        wholePart > 0
            ? `${signPrefix}${wholePart}\\frac{${rawNumerator}}{${placeValueDenom}}`
            : `${signPrefix}\\frac{${rawNumerator}}{${placeValueDenom}}`;

    steps.push({
        type: 'unsimplified_fraction',
        wholePart,
        isNegative,
        rawNumerator,
        totalRawNumerator,
        placeValueDenom,
        expectedInput: unsimpExpected,
        acceptedInputs: unsimpAccepted,
        tex: unsimpTex,
        animationFrames: [
            { math: `${signPrefix}\\htmlId{w}{${wholeStr}}.\\htmlId{num}{${fracDigitsStr}}` },
            {
                math:
                    wholePart > 0
                        ? `${signPrefix}\\left(\\htmlId{w}{${wholePart}} + \\frac{\\textcolor{#4f46e5}{\\htmlId{num}{${rawNumerator}}}}{\\textcolor{#4f46e5}{\\htmlId{den}{${placeValueDenom}}}}\\right)`
                        : `${signPrefix}\\frac{\\textcolor{#4f46e5}{\\htmlId{num}{${rawNumerator}}}}{\\textcolor{#4f46e5}{\\htmlId{den}{${placeValueDenom}}}}`
            },
            {
                math:
                    wholePart > 0
                        ? `\\textcolor{#16a34a}{${signPrefix}\\htmlId{w}{${wholePart}}\\frac{\\htmlId{num}{${rawNumerator}}}{\\htmlId{den}{${placeValueDenom}}}} \\; \\left(\\text{or } ${signPrefix}\\frac{${totalRawNumerator}}{${placeValueDenom}}\\right)`
                        : `\\textcolor{#16a34a}{${signPrefix}\\frac{\\htmlId{num}{${rawNumerator}}}{\\htmlId{den}{${placeValueDenom}}}}`
            }
        ],
        frameCaptions: [
            `Step 1: Take the decimal digits (${rawNumerator}) from ${cleaned}`,
            `Step 2: Place ${rawNumerator} over the place-value denominator ${placeValueDenom}`,
            `Step 3: Write the unsimplified fraction ${unsimpExpected}`
        ]
    });

    // Step 3 & Step 4: Find GCF and Simplify (if GCF > 1)
    if (gcf > 1) {
        steps.push({
            type: 'find_gcf',
            rawNumerator,
            placeValueDenom,
            gcf,
            expectedInput: String(gcf),
            acceptedInputs: [String(gcf)],
            tex: `\\text{GCF} = ${gcf}`,
            animationFrames: [
                { math: `\\text{GCF}(\\htmlId{num}{${rawNumerator}}, \\htmlId{den}{${placeValueDenom}})` },
                {
                    math: `\\htmlId{num}{${rawNumerator}} = ${simpNum} \\times \\textcolor{#4f46e5}{\\htmlId{g}{${gcf}}}, \\quad \\htmlId{den}{${placeValueDenom}} = ${simpDen} \\times \\textcolor{#4f46e5}{\\htmlId{g}{${gcf}}}`
                },
                { math: `\\text{GCF} = \\textcolor{#16a34a}{\\htmlId{g}{\\mathbf{${gcf}}}}` }
            ],
            frameCaptions: [
                `Step 1: Find the Greatest Common Factor (GCF) of ${rawNumerator} and ${placeValueDenom}`,
                `Step 2: Both ${rawNumerator} and ${placeValueDenom} are divisible by ${gcf}`,
                `Step 3: Enter ${gcf} as the Greatest Common Factor`
            ]
        });

        const simpExpected =
            wholePart > 0
                ? `${signPrefix}${wholePart} ${simpNum}/${simpDen}`
                : `${signPrefix}${simpNum}/${simpDen}`;
        const simpAccepted =
            wholePart > 0
                ? [`${signPrefix}${wholePart} ${simpNum}/${simpDen}`, `${signPrefix}${totalSimpNum}/${simpDen}`]
                : [`${signPrefix}${simpNum}/${simpDen}`];
        const simpTex =
            wholePart > 0
                ? `${signPrefix}${wholePart}\\frac{${simpNum}}{${simpDen}}`
                : `${signPrefix}\\frac{${simpNum}}{${simpDen}}`;

        steps.push({
            type: 'simplify_fraction',
            wholePart,
            isNegative,
            rawNumerator,
            placeValueDenom,
            gcf,
            simpNum,
            simpDen,
            totalSimpNum,
            expectedInput: simpExpected,
            acceptedInputs: simpAccepted,
            tex: simpTex,
            animationFrames: [
                {
                    math:
                        wholePart > 0
                            ? `${signPrefix}\\htmlId{w}{${wholePart}}\\frac{\\htmlId{num}{${rawNumerator}}}{\\htmlId{den}{${placeValueDenom}}}`
                            : `${signPrefix}\\frac{\\htmlId{num}{${rawNumerator}}}{\\htmlId{den}{${placeValueDenom}}}`
                },
                {
                    math:
                        wholePart > 0
                            ? `${signPrefix}\\htmlId{w}{${wholePart}}\\frac{\\htmlId{num}{${rawNumerator}} \\textcolor{#4f46e5}{\\div \\htmlId{g}{${gcf}}}}{\\htmlId{den}{${placeValueDenom}} \\textcolor{#4f46e5}{\\div \\htmlId{g}{${gcf}}}}`
                            : `${signPrefix}\\frac{\\htmlId{num}{${rawNumerator}} \\textcolor{#4f46e5}{\\div \\htmlId{g}{${gcf}}}}{\\htmlId{den}{${placeValueDenom}} \\textcolor{#4f46e5}{\\div \\htmlId{g}{${gcf}}}}`
                },
                {
                    math:
                        wholePart > 0
                            ? `\\textcolor{#16a34a}{${signPrefix}\\htmlId{w}{${wholePart}}\\frac{\\htmlId{num}{\\mathbf{${simpNum}}}}{\\htmlId{den}{\\mathbf{${simpDen}}}}} \\; \\left(\\text{or } ${signPrefix}\\frac{${totalSimpNum}}{${simpDen}}\\right)`
                            : `\\textcolor{#16a34a}{${signPrefix}\\frac{\\htmlId{num}{\\mathbf{${simpNum}}}}{\\htmlId{den}{\\mathbf{${simpDen}}}}}`
                }
            ],
            frameCaptions: [
                `Step 1: Start with the unsimplified fraction ${unsimpExpected}`,
                `Step 2: Divide both numerator (${rawNumerator}) and denominator (${placeValueDenom}) by GCF ${gcf}`,
                `Step 3: Simplified lowest-terms fraction is ${simpExpected}`
            ]
        });
    }

    const finalStep = steps[steps.length - 1];

    return {
        decimalStr: cleaned,
        isNegative,
        complexity,
        wholePart,
        decimalPlaces,
        placeValueDenom,
        placeValueName,
        rawNumerator,
        totalRawNumerator,
        gcf,
        simpNum,
        simpDen,
        totalSimpNum,
        texInitial: cleaned,
        finalExpected: finalStep.expectedInput,
        acceptedFinalAnswers: finalStep.acceptedInputs,
        finalTex: finalStep.tex,
        steps
    };
}
