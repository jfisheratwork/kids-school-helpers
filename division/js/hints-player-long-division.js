import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let longDivPlayer = null;
let lastProblem = null;
let lastStepIndex = 0;

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
                const inputEl = document.getElementById('long-division-step-input');
                if (lastProblem && lastProblem.steps && lastProblem.steps[lastStepIndex] && inputEl) {
                    longDivPlayer.fillInput(inputEl, lastProblem.steps[lastStepIndex].expectedInput);
                }
            }
        });
        longDivPlayer.initEvents();
    }
    return longDivPlayer;
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

export function playNextHint(problem, stepIndex) {
    if (!problem || stepIndex >= problem.steps.length) return;
    lastProblem = problem;
    lastStepIndex = stepIndex;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('long-division-hint-content');
    const inputElement = document.getElementById('long-division-step-input');

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

    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `ld-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer: step.expectedInput,
        inputEl: inputElement
    });
}

export function resetHintPlayer() {
    if (longDivPlayer) {
        longDivPlayer.hide(true);
    } else {
        ensurePlayer().hide(true);
    }
}
