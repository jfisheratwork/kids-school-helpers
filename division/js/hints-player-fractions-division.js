import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let fractionsDivPlayer = null;
let currentProblemGetter = null;
let currentStepIndexGetter = null;
let activeInputEl = null;

function ensurePlayer() {
    if (!fractionsDivPlayer) {
        fractionsDivPlayer = new SharedAnimationPlayer({
            containerId: 'frac-visual-explanation-container',
            displayId: 'frac-visual-explanation-display',
            captionId: 'frac-anim-frame-caption',
            speedId: 'frac-anim-speed',
            speedDisplayId: 'frac-anim-speed-display',
            prevBtnId: 'frac-btn-anim-prev',
            nextBtnId: 'frac-btn-anim-next',
            playBtnId: 'frac-btn-anim-play',
            fillBtnId: 'frac-btn-anim-fill',
            counterId: 'frac-anim-frame-counter',
            transitionPrefix: 'div_frac_anim_',
            onFillRequest: () => {
                if (!currentProblemGetter || !currentStepIndexGetter || !activeInputEl) return;
                const prob = currentProblemGetter();
                const idx = currentStepIndexGetter();
                if (prob && prob.steps && prob.steps[idx]) {
                    fractionsDivPlayer.fillInput(activeInputEl, prob.steps[idx].expectedInput);
                }
            }
        });
        fractionsDivPlayer.initEvents();
    }
    return fractionsDivPlayer;
}

export function attachFractionsHintListener(inputElement, getProblemFunc, getStepIndexFunc) {
    currentProblemGetter = getProblemFunc;
    currentStepIndexGetter = getStepIndexFunc;
    activeInputEl = inputElement;
    ensurePlayer();

    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextFractionsHint(getProblemFunc(), getStepIndexFunc(), inputElement);
        }
    });
}

export function hideFractionsDivisionAnimation() {
    if (fractionsDivPlayer) {
        fractionsDivPlayer.hide(true);
    }
}

export function playNextFractionsHint(problem, stepIndex, inputElement) {
    if (!problem || stepIndex >= problem.steps.length) return;
    activeInputEl = inputElement;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('fractions-hint-content');
    if (hintBox) {
        const card = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = 'Hint: ';
        card.appendChild(strong);

        if (step.type === 'keep_change_flip') {
            card.className = 'bg-blue-100 p-3 rounded-md mb-2 text-blue-900 border border-blue-200';
            card.appendChild(
                document.createTextNode(
                    `Keep the first fraction (${problem.f1.n}/${problem.f1.d}), change ÷ to ×, and flip the second fraction (${problem.f2.n}/${problem.f2.d} → ${problem.f2Flipped.n}/${problem.f2Flipped.d}).`
                )
            );
        } else if (step.type === 'multiply') {
            card.className = 'bg-blue-100 p-3 rounded-md mb-2 text-blue-900 border border-blue-200';
            card.appendChild(
                document.createTextNode(
                    `Multiply top numbers: ${problem.f1.n} × ${problem.f2Flipped.n}. Multiply bottom numbers: ${problem.f1.d} × ${problem.f2Flipped.d}.`
                )
            );
        } else if (step.type === 'simplify') {
            card.className = 'bg-green-100 p-3 rounded-md mb-2 text-green-900 border border-green-200';
            card.appendChild(document.createTextNode('Find the greatest common divisor and reduce the fraction.'));
        }
        hintBox.replaceChildren(card);
    }

    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `div-frac-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer: step.expectedInput,
        inputEl: inputElement
    });
}
