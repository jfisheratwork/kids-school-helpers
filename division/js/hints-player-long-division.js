import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let longDivPlayer = null;
let lastProblem = null;
let lastStepIndex = 0;
let activeInputEl = null;
let finalInputRef = null;

function ensurePlayer() {
    if (!longDivPlayer) {
        longDivPlayer = new SharedAnimationPlayer({
            containerId: 'visual-explanation-container',
            displayId: 'visual-explanation-display',
            captionId: 'anim-frame-caption',
            speedId: 'anim-speed',
            speedDisplayId: 'anim-speed-display',
            prevBtnId: 'btn-anim-prev',
            nextBtnId: 'btn-anim-next',
            playBtnId: 'btn-anim-play',
            fillBtnId: 'btn-anim-fill',
            counterId: 'anim-frame-counter',
            transitionPrefix: 'div_anim_',
            onFillRequest: () => {
                if (!lastProblem || !lastProblem.steps || !lastProblem.steps[lastStepIndex]) return;
                const targetInput = activeInputEl || document.getElementById('long-division-step-input');
                if (!targetInput) return;

                const isFinalTarget = targetInput === finalInputRef || targetInput.id === 'long-division-final-input';
                const expectedVal = isFinalTarget
                    ? String(lastProblem.quotientStr)
                    : lastProblem.steps[lastStepIndex].expectedInput;
                longDivPlayer.fillInput(targetInput, expectedVal);
            }
        });
        longDivPlayer.initEvents();
    }
    return longDivPlayer;
}

export function attachLongDivisionHintListener(stepInputEl, finalInputEl, getProblemFunc, getStepIndexFunc) {
    activeInputEl = stepInputEl;
    finalInputRef = finalInputEl;
    ensurePlayer();

    const bindTab = (inputEl) => {
        if (!inputEl) return;
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                playNextHint(getProblemFunc(), getStepIndexFunc(), inputEl);
            }
        });
    };

    bindTab(stepInputEl);
    bindTab(finalInputEl);
}

function renderHintCard(hintBox, colorScheme, textContent) {
    if (!hintBox) return;
    const card = document.createElement('div');
    const classes = {
        indigo: 'bg-indigo-100 p-3 rounded-md mb-2 text-indigo-900 border border-indigo-200',
        yellow: 'bg-yellow-100 p-3 rounded-md mb-2 text-yellow-800 border border-yellow-200',
        red: 'bg-red-100 p-3 rounded-md mb-2 text-red-900 border border-red-200',
        blue: 'bg-blue-100 p-3 rounded-md mb-2 text-blue-900 border border-blue-200'
    };
    card.className = classes[colorScheme] || classes.indigo;
    const strong = document.createElement('strong');
    strong.textContent = 'Hint: ';
    card.appendChild(strong);
    card.appendChild(document.createTextNode(textContent));
    hintBox.replaceChildren(card);
}

export function playNextHint(problem, stepIndex, sourceInput) {
    if (!problem || stepIndex >= problem.steps.length) return;
    lastProblem = problem;
    lastStepIndex = stepIndex;
    if (sourceInput) activeInputEl = sourceInput;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('long-division-hint-content');
    const targetInput = activeInputEl || document.getElementById('long-division-step-input');

    if (step.type === 'divide_digit') {
        renderHintCard(
            hintBox,
            'indigo',
            `We need to divide ${step.workingNum} by ${step.divisor}. ${step.divisor} goes into ${step.workingNum}, ${step.qDigit} times!`
        );
    } else if (step.type === 'multiply_back') {
        renderHintCard(
            hintBox,
            'yellow',
            `Multiply the quotient digit (${step.qDigit}) by the divisor (${step.divisor}): ${step.qDigit} × ${step.divisor} = ${step.multBack}.`
        );
    } else if (step.type === 'subtract_down') {
        renderHintCard(
            hintBox,
            'red',
            `Subtract the product (${step.multBack}) from the working number (${step.workingNum}): ${step.workingNum} - ${step.multBack} = ${step.remainder}.`
        );
    } else if (step.type === 'bring_down') {
        renderHintCard(
            hintBox,
            'blue',
            `Bring down the next digit of the dividend, which is ${step.nextDigit}.`
        );
    }

    const isFinalTarget = targetInput && (targetInput === finalInputRef || targetInput.id === 'long-division-final-input');
    const expectedAnswer = isFinalTarget ? String(problem.quotientStr) : step.expectedInput;

    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `ld-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer,
        inputEl: targetInput
    });
}

export function resetHintPlayer() {
    if (longDivPlayer) {
        longDivPlayer.hide(true);
    } else {
        ensurePlayer().hide(true);
    }
}
