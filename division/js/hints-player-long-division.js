export function playNextHint(problem, stepIndex) {
    if (!problem || stepIndex >= problem.steps.length) return;
    
    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('long-division-hint-content');
    const inputElement = document.getElementById('long-division-step-input');
    
    let hintText = '';
    let katexMath = '';
    
    if (step.type === 'divide_digit') {
        hintText = `
            <div class="bg-indigo-100 p-3 rounded-md mb-2 text-indigo-900 border border-indigo-200">
                <strong>Hint:</strong> We need to divide ${step.workingNum} by ${step.divisor}.<br>
                ${step.divisor} goes into ${step.workingNum}, ${step.qDigit} times!
            </div>
        `;
        katexMath = `${step.workingNum} \\div ${step.divisor} = ${step.qDigit} \\text{ R } ${step.workingNum % step.divisor}`;
    } else if (step.type === 'multiply_back') {
        hintText = `
            <div class="bg-yellow-100 p-3 rounded-md mb-2 text-yellow-800 border border-yellow-200">
                <strong>Hint:</strong> Multiply the quotient digit (${step.qDigit}) by the divisor (${step.divisor}).<br>
                ${step.qDigit} \\times ${step.divisor} = ${step.multBack}.
            </div>
        `;
        katexMath = `${step.qDigit} \\times ${step.divisor} = ${step.multBack}`;
    } else if (step.type === 'subtract_down') {
        hintText = `
            <div class="bg-red-100 p-3 rounded-md mb-2 text-red-900 border border-red-200">
                <strong>Hint:</strong> Subtract the product (${step.multBack}) from the working number (${step.workingNum}).<br>
                ${step.workingNum} - ${step.multBack} = ${step.remainder}.
            </div>
        `;
        katexMath = `${step.workingNum} - ${step.multBack} = ${step.remainder}`;
    } else if (step.type === 'bring_down') {
        hintText = `
            <div class="bg-blue-100 p-3 rounded-md mb-2 text-blue-900 border border-blue-200">
                <strong>Hint:</strong> Bring down the next digit of the dividend, which is ${step.nextDigit}.
            </div>
        `;
        katexMath = `\\downarrow ${step.nextDigit}`;
    }
    
    hintBox.innerHTML = hintText;
    
    if (inputElement) {
        inputElement.value = step.expectedInput;
        inputElement.focus();
    }
    
    // Show visual explanation
    const explanationContainer = document.getElementById('visual-explanation-container');
    const explanationDisplay = document.getElementById('visual-explanation-display');
    const controls = document.getElementById('btn-anim-prev')?.parentElement; // hide controls since no anim
    
    if (explanationContainer && explanationDisplay && window.katex) {
        if (katexMath) {
            explanationContainer.classList.remove('hidden');
            setTimeout(() => explanationContainer.classList.remove('opacity-0'), 50);
            if(controls) controls.classList.add('hidden');
            window.katex.render(katexMath, explanationDisplay, { throwOnError: false, displayMode: true });
        } else {
            explanationContainer.classList.add('opacity-0');
            setTimeout(() => explanationContainer.classList.add('hidden'), 500);
        }
    }
}

export function resetHintPlayer() {
    const hintBox = document.getElementById('long-division-hint-content');
    if(hintBox) {
        hintBox.innerHTML = 'Generate a problem to begin.';
    }
    const explanationContainer = document.getElementById('visual-explanation-container');
    if (explanationContainer) {
        explanationContainer.classList.add('opacity-0');
        setTimeout(() => explanationContainer.classList.add('hidden'), 500);
    }
}
