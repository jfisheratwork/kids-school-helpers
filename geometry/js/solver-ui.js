import { renderShapeSVG } from './renderer-shapes.js';
import { generateAreaPerimeterProblem, generateVolumeProblem, generateAnglesProblem, generatePythagoreanProblem } from './generator-geometry.js';

export function initSolverUI() {
    const btnGenerate = document.getElementById('btn-generate-geometry');
    if(btnGenerate) {
        btnGenerate.addEventListener('click', generateNewProblem);
    }

    const stepInput = document.getElementById('geometry-step-input');
    if(stepInput) {
        stepInput.addEventListener('keydown', handleStepInput);
    }

    // Hint player controls
    document.getElementById('btn-anim-prev')?.addEventListener('click', playPrevHint);
    document.getElementById('btn-anim-next')?.addEventListener('click', playNextHint);
    document.getElementById('anim-speed')?.addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('anim-speed-display').textContent = val + 's';
        document.documentElement.style.setProperty('--transition-duration', val + 's');
    });

    // Generate first problem
    if(btnGenerate) generateNewProblem();
}

let currentProblem = null;
let currentStepIndex = 0;

function generateNewProblem() {
    const topic = document.getElementById('config-topic').value;
    
    if (topic === 'area') {
        currentProblem = generateAreaPerimeterProblem();
    } else if (topic === 'volume') {
        currentProblem = generateVolumeProblem();
    } else if (topic === 'angles') {
        currentProblem = generateAnglesProblem();
    } else if (topic === 'pythagorean') {
        currentProblem = generatePythagoreanProblem();
    }

    currentStepIndex = 0;
    
    // Reset UI
    document.getElementById('geometry-step-input').value = '';
    document.getElementById('geometry-step-input').disabled = false;
    document.getElementById('geometry-step-error').classList.add('hidden');
    document.getElementById('visual-explanation-container').classList.add('hidden', 'opacity-0');
    
    // Draw SVG
    renderShapeSVG(currentProblem.shapeType, currentProblem.params, 'shape-visual-container');
    
    // Update guide drawer
    updateGuideDrawer(topic);
    
    // Render initial math state
    renderMathState();
    updateHintContent();
}

function handleStepInput(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        showHint();
        return;
    }
    
    if (e.key === 'Enter') {
        e.preventDefault();
        checkStep();
    }
}

function checkStep() {
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;
    
    // We are just simulating correctness by advancing the step unconditionally for this demo
    // Real implementation would parse the input text to see if it matches the currentStep.tex
    currentStepIndex++;
    
    if (currentStepIndex >= currentProblem.steps.length) {
        // Solved
        renderMathState();
        document.getElementById('geometry-step-input').disabled = true;
        document.getElementById('geometry-step-input').value = 'Solved!';
        
        document.getElementById('geometry-hint-content').innerHTML = `
            <div class="flex items-center space-x-2 text-emerald-700 font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Excellent job!</span>
            </div>
        `;
    } else {
        renderMathState();
        document.getElementById('geometry-step-input').value = '';
        updateHintContent();
    }
}

function showHint() {
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;
    
    const container = document.getElementById('visual-explanation-container');
    container.classList.remove('hidden');
    // slight delay for transition
    setTimeout(() => {
        container.classList.remove('opacity-0');
    }, 50);
    
    updateHintContent();
}

function updateHintContent() {
    if (!currentProblem) return;
    
    if (currentStepIndex < currentProblem.steps.length) {
        const step = currentProblem.steps[currentStepIndex];
        document.getElementById('geometry-hint-content').innerHTML = `
            <div class="mb-2 text-emerald-700 font-medium">Next Step:</div>
            <div class="p-3 bg-white rounded border border-emerald-100 text-gray-700">${step.hint}</div>
        `;
        
        document.getElementById('anim-frame-counter').textContent = `${currentStepIndex + 1}/${currentProblem.steps.length}`;
    }
}

function renderMathState() {
    const display = document.getElementById('geometry-math-display');
    const visual = document.getElementById('visual-explanation-display');
    
    if (typeof katex === 'undefined') return;
    
    // The main display just stacks all completed steps
    let fullTex = currentProblem.initialTex + ' \\\\ ';
    for (let i = 0; i < currentStepIndex; i++) {
        fullTex += currentProblem.steps[i].tex + ' \\\\ ';
    }
    
    const renderOptsDisplay = { throwOnError: false, displayMode: true, trust: true };
    const renderOptsInline = { throwOnError: false, displayMode: false, trust: true };
    
    // We use ViewTransitions for the visual explanation box
    if (document.startViewTransition) {
        document.documentElement.classList.add('slow-transition');
        document.startViewTransition(() => {
            display.innerHTML = katex.renderToString(fullTex, renderOptsDisplay);
            
            if (currentStepIndex < currentProblem.steps.length) {
                visual.innerHTML = katex.renderToString(currentProblem.steps[currentStepIndex].tex, renderOptsInline);
            }
        });
    } else {
        display.innerHTML = katex.renderToString(fullTex, renderOptsDisplay);
        if (currentStepIndex < currentProblem.steps.length) {
            visual.innerHTML = katex.renderToString(currentProblem.steps[currentStepIndex].tex, renderOptsInline);
        }
    }
}

function playPrevHint() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderMathState();
        updateHintContent();
    }
}

function playNextHint() {
    if (currentProblem && currentStepIndex < currentProblem.steps.length - 1) {
        currentStepIndex++;
        renderMathState();
        updateHintContent();
    }
}

function updateGuideDrawer(topic) {
    const titleEl = document.getElementById('guide-geometry-title');
    const contentEl = document.getElementById('guide-geometry-content');
    if (!titleEl || !contentEl) return;
    
    if (topic === 'area') {
        titleEl.textContent = "How to Solve: Area & Perimeter";
        contentEl.innerHTML = `
            <ol class="list-decimal list-inside space-y-2.5 font-medium text-gray-800">
                <li><strong>Rectangle Area:</strong> Multiply the width by the height ($A = w \\times h$).</li>
                <li><strong>Rectangle Perimeter:</strong> Add all four sides together ($P = 2w + 2h$).</li>
                <li><strong>Triangle Area:</strong> Multiply the base by the height, then divide by 2 ($A = \\frac{1}{2}bh$).</li>
                <li><strong>Circle Area:</strong> Multiply $\\pi$ (3.14) by the radius squared ($A = \\pi r^2$).</li>
                <li><strong>Circle Circumference:</strong> Multiply $2\\pi$ by the radius ($C = 2\\pi r$).</li>
            </ol>
        `;
    } else if (topic === 'volume') {
        titleEl.textContent = "How to Solve: Volume";
        contentEl.innerHTML = `
            <ol class="list-decimal list-inside space-y-2.5 font-medium text-gray-800">
                <li><strong>Rectangular Prism:</strong> Multiply length, width, and height together ($V = l \\times w \\times h$).</li>
                <li><strong>Cylinder:</strong> Find the area of the circular base ($\\pi r^2$) and multiply by the height ($V = \\pi r^2 h$).</li>
            </ol>
        `;
    } else if (topic === 'angles') {
        titleEl.textContent = "How to Solve: Missing Angles";
        contentEl.innerHTML = `
            <ol class="list-decimal list-inside space-y-2.5 font-medium text-gray-800">
                <li><strong>Complementary Angles:</strong> Two angles that form a right angle ($90^\\circ$). If one is known, subtract it from 90.</li>
                <li><strong>Supplementary Angles:</strong> Two angles that form a straight line ($180^\\circ$). If one is known, subtract it from 180.</li>
                <li><strong>Triangle Angles:</strong> The three inside angles of any triangle always add up to $180^\\circ$. Add the two known angles and subtract from 180.</li>
            </ol>
        `;
    } else if (topic === 'pythagorean') {
        titleEl.textContent = "How to Solve: Pythagorean Theorem";
        contentEl.innerHTML = `
            <p class="mb-2 text-gray-800">The formula for a right triangle is <strong>$a^2 + b^2 = c^2$</strong>, where $c$ is the longest side (hypotenuse).</p>
            <ol class="list-decimal list-inside space-y-2.5 font-medium text-gray-800">
                <li><strong>Finding the hypotenuse ($c$):</strong> Square both legs ($a^2$ and $b^2$), add them together, and take the square root.</li>
                <li><strong>Finding a missing leg ($a$ or $b$):</strong> Square the hypotenuse and the known leg. Subtract the leg's square from the hypotenuse's square, then take the square root.</li>
            </ol>
        `;
    }
    
    // Render KaTeX inside the drawer
    if (typeof katex !== 'undefined') {
        const textNodes = [];
        const walk = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walk.nextNode()) {
            if (node.nodeValue.includes('$')) {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const parts = textNode.nodeValue.split(/(\$[^$]+\$)/g);
            if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                parts.forEach(part => {
                    if (part.startsWith('$') && part.endsWith('$')) {
                        const span = document.createElement('span');
                        const mathStr = part.substring(1, part.length - 1);
                        katex.render(mathStr, span, { throwOnError: false, displayMode: false });
                        fragment.appendChild(span);
                    } else {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }
}
