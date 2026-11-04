const TOPIC_GUIDES = {
    basic: {
        title: 'How to Solve: Converting Fractions to Decimals (Level 1 — Tenths)',
        intro: 'Every fraction is a division problem ($\\frac{\\text{Numerator}}{\\text{Denominator}} = \\text{Numerator} \\div \\text{Denominator}$). Use long division with a decimal point and a trailing zero to convert fractions into tenths.',
        steps: [
            ['Set Up Long Division', 'Place the bottom denominator ($d$) outside the division bracket as the divisor, and the top numerator ($n$) inside as the dividend ($d \\overline{) n}$).'],
            ['Line Up the Decimal Point', 'Since $n < d$, $d$ goes into $n$ zero ($0$) times. Write $0.$ in the quotient directly above the decimal point and annex a trailing $0$ after the decimal ($n.0$).'],
            ['Bring Down the Trailing Zero', 'Combine the remainder $n$ with the annexed $0$ to form $10 \\times n$ (for example, $\\frac{3}{5} \\rightarrow 3.0 \\rightarrow 30 \\div 5$).'],
            ['Divide, Multiply, and Subtract', 'Divide $30 \\div 5 = 6$, write $6$ in the tenths place to get $0.6$, multiply $6 \\times 5 = 30$, and subtract $30 - 30 = 0$.']
        ]
    },
    medium: {
        title: 'How to Solve: Multi-Step Long Division (Level 2 — Hundredths)',
        intro: 'When the first decimal subtraction leaves a non-zero remainder, annex and bring down a second zero ($n.00$) to continue into the hundredths place.',
        steps: [
            ['Divide the Whole Number Part', 'For a proper fraction like $\\frac{3}{4}$, $4$ goes into $3$ zero ($0$) times. Write $0.$ in the quotient row.'],
            ['First Decimal Place (Tenths)', 'Annex and bring down the first $0$ to make $30$. Divide $30 \\div 4 = 7$, multiply $7 \\times 4 = 28$, and subtract $30 - 28 = 2$.'],
            ['Second Decimal Place (Hundredths)', 'Bring down the second $0$ next to remainder $2$ to make $20$. Divide $20 \\div 4 = 5$, multiply $5 \\times 4 = 20$, and subtract $20 - 20 = 0$.'],
            ['Read the Final Decimal', 'Once the remainder reaches $0$, the decimal terminates: $\\frac{3}{4} = 0.75$.']
        ]
    },
    challenging: {
        title: 'How to Solve: Thousandths & Improper Fractions (Level 3)',
        intro: 'Fractions with denominators like $8$ or $40$ extend to three decimal places (thousandths), while improper fractions ($n > d$) start with a whole number greater than $0$ before the decimal point.',
        steps: [
            ['Check if Improper ($n \\ge d$)', 'If the numerator is larger than the denominator (e.g., $\\frac{7}{4}$), divide $7 \\div 4 = 1$ first, multiply $1 \\times 4 = 4$, and subtract $7 - 4 = 3$ before crossing the decimal point.'],
            ['Cross the Decimal Point', 'Place the decimal point in the quotient directly above the dividend decimal point, then bring down $0$s one column at a time.'],
            ['Continue Until Remainder is Zero', 'For eighths (such as $\\frac{5}{8}$), repeat the Bring Down $\\rightarrow$ Divide $\\rightarrow$ Multiply $\\rightarrow$ Subtract cycle across tenths, hundredths, and thousandths ($\\frac{5}{8} = 0.625$).']
        ]
    },
    repeating: {
        title: 'How to Solve: Repeating Decimals (Level 4)',
        intro: 'Fractions whose simplified denominators contain prime factors other than $2$ or $5$ (such as $3, 6, 9, 11, 12$) produce remainders that repeat forever.',
        steps: [
            ['Set Up with Decimal Zeros', 'Write the dividend with two or three decimal zeros ($n.00$ or $n.000$) and divide step by step.'],
            ['Watch for Repeating Remainders', 'In $\\frac{1}{3}$, dividing $10 \\div 3 = 3$ leaves remainder $1$ again! In $\\frac{7}{12}$, dividing $7.000 \\div 12 = 0.583$ leaves remainder $4$ repeatedly.'],
            ['Record the Repeating Decimal', 'Compute enough decimal digits to reveal the repeating digit (e.g., $\\frac{1}{3} = 0.33\\ldots$ or $\\frac{7}{12} = 0.583\\ldots$).']
        ]
    },
    mixed_signed: {
        title: 'How to Solve: Signed Mixed Numbers (Level 5 — e.g. -5 7/12)',
        intro: 'To convert a positive or negative mixed number like $-5\\frac{7}{12}$ into a decimal, separate the whole number and sign from the fraction, use long division on the fractional part, and combine them at the end.',
        steps: [
            ['Separate Sign & Whole Number', 'Rewrite $-5\\frac{7}{12}$ as $-\\left(5 + \\frac{7}{12}\\right)$. Keep $-5$ aside while converting the fractional part $\\frac{7}{12}$.'],
            ['Long Divide the Fractional Part ($7 \\div 12$)', 'Set up $12 \\overline{) 7.000}$. Divide $70 \\div 12 = 5$ (rem $10$), $100 \\div 12 = 8$ (rem $4$), and $40 \\div 12 = 3$ (rem $4$) to get $\\frac{7}{12} = 0.583\\ldots$.'],
            ['Combine Whole Number & Decimal', 'Add the whole number $5$ and fractional decimal $0.583\\ldots$ to get $5.583\\ldots$.'],
            ['Apply the Negative Sign', 'Re-attach the negative sign to write the final decimal: $-5\\frac{7}{12} = -5.583\\ldots$.']
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

export function renderF2DGuide(level = 'basic') {
    const guideData = TOPIC_GUIDES[level] || TOPIC_GUIDES.basic;

    const titleEl = document.getElementById('guide-f2d-title');
    if (titleEl) {
        titleEl.textContent = guideData.title;
    }

    const contentEl = document.getElementById('guide-f2d-content');
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

    const pillButtons = document.querySelectorAll('#guide-f2d-nav button');
    pillButtons.forEach((btn) => {
        const btnTopic = btn.getAttribute('data-level');
        if (btnTopic === level) {
            btn.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white shadow-sm transition-all';
        } else {
            btn.className = 'px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all';
        }
    });
}

export function initF2DGuide() {
    const nav = document.getElementById('guide-f2d-nav');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-level]');
            if (btn) {
                renderF2DGuide(btn.getAttribute('data-level'));
            }
        });
    }

    const complexitySelect = document.getElementById('config-complexity');
    renderF2DGuide(complexitySelect ? complexitySelect.value : 'basic');
}
