import { state } from './state.js';
import { plotPoint, toAlgebraic, drawInfiniteLine } from './graph-renderer.js';
import { hideGraphingAnimation } from './hints-player.js';

export function initSolverUI() {
    const svgGraph = document.getElementById('graph-container').querySelector('svg');
    if (svgGraph) {
        svgGraph.addEventListener('click', handleGraphClick);
    }

    const eqInput = document.getElementById('equation-input');
    if (eqInput) {
        eqInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkDeterminedEquation(e.target.value);
            }
        });
    }

    state.subscribe(updateUI);
}

export function formatExpectedEquation(eq) {
    if (!eq) return '';
    if (eq.type === 'slope-intercept') {
        let mStr = '';
        if (eq.m.den === 1) {
            if (eq.m.num === 1) mStr = 'x';
            else if (eq.m.num === -1) mStr = '-x';
            else mStr = `${eq.m.num}x`;
        } else {
            mStr = `${eq.m.num}/${eq.m.den}x`;
        }

        let bStr = '';
        if (eq.b > 0) bStr = `+${eq.b}`;
        else if (eq.b < 0) bStr = `${eq.b}`;

        return `y=${mStr}${bStr}`;
    }

    let aStr = '';
    if (eq.A === 1) aStr = 'x';
    else if (eq.A === -1) aStr = '-x';
    else if (eq.A !== 0) aStr = `${eq.A}x`;

    let bStr = '';
    if (eq.B === 1) bStr = eq.A === 0 ? 'y' : '+y';
    else if (eq.B === -1) bStr = '-y';
    else if (eq.B > 0) bStr = eq.A === 0 ? `${eq.B}y` : `+${eq.B}y`;
    else if (eq.B < 0) bStr = `${eq.B}y`;

    return `${aStr}${bStr}=${eq.C}`;
}

export function applyExpectedStepAction(player) {
    const eq = state.currentEquation;
    if (!eq) return;

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

    if (state.currentMode === 'interactive') {
        if (state.interactive.step === 0) {
            applyPointSelection(0, b);
        } else if (state.interactive.step === 1) {
            applyPointSelection(mDen, b + mNum);
        }
    } else if (state.currentMode === 'determine') {
        if (state.determine.step === 0) {
            applyPointSelection(0, b);
        } else if (state.determine.step === 1) {
            applyPointSelection(mDen, b + mNum);
        } else if (state.determine.step === 2) {
            const eqInput = document.getElementById('equation-input');
            const expected = formatExpectedEquation(eq);
            if (player && eqInput) {
                player.fillInput(eqInput, expected);
            } else if (eqInput) {
                eqInput.value = expected;
                eqInput.focus();
            }
        }
    }
}

function handleGraphClick(e) {
    if (state.currentMode === 'worksheet') return;

    const eq = state.currentEquation;
    if (!eq) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = 600 / rect.width;
    const scaleY = 600 / rect.height;

    const svgX = clickX * scaleX;
    const svgY = clickY * scaleY;

    const { x, y } = toAlgebraic(svgX, svgY);
    applyPointSelection(x, y);
}

function applyPointSelection(x, y) {
    const eq = state.currentEquation;
    if (!eq) return;

    if (state.currentMode === 'interactive') {
        if (state.interactive.step === 0) {
            const b = eq.type === 'slope-intercept' ? eq.b : eq.C / eq.B;

            if (x === 0 && y === b) {
                hideGraphingAnimation();
                plotPoint(x, y, 'point-y-int', '#10b981');
                state.interactive.yInterceptPlotted = true;
                state.interactive.points.push({ x, y });
                state.interactive.step = 1;

                addHistoryItem(`Plotted y-intercept at (0, ${b})`);
                state.notify();
            } else {
                const pt = plotPoint(x, y, 'err', '#ef4444');
                setTimeout(() => pt.remove(), 500);
            }
        } else if (state.interactive.step === 1) {
            let m = 0;
            let b = 0;
            if (eq.type === 'slope-intercept') {
                m = eq.m.num / eq.m.den;
                b = eq.b;
            } else if (eq.type === 'standard') {
                m = -eq.A / eq.B;
                b = eq.C / eq.B;
            }

            const expectedY = m * x + b;

            if (Math.abs(y - expectedY) < 0.001 && x !== 0) {
                hideGraphingAnimation();
                plotPoint(x, y, 'point-2', '#10b981');
                state.interactive.secondPointPlotted = true;
                state.interactive.points.push({ x, y });
                state.interactive.step = 2;

                addHistoryItem(`Plotted second point at (${x}, ${y})`);

                if (eq.type === 'slope-intercept') {
                    drawInfiniteLine(eq.m.num, eq.m.den, eq.b, '#10b981');
                } else {
                    drawInfiniteLine(-eq.A, eq.B, eq.C / eq.B, '#10b981');
                }

                state.notify();
            } else {
                const pt = plotPoint(x, y, 'err', '#ef4444');
                setTimeout(() => pt.remove(), 500);
            }
        }
    } else if (state.currentMode === 'determine') {
        let m = 0;
        let b = 0;
        if (eq.type === 'slope-intercept') {
            m = eq.m.num / eq.m.den;
            b = eq.b;
        } else if (eq.type === 'standard') {
            m = -eq.A / eq.B;
            b = eq.C / eq.B;
        }

        if (state.determine.step === 0) {
            if (x === 0 && y === b) {
                hideGraphingAnimation();
                plotPoint(x, y, 'det-y-int', '#10b981');
                state.determine.yInterceptIdentified = true;
                state.determine.points.push({ x, y });
                state.determine.step = 1;
                addHistoryItem(`Identified y-intercept at (0, ${b})`);
                state.notify();
            } else {
                const pt = plotPoint(x, y, 'err', '#ef4444');
                setTimeout(() => pt.remove(), 500);
            }
        } else if (state.determine.step === 1) {
            const expectedY = m * x + b;
            if (Math.abs(y - expectedY) < 0.001 && x !== 0) {
                hideGraphingAnimation();
                plotPoint(x, y, 'det-pt-2', '#10b981');
                state.determine.secondPointIdentified = true;
                state.determine.points.push({ x, y });
                state.determine.step = 2;
                addHistoryItem(`Identified second point at (${x}, ${y})`);
                state.notify();
            } else {
                const pt = plotPoint(x, y, 'err', '#ef4444');
                setTimeout(() => pt.remove(), 500);
            }
        }
    }
}

function checkDeterminedEquation(inputValue) {
    const eq = state.currentEquation;
    if (!eq) return;

    const cleanInput = inputValue.replace(/\s+/g, '').toLowerCase();
    const expected = formatExpectedEquation(eq);

    if (cleanInput === expected) {
        hideGraphingAnimation();
        document.getElementById('equation-input').classList.add('border-green-500', 'bg-green-50');
        addHistoryItem(`Correct! Equation is ${expected}`);
    } else {
        const el = document.getElementById('equation-input');
        el.classList.add('border-red-500', 'bg-red-50');
        setTimeout(() => {
            el.classList.remove('border-red-500', 'bg-red-50');
        }, 1000);
    }
}

function addHistoryItem(text) {
    const historyList = document.getElementById('history-list');
    const li = document.createElement('li');
    li.className = 'text-sm text-gray-700 py-2 border-b border-gray-100 flex items-center';
    const checkSpan = document.createElement('span');
    checkSpan.className = 'text-green-600 font-bold mr-2';
    checkSpan.textContent = '✓';
    li.appendChild(checkSpan);
    li.appendChild(document.createTextNode(text));
    historyList.appendChild(li);
}

export function updateUI() {
    hideGraphingAnimation();
    const objText = document.getElementById('objective-text');
    const eqInputContainer = document.getElementById('equation-input-container');

    if (state.currentMode === 'interactive') {
        if (eqInputContainer) eqInputContainer.classList.add('hidden');
        if (state.interactive.step === 0) {
            objText.textContent = 'Identify the y-intercept. Click the correct point on the graph.';
        } else if (state.interactive.step === 1) {
            objText.textContent = 'Identify the slope (Rise over Run). Click a second point on the line.';
        } else {
            objText.textContent = 'Great job! The line is plotted.';
        }
    } else if (state.currentMode === 'determine') {
        if (state.determine.step === 0) {
            if (eqInputContainer) eqInputContainer.classList.add('hidden');
            objText.textContent = 'Analyze the line. Click the y-intercept on the graph.';
        } else if (state.determine.step === 1) {
            if (eqInputContainer) eqInputContainer.classList.add('hidden');
            objText.textContent = 'Identify the slope. Click any other valid integer coordinate on the line.';
        } else {
            if (eqInputContainer) eqInputContainer.classList.remove('hidden');
            objText.textContent = 'Great. Now type the corresponding equation below.';
        }
    }
}
