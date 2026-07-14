// Standard Multiplication Generator

export function generateStandardProblem(topDigits, bottomDigits, decimalConfig) {
    function getRandomIntStr(digits) {
        if (digits === 1) return String(Math.floor(Math.random() * 9) + 1); // 1-9
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    let str1 = getRandomIntStr(topDigits);
    let str2 = getRandomIntStr(bottomDigits);

    // Swap so the longer string is on top
    let topStr = str1.length >= str2.length ? str1 : str2;
    let bottomStr = str1.length < str2.length ? str1 : str2;

    // Handle Decimals
    let decTop = 0;
    let decBottom = 0;
    
    if (decimalConfig !== '0') {
        let totalDec = 0;
        if (decimalConfig === 'random') {
            totalDec = Math.floor(Math.random() * 3); // 0, 1, 2
        } else {
            totalDec = parseInt(decimalConfig);
        }

        if (totalDec > 0) {
            if (totalDec === 1) {
                if (Math.random() > 0.5) decTop = 1; else decBottom = 1;
            } else if (totalDec === 2) {
                if (Math.random() > 0.5) { decTop = 1; decBottom = 1; }
                else { decTop = 2; decBottom = 0; }
            }
            
            if (decTop >= topStr.length) decTop = topStr.length - 1;
            if (decBottom >= bottomStr.length) decBottom = bottomStr.length - 1;
        }
    }

    const insertDecimal = (str, pos) => pos > 0 ? str.slice(0, str.length - pos) + '.' + str.slice(str.length - pos) : str;

    const displayTop = insertDecimal(topStr, decTop);
    const displayBottom = insertDecimal(bottomStr, decBottom);
    
    const topVal = parseFloat(displayTop);
    const bottomVal = parseFloat(displayBottom);
    
    const steps = [];
    
    let bottomRev = bottomStr.split('').reverse();
    let topRev = topStr.split('').reverse();

    // Total columns for the grid. Max possible is topStr.length + bottomStr.length + 1
    const gridCols = topStr.length + bottomStr.length + 1; 
    
    let ppRows = []; // Track partial products for addition

    for (let i = 0; i < bottomRev.length; i++) {
        let bDigit = parseInt(bottomRev[i]);
        
        // If not the first row, strike out previous carries
        if (i > 0) {
            steps.push({
                type: 'strike_carries',
                rowIndex: i
            });
            
            // Add zero placeholders
            for (let z = 0; z < i; z++) {
                steps.push({
                    type: 'add_placeholder',
                    bDigit: bDigit,
                    expectedInput: '0',
                    targetCol: gridCols - z,
                    rowIndex: i
                });
            }
        }
        
        let currentCarry = 0;
        let partialProductStr = '';
        
        for (let j = 0; j < topRev.length; j++) {
            let tDigit = parseInt(topRev[j]);
            let prod = (bDigit * tDigit) + currentCarry;
            
            let resultDigit = prod % 10;
            let carryOut = Math.floor(prod / 10);
            
            // If it's the last top digit, the result digit gets the whole product 
            // OR we just write both digits. Usually we write the full product on the bottom line.
            // Let's break it down: write ones digit, and carry goes to next col. 
            // Wait, if it's the last digit, we don't carry up, we just write it down on the same row.
            let isLastTopDigit = (j === topRev.length - 1);
            
            let frames;
            if (currentCarry > 0) {
                frames = [{ math: `(${bDigit} \\times ${tDigit}) + ${currentCarry} \\text{ (carry)} = ${prod}` }];
            } else {
                frames = [{ math: `${bDigit} \\times ${tDigit} = ${prod}` }];
            }
            
            if (isLastTopDigit) {
                partialProductStr = prod.toString() + partialProductStr;
                
                if (prod > 9) {
                    steps.push({
                        type: 'multiply_digit_last',
                        bDigit,
                        tDigit,
                        carryIn: currentCarry,
                        fullResult: prod.toString(),
                        expectedInput: prod.toString(), // User enters the whole final piece of the partial product
                        targetCol: gridCols - i - j,    // Rightmost digit of this piece
                        targetColStart: gridCols - i - j - 1, // Leftmost digit
                        topCol: gridCols - j,
                        bottomCol: gridCols - i,
                        rowIndex: i,
                        animationFrames: frames
                    });
                } else {
                    steps.push({
                        type: 'multiply_digit',
                        bDigit,
                        tDigit,
                        carryIn: currentCarry,
                        carryOut: 0,
                        resultDigit,
                        expectedInput: resultDigit.toString(),
                        targetCol: gridCols - i - j,
                        topCol: gridCols - j,
                        bottomCol: gridCols - i,
                        rowIndex: i,
                        carryCol: null,
                        animationFrames: frames
                    });
                }
            } else {
                partialProductStr = resultDigit.toString() + partialProductStr;
                steps.push({
                    type: 'multiply_digit',
                    bDigit,
                    tDigit,
                    carryIn: currentCarry,
                    carryOut,
                    resultDigit,
                    expectedInput: resultDigit.toString(),
                    targetCol: gridCols - i - j,
                    topCol: gridCols - j,
                    bottomCol: gridCols - i,
                    rowIndex: i,
                    carryCol: gridCols - j - 1,
                    animationFrames: frames
                });
            }
            
            currentCarry = carryOut;
        }
        
        let paddedPP = partialProductStr + '0'.repeat(i);
        ppRows.push(paddedPP);
    }

    const totalStr = String(parseInt(topStr) * parseInt(bottomStr));
    const totalDecimals = decTop + decBottom;
    const finalProductDisplay = totalDecimals > 0 ? insertDecimal(totalStr, totalDecimals) : totalStr;

    if (bottomStr.length > 1) {
        // Multi-step addition of partial products
        let carry = 0;
        let colIdx = 0;
        let additionDone = false;
        
        while (!additionDone) {
            let colSum = carry;
            let addends = [];
            let hasDigits = false;
            
            for (let r = 0; r < ppRows.length; r++) {
                let s = ppRows[r];
                if (colIdx < s.length) {
                    let digit = parseInt(s[s.length - 1 - colIdx]);
                    colSum += digit;
                    addends.push(digit);
                    hasDigits = true;
                }
            }
            
            if (!hasDigits && carry === 0) {
                additionDone = true;
                break;
            }
            
            let resultDigit = colSum % 10;
            let carryOut = Math.floor(colSum / 10);
            
            let mathStr = addends.join(' + ');
            if (carry > 0) mathStr += ` + ${carry} \\text{ (carry)}`;
            mathStr += ` = ${colSum}`;
            
            steps.push({
                type: 'final_add_digit',
                resultDigit,
                expectedInput: resultDigit.toString(),
                carryIn: carry,
                carryOut: carryOut,
                targetCol: gridCols - colIdx,
                carryCol: gridCols - colIdx - 1,
                animationFrames: [{ math: mathStr }]
            });
            
            carry = carryOut;
            colIdx++;
        }
    }

    if (totalDecimals > 0) {
        steps.push({
            type: 'place_decimal',
            expectedInput: finalProductDisplay,
            decCount: totalDecimals,
            targetCol: gridCols - totalDecimals,
            isSingleRow: bottomStr.length === 1
        });
    }

    return {
        topStr,
        bottomStr,
        displayTop,
        displayBottom,
        topVal,
        bottomVal,
        decTop,
        decBottom,
        totalDecimals,
        gridCols,
        steps,
        ppRows,
        finalProduct: topVal * bottomVal,
        finalProductDisplay
    };
}
