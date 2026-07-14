export function generateLongDivisionProblem(dividendDigits, divisorDigits, decimalConfig) {
    function getRandomIntStr(digits, minVal = 1) {
        const min = Math.max(Math.pow(10, digits - 1), minVal);
        const max = Math.pow(10, digits) - 1;
        return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    let divisorStr, dividendStr, divisor, dividend;
    
    // Generate numbers that divide perfectly without a remainder
    while (true) {
        divisorStr = getRandomIntStr(divisorDigits, 2);
        divisor = parseInt(divisorStr);
        
        let minQ = Math.ceil(Math.pow(10, dividendDigits - 1) / divisor);
        let maxQ = Math.floor((Math.pow(10, dividendDigits) - 1) / divisor);
        
        if (minQ > maxQ) {
            // Not possible to get dividendDigits with this divisor, fallback to simple random
            dividendStr = getRandomIntStr(dividendDigits);
            dividend = parseInt(dividendStr);
            dividend = Math.floor(dividend / divisor) * divisor; // force no remainder, might drop a digit
            if (dividend === 0) dividend = divisor;
            dividendStr = dividend.toString();
            break;
        }
        
        let quotient = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
        dividend = divisor * quotient;
        dividendStr = dividend.toString();
        break;
    }
    
    let steps = [];
    
    let workingStr = '';
    let quotientStr = '';
    
    for (let i = 0; i < dividendStr.length; i++) {
        let currentDigit = dividendStr[i];
        workingStr += currentDigit;
        let workingNum = parseInt(workingStr);
        
        let qDigit = Math.floor(workingNum / divisor);
        
        // If it's the first step and qDigit is 0, we can either write 0 or wait.
        // Standard US long division usually leaves it blank until we can divide, OR writes 0.
        // We'll write 0 if requested, but for now we'll write 0 or leave blank based on quotientStr length.
        
        // Wait, if workingNum < divisor and it's the very first digits, we usually just pull the next digit
        // before doing a full subtraction cycle.
        if (qDigit === 0 && quotientStr === '') {
            steps.push({
                type: 'divide_digit',
                workingNum,
                divisor,
                qDigit: 0,
                isSkip: true, // We don't multiply/subtract, just bring down next
                dividendIndex: i,
                expectedInput: '' // usually handled implicitly
            });
            continue;
        }
        
        quotientStr += qDigit.toString();
        
        steps.push({
            type: 'divide_digit',
            workingNum,
            divisor,
            qDigit,
            dividendIndex: i,
            quotientIndex: quotientStr.length - 1,
            expectedInput: qDigit.toString()
        });
        
        let multBack = qDigit * divisor;
        steps.push({
            type: 'multiply_back',
            qDigit,
            divisor,
            multBack,
            dividendIndex: i,
            expectedInput: multBack.toString()
        });
        
        let remainder = workingNum - multBack;
        steps.push({
            type: 'subtract_down',
            workingNum,
            multBack,
            remainder,
            dividendIndex: i,
            expectedInput: remainder.toString()
        });
        
        workingStr = remainder.toString();
        
        if (i < dividendStr.length - 1) {
            steps.push({
                type: 'bring_down',
                nextDigit: dividendStr[i + 1],
                currentWorkingStr: workingStr, // before bring down
                newWorkingStr: workingStr + dividendStr[i + 1], // after bring down
                dividendIndex: i + 1,
                expectedInput: dividendStr[i + 1]
            });
        }
    }
    
    // Final check for remainders
    let finalRemainder = parseInt(workingStr);
    
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
