import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

let fractionsPlayer = null;
let currentProblemGetter = null;
let currentStepIndexGetter = null;
let stepInputEl = null;
let finalInputEl = null;
let lastSourceInputEl = null;

function ensurePlayer() {
    if (!fractionsPlayer) {
        fractionsPlayer = new SharedAnimationPlayer({
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
            transitionPrefix: 'mult_frac_anim_',
            onFillRequest: () => {
                if (!currentProblemGetter || !currentStepIndexGetter) return;
                const prob = currentProblemGetter();
                const idx = currentStepIndexGetter();
                if (!prob || !prob.steps || !prob.steps[idx]) return;
                const isFinal = idx === prob.steps.length - 1;
                const useFinal = isFinal || (lastSourceInputEl && finalInputEl && lastSourceInputEl === finalInputEl);
                if (useFinal && finalInputEl) {
                    fractionsPlayer.fillInput(finalInputEl, prob.steps[prob.steps.length - 1].expectedInput);
                } else if (stepInputEl) {
                    fractionsPlayer.fillInput(stepInputEl, prob.steps[idx].expectedInput);
                }
            }
        });
        fractionsPlayer.initEvents();
    }
    return fractionsPlayer;
}

export function attachFractionsHintListener(stepInput, finalInput, getProblemFunc, getStepIndexFunc) {
    currentProblemGetter = getProblemFunc;
    currentStepIndexGetter = getStepIndexFunc;
    stepInputEl = stepInput;
    finalInputEl = finalInput;
    ensurePlayer();

    const bindTab = (el) => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                playNextFractionsHint(getProblemFunc(), getStepIndexFunc(), stepInput, finalInput, el);
            }
        });
    };

    bindTab(stepInput);
    bindTab(finalInput);
}

export function hideFractionsAnimation() {
    if (fractionsPlayer) {
        fractionsPlayer.hide(true);
    }
}

export function playNextFractionsHint(problem, stepIndex, stepInput, finalInput, sourceInput) {
    if (!problem || stepIndex >= problem.steps.length) return;
    stepInputEl = stepInput;
    finalInputEl = finalInput;
    lastSourceInputEl = sourceInput || stepInput;

    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('fractions-hint-content');

    if (hintBox) {
        const card = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = 'Hint: ';
        card.appendChild(strong);

        if (step.type === 'multiply') {
            card.className = 'bg-blue-100 p-3 rounded-md mb-2 text-blue-900 border border-blue-200';
            card.appendChild(
                document.createTextNode(
                    `Multiply top numbers: ${problem.f1.n} × ${problem.f2.n}. Multiply bottom numbers: ${problem.f1.d} × ${problem.f2.d}.`
                )
            );
        } else if (step.type === 'simplify') {
            card.className = 'bg-green-100 p-3 rounded-md mb-2 text-green-900 border border-green-200';
            card.appendChild(document.createTextNode('Find the greatest common divisor and simplify the fraction.'));
        }
        hintBox.replaceChildren(card);
    }

    const isFinalStep = stepIndex === problem.steps.length - 1;
    const useFinal = isFinalStep || (sourceInput && finalInput && sourceInput === finalInput);
    const player = ensurePlayer();
    player.handleTabKey({
        stepKey: `frac-${stepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        autoplay: false,
        fillInputFn: () => {
            if (useFinal && finalInput) {
                player.fillInput(finalInput, problem.steps[problem.steps.length - 1].expectedInput);
            } else if (stepInput) {
                player.fillInput(stepInput, step.expectedInput);
            }
        }
    });
}
