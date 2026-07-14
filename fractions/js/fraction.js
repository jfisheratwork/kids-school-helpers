export class Fraction {
    constructor(numerator, denominator = 1, whole = 0) {
        if (whole !== 0) {
            this.n = Math.abs(whole) * denominator + numerator;
            if (whole < 0) this.n = -this.n;
        } else {
            this.n = numerator;
        }
        this.d = denominator;
        this.simplify();
    }

    simplify() {
        const divisor = Fraction.gcd(Math.abs(this.n), Math.abs(this.d));
        this.n /= divisor;
        this.d /= divisor;
        if (this.d < 0) {
            this.n = -this.n;
            this.d = -this.d;
        }
    }

    static gcd(a, b) {
        return b === 0 ? a : Fraction.gcd(b, a % b);
    }

    static lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / Fraction.gcd(a, b);
    }

    add(other) {
        const commonDenom = Fraction.lcm(this.d, other.d);
        const newNum1 = this.n * (commonDenom / this.d);
        const newNum2 = other.n * (commonDenom / other.d);
        return new Fraction(newNum1 + newNum2, commonDenom);
    }

    toTeX(mixed = false) {
        if (this.d === 1) return `${this.n}`;
        if (mixed && Math.abs(this.n) >= this.d) {
            const w = Math.floor(Math.abs(this.n) / this.d);
            const rem = Math.abs(this.n) % this.d;
            const sign = this.n < 0 ? '-' : '';
            if (rem === 0) return `${sign}${w}`;
            return `${sign}${w} \\frac{${rem}}{${this.d}}`;
        }
        return `\\frac{${this.n}}{${this.d}}`;
    }
}
