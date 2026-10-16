export class ViewTransitions {
    static applyNames(container, prefix = '') {
        if (!container) return;
        container.querySelectorAll('[id]').forEach(el => {
            el.style.viewTransitionName = prefix + el.id.replace(/[^a-zA-Z0-9_-]/g, '_');
        });
    }

    static update(container, prefix, updateFn) {
        if (!document.startViewTransition) {
            updateFn();
            ViewTransitions.applyNames(container, prefix);
            return Promise.resolve();
        }

        ViewTransitions.applyNames(container, prefix);
        document.documentElement.classList.add('slow-transition');

        const transition = document.startViewTransition(() => {
            updateFn();
            ViewTransitions.applyNames(container, prefix);
        });

        return transition.finished.finally(() => {
            document.documentElement.classList.remove('slow-transition');
        });
    }
}

if (typeof window !== 'undefined') {
  window.ViewTransitions = ViewTransitions;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ViewTransitions };
}
