export function generateLongDivisionProblem(dividendDigits, divisorDigits) {
    function getRandomIntStr(digits, minVal = 1) {
        const min = Math.max(Math.pow(10, digits - 1), minVal);
        const max = Math.pow(10, digits) - 1;
        return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    let divisorStr, dividendStr, divisor, dividend;

    while (true) {
        divisorStr = getRandomIntStr(divisorDigits, 2);
        divisor = parseInt(divisorStr, 10);

        const minQ = Math.ceil(Math.pow(10, dividendDigits - 1) / divisor);
        const maxQ = Math.floor((Math.pow(10, dividendDigits) - 1) / divisor);

        if (minQ > maxQ) {
            dividendStr = getRandomIntStr(dividendDigits);
            dividend = parseInt(dividendStr, 10);
            dividend = Math.floor(dividend / divisor) * divisor;
            if (dividend === 0) dividend = divisor;
            dividendStr = dividend.toString();
            break;
        }

        const quotient = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
        dividend = divisor * quotient;
        dividendStr = dividend.toString();
        break;
    }

    const steps = [];
    let workingStr = '';
    let quotientStr = '';

    for (let i = 0; i < dividendStr.length; i++) {
        const currentDigit = dividendStr[i];
        workingStr += currentDigit;
        const workingNum = parseInt(workingStr, 10);

        const qDigit = Math.floor(workingNum / divisor);

        if (qDigit === 0 && quotientStr === '') {
            steps.push({
                type: 'divide_digit',
                workingNum,
                divisor,
                qDigit: 0,
                isSkip: true,
                dividendIndex: i,
                expectedInput: ''
            });
            continue;
        }

        quotientStr += qDigit.toString();
        const multBack = qDigit * divisor;

        steps.push({
            type: 'divide_digit',
            workingNum,
            divisor,
            qDigit,
            dividendIndex: i,
            quotientIndex: quotientStr.length - 1,
            expectedInput: qDigit.toString(),
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} \\div \\htmlId{d}{${divisor}}` },
                { math: `\\htmlId{d}{${divisor}} \\times \\textcolor{#4f46e5}{\\htmlId{q}{${qDigit}}} = \\htmlId{mb}{${multBack}} \\le \\htmlId{w}{${workingNum}}` },
                { math: `\\text{Quotient digit: } \\textcolor{#16a34a}{\\htmlId{q}{\\mathbf{${qDigit}}}}` }
            ],
            frameCaptions: [
                `Step 1: How many times does ${divisor} go into ${workingNum}?`,
                `Step 2: ${divisor} × ${qDigit} = ${multBack} fits inside ${workingNum}`,
                `Step 3: Write ${qDigit} in the quotient row above`
            ]
        });

        steps.push({
            type: 'multiply_back',
            qDigit,
            divisor,
            multBack,
            dividendIndex: i,
            expectedInput: multBack.toString(),
            animationFrames: [
                { math: `\\htmlId{q}{${qDigit}} \\times \\htmlId{d}{${divisor}}` },
                { math: `\\htmlId{q}{${qDigit}} \\times \\htmlId{d}{${divisor}} = \\textcolor{#4f46e5}{\\htmlId{mb}{${multBack}}}` },
                { math: `\\text{Write } \\textcolor{#16a34a}{\\htmlId{mb}{\\mathbf{${multBack}}}} \\text{ below } \\htmlId{w}{${workingNum}}` }
            ],
            frameCaptions: [
                `Step 1: Multiply quotient digit ${qDigit} by divisor ${divisor}`,
                `Step 2: Compute ${qDigit} × ${divisor} = ${multBack}`,
                `Step 3: Write ${multBack} under ${workingNum}`
            ]
        });

        const remainder = workingNum - multBack;
        steps.push({
            type: 'subtract_down',
            workingNum,
            multBack,
            remainder,
            dividendIndex: i,
            expectedInput: remainder.toString(),
            animationFrames: [
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}}` },
                { math: `\\htmlId{w}{${workingNum}} - \\htmlId{mb}{${multBack}} = \\textcolor{#4f46e5}{\\htmlId{rem}{${remainder}}}` },
                { math: `\\text{Remainder: } \\textcolor{#16a34a}{\\htmlId{rem}{\\mathbf{${remainder}}}}` }
            ],
            frameCaptions: [
                `Step 1: Set up subtraction ${workingNum} - ${multBack}`,
                `Step 2: Subtract to find remainder ${remainder}`,
                `Step 3: Write remainder ${remainder} below the line`
            ]
        });

        workingStr = remainder.toString();

        if (i < dividendStr.length - 1) {
            const nextDigit = dividendStr[i + 1];
            const newWorkingStr = workingStr + nextDigit;
            steps.push({
                type: 'bring_down',
                nextDigit,
                currentWorkingStr: workingStr,
                newWorkingStr,
                dividendIndex: i + 1,
                expectedInput: nextDigit,
                animationFrames: [
                    { math: `\\htmlId{rem}{${workingStr}} \\quad \\textcolor{#4f46e5}{\\downarrow \\htmlId{nd}{${nextDigit}}}` },
                    { math: `\\htmlId{rem}{${workingStr}}\\textcolor{#4f46e5}{\\htmlId{nd}{${nextDigit}}}` },
                    { math: `\\text{Bring down } \\textcolor{#16a34a}{\\htmlId{nd}{\\mathbf{${nextDigit}}}} \\rightarrow \\htmlId{nw}{${newWorkingStr}}` }
                ],
                frameCaptions: [
                    `Step 1: Locate next dividend digit ${nextDigit}`,
                    `Step 2: Bring ${nextDigit} down next to ${workingStr}`,
                    `Step 3: Enter ${nextDigit} to form ${newWorkingStr}`
                ]
            });
        }
    }

    const finalRemainder = parseInt(workingStr, 10);

    return {
        dividendStr,
        divisorStr,
        dividend,
        divisor,
        quotientStr,
        finalRemainder,
        steps
    };
}
