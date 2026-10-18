import { ViewTransitions } from './view-transitions.js';
import { MathRenderer } from './renderer.js';

export class SharedAnimationPlayer {
    constructor(options = {}) {
        this.containerId = options.containerId || 'visual-explanation-container';
        this.displayId = options.displayId || 'visual-explanation-display';
        this.captionId = options.captionId || 'anim-frame-caption';
        this.counterId = options.counterId || 'anim-frame-counter';
        this.playBtnId = options.playBtnId || 'btn-anim-play';
        this.prevBtnId = options.prevBtnId || 'btn-anim-prev';
        this.nextBtnId = options.nextBtnId || 'btn-anim-next';
        this.fillBtnId = options.fillBtnId || 'btn-anim-fill';
        this.speedInputId = options.speedInputId || options.speedId || 'anim-speed';
        this.speedDisplayId = options.speedDisplayId || 'anim-speed-display';
        this.pulseTargetId = options.pulseTargetId || 'hint-system-container';

        this.frames = [];
        this.captions = [];
        this.index = 0;
        this.playing = false;
        this.interval = null;
        this.hideTimeout = null;
        this.activeStepKey = null;

        this.onFrameChange = options.onFrameChange || null;
        this.onPrevAtStart = options.onPrevAtStart || null;
        this.onNextAtEnd = options.onNextAtEnd || null;
        this.onFillInput = options.onFillInput || options.onFillRequest || null;
        this.updateNavButtons = options.updateNavButtons || null;

        this._eventsBound = false;
    }

    initEvents() {
        this.bindEvents();
    }

    get currentStepKey() {
        return this.activeStepKey;
    }

    isOpen() {
        return this.isVisible();
    }

    fillInput(inputEl, value) {
        SharedAnimationPlayer.fillInputElement(inputEl, value);
    }

    loadFrames(rawFrames, captions = [], autoplay = true, stepKey = null) {
        this.play(rawFrames, { captions, autoplay, stepKey });
    }

    bindEvents() {
        if (this._eventsBound) return;
        this._eventsBound = true;

        const speedEl = document.getElementById(this.speedInputId);
        if (speedEl) {
            speedEl.addEventListener('input', () => {
                const val = parseFloat(speedEl.value) || 2.5;
                const speedDisplay = document.getElementById(this.speedDisplayId);
                if (speedDisplay) {
                    speedDisplay.textContent = `${val.toFixed(1)}s`;
                }
                if (this.playing) {
                    this.startTimer();
                }
            });
        }

        const playBtn = document.getElementById(this.playBtnId);
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.togglePlay();
            });
        }

        const prevBtn = document.getElementById(this.prevBtnId);
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopTimer();
                if (this.index > 0) {
                    this.index--;
                    this.showFrame(this.index);
                } else if (typeof this.onPrevAtStart === 'function') {
                    this.onPrevAtStart();
                }
            });
        }

        const nextBtn = document.getElementById(this.nextBtnId);
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopTimer();
                if (this.index < this.frames.length - 1) {
                    this.index++;
                    this.showFrame(this.index);
                } else if (typeof this.onNextAtEnd === 'function') {
                    this.onNextAtEnd();
                }
            });
        }

        const fillBtn = document.getElementById(this.fillBtnId);
        if (fillBtn) {
            fillBtn.addEventListener('click', () => {
                if (typeof this.onFillInput === 'function') {
                    this.onFillInput();
                }
            });
        }
    }

    normalizeFrames(rawFrames = [], rawCaptions = []) {
        const normalized = [];
        const captions = [];

        rawFrames.forEach((item, idx) => {
            if (typeof item === 'string') {
                normalized.push({ math: item });
                captions.push(rawCaptions[idx] || '');
            } else if (item && typeof item === 'object') {
                normalized.push({
                    math: item.math || item.tex || item.latex || '',
                    text: item.text || ''
                });
                captions.push(item.caption || rawCaptions[idx] || '');
            }
        });

        return { normalized, captions };
    }

    play(rawFrames, options = {}) {
        this.bindEvents();
        const { normalized, captions } = this.normalizeFrames(
            rawFrames,
            options.captions || []
        );
        if (normalized.length === 0) return;

        if (options.stepKey !== undefined) {
            this.activeStepKey = options.stepKey;
        }
        if (typeof options.onFillInput === 'function') {
            this.onFillInput = options.onFillInput;
        }

        this.frames = normalized;
        this.captions = captions;
        this.index = typeof options.startIndex === 'number' ? options.startIndex : 0;
        this.playing = Boolean(options.autoplay);

        this.showContainer(options.pulseContainer);
        this.showFrame(this.index);

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.playing && this.frames.length > 1) {
            this.startTimer();
        } else {
            this.playing = false;
            this.syncPlayButton();
        }
    }

    showFrame(index) {
        const display = document.getElementById(this.displayId);
        const counter = document.getElementById(this.counterId);
        const captionEl = document.getElementById(this.captionId);
        if (!display || index < 0 || index >= this.frames.length) return;

        const frameObj = this.frames[index];
        const captionText = this.captions[index] || '';

        ViewTransitions.update(display, 'vis_', () => {
            if (frameObj.math) {
                MathRenderer.renderBlock(frameObj.math, display);
            } else {
                display.textContent = frameObj.text || '';
            }

            if (counter) {
                counter.textContent = `${index + 1}/${this.frames.length}`;
            }

            if (captionEl) {
                captionEl.textContent = captionText;
                if (captionText) {
                    captionEl.classList.remove('hidden');
                } else {
                    captionEl.classList.add('hidden');
                }
            }

            this.syncPlayButton();
            if (typeof this.updateNavButtons === 'function') {
                this.updateNavButtons(index, this.frames.length);
            } else {
                this.defaultUpdateNavButtons(index, this.frames.length);
            }
            if (typeof this.onFrameChange === 'function') {
                this.onFrameChange(index, this.frames.length);
            }
        });
    }

    defaultUpdateNavButtons(index, total) {
        const prevBtn = document.getElementById(this.prevBtnId);
        const nextBtn = document.getElementById(this.nextBtnId);
        if (prevBtn) {
            prevBtn.disabled = index <= 0 && typeof this.onPrevAtStart !== 'function';
            prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
        }
        if (nextBtn) {
            nextBtn.disabled = index >= total - 1 && typeof this.onNextAtEnd !== 'function';
            nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
        }
    }

    syncPlayButton() {
        const playBtn = document.getElementById(this.playBtnId);
        if (!playBtn) return;

        if (this.frames.length <= 1) {
            playBtn.classList.add('hidden');
            return;
        }
        playBtn.classList.remove('hidden');

        if (this.playing) {
            playBtn.textContent = 'Pause';
        } else if (this.index >= this.frames.length - 1) {
            playBtn.textContent = 'Replay';
        } else {
            playBtn.textContent = 'Play';
        }
    }

    togglePlay() {
        if (this.frames.length <= 1) return;
        if (this.playing) {
            this.stopTimer();
        } else {
            if (this.index >= this.frames.length - 1) {
                this.index = 0;
                this.showFrame(0);
            }
            this.playing = true;
            this.syncPlayButton();
            this.startTimer();
        }
    }

    startTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        const speedEl = document.getElementById(this.speedInputId);
        const speedSeconds = speedEl ? (parseFloat(speedEl.value) || 2.5) : 2.5;
        const speedDisplay = document.getElementById(this.speedDisplayId);
        if (speedDisplay) {
            speedDisplay.textContent = `${speedSeconds.toFixed(1)}s`;
        }

        this.playing = true;
        this.syncPlayButton();

        this.interval = setInterval(() => {
            if (!this.playing) return;
            if (this.index < this.frames.length - 1) {
                this.index++;
                this.showFrame(this.index);
            } else {
                this.stopTimer();
            }
        }, speedSeconds * 1000);
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.playing = false;
        this.syncPlayButton();
    }

    isVisible() {
        const container = document.getElementById(this.containerId);
        return Boolean(container && !container.classList.contains('hidden'));
    }

    showContainer(pulseTargetOverride = null) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        container.classList.remove('hidden');
        setTimeout(() => {
            container.classList.remove('opacity-0');
        }, 30);

        const pulseEl = pulseTargetOverride || document.getElementById(this.pulseTargetId);
        if (pulseEl) {
            pulseEl.classList.add('ring-4', 'ring-indigo-300', 'border-indigo-400');
            setTimeout(() => {
                pulseEl.classList.remove('ring-4', 'ring-indigo-300', 'border-indigo-400');
            }, 900);
        }
    }

    hide(immediate = false) {
        this.stopTimer();
        this.activeStepKey = null;
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.classList.add('opacity-0');
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        if (immediate) {
            container.classList.add('hidden');
            return;
        }
        this.hideTimeout = setTimeout(() => {
            container.classList.add('hidden');
        }, 350);
    }

    /**
     * Unified Two-Stage Tab Handler:
     * - 1st Tab on a step: Opens the visual explanation and auto-plays frames without filling input.
     * - 2nd Tab on the same step (while visible): Fills the expected answer into the input and focuses it.
     */
    handleTabKey(options = {}) {
        const {
            stepKey,
            frames,
            captions = [],
            fillInputFn,
            expectedAnswer,
            inputEl,
            onOpen,
            autoplay = true,
            pulseContainer = null
        } = options;

        const effectiveFillFn = typeof fillInputFn === 'function'
            ? fillInputFn
            : () => {
                if (inputEl && expectedAnswer !== undefined) {
                    SharedAnimationPlayer.fillInputElement(inputEl, expectedAnswer);
                } else if (typeof this.onFillInput === 'function') {
                    this.onFillInput();
                }
            };

        const alreadyOpenForStep = this.isVisible() && this.activeStepKey === stepKey;

        if (!alreadyOpenForStep) {
            if (typeof onOpen === 'function') {
                onOpen();
            }
            this.play(frames, {
                captions,
                autoplay,
                stepKey,
                onFillInput: effectiveFillFn,
                pulseContainer
            });
            return { stage: 'visual', filled: false };
        }

        effectiveFillFn();
        return { stage: 'fill', filled: true };
    }

    static fillInputElement(inputEl, value) {
        if (!inputEl || value === undefined || value === null) return;
        inputEl.value = String(value);
        inputEl.focus();
        inputEl.classList.remove('border-red-500', 'focus:border-red-500');
        inputEl.classList.remove('math-Input-filled-pulse');
        // Trigger reflow for pulse animation
        void inputEl.offsetWidth;
        inputEl.classList.add('math-Input-filled-pulse');
    }
}

if (typeof window !== 'undefined') {
    window.SharedAnimationPlayer = SharedAnimationPlayer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SharedAnimationPlayer };
}
