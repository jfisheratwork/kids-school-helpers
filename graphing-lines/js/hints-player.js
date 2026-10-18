import { state } from './state.js';
import { plotPoint, drawLineSegment } from './graph-renderer.js';
import { SharedAnimationPlayer } from '../../shared/js/animation-player.js';
import { applyExpectedStepAction, formatExpectedEquation } from './solver-ui.js';

let graphingPlayer = null;

function ensurePlayer() {
    if (!graphingPlayer) {
        graphingPlayer = new SharedAnimationPlayer({
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
            transitionPrefix: 'graph_anim_',
            onFillRequest: () => {
                applyExpectedStepAction(graphingPlayer);
            }
        });
        graphingPlayer.initEvents();
    }
    return graphingPlayer;
}

export function hideGraphingAnimation() {
    if (graphingPlayer) {
        graphingPlayer.hide(true);
    }
}

export function initHintsPlayer() {
    ensurePlayer();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            triggerHint();
        }
    });
    const btn = document.getElementById('btn-show-hint');
    if (btn) {
        btn.addEventListener('click', triggerHint);
    }
}

function buildStepFrames(eq, currentStep) {
    let mNum = 0;
    let mDen = 1;
    let b = 0;
    if (eq.type === 'slope-intercept') {
        mNum = eq.m.num;
        mDen = eq.m.den;
        b = eq.b;
    } else {
        mNum = -eq.A;
        mDen = eq.B;
        b = eq.C / eq.B;
    }

    const mTex = mDen === 1 ? `${mNum}` : `\\frac{${mNum}}{${mDen}}`;
    const bSigned = b >= 0 ? `+ \\htmlId{b}{${b}}` : `- \\htmlId{b}{${Math.abs(b)}}`;

    if (currentStep === 0) {
        if (eq.type === 'slope-intercept') {
            return {
                frames: [
                    { math: `y = \\htmlId{m}{${mTex}}x ${bSigned}` },
                    { math: `\\text{At } x = 0: \\quad y = \\textcolor{#4f46e5}{\\htmlId{b}{${b}}}` },
                    { math: `\\text{Plot } (0, \\textcolor{#16a34a}{\\htmlId{b}{\\mathbf{${b}}}})` }
                ],
                captions: [
                    'Step 1: Locate b in y = mx + b',
                    `Step 2: When x = 0, y = ${b}`,
                    `Step 3: Click (0, ${b}) on the y-axis (or press Tab again)`
                ]
            };
        }
        return {
            frames: [
                { math: `\\htmlId{a}{${eq.A}}(0) + \\htmlId{bcoef}{${eq.B}}y = \\htmlId{c}{${eq.C}}` },
                { math: `\\htmlId{bcoef}{${eq.B}}y = \\htmlId{c}{${eq.C}} \\implies y = \\textcolor{#4f46e5}{\\htmlId{b}{${b}}}` },
                { math: `\\text{Plot } (0, \\textcolor{#16a34a}{\\htmlId{b}{\\mathbf{${b}}}})` }
            ],
            captions: [
                'Step 1: Substitute x = 0 into Ax + By = C',
                `Step 2: Divide ${eq.C} by ${eq.B} to get y = ${b}`,
                `Step 3: Click (0, ${b}) on the y-axis (or press Tab again)`
            ]
        };
    }

    if (currentStep === 1) {
        const nextX = mDen;
        const nextY = b + mNum;
        return {
            frames: [
                { math: `m = \\frac{\\text{Rise}}{\\text{Run}} = \\frac{\\textcolor{#4f46e5}{\\htmlId{rn}{${mNum}}}}{\\textcolor{#4f46e5}{\\htmlId{rd}{${mDen}}}}` },
                { math: `(0 + \\textcolor{#4f46e5}{\\htmlId{rd}{${mDen}}},\\; ${b} + (\\textcolor{#4f46e5}{\\htmlId{rn}{${mNum}}}))` },
                { math: `\\text{Plot } (\\textcolor{#16a34a}{\\htmlId{rd}{\\mathbf{${nextX}}}},\\; \\textcolor{#16a34a}{\\htmlId{ny}{\\mathbf{${nextY}}}})` }
            ],
            captions: [
                `Step 1: Slope is Rise (${mNum}) over Run (${mDen})`,
                `Step 2: Start at (0, ${b}), move right ${mDen} and vertically ${mNum}`,
                `Step 3: Click (${nextX}, ${nextY}) on the grid (or press Tab again)`
            ]
        };
    }

    const expectedEq = formatExpectedEquation(eq);
    return {
        frames: [
            { math: `\\text{y-intercept } \\htmlId{b}{b = ${b}}, \\quad \\text{slope } \\htmlId{m}{m = ${mTex}}` },
            { math: `y = \\textcolor{#4f46e5}{\\htmlId{m}{${mTex}}}x ${b >= 0 ? '+' : '-'} \\textcolor{#4f46e5}{\\htmlId{b}{${Math.abs(b)}}}` },
            { math: `\\textcolor{#16a34a}{\\htmlId{eq}{\\mathbf{${expectedEq}}}}` }
        ],
        captions: [
            'Step 1: Combine the y-intercept and slope you found',
            'Step 2: Substitute m and b into the linear equation',
            `Step 3: Enter ${expectedEq} (or press Tab again to fill)`
        ]
    };
}

export function triggerHint() {
    const eq = state.currentEquation;
    if (!eq) return;
    if (state.currentMode !== 'interactive' && state.currentMode !== 'determine') return;

    const currentStep = state.currentMode === 'interactive' ? state.interactive.step : state.determine.step;
    if (currentStep > 2 || (state.currentMode === 'interactive' && currentStep > 1)) return;

    const player = ensurePlayer();
    const stepKey = `${state.currentMode}-${currentStep}`;

    // If already open for this step, advance frames manually; on the final frame, trigger fill/plot action
    if (player.isOpen() && player.currentStepKey === stepKey) {
        if (Array.isArray(player.frames) && player.index < player.frames.length - 1) {
            player.pause();
            player.index++;
            player.showFrame(player.index);
            return;
        }
        applyExpectedStepAction(player);
        return;
    }

    if (currentStep === 0) {
        const b = eq.type === 'slope-intercept' ? eq.b : eq.C / eq.B;
        const pt = plotPoint(0, b, 'hint-y-int', '#f59e0b');
        pt.classList.add('animate-ping');
        setTimeout(() => pt.remove(), 2000);
    } else if (currentStep === 1) {
        let mNum = 0;
        let mDen = 0;
        let b = 0;
        if (eq.type === 'slope-intercept') {
            mNum = eq.m.num;
            mDen = eq.m.den;
            b = eq.b;
        } else {
            mNum = -eq.A;
            mDen = eq.B;
            b = eq.C / eq.B;
        }

        const yInt = { x: 0, y: b };
        const nextPt = { x: mDen, y: b + mNum };
        const riseLine = drawLineSegment(yInt.x, yInt.y, yInt.x, nextPt.y, '#f59e0b', true);
        const runLine = drawLineSegment(yInt.x, nextPt.y, nextPt.x, nextPt.y, '#f59e0b', true);

        setTimeout(() => {
            riseLine.remove();
            runLine.remove();
        }, 3000);
    }

    const { frames, captions } = buildStepFrames(eq, currentStep);
    player.loadFrames(frames, captions, false, stepKey);
}
