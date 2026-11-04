import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

const player = new SharedAnimationPlayer({
    pulseTargetId: 'hint-system-container'
});

function getStepHintDescription(step) {
    switch (step.type) {
        case 'identify_place_value':
            return `Count the digits after the decimal point (${step.decimalPlaces}) to find the power-of-10 denominator (${step.placeValueDenom}).`;
        case 'unsimplified_fraction':
            return `Write the decimal digits (${step.rawNumerator}) over the place-value denominator (${step.placeValueDenom}).`;
        case 'find_gcf':
            return `Find the Greatest Common Factor (GCF) that divides evenly into both ${step.rawNumerator} and ${step.placeValueDenom}.`;
        case 'simplify_fraction':
            return `Divide both top (${step.rawNumerator}) and bottom (${step.placeValueDenom}) by the GCF (${step.gcf}) to simplify.`;
        default:
            return '';
    }
}

export function attachD2FHintListener(stepInput, finalInput, getProblemFn, getStepIndexFn) {
    player.bindEvents();

    const bindTab = (el) => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                playNextD2FHint(getProblemFn(), getStepIndexFn(), stepInput, finalInput, el);
            }
        });
    };

    bindTab(stepInput);
    bindTab(finalInput);
}

export function playNextD2FHint(problem, stepIndex, stepInput, finalInput, sourceInput) {
    if (!problem || stepIndex >= problem.steps.length) return;

    const isFinalStep = stepIndex === problem.steps.length - 1;
    const targetFinal = isFinalStep || (sourceInput && finalInput && sourceInput === finalInput);
    const step = problem.steps[stepIndex];
    const finalStep = problem.steps[problem.steps.length - 1];
    const hintBox = document.getElementById('d2f-hint-content');

    const fillFn = () => {
        if (targetFinal && finalInput) {
            SharedAnimationPlayer.fillInputElement(finalInput, finalStep.expectedInput);
        } else if (stepInput) {
            SharedAnimationPlayer.fillInputElement(stepInput, step.expectedInput);
        }
    };

    player.handleTabKey({
        stepKey: `d2f-step-${stepIndex}-${step.type}`,
        frames: step.animationFrames || [step.tex],
        captions: step.frameCaptions || [],
        autoplay: false,
        fillInputFn: fillFn,
        onOpen: () => {
            if (!hintBox) return;
            hintBox.replaceChildren();

            const descP = document.createElement('p');
            descP.className = 'text-indigo-800 font-medium';
            descP.textContent = getStepHintDescription(step);
            hintBox.appendChild(descP);

            const formatDiv = document.createElement('div');
            formatDiv.className = 'mt-2 text-xs text-indigo-600 bg-white/80 border border-indigo-100 rounded px-2.5 py-1.5';
            formatDiv.textContent = 'Press Next → or Tab to advance frames, then press Tab on the final frame (or click Fill Answer) to populate the box.';
            hintBox.appendChild(formatDiv);
        }
    });
}

export function hideD2FVisualExplanation() {
    player.hide();
}
