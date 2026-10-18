export class ViewTransitions {
    static applyNames(container, prefix = '') {
        if (!container) return;
        const seen = new Set();
        container.querySelectorAll('[id]').forEach(el => {
            const safeName = prefix + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
            if (!seen.has(safeName)) {
                seen.add(safeName);
                el.style.viewTransitionName = safeName;
                el.style.viewTransitionClass = 'math-token';
            } else {
                el.style.viewTransitionName = '';
            }
        });
    }

    static clearNames(container) {
        if (!container) return;
        container.querySelectorAll('[id]').forEach(el => {
            el.style.viewTransitionName = '';
        });
    }

    static update(container, prefix, updateFn) {
        if (!container || !document.startViewTransition) {
            updateFn();
            ViewTransitions.applyNames(container, prefix);
            return Promise.resolve();
        }

        const txId = (container._vtId || 0) + 1;
        container._vtId = txId;

        ViewTransitions.applyNames(container, prefix);
        document.documentElement.classList.add('slow-transition');

        try {
            const transition = document.startViewTransition(() => {
                updateFn();
                ViewTransitions.applyNames(container, prefix);
            });

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
