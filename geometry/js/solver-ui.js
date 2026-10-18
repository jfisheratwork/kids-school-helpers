import { renderShapeSVG } from './renderer-shapes.js';
import {
    generateAreaPerimeterProblem,
    generateVolumeProblem,
    generateAnglesProblem,
    generatePythagoreanProblem
} from './generator-geometry.js';
import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';
import { ViewTransitions } from '../../shared/js/view-transitions.js';

let currentProblem = null;
let currentStepIndex = 0;
let geometryPlayer = null;

function ensurePlayer() {
    if (!geometryPlayer) {
        geometryPlayer = new SharedAnimationPlayer({
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
            transitionPrefix: 'geom_anim_',
            onFillRequest: () => {
                const stepInput = document.getElementById('geometry-step-input');
                if (currentProblem && currentProblem.steps && currentProblem.steps[currentStepIndex] && stepInput) {
                    geometryPlayer.fillInput(stepInput, currentProblem.steps[currentStepIndex].expectedInput);
                }
            }
        });
        geometryPlayer.initEvents();
    }
    return geometryPlayer;
}

export function initSolverUI() {
    ensurePlayer();

    const btnGenerate = document.getElementById('btn-generate-geometry');
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateNewProblem);
    }

    const stepInput = document.getElementById('geometry-step-input');
    if (stepInput) {
        stepInput.addEventListener('keydown', handleStepInput);
    }

    if (btnGenerate) generateNewProblem();
}

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

    const inputEl = document.getElementById('geometry-step-input');
    if (inputEl) {
        inputEl.value = '';
        inputEl.disabled = false;
    }
    document.getElementById('geometry-step-error').classList.add('hidden');
    ensurePlayer().hide(true);

    renderShapeSVG(currentProblem.shapeType, currentProblem.params, 'shape-visual-container');
    updateGuideDrawer(topic);

    renderMathState();
    updateHintContent();
}

function handleStepInput(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        showHint(e.target);
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        checkStep();
    }
}

function normalizeGeomInput(str) {
    return (str || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/×/g, '*')
        .replace(/·/g, '*');
}

function isStepInputValid(rawInput, step) {
    const norm = normalizeGeomInput(rawInput);
    if (!norm) return false;
    const expNorm = normalizeGeomInput(step.expectedInput);
    const altNorm = normalizeGeomInput(step.altInput);
    if (norm === expNorm || (altNorm && norm === altNorm)) return true;

    // Also accept the RHS of expectedInput if expectedInput has '='
    if (expNorm.includes('=')) {
        const rhs = expNorm.split('=')[1];
        if (norm === rhs) return true;
    }
    return false;
}

function checkStep() {
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;

    const inputEl = document.getElementById('geometry-step-input');
    const errorEl = document.getElementById('geometry-step-error');
    const step = currentProblem.steps[currentStepIndex];

    if (!isStepInputValid(inputEl.value, step)) {
        if (errorEl) {
            errorEl.textContent = `Not quite! Expected something like "${step.expectedInput}" (press Tab for visual hint).`;
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    ensurePlayer().hide(true);
    currentStepIndex++;

    if (currentStepIndex >= currentProblem.steps.length) {
        renderMathState();
        inputEl.disabled = true;
        inputEl.value = 'Solved!';

        const hintBox = document.getElementById('geometry-hint-content');
        if (hintBox) {
            const doneDiv = document.createElement('div');
            doneDiv.className = 'flex items-center space-x-2 text-emerald-700 font-bold';
            doneDiv.textContent = '✓ Excellent job!';
            hintBox.replaceChildren(doneDiv);
        }
    } else {
        renderMathState();
        inputEl.value = '';
        updateHintContent();
    }
}

function showHint(inputEl) {
    if (!currentProblem || currentStepIndex >= currentProblem.steps.length) return;
    const step = currentProblem.steps[currentStepIndex];
    updateHintContent();

    ensurePlayer().handleTabKey({
        stepKey: `geom-${currentStepIndex}`,
        frames: step.animationFrames || [],
        captions: step.frameCaptions || [],
        expectedAnswer: step.expectedInput,
        inputEl: inputEl || document.getElementById('geometry-step-input')
    });
}

function updateHintContent() {
    if (!currentProblem) return;

    if (currentStepIndex < currentProblem.steps.length) {
        const step = currentProblem.steps[currentStepIndex];
        const hintBox = document.getElementById('geometry-hint-content');
        if (!hintBox) return;

        const labelDiv = document.createElement('div');
        labelDiv.className = 'mb-2 text-emerald-700 font-medium';
        labelDiv.textContent = `Step ${currentStepIndex + 1} of ${currentProblem.steps.length}:`;

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'p-3 bg-white rounded border border-emerald-100 text-gray-700';
        bodyDiv.textContent = step.hint;

        hintBox.replaceChildren(labelDiv, bodyDiv);
    }
}

function renderMathState() {
    const display = document.getElementById('geometry-math-display');
    if (!display || typeof katex === 'undefined') return;

    let fullTex = currentProblem.initialTex + ' \\\\ ';
    for (let i = 0; i < currentStepIndex; i++) {
        fullTex += currentProblem.steps[i].tex + ' \\\\ ';
    }

    const renderOptsDisplay = { throwOnError: false, displayMode: true, trust: true };

    ViewTransitions.update(display, 'geom_main_', () => {
        window.katex.render(fullTex, display, renderOptsDisplay);
    });
}

function renderGuideList(contentEl, introText, items) {
    contentEl.replaceChildren();
    if (introText) {
        const p = document.createElement('p');
        p.className = 'mb-2 text-gray-800';
        p.textContent = introText;
        contentEl.appendChild(p);
    }
    const ol = document.createElement('ol');
    ol.className = 'list-decimal list-inside space-y-2.5 font-medium text-gray-800';
    items.forEach(([boldTitle, bodyText]) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = `${boldTitle}: `;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(bodyText));
        ol.appendChild(li);
    });
    contentEl.appendChild(ol);
}

function updateGuideDrawer(topic) {
    const titleEl = document.getElementById('guide-geometry-title');
    const contentEl = document.getElementById('guide-geometry-content');
    if (!titleEl || !contentEl) return;

    if (topic === 'area') {
        titleEl.textContent = 'How to Solve: Area & Perimeter';
        renderGuideList(contentEl, null, [
            ['Rectangle Area', 'Multiply the width by the height ($A = w \\times h$).'],
            ['Rectangle Perimeter', 'Add all four sides together ($P = 2w + 2h$).'],
            ['Triangle Area', 'Multiply the base by the height, then divide by 2 ($A = \\frac{1}{2}bh$).'],
            ['Circle Area', 'Multiply $\\pi$ (3.14) by the radius squared ($A = \\pi r^2$).'],
            ['Circle Circumference', 'Multiply $2\\pi$ by the radius ($C = 2\\pi r$).']
        ]);
    } else if (topic === 'volume') {
        titleEl.textContent = 'How to Solve: Volume';
        renderGuideList(contentEl, null, [
            ['Rectangular Prism', 'Multiply length, width, and height together ($V = l \\times w \\times h$).'],
            ['Cylinder', 'Find the area of the circular base ($\\pi r^2$) and multiply by the height ($V = \\pi r^2 h$).']
        ]);
    } else if (topic === 'angles') {
        titleEl.textContent = 'How to Solve: Missing Angles';
        renderGuideList(contentEl, null, [
            ['Complementary Angles', 'Two angles that form a right angle ($90^\\circ$). If one is known, subtract it from 90.'],
            ['Supplementary Angles', 'Two angles that form a straight line ($180^\\circ$). If one is known, subtract it from 180.'],
            ['Triangle Angles', 'The three inside angles of any triangle always add up to $180^\\circ$. Add the two known angles and subtract from 180.']
        ]);
    } else if (topic === 'pythagorean') {
        titleEl.textContent = 'How to Solve: Pythagorean Theorem';
        renderGuideList(
            contentEl,
            'The formula for a right triangle is $a^2 + b^2 = c^2$, where $c$ is the longest side (hypotenuse).',
            [
                ['Finding the hypotenuse ($c$)', 'Square both legs ($a^2$ and $b^2$), add them together, and take the square root.'],
                ['Finding a missing leg ($a$ or $b$)', "Square the hypotenuse and the known leg. Subtract the leg's square from the hypotenuse's square, then take the square root."]
            ]
        );
    }

    if (typeof katex !== 'undefined') {
        const textNodes = [];
        const walk = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, null, false);
        let node = walk.nextNode();
        while (node) {
            if (node.nodeValue.includes('$')) {
                textNodes.push(node);
            }
            node = walk.nextNode();
        }

        textNodes.forEach(textNode => {
            const parts = textNode.nodeValue.split(/(\$[^$]+\$)/g);
            if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                parts.forEach(part => {
                    if (part.startsWith('$') && part.endsWith('$')) {
                        const span = document.createElement('span');
                        const mathStr = part.substring(1, part.length - 1);
                        window.katex.render(mathStr, span, { throwOnError: false, displayMode: false });
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
