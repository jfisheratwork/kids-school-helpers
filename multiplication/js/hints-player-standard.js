import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let standardPlayer = null;
let currentProblemGetter = null;
let currentStepIndexGetter = null;
let activeInputEl = null;

function ensurePlayer() {
    if (!standardPlayer) {
        standardPlayer = new SharedAnimationPlayer({
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
            transitionPrefix: 'mult_anim_',
            onFillRequest: () => {
                if (!currentProblemGetter || !currentStepIndexGetter || !activeInputEl) return;
                const prob = currentProblemGetter();
                const idx = currentStepIndexGetter();
                if (prob && prob.steps && prob.steps[idx]) {
                    standardPlayer.fillInput(activeInputEl, prob.steps[idx].expectedInput);
                }
            }
        });
        standardPlayer.initEvents();
    }
    return standardPlayer;
}

export function attachHintListener(inputElement, getProblemFunc, getStepIndexFunc) {
    currentProblemGetter = getProblemFunc;
    currentStepIndexGetter = getStepIndexFunc;
    activeInputEl = inputElement;
    ensurePlayer();

    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextHint(getProblemFunc(), getStepIndexFunc(), inputElement);
        }
    });
}

export function hideStandardAnimation() {
    if (standardPlayer) {
        standardPlayer.hide(true);
    }
}

function renderHintCard(hintBox, colorScheme, textContent) {
    if (!hintBox) return;
    const card = document.createElement('div');
    const classes = {
        indigo: 'bg-indigo-100 p-3 rounded-md mb-2 text-indigo-900 border border-indigo-200',
        yellow: 'bg-yellow-100 p-3 rounded-md mb-2 text-yellow-800 border border-yellow-200',
        green: 'bg-green-100 p-3 rounded-md mb-2 text-green-900 border border-green-200'
    };
    card.className = classes[colorScheme] || classes.indigo;
    const strong = document.createElement('strong');
    strong.textContent = 'Hint: ';
    card.appendChild(strong);
    card.appendChild(document.createTextNode(textContent));
    hintBox.replaceChildren(card);
}

export function playNextHint(problem, stepIndex, inputElement) {
    if (!problem || stepIndex >= problem.steps.length) return;
    activeInputEl = inputElement;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('standard-hint-content');

    if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
        const carryText = step.carryIn ? ` plus the carry of ${step.carryIn}` : '';
        const total = (step.bDigit * step.tDigit) + step.carryIn;
        const suffix = step.type === 'multiply_digit_last'
            ? `Since it's the last digit, enter ${total}.`
            : `Write the ${step.resultDigit} and we'll carry the ${step.carryOut}.`;
        renderHintCard(hintBox, 'indigo', `Multiply ${step.bDigit} × ${step.tDigit}${carryText}, which equals ${total}. ${suffix}`);
    } else if (step.type === 'add_placeholder') {
        renderHintCard(hintBox, 'yellow', "We're on a new row for the next digit! We must put a 0 as a placeholder.");
    } else if (step.type === 'final_add_digit') {
        const carryPhrase = step.carryIn > 0 ? ` including the carry of ${step.carryIn}` : '';
        const suffix = step.carryOut > 0
            ? `Write the ${step.resultDigit} and we'll carry the ${step.carryOut}.`
            : `The sum is ${step.resultDigit}.`;
        renderHintCard(hintBox, 'green', `Add the column${carryPhrase}. ${suffix}`);
    } else if (step.type === 'place_decimal') {
        renderHintCard(
            hintBox,
            'green',
            `There are ${step.decCount} decimal places in the problem, so place the decimal point ${step.decCount} spots from the right! The final answer is ${step.expectedInput}.`
        );
    }

    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `std-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer: step.expectedInput,
        inputEl: inputElement
    });

    if (step.targetCol) {
        const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol + 1}`);
        if (cell) {
            cell.classList.add('bg-yellow-200');
            setTimeout(() => cell.classList.remove('bg-yellow-200'), 1000);
        }
    }
}
