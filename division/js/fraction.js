export class Fraction {
    constructor(numerator, denominator = 1) {
        this.n = numerator;
        this.d = denominator;
        this.simplify();
    }

    simplify() {
        const divisor = this.gcd(Math.abs(this.n), Math.abs(this.d));
        this.n /= divisor;
        this.d /= divisor;
        if (this.d < 0) {
            this.n = -this.n;
            this.d = -this.d;
        }
    }

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    multiply(other) {
        return new Fraction(this.n * other.n, this.d * other.d);
    }

    toTeX() {
        if (this.d === 1) return `${this.n}`;
        return `\\frac{${this.n}}{${this.d}}`;
    }
}
