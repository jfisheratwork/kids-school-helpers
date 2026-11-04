import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let f2dPlayer = null;
let lastProblem = null;
let lastStepIndex = 0;
let activeInputEl = null;
let finalInputRef = null;

function ensurePlayer() {
    if (!f2dPlayer) {
        f2dPlayer = new SharedAnimationPlayer({
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
            transitionPrefix: 'f2d_anim_',
            onFillRequest: () => {
                if (!lastProblem || !lastProblem.steps || !lastProblem.steps[lastStepIndex]) return;
                const targetInput = activeInputEl || document.getElementById('f2d-step-input');
                if (!targetInput) return;

                const isFinalTarget = targetInput === finalInputRef || targetInput.id === 'f2d-final-input';
                const expectedVal = isFinalTarget
                    ? String(lastProblem.finalAnswerStr || lastProblem.quotientStr)
                    : lastProblem.steps[lastStepIndex].expectedInput;
                f2dPlayer.fillInput(targetInput, expectedVal);
            }
        });
        f2dPlayer.initEvents();
    }
    return f2dPlayer;
}

export function attachF2DHintListener(stepInputEl, finalInputEl, getProblemFunc, getStepIndexFunc) {
    activeInputEl = stepInputEl;
    finalInputRef = finalInputEl;
    ensurePlayer();

    const bindTab = (inputEl) => {
        if (!inputEl) return;
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                playNextF2DHint(getProblemFunc(), getStepIndexFunc(), inputEl);
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

export function playNextF2DHint(problem, stepIndex, sourceInput) {
    if (!problem || stepIndex >= problem.steps.length) return;
    lastProblem = problem;
    lastStepIndex = stepIndex;
    if (sourceInput) activeInputEl = sourceInput;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('f2d-hint-content');
    const targetInput = activeInputEl || document.getElementById('f2d-step-input');

    if (step.type === 'divide_whole') {
        renderHintCard(
            hintBox,
            'indigo',
            `Check how many times ${step.divisor} goes into ${step.workingNum} before the decimal point: ${step.qDigit} times. Type ${step.qDigit} to place ${step.qDigit}. in the quotient.`
        );
    } else if (step.type === 'bring_down_zero') {
        renderHintCard(
            hintBox,
            'blue',
            `Annex and bring down the trailing 0 next to ${step.prevRemainder} to form the new working number ${step.newWorkingNum}.`
        );
    } else if (step.type === 'divide_digit') {
        renderHintCard(
            hintBox,
            'indigo',
            `Divide ${step.workingNum} by ${step.divisor}: ${step.divisor} goes into ${step.workingNum} ${step.qDigit} times.`
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
            `Subtract ${step.multBack} from ${step.workingNum}: ${step.workingNum} - ${step.multBack} = ${step.remainder}.`
        );
    } else if (step.type === 'combine_whole_and_sign') {
        renderHintCard(
            hintBox,
            'indigo',
            `Combine ${step.wholePart > 0 ? `whole number ${step.wholePart} and ` : ''}long-division decimal ${step.longDivQuotient}${step.isNegative ? ' with the negative (-) sign' : ''}: ${step.finalAnswerStr}.`
        );
    }

    const isFinalTarget = targetInput && (targetInput === finalInputRef || targetInput.id === 'f2d-final-input');
    const expectedAnswer = isFinalTarget
        ? String(problem.finalAnswerStr || problem.quotientStr)
        : step.expectedInput;

    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `f2d-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer,
        inputEl: targetInput
    });
}

export function resetF2DHintPlayer() {
    if (f2dPlayer) {
        f2dPlayer.hide(true);
    } else {
        ensurePlayer().hide(true);
    }
}
