import { MathRenderer } from '../../shared/js/renderer.js';

const TOPIC_GUIDES = {
    addsub: {
        title: 'How to Solve: Adding & Subtracting Fractions',
        intro: 'To add or subtract fractions, they must share a common denominator before combining the numerators.',
        steps: [
            ['Check Denominators', 'If both fractions already have identical denominators, keep the denominator unchanged and add or subtract the numerators ($\\frac{a}{d} \\pm \\frac{b}{d} = \\frac{a \\pm b}{d}$).'],
            ['Find the Least Common Denominator (LCD)', 'If denominators differ, calculate the Least Common Multiple ($LCM$) of both denominators to determine the $LCD$.'],
            ['Convert to Equivalent Fractions', 'Multiply the numerator and denominator of each fraction by the factor needed to reach the $LCD$.'],
            ['Add or Subtract Numerators', 'Keep the common denominator unchanged and add or subtract only the top numerators.'],
            ['Simplify & Reduce', 'Divide the resulting numerator and denominator by their Greatest Common Factor ($GCF$). Convert improper fractions to mixed numbers if requested.']
        ]
    },
    multiply: {
        title: 'How to Solve: Multiplying Fractions',
        intro: 'Multiplying fractions is straightforward: multiply straight across the tops and straight across the bottoms.',
        steps: [
            ['Convert Mixed Numbers', 'If any mixed numbers are present, convert them to improper fractions first ($w\\frac{n}{d} = \\frac{w \\cdot d + n}{d}$).'],
            ['Multiply Numerators Straight Across', 'Multiply the top numbers together ($a \\times c$) to get the product numerator.'],
            ['Multiply Denominators Straight Across', 'Multiply the bottom numbers together ($b \\times d$) to get the product denominator.'],
            ['Simplify & Reduce', 'Divide the resulting numerator and denominator by their $GCF$ to write the final fraction in simplest form.']
        ]
    },
    divide: {
        title: 'How to Solve: Dividing Fractions',
        intro: 'Dividing fractions uses the Keep, Change, Flip (KCF) rule to convert division into multiplication by the reciprocal.',
        steps: [
            ['Convert Mixed Numbers', 'Convert any mixed numbers or whole numbers into improper fractions first.'],
            ['Keep, Change, Flip (KCF)', 'Keep the first fraction as it is ($\\frac{a}{b}$), Change division ($\\div$) to multiplication ($\\times$), and Flip the second fraction to its reciprocal ($\\frac{c}{d} \\rightarrow \\frac{d}{c}$).'],
            ['Multiply Straight Across', 'Multiply the numerators together and the denominators together ($\\frac{a \\times d}{b \\times c}$).'],
            ['Simplify & Reduce', 'Divide both the numerator and denominator by their $GCF$ to reduce the answer to simplest form.']
        ]
    },
    concepts: {
        title: 'How to Solve: Fraction Concepts & Foundations',
        intro: 'Essential mathematical rules and building blocks for understanding and simplifying fractions.',
        steps: [
            ['Proper vs. Improper Fractions', 'In a proper fraction, the numerator is less than the denominator ($n < d$, e.g. $\\frac{2}{5}$). In an improper fraction, the numerator is greater than or equal to the denominator ($n \\ge d$, e.g. $\\frac{7}{4}$).'],
            ['Converting Improper to Mixed Numbers', 'Divide numerator by denominator ($n \\div d$). The whole quotient is the whole number, the remainder is the new numerator, and the denominator stays the same ($7 \\div 4 = 1 \\text{ R } 3 \\rightarrow 1\\frac{3}{4}$).'],
            ['Least Common Denominator (LCD / LCM)', 'The smallest positive integer that is a multiple of two or more denominators. Used to find equivalent fractions with matching bottoms.'],
            ['Greatest Common Factor (GCF) & Simplifying', 'The largest integer that divides evenly into both numerator and denominator. Divide both by the $GCF$ to reduce a fraction to simplest form.']
        ]
    }
};

let currentGuideTopic = 'addsub';

function renderMathInNode(container) {
    const textNodes = [];
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node = walk.nextNode();
    while (node) {
        if (node.nodeValue && node.nodeValue.includes('$')) {
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

export function renderFractionsGuide(topic) {
    const guideData = TOPIC_GUIDES[topic] || TOPIC_GUIDES.addsub;
    currentGuideTopic = topic;

    const titleEl = document.getElementById('guide-fractions-title');
    if (titleEl) {
        titleEl.textContent = guideData.title;
    }

    const contentEl = document.getElementById('guide-fractions-content');
    if (!contentEl) return;

    contentEl.replaceChildren();

    if (guideData.intro) {
        const introP = document.createElement('p');
        introP.className = 'text-gray-700 leading-relaxed font-medium mb-3';
        introP.textContent = guideData.intro;
        contentEl.appendChild(introP);
    }

    const ol = document.createElement('ol');
    ol.className = 'list-decimal list-inside space-y-3 font-normal text-gray-800';

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

    // Update pill buttons visual state
    const pillButtons = document.querySelectorAll('#guide-topic-nav button');
    pillButtons.forEach(btn => {
        const btnTopic = btn.getAttribute('data-topic');
        if (btnTopic === topic) {
            btn.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white shadow-sm transition-all';
        } else {
            btn.className = 'px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all';
        }
    });
}

export function syncGuideTopic(topic) {
    if (TOPIC_GUIDES[topic]) {
        renderFractionsGuide(topic);
    }
}

export function initFractionsGuide() {
    const nav = document.getElementById('guide-topic-nav');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-topic]');
            if (btn) {
                const topic = btn.getAttribute('data-topic');
                renderFractionsGuide(topic);
            }
        });
    }

    // Initial render based on topic dropdown if available
    const topicSelect = document.getElementById('config-topic');
    const initialTopic = topicSelect ? topicSelect.value : 'addsub';
    renderFractionsGuide(initialTopic);
}
