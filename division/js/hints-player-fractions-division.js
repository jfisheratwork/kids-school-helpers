// Hints player for fraction division mode

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
    if (!hintBox) return;
    
    if (step.type === 'keep_change_flip') {
        hintBox.innerHTML = `
            <div class="bg-blue-100 p-3 rounded-md mb-2">
                <strong>Hint:</strong> Keep the first fraction (${problem.f1.toTeX()}), change &divide; to &times;, and flip the second fraction (${problem.f2.toTeX()} &rarr; ${problem.f2Flipped.toTeX()}).
            </div>
        `;
        inputElement.value = step.expectedInput;
    } else if (step.type === 'multiply') {
        hintBox.innerHTML = `
            <div class="bg-blue-100 p-3 rounded-md mb-2">
                <strong>Hint:</strong> Multiply top numbers: ${problem.f1.n} &times; ${problem.f2Flipped.n}. <br/>
                Multiply bottom numbers: ${problem.f1.d} &times; ${problem.f2Flipped.d}.
            </div>
        `;
        inputElement.value = step.expectedInput;
    } else if (step.type === 'simplify') {
        hintBox.innerHTML = `
            <div class="bg-green-100 p-3 rounded-md mb-2">
                <strong>Hint:</strong> Find the greatest common divisor and reduce the fraction.
            </div>
        `;
        inputElement.value = step.expectedInput;
    }
}
