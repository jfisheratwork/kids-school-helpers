let animFrames = [];
let animIndex = 0;
let animPlaying = false;
let animInterval = null;
let hideTimeout = null;

export function attachFractionsHintListener(inputElement, getProblemFn, getStepIndexFn) {
    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextFractionsHint(getProblemFn(), getStepIndexFn(), inputElement);
        }
    });

    document.getElementById('btn-anim-prev')?.addEventListener('click', () => {
        if (animPlaying) {
            animPlaying = false;
            clearInterval(animInterval);
        }
        if (animIndex > 0) {
            animIndex--;
            showFrame(animIndex);
        }
    });

    document.getElementById('btn-anim-next')?.addEventListener('click', () => {
        if (animPlaying) {
            animPlaying = false;
            clearInterval(animInterval);
        }
        if (animIndex < animFrames.length - 1) {
            animIndex++;
            showFrame(animIndex);
        }
    });

    document.getElementById('anim-speed')?.addEventListener('input', (e) => {
        document.getElementById('anim-speed-display').textContent = `${parseFloat(e.target.value).toFixed(1)}s`;
        if (animPlaying) {
            startAnimTimer();
        }
    });
}

export function playNextFractionsHint(problem, stepIndex, inputElement) {
    if (!problem || stepIndex >= problem.steps.length) return;
    
    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('fractions-hint-content');
    
    // Set hint text based on step type
    hintBox.innerHTML = `<div><strong>Hint:</strong> The expected format is: <code>${step.expectedInput}</code></div>`;
    if (step.type === 'find_lcd') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Find the smallest number both denominators multiply into.</p>`;
    } else if (step.type === 'convert') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Multiply the top and bottom of each fraction to reach the LCD.</p>`;
    } else if (step.type === 'kcf') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700"><strong>Keep, Change, Flip!</strong> Keep the first fraction, change division to multiplication, flip the second fraction.</p>`;
    } else if (step.type === 'multiply') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Multiply the numerators straight across. Multiply the denominators straight across.</p>`;
    } else if (step.type === 'simplify') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Simplify to lowest terms by dividing top and bottom by their GCD.</p>`;
    } else if (step.type === 'categorize') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">If the top number is equal to or larger than the bottom, it is <strong>improper</strong>. Otherwise it is <strong>proper</strong>.</p>`;
    } else if (step.type === 'find_lcm') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">List the multiples of both numbers until you find the smallest one they share in common.</p>`;
    } else if (step.type === 'find_gcd') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Find the largest number that divides evenly into both of these numbers.</p>`;
    } else if (step.type === 'simplify_concept') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Divide both the top and bottom number by their Greatest Common Factor (GCF) to simplify the fraction to lowest terms.</p>`;
    } else if (step.type === 'convert_mixed') {
        hintBox.innerHTML += `<p class="mt-2 text-indigo-700">Divide top by bottom. The quotient is the whole number. The remainder is the new numerator.</p>`;
    }

    inputElement.value = step.expectedInput;
    inputElement.focus();

    if (step.animationFrames && step.animationFrames.length > 0) {
        triggerVisualExplanation(step.animationFrames, true);
    }
}

export function triggerVisualExplanation(frames, autoplay = false) {
    const explanationContainer = document.getElementById('visual-explanation-container');
    const hintContainer = document.getElementById('fractions-hint-content').parentElement;

    playAnimation(frames, autoplay);

    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    explanationContainer.classList.remove('hidden');
    setTimeout(() => {
        explanationContainer.classList.remove('opacity-0');
    }, 50);

    hintContainer.classList.add('ring-4', 'ring-indigo-300', 'border-indigo-400');
    setTimeout(() => {
        hintContainer.classList.remove('ring-4', 'ring-indigo-300', 'border-indigo-400');
    }, 1000);
}

export function hideVisualExplanation() {
    if (animInterval) clearInterval(animInterval);
    animPlaying = false;
    const explanationContainer = document.getElementById('visual-explanation-container');
    explanationContainer.classList.add('opacity-0');
    
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        explanationContainer.classList.add('hidden');
    }, 500);
}

function playAnimation(frames, autoplay = false) {
    if (!frames || frames.length === 0) return;
    animFrames = frames;
    animIndex = 0;
    animPlaying = autoplay;
    
    showFrame(animIndex);
    if (animInterval) clearInterval(animInterval);
    if (animPlaying) {
        startAnimTimer();
    }
}

function applyViewTransitionNames(container, prefix = '') {
    container.querySelectorAll('[id]').forEach(el => {
        el.style.viewTransitionName = prefix + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    });
}

function showFrame(index) {
    const display = document.getElementById('visual-explanation-display');
    const counter = document.getElementById('anim-frame-counter');
    
    if (!document.startViewTransition) {
        window.MathRenderer.renderBlock(animFrames[index], display);
        applyViewTransitionNames(display, 'vis_');
        counter.textContent = `${index + 1}/${animFrames.length}`;
        return;
    }
    
    display.querySelectorAll('[id]').forEach(el => {
        el.style.viewTransitionName = 'vis_' + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    });

    document.documentElement.classList.add('slow-transition');
    const transition = document.startViewTransition(() => {
        window.MathRenderer.renderBlock(animFrames[index], display);
        applyViewTransitionNames(display, 'vis_');
        counter.textContent = `${index + 1}/${animFrames.length}`;
    });
    transition.finished.finally(() => {
        document.documentElement.classList.remove('slow-transition');
    });
}

function startAnimTimer() {
    if (animInterval) clearInterval(animInterval);
    const speedInput = document.getElementById('anim-speed');
    const speedSeconds = speedInput ? parseFloat(speedInput.value) : 3;
    document.documentElement.style.setProperty('--transition-duration', speedSeconds + 's');
    
    animInterval = setInterval(() => {
        if (!animPlaying) return;
        if (animIndex < animFrames.length - 1) {
            animIndex++;
            showFrame(animIndex);
        } else {
            animPlaying = false;
            clearInterval(animInterval);
        }
    }, speedSeconds * 1000);
}
