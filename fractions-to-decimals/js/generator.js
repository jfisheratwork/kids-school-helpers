import { Fraction } from '../../shared/js/fraction.js';

const COMPLEXITY_POOLS = {
    basic: [
        [1, 2],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [1, 10],
        [3, 10],
        [7, 10],
        [9, 10]
    ],
    medium: [
        [1, 4],
        [3, 4],
        [1, 20],
        [3, 20],
        [7, 20],
        [9, 20],
        [11, 20],
        [13, 20],
        [17, 20],
        [19, 20],
        [1, 25],
        [2, 25],
        [3, 25],
        [4, 25],
        [6, 25],
        [7, 25],
        [8, 25],
        [9, 25],
        [11, 25],
        [12, 25],
        [13, 25],
        [14, 25],
        [16, 25],
        [17, 25],
        [18, 25],
        [19, 25],
        [21, 25],
        [22, 25],
        [23, 25],
        [24, 25],
        [3, 50],
        [7, 50],
        [9, 50],
        [11, 50],
        [13, 50],
        [17, 50],
        [19, 50],
        [21, 50],
        [23, 50],
        [27, 50],
        [29, 50]
    ],
    challenging: [
        [1, 8],
        [3, 8],
        [5, 8],
        [7, 8],
        [3, 40],
        [7, 40],
        [9, 40],
        [11, 40],
        [13, 40],
        [17, 40],
        [19, 40],
        [21, 40],
        [23, 40],
        [3, 2],
        [5, 2],
        [7, 2],
        [5, 4],
        [7, 4],
        [9, 4],
        [11, 4],
        [7, 5],
        [8, 5],
        [9, 5],
        [12, 5],
        [9, 8],
        [11, 8],
        [13, 8],
        [15, 8]
    ],
    repeating: [
        [1, 3],
        [2, 3],
        [1, 6],
        [5, 6],
        [1, 9],
        [2, 9],
        [4, 9],
        [5, 9],
        [7, 9],
        [8, 9],
        [1, 11],
        [2, 11],
        [3, 11],
        [4, 11],
        [5, 11],
        [1, 12],
        [5, 12],
        [7, 12],
        [11, 12]
    ],
    mixed_signed: [
        [5, 7, 12, true],
        [3, 5, 12, true],
        [2, 11, 12, false],
        [4, 1, 12, true],
        [4, 3, 4, true],
        [2, 5, 8, true],
        [6, 2, 3, true],
        [1, 7, 20, true],
        [3, 9, 25, false],
        [5, 3, 8, false],
        [4, 5, 6, true],
        [2, 3, 11, true],
        [7, 1, 4, true],
        [3, 7, 8, true]
    ]
};

export function generateFractionToDecimalProblem(complexity = 'basic', options = {}) {
    if (complexity === 'mixed_signed') {
        const entry = COMPLEXITY_POOLS.mixed_signed[Math.floor(Math.random() * COMPLEXITY_POOLS.mixed_signed.length)];
        const [wholePart, numerator, denominator, defaultNeg] = entry;
        const isNegative = options.allowNegatives !== undefined ? Boolean(options.allowNegatives) : defaultNeg;
        return buildFractionToDecimalProblem(numerator, denominator, complexity, {
            wholePart,
            isNegative
        });
    }

    const pool = COMPLEXITY_POOLS[complexity] || COMPLEXITY_POOLS.basic;
    const [numerator, denominator] = pool[Math.floor(Math.random() * pool.length)];

    let wholePart = options.wholePart || 0;
    if (options.format === 'mixed' && wholePart === 0 && numerator < denominator) {
        wholePart = Math.floor(Math.random() * 8) + 1;
    }
    const isNegative = Boolean(options.allowNegatives);

    return buildFractionToDecimalProblem(numerator, denominator, complexity, {
        wholePart,
        isNegative
    });
}

export function parseCustomFractionToDecimalProblem(rawStr) {
    const cleaned = (rawStr || '').trim().replace(/\u2212/g, '-');
    if (!cleaned) return null;

    // Match optional sign, optional whole number + space + n/d, or simple n/d
    const mixedMatch = cleaned.match(/^([+-])?\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (mixedMatch) {
        const isNegative = mixedMatch[1] === '-';
        const wholePart = parseInt(mixedMatch[2], 10);
        const numerator = parseInt(mixedMatch[3], 10);
        const denominator = parseInt(mixedMatch[4], 10);
        if (denominator <= 0 || denominator > 1000 || numerator <= 0 || numerator >= denominator * 20) {
            return null;
        }
        return buildFractionToDecimalProblem(numerator, denominator, 'mixed_signed', {
            wholePart,
            isNegative
        });
    }

    const fracMatch = cleaned.match(/^([+-])?\s*(\d+)\s*\/\s*(\d+)$/);
    if (fracMatch) {
        const isNegative = fracMatch[1] === '-';
        const numerator = parseInt(fracMatch[2], 10);
        const denominator = parseInt(fracMatch[3], 10);
        if (denominator <= 0 || denominator > 1000 || numerator <= 0 || numerator > 9999) {
            return null;
        }
        const complexity = isTerminatingDenominator(denominator) ? 'challenging' : 'repeating';
        return buildFractionToDecimalProblem(numerator, denominator, complexity, {
            wholePart: 0,
            isNegative
        });
    }

    return null;
}

export function buildFractionToDecimalProblem(numerator, denominator, complexity = 'basic', options = {}) {
    const wholePart = options.wholePart || 0;
    const isNegative = Boolean(options.isNegative);

    const frac = new Fraction(numerator, denominator);
    const isRepeating = complexity === 'repeating' || !isTerminatingDenominator(frac.d);
    const maxDecimalPlaces = isRepeating
        ? getRepeatingDecimalPlaces(frac.d)
        : getTerminatingDecimalPlaces(frac.n, frac.d);

    const intPartStr = String(numerator);
    const intEndCol = intPartStr.length - 1;
    const dotCol = intPartStr.length;

    const dividendCols = [...intPartStr.split(''), '.'];
    for (let k = 0; k < maxDecimalPlaces; k++) {
        dividendCols.push('0');
    }

    // Map numeric column index -> table column index (skipping dotCol)
    const numericColMap = [];
    for (let c = 0; c < dividendCols.length; c++) {
        if (c !== dotCol) {
            numericColMap.push(c);
        }
    }

    const steps = [];
    const wholeQuotient = Math.floor(numerator / denominator);
    let workingNum = numerator;
    let currentNumericIdx = intEndCol;
    let quotientStr = `${wholeQuotient}.`;

    if (wholeQuotient === 0) {
        steps.push({
            type: 'divide_whole',
            workingNum,
            divisor: denominator,
            qDigit: 0,
            colIndex: intEndCol,
            dotColIndex: dotCol,
            numericIndex: currentNumericIdx,
            expectedInput: '0',
            acceptedInputs: ['0', '0.'],
            animationFrames: [
                { math: `\\frac{\\htmlId{num}{${numerator}}}{\\htmlId{den}{${denominator}}} = \\htmlId{den}{${denominator}} \\overline{)\\htmlId{num}{${numerator}}.0}` },
                { math: `\\htmlId{num}{${numerator}} < \\htmlId{den}{${denominator}} \\implies \\htmlId{den}{${denominator}} \\text{ goes into } \\htmlId{num}{${numerator}} \\; \\textcolor{#4f46e5}{\\htmlId{q0}{0}} \\text{ times}` },
                { math: `\\text{Write } \\textcolor{#16a34a}{\\htmlId{q0}{\\mathbf{0.}}} \\text{ in the quotient above } \\htmlId{num}{${numerator}}.` }
            ],
            frameCaptions: [
                `Step 1: Set up the fractional part ${numerator} ÷ ${denominator} with a decimal point`,
                `Step 2: Since ${numerator} is smaller than ${denominator}, ${denominator} goes into ${numerator} zero (0) times`,
                `Step 3: Write 0 (and line up the decimal point) in the quotient row`
            ]
        });
    } else {
        const multBack = wholeQuotient * denominator;
        const remainder = workingNum - multBack;

        steps.push({
            type: 'divide_whole',
            workingNum,
            divisor: denominator,
            qDigit: wholeQuotient,
            colIndex: intEndCol,
            dotColIndex: dotCol,
            numericIndex: currentNumericIdx,
            expectedInput: String(wholeQuotient),
            acceptedInputs: [String(wholeQuotient), `${wholeQuotient}.`],
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} \\div \\htmlId{d}{${denominator}}` },
                { math: `\\htmlId{d}{${denominator}} \\times \\textcolor{#4f46e5}{\\htmlId{q0}{${wholeQuotient}}} = \\htmlId{mb}{${multBack}} \\le \\htmlId{w}{${workingNum}}` },
                { math: `\\text{Whole quotient digit: } \\textcolor{#16a34a}{\\htmlId{q0}{\\mathbf{${wholeQuotient}.}}}` }
            ],
            frameCaptions: [
                `Step 1: How many times does ${denominator} go into ${workingNum}?`,
                `Step 2: ${denominator} × ${wholeQuotient} = ${multBack} fits inside ${workingNum}`,
                `Step 3: Write ${wholeQuotient} (and the decimal point) in the quotient row`
            ]
        });

        steps.push({
            type: 'multiply_back',
            qDigit: wholeQuotient,
            divisor: denominator,
            multBack,
            workingNum,
            colIndex: intEndCol,
            numericIndex: currentNumericIdx,
            expectedInput: String(multBack),
            animationFrames: [
                { math: `\\htmlId{q}{${wholeQuotient}} \\times \\htmlId{d}{${denominator}}` },
                { math: `\\htmlId{q}{${wholeQuotient}} \\times \\htmlId{d}{${denominator}} = \\textcolor{#4f46e5}{\\htmlId{mb}{${multBack}}}` },
                { math: `\\text{Write } \\textcolor{#16a34a}{\\htmlId{mb}{\\mathbf{${multBack}}}} \\text{ below } \\htmlId{w}{${workingNum}}` }
            ],
            frameCaptions: [
                `Step 1: Multiply quotient digit ${wholeQuotient} by divisor ${denominator}`,
                `Step 2: Compute ${wholeQuotient} × ${denominator} = ${multBack}`,
                `Step 3: Write ${multBack} under ${workingNum}`
            ]
        });

        steps.push({
            type: 'subtract_down',
            workingNum,
            multBack,
            remainder,
            colIndex: intEndCol,
            numericIndex: currentNumericIdx,
            expectedInput: String(remainder),
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}}` },
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}} = \\textcolor{#4f46e5}{\\htmlId{rem}{${remainder}}}` },
                { math: `\\text{Remainder: } \\textcolor{#16a34a}{\\htmlId{rem}{\\mathbf{${remainder}}}}` }
            ],
            frameCaptions: [
                `Step 1: Set up subtraction ${workingNum} - ${multBack}`,
                `Step 2: Subtract to get remainder ${remainder}`,
                `Step 3: Write remainder ${remainder} below the line`
            ]
        });

        workingNum = remainder;
    }

    // Decimal places loop
    for (let decPlace = 1; decPlace <= maxDecimalPlaces; decPlace++) {
        currentNumericIdx = intEndCol + decPlace;
        const tableColIdx = dotCol + decPlace;
        const prevRemainder = workingNum;
        workingNum = prevRemainder * 10;

        steps.push({
            type: 'bring_down_zero',
            decPlace,
            prevRemainder,
            newWorkingNum: workingNum,
            nextDigit: '0',
            colIndex: tableColIdx,
            numericIndex: currentNumericIdx,
            expectedInput: String(workingNum),
            acceptedInputs: [String(workingNum), '0'],
            animationFrames: [
                { math: `\\htmlId{rem}{${prevRemainder}} \\quad \\textcolor{#4f46e5}{\\downarrow \\htmlId{z}{0}}` },
                { math: `\\htmlId{rem}{${prevRemainder}}\\textcolor{#4f46e5}{\\htmlId{z}{0}}` },
                { math: `\\text{New working number: } \\textcolor{#16a34a}{\\htmlId{nw}{\\mathbf{${workingNum}}}}` }
            ],
            frameCaptions: [
                `Step 1: Annex and bring down 0 in decimal place #${decPlace}`,
                `Step 2: Place 0 next to ${prevRemainder} to form ${workingNum}`,
                `Step 3: Enter the new working number ${workingNum} (or 0)`
            ]
        });

        const qDigit = Math.floor(workingNum / denominator);
        const multBack = qDigit * denominator;
        const remainder = workingNum - multBack;
        quotientStr += String(qDigit);

        steps.push({
            type: 'divide_digit',
            decPlace,
            workingNum,
            divisor: denominator,
            qDigit,
            colIndex: tableColIdx,
            numericIndex: currentNumericIdx,
            expectedInput: String(qDigit),
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} \\div \\htmlId{d}{${denominator}}` },
                { math: `\\htmlId{d}{${denominator}} \\times \\textcolor{#4f46e5}{\\htmlId{q}{${qDigit}}} = \\htmlId{mb}{${multBack}} \\le \\htmlId{w}{${workingNum}}` },
                { math: `\\text{Decimal digit: } \\textcolor{#16a34a}{\\htmlId{q}{\\mathbf{${qDigit}}}}` }
            ],
            frameCaptions: [
                `Step 1: How many times does ${denominator} go into ${workingNum}?`,
                `Step 2: ${denominator} × ${qDigit} = ${multBack} fits inside ${workingNum}`,
                `Step 3: Write ${qDigit} in the quotient row above the 0`
            ]
        });

        steps.push({
            type: 'multiply_back',
            decPlace,
            qDigit,
            divisor: denominator,
            multBack,
            workingNum,
            colIndex: tableColIdx,
            numericIndex: currentNumericIdx,
            expectedInput: String(multBack),
            animationFrames: [
                { math: `\\htmlId{q}{${qDigit}} \\times \\htmlId{d}{${denominator}}` },
                { math: `\\htmlId{q}{${qDigit}} \\times \\htmlId{d}{${denominator}} = \\textcolor{#4f46e5}{\\htmlId{mb}{${multBack}}}` },
                { math: `\\text{Write } \\textcolor{#16a34a}{\\htmlId{mb}{\\mathbf{${multBack}}}} \\text{ below } \\htmlId{w}{${workingNum}}` }
            ],
            frameCaptions: [
                `Step 1: Multiply quotient digit ${qDigit} by divisor ${denominator}`,
                `Step 2: Compute ${qDigit} × ${denominator} = ${multBack}`,
                `Step 3: Write ${multBack} under ${workingNum}`
            ]
        });

        steps.push({
            type: 'subtract_down',
            decPlace,
            workingNum,
            multBack,
            remainder,
            colIndex: tableColIdx,
            numericIndex: currentNumericIdx,
            expectedInput: String(remainder),
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}}` },
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}} = \\textcolor{#4f46e5}{\\htmlId{rem}{${remainder}}}` },
                { math: `\\text{Remainder: } \\textcolor{#16a34a}{\\htmlId{rem}{\\mathbf{${remainder}}}}` }
            ],
            frameCaptions: [
                `Step 1: Subtract ${multBack} from ${workingNum}`,
                `Step 2: ${workingNum} - ${multBack} = ${remainder}`,
                remainder === 0
                    ? `Step 3: Remainder is 0! The division terminates at ${quotientStr}`
                    : `Step 3: Write remainder ${remainder} below the line`
            ]
        });

        workingNum = remainder;
        if (!isRepeating && workingNum === 0) {
            break;
        }
    }

    const totalWhole = wholePart + wholeQuotient;
    const decDigitsOnly = quotientStr.split('.')[1] || '0';
    const signPrefix = isNegative ? '-' : '';
    const finalAnswerStr = `${signPrefix}${totalWhole}.${decDigitsOnly}`;

    const acceptedFinalAnswers = [finalAnswerStr];
    if (finalAnswerStr.startsWith('0.')) {
        acceptedFinalAnswers.push(finalAnswerStr.slice(1));
    } else if (finalAnswerStr.startsWith('-0.')) {
        acceptedFinalAnswers.push(`-${finalAnswerStr.slice(2)}`);
    }
    if (isRepeating) {
        acceptedFinalAnswers.push(`${finalAnswerStr}...`);
        if (decDigitsOnly.length >= 3) {
            const twoPlaceTrunc = `${signPrefix}${totalWhole}.${decDigitsOnly.slice(0, 2)}`;
            acceptedFinalAnswers.push(twoPlaceTrunc);
            acceptedFinalAnswers.push(`${twoPlaceTrunc}...`);
        }
    }

    // If wholePart > 0 or isNegative, add final synthesis step combining whole part & sign with quotientStr
    if (wholePart > 0 || isNegative) {
        const dots = isRepeating ? '\\ldots' : '';
        const fracPartTex = `\\frac{${numerator}}{${denominator}}`;
        steps.push({
            type: 'combine_whole_and_sign',
            wholePart,
            isNegative,
            longDivQuotient: quotientStr,
            finalAnswerStr,
            numericIndex: currentNumericIdx,
            expectedInput: finalAnswerStr,
            acceptedInputs: acceptedFinalAnswers,
            animationFrames: [
                {
                    math:
                        wholePart > 0
                            ? `${signPrefix}\\left(\\htmlId{w}{${wholePart}} + ${fracPartTex}\\right) = ${signPrefix}\\left(\\htmlId{w}{${wholePart}} + \\htmlId{ld}{${quotientStr}${dots}}\\right)`
                            : `\\htmlId{sign}{-} ${fracPartTex} = \\htmlId{sign}{-} \\htmlId{ld}{${quotientStr}${dots}}`
                },
                {
                    math:
                        wholePart > 0
                            ? `${signPrefix}\\left(\\textcolor{#4f46e5}{\\htmlId{w}{${wholePart}}} + \\textcolor{#4f46e5}{\\htmlId{ld}{${quotientStr}${dots}}}\\right) = \\textcolor{#4f46e5}{\\htmlId{res}{${finalAnswerStr}${dots}}}`
                            : `\\textcolor{#4f46e5}{\\htmlId{sign}{-}\\htmlId{ld}{${quotientStr}${dots}}} = \\textcolor{#4f46e5}{\\htmlId{res}{${finalAnswerStr}${dots}}}`
                },
                {
                    math: `\\text{Final Answer: } \\textcolor{#16a34a}{\\htmlId{res}{\\mathbf{${finalAnswerStr}${dots}}}}`
                }
            ],
            frameCaptions: [
                `Step 1: Replace ${numerator}/${denominator} with its long-division decimal ${quotientStr}${isRepeating ? '...' : ''}`,
                wholePart > 0
                    ? `Step 2: Combine whole number ${wholePart} with ${quotientStr}${isRepeating ? '...' : ''}${isNegative ? ' and apply the negative (-) sign' : ''}`
                    : `Step 2: Apply the negative (-) sign to ${quotientStr}${isRepeating ? '...' : ''}`,
                `Step 3: Enter the final decimal ${finalAnswerStr}`
            ]
        });
    }

    const dividendDisplay = `${numerator}.${'0'.repeat(maxDecimalPlaces)}`;
    const fractionTex =
        wholePart > 0
            ? `${signPrefix}${wholePart}\\frac{${numerator}}{${denominator}}`
            : `${signPrefix}\\frac{${numerator}}{${denominator}}`;
    const decompositionTex =
        wholePart > 0
            ? `${signPrefix}\\left(${wholePart} + \\frac{${numerator}}{${denominator}}\\right)`
            : '';
    const finalTex = isRepeating ? `${finalAnswerStr}\\ldots` : finalAnswerStr;
    const problemLabel =
        wholePart > 0
            ? `${signPrefix}${wholePart} ${numerator}/${denominator}`
            : `${signPrefix}${numerator}/${denominator}`;

    return {
        wholePart,
        isNegative,
        numerator,
        denominator,
        complexity,
        isRepeating,
        maxDecimalPlaces,
        intEndCol,
        dotCol,
        dividendCols,
        numericColMap,
        dividendDisplay,
        divisor: denominator,
        quotientStr,
        finalAnswerStr,
        acceptedFinalAnswers,
        finalRemainder: workingNum,
        fractionTex,
        decompositionTex,
        finalTex,
        problemLabel,
        steps
    };
}

function isTerminatingDenominator(d) {
    let temp = Math.abs(d);
    while (temp % 2 === 0) temp /= 2;
    while (temp % 5 === 0) temp /= 5;
    return temp === 1;
}

function getRepeatingDecimalPlaces(d) {
    let temp = Math.abs(d);
    let c2 = 0;
    let c5 = 0;
    while (temp % 2 === 0) {
        c2++;
        temp /= 2;
    }
    while (temp % 5 === 0) {
        c5++;
        temp /= 5;
    }
    const nonRepeatingPlaces = Math.max(c2, c5);
    return Math.min(3, Math.max(2, nonRepeatingPlaces + 1));
}

function getTerminatingDecimalPlaces(n, d) {
    let rem = n % d;
    let places = 0;
    while (rem !== 0 && places < 4) {
        rem = (rem * 10) % d;
        places++;
    }
    return Math.max(1, places);
}
