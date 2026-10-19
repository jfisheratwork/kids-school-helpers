export class ViewTransitions {
    static applyNames(container, prefix = '') {
        if (!container) return 0;
        const seen = new Set();
        const tokens = container.querySelectorAll('.enclosing[id]');
        tokens.forEach(el => {
            const safeName = prefix + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
            if (!seen.has(safeName)) {
                seen.add(safeName);
                el.style.viewTransitionName = safeName;
                el.style.viewTransitionClass = 'math-token';
            } else {
                el.style.viewTransitionName = '';
                el.style.viewTransitionClass = '';
            }
        });
        return seen.size;
    }

    static clearNames(container) {
        if (!container) return;
        container.querySelectorAll('.enclosing[id]').forEach(el => {
            el.style.viewTransitionName = '';
            el.style.viewTransitionClass = '';
        });
    }

    static triggerFadeIn(container) {
        if (!container || !container.classList) return;
        container.classList.remove('math-fade-in');
        void container.offsetWidth;
        container.classList.add('math-fade-in');
    }

    static update(container, prefix, updateFn) {
        if (!container) {
            updateFn();
            return Promise.resolve();
        }

        const beforeTokenCount = ViewTransitions.applyNames(container, prefix);
        if (!document.startViewTransition || beforeTokenCount === 0) {
            updateFn();
            ViewTransitions.clearNames(container);
            ViewTransitions.triggerFadeIn(container);
            return Promise.resolve();
        }

        const txId = (container._vtId || 0) + 1;
        container._vtId = txId;

        document.documentElement.classList.add('slow-transition');

        try {
            const transition = document.startViewTransition(() => {
                updateFn();
                ViewTransitions.applyNames(container, prefix);
                ViewTransitions.triggerFadeIn(container);
            });

            if (transition.ready) {
                transition.ready.catch(() => {});
            }

            return transition.finished
                .catch(() => {})
                .finally(() => {
                    if (container._vtId === txId) {
                        document.documentElement.classList.remove('slow-transition');
                        ViewTransitions.clearNames(container);
                    }
                });
        } catch {
            updateFn();
            ViewTransitions.clearNames(container);
            ViewTransitions.triggerFadeIn(container);
            document.documentElement.classList.remove('slow-transition');
            return Promise.resolve();
        }
    }
}

if (typeof window !== 'undefined') {
  window.ViewTransitions = ViewTransitions;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ViewTransitions };
}
