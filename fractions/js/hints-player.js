import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';

const player = new SharedAnimationPlayer({
    pulseTargetId: 'hint-system-container'
});

function getStepHintDescription(step) {
    switch (step.type) {
        case 'find_lcd':
            return 'Find the smallest number both denominators multiply into.';
        case 'convert':
            return 'Multiply the top and bottom of each fraction to reach the LCD.';
        case 'operate':
            return 'Add or subtract the numerators and keep the common denominator.';
        case 'kcf':
            return 'Keep the first fraction, change division to multiplication, and flip the second fraction.';
        case 'multiply':
            return 'Multiply the numerators straight across. Multiply the denominators straight across.';
        case 'simplify':
            return 'Simplify to lowest terms by dividing top and bottom by their GCF (or convert to a mixed number).';
        case 'categorize':
            return 'If the top number is equal to or larger than the bottom, it is improper. Otherwise it is proper.';
        case 'find_lcm':
            return 'List the multiples of both numbers until you find the smallest one they share in common.';
        case 'find_gcd':
            return 'Find the largest number that divides evenly into both numbers.';
        case 'simplify_concept':
            return 'Divide both the top and bottom number by their Greatest Common Factor (GCF).';
        case 'convert_mixed':
            return 'Divide top by bottom. The quotient is the whole number and the remainder is the new numerator.';
        default:
            return '';
    }
}

export function attachFractionsHintListener(stepInput, finalInput, getProblemFn, getStepIndexFn) {
    player.bindEvents();

    const bindTab = (el) => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                playNextFractionsHint(getProblemFn(), getStepIndexFn(), stepInput, finalInput, el);
            }
        });
    };

    bindTab(stepInput);
    bindTab(finalInput);
}

export function playNextFractionsHint(problem, stepIndex, stepInput, finalInput, sourceInput) {
    if (!problem || stepIndex >= problem.steps.length) return;

    const isFinalStep = stepIndex === problem.steps.length - 1;
    const targetFinal = isFinalStep || (sourceInput && finalInput && sourceInput === finalInput);
    const step = problem.steps[stepIndex];
    const finalStep = problem.steps[problem.steps.length - 1];
    const hintBox = document.getElementById('fractions-hint-content');

    const fillFn = () => {
        if (targetFinal && finalInput) {
            SharedAnimationPlayer.fillInputElement(finalInput, finalStep.expectedInput);
        } else if (stepInput) {
            SharedAnimationPlayer.fillInputElement(stepInput, step.expectedInput);
        }
    };

    player.handleTabKey({
        stepKey: `fractions-step-${stepIndex}-${step.type}`,
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

export function triggerVisualExplanation(frames, autoplay = false, captions = []) {
    player.play(frames, { autoplay, captions });
}

export function hideVisualExplanation() {
    player.hide();
}
