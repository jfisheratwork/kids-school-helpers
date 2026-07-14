// Hints player for standard mode

let animState = {
    frames: [],
    index: 0,
    playing: false,
    interval: null
};

export function attachHintListener(inputElement, getProblemFunc, getStepIndexFunc) {
    if (!window.__anim_listeners_attached) {
        initAnimEvents();
        window.__anim_listeners_attached = true;
    }

    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            playNextHint(getProblemFunc(), getStepIndexFunc(), inputElement);
        }
    });
}

function initAnimEvents() {
    const speedEl = document.getElementById('anim-speed');
    if (speedEl) {
        speedEl.addEventListener('input', function() {
            const val = parseFloat(this.value);
            const display = document.getElementById('anim-speed-display');
            if (display) display.textContent = `${val.toFixed(1)}s`;
            document.documentElement.style.setProperty('--transition-duration', val + 's');
            if (animState.playing) startAnimTimer();
        });
    }

    const prevBtn = document.getElementById('btn-anim-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            animState.playing = false;
            if (animState.interval) clearInterval(animState.interval);
            if (animState.index > 0) {
                animState.index--;
                showFrame(animState.index);
            }
        });
    }

    const nextBtn = document.getElementById('btn-anim-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            animState.playing = false;
            if (animState.interval) clearInterval(animState.interval);
            if (animState.index < animState.frames.length - 1) {
                animState.index++;
                showFrame(animState.index);
            }
        });
    }
}

function showFrame(index) {
    const display = document.getElementById('visual-explanation-display');
    const counter = document.getElementById('anim-frame-counter');
    if(!display) return;
    
    let frame = animState.frames[index];
    let html = '';
    if (frame && frame.math && window.katex) {
        html = window.katex.renderToString(frame.math, { displayMode: true, throwOnError: false });
    } else if (frame && frame.html) {
        html = frame.html;
    }

    if (!document.startViewTransition) {
        display.innerHTML = html;
        if(counter) counter.textContent = `${index + 1}/${animState.frames.length}`;
        return;
    }
    
    document.startViewTransition(() => {
        display.innerHTML = html;
        if(counter) counter.textContent = `${index + 1}/${animState.frames.length}`;
    });
}

function startAnimTimer() {
    if (animState.interval) clearInterval(animState.interval);
    const speedEl = document.getElementById('anim-speed');
    const speedSeconds = speedEl ? parseFloat(speedEl.value) : 3;
    
    animState.interval = setInterval(() => {
        if (!animState.playing) return;
        if (animState.index < animState.frames.length - 1) {
            animState.index++;
            showFrame(animState.index);
        } else {
            animState.playing = false;
            clearInterval(animState.interval);
        }
    }, speedSeconds * 1000);
}

export function playNextHint(problem, stepIndex, inputElement) {
    if (!problem || stepIndex >= problem.steps.length) return;
    
    const step = problem.steps[stepIndex];
    const hintBox = document.getElementById('standard-hint-content');
    
    let hintText = '';
    
    if (step.type === 'multiply_digit' || step.type === 'multiply_digit_last') {
        let carryText = step.carryIn ? ` plus the carry of ${step.carryIn}` : '';
        let total = (step.bDigit * step.tDigit) + step.carryIn;
        hintText = `
            <div class="bg-indigo-100 p-3 rounded-md mb-2 text-indigo-900 border border-indigo-200">
                <strong>Hint:</strong> Multiply ${step.bDigit} &times; ${step.tDigit}${carryText}, which equals ${total}. 
                ${step.type === 'multiply_digit_last' ? `Since it's the last digit, enter ${total}.` : `Write the ${step.resultDigit} and we'll carry the ${step.carryOut}.`}
            </div>
        `;
    } else if (step.type === 'add_placeholder') {
        hintText = `
            <div class="bg-yellow-100 p-3 rounded-md mb-2 text-yellow-800 border border-yellow-200">
                <strong>Hint:</strong> We're on a new row for the next digit! We must put a 0 as a placeholder.
            </div>
        `;
    } else if (step.type === 'final_add_digit') {
        hintText = `
            <div class="bg-green-100 p-3 rounded-md mb-2 text-green-900 border border-green-200">
                <strong>Hint:</strong> Add the column ${step.carryIn > 0 ? `including the carry of ${step.carryIn}` : ''}. 
                ${step.carryOut > 0 ? `Write the ${step.resultDigit} and we'll carry the ${step.carryOut}.` : `The sum is ${step.resultDigit}.`}
            </div>
        `;
    } else if (step.type === 'place_decimal') {
        hintText = `
            <div class="bg-green-100 p-3 rounded-md mb-2 text-green-900 border border-green-200">
                <strong>Hint:</strong> There are ${step.decCount} decimal places in the problem, so place the decimal point ${step.decCount} spots from the right!
                The final answer is ${step.expectedInput}.
            </div>
        `;
    }
    
    hintBox.innerHTML = hintText;
    
    // Auto-fill the input but keep focus
    inputElement.value = step.expectedInput;
    inputElement.focus();
    
    // Show visual explanation if frames exist
    const explanationContainer = document.getElementById('visual-explanation-container');
    if (explanationContainer) {
        if (step.animationFrames && step.animationFrames.length > 0) {
            animState.frames = step.animationFrames;
            animState.index = 0;
            animState.playing = true;
            
            explanationContainer.classList.remove('hidden');
            setTimeout(() => explanationContainer.classList.remove('opacity-0'), 50);
            
            showFrame(0);
            startAnimTimer();
        } else {
            animState.playing = false;
            if (animState.interval) clearInterval(animState.interval);
            explanationContainer.classList.add('opacity-0');
            setTimeout(() => explanationContainer.classList.add('hidden'), 500);
        }
    }
    
    // Add a quick animation to the cell we're targeting
    if (step.targetCol) {
        const cell = document.getElementById(`pp-cell-${step.rowIndex}-${step.targetCol}`);
        if(cell) {
            cell.classList.add('bg-yellow-200');
            setTimeout(() => cell.classList.remove('bg-yellow-200'), 1000);
        }
    }
}
