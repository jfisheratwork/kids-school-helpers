const TOPIC_GUIDES = {
    basic: {
        title: 'How to Solve: Converting Decimals to Fractions (Level 1 — Basic)',
        intro: 'Every terminating decimal is a fraction whose denominator is a power of $10$ ($10, 100, 1000$). Count the decimal places, write the fraction over $10^k$, and simplify.',
        steps: [
            ['Count the Decimal Places (Place Value)', 'One digit after the decimal point means Tenths ($10$). Two digits after the decimal point means Hundredths ($100$).'],
            ['Write as an Unsimplified Fraction', 'Remove the decimal point and place the digits over the place-value denominator (for example, $0.4 = \\frac{4}{10}$ and $0.75 = \\frac{75}{100}$).'],
            ['Find the Greatest Common Factor (GCF)', 'Find the largest integer that divides evenly into both the numerator and denominator (e.g., $\\text{GCF}(4, 10) = 2$ and $\\text{GCF}(75, 100) = 25$).'],
            ['Divide by the GCF to Simplify', 'Divide both numerator and denominator by the $\\text{GCF}$ to reach lowest terms ($\\frac{4 \\div 2}{10 \\div 2} = \\frac{2}{5}$ and $\\frac{75 \\div 25}{100 \\div 25} = \\frac{3}{4}$).']
        ]
    },
    medium: {
        title: 'How to Solve: Hundredths & Multi-Factor GCF Reduction (Level 2)',
        intro: 'Two-digit decimals stand over $100$. Since $100 = 2^2 \\times 5^2$, look for shared factors of $2, 4, 5, 20, 25,$ or $50$.',
        steps: [
            ['Identify Hundredths ($100$)', 'A two-decimal-place number like $0.48$ or $0.35$ has a starting denominator of $100$.'],
            ['Write Over $100$', 'Place the two decimal digits over $100$ ($0.48 = \\frac{48}{100}$, $0.35 = \\frac{35}{100}$).'],
            ['Test Factors of $100$', 'If the numerator ends in $5$ or $0$, divide by $5$ or $25$. If the numerator is even, divide by $2$ or $4$ ($\\text{GCF}(48, 100) = 4$).'],
            ['Reduce to Lowest Terms', 'Divide top and bottom by the $\\text{GCF}$ ($\\frac{48 \\div 4}{100 \\div 4} = \\frac{12}{25}$, $\\frac{35 \\div 5}{100 \\div 5} = \\frac{7}{20}$).']
        ]
    },
    challenging: {
        title: 'How to Solve: Thousandths & Mixed Decimals (Level 3)',
        intro: 'Three decimal places represent Thousandths ($1000$). Decimals greater than $1$ keep their whole-number part in front as a mixed number (or convert to an improper fraction).',
        steps: [
            ['Identify Thousandths ($1000$) or Whole Part', 'Three digits after the decimal point (such as $0.375$) use a denominator of $1000$. A number like $2.35$ has whole part $2$ and hundredths part $\\frac{35}{100}$.'],
            ['Write the Unsimplified Fraction', 'Write $0.375 = \\frac{375}{1000}$, or for mixed decimals write $2\\frac{35}{100}$ (also equal to $\\frac{235}{100}$).'],
            ['Find the GCF with $1000$ or $100$', 'Since $1000 = 8 \\times 125$, multiples of $125$ reduce cleanly to eighths ($\\text{GCF}(375, 1000) = 125$).'],
            ['Simplify to Lowest Terms', 'Divide top and bottom by the $\\text{GCF}$ ($\\frac{375 \\div 125}{1000 \\div 125} = \\frac{3}{8}$, and $2\\frac{35 \\div 5}{100 \\div 5} = 2\\frac{7}{20}$ or $\\frac{47}{20}$).']
        ]
    }
};

function renderMathInNode(container) {
    const textNodes = [];
    const walk = document.createTreeWalker(container, window.NodeFilter.SHOW_TEXT, null, false);
    let node = walk.nextNode();
    while (node) {
        if (node.nodeValue && node.nodeValue.includes('$')) {
            textNodes.push(node);
        }
        node = walk.nextNode();
    }

    textNodes.forEach((textNode) => {
        const parts = textNode.nodeValue.split(/(\$[^$]+\$)/g);
        if (parts.length > 1) {
            const fragment = document.createDocumentFragment();
            parts.forEach((part) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const span = document.createElement('span');
                    const mathStr = part.substring(1, part.length - 1);
                    if (window.MathRenderer) {
                        window.MathRenderer.renderInline(mathStr, span);
                    } else if (typeof katex !== 'undefined') {
                        window.katex.render(mathStr, span, { throwOnError: false, displayMode: false });
                    } else {
                        span.textContent = mathStr;
                    }
                    fragment.appendChild(span);
                } else if (part.length > 0) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}

export function renderD2FGuide(level = 'basic') {
    const guideData = TOPIC_GUIDES[level] || TOPIC_GUIDES.basic;

    const titleEl = document.getElementById('guide-d2f-title');
    if (titleEl) {
        titleEl.textContent = guideData.title;
    }

    const contentEl = document.getElementById('guide-d2f-content');
    if (!contentEl) return;

    contentEl.replaceChildren();

    if (guideData.intro) {
        const introP = document.createElement('p');
        introP.className = 'text-gray-700 leading-relaxed font-medium mb-3';
        introP.textContent = guideData.intro;
        contentEl.appendChild(introP);
    }

    const ol = document.createElement('ol');
    ol.className = 'list-decimal list-inside space-y-2.5 font-normal text-gray-800';

    guideData.steps.forEach(([boldTitle, bodyText]) => {
        const li = document.createElement('li');
        li.className = 'leading-relaxed';

        const strong = document.createElement('strong');
        strong.className = 'font-bold text-indigo-700 mr-1.5';
        strong.textContent = `${boldTitle}:`;

        li.appendChild(strong);
        li.appendChild(document.createTextNode(` ${bodyText}`));
        ol.appendChild(li);
    });

    contentEl.appendChild(ol);
    renderMathInNode(contentEl);

    const pillButtons = document.querySelectorAll('#guide-d2f-nav button');
    pillButtons.forEach((btn) => {
        const btnTopic = btn.getAttribute('data-level');
        if (btnTopic === level) {
            btn.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white shadow-sm transition-all';
        } else {
            btn.className = 'px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all';
        }
    });
}

export function initD2FGuide() {
    const nav = document.getElementById('guide-d2f-nav');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-level]');
            if (btn) {
                renderD2FGuide(btn.getAttribute('data-level'));
            }
        });
    }

    const complexitySelect = document.getElementById('config-complexity');
    renderD2FGuide(complexitySelect ? complexitySelect.value : 'basic');
}
