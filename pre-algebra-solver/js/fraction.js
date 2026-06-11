class Fraction {
  constructor(num, den = 1) {
    if (num instanceof Fraction) {
      this.n = num.n;
      this.d = num.d;
      return;
    }
    if (typeof num === 'string') {
      const parsed = Fraction.parse(num);
      this.n = parsed.n;
      this.d = parsed.d;
    } else {
      if (!Number.isInteger(num) || !Number.isInteger(den)) {
        // Handle float approximations if passed directly
        if (den === 1 && !Number.isInteger(num)) {
          const precision = 1000000;
          num = Math.round(num * precision);
          den = precision;
        } else {
          throw new Error('Numerator and denominator must be integers');
        }
      }
      if (den === 0) {
        throw new Error('Denominator cannot be zero');
      }
      this.n = num;
      this.d = den;
    }
    this.simplify();
  }

  simplify() {
    if (this.d < 0) {
      this.n = -this.n;
      this.d = -this.d;
    }
    const g = Fraction.gcd(Math.abs(this.n), this.d);
    this.n /= g;
    this.d /= g;
    return this;
  }

  static gcd(a, b) {
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  add(other) {
    const o = Fraction.cast(other);
    return new Fraction(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(other) {
    const o = Fraction.cast(other);
    return new Fraction(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(other) {
    const o = Fraction.cast(other);
    return new Fraction(this.n * o.n, this.d * o.d);
  }

  div(other) {
    const o = Fraction.cast(other);
    if (o.n === 0) throw new Error('Division by zero');
    return new Fraction(this.n * o.d, this.d * o.n);
  }

  neg() {
    return new Fraction(-this.n, this.d);
  }

  abs() {
    return new Fraction(Math.abs(this.n), this.d);
  }

  inv() {
    if (this.n === 0) throw new Error('Division by zero');
    return new Fraction(this.d, this.n);
  }

  equals(other) {
    const o = Fraction.cast(other);
    return this.n === o.n && this.d === o.d;
  }

  static cast(val) {
    if (val instanceof Fraction) return val;
    return new Fraction(val);
  }

  static parse(str) {
    str = str.trim().replace(/\s+/g, '');
    if (str.startsWith('+')) {
      str = str.substring(1);
    }
    const isNegative = str.startsWith('-');
    if (isNegative) {
      str = str.substring(1);
    }

    let n, d;
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length !== 2) throw new Error('Invalid fraction format');
      n = parseInt(parts[0], 10);
      d = parseInt(parts[1], 10);
    } else {
      const val = parseFloat(str);
      if (isNaN(val)) throw new Error('Invalid number format');
      if (Number.isInteger(val)) {
        n = val;
        d = 1;
      } else {
        const precision = 1000000;
        n = Math.round(val * precision);
        d = precision;
      }
    }

    return new Fraction(isNegative ? -n : n, d);
  }

  toString() {
    if (this.d === 1) return `${this.n}`;
    return `${this.n}/${this.d}`;
  }

  toLaTeX() {
    if (this.d === 1) return `${this.n}`;
    if (this.n < 0) {
      return `-\\frac{${Math.abs(this.n)}}{${this.d}}`;
    }
    return `\\frac{${this.n}}{${this.d}}`;
  }

  valueOf() {
    return this.n / this.d;
  }
}

window.Fraction = Fraction;
