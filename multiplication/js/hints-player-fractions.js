// Hints player for fractions mode

export function attachFractionsHintListener(inputElement, getProblemFunc, getStepIndexFunc) {
    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextFractionsHint(getProblemFunc(), getStepIndexFunc(), inputElement);
        }
    });
}

export function playNextFractionsHint(problem, stepIndex, inputElement) {
    if (!problem || stepIndex >= problem.steps.length) return;
    
    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('fractions-hint-content');
    
    if (step.type === 'multiply') {
        hintBox.innerHTML = `
            <div class="bg-blue-100 p-3 rounded-md mb-2">
                <strong>Hint:</strong> Multiply top numbers: ${problem.f1.n} &times; ${problem.f2.n}. <br/>
                Multiply bottom numbers: ${problem.f1.d} &times; ${problem.f2.d}.
            </div>
        `;
        inputElement.value = step.expectedInput;
    } else if (step.type === 'simplify') {
        hintBox.innerHTML = `
            <div class="bg-green-100 p-3 rounded-md mb-2">
                <strong>Hint:</strong> Find the greatest common divisor and simplify the fraction.
            </div>
        `;
        inputElement.value = step.expectedInput;
    }
}
