import { Fraction } from './js/fraction.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        passed++;
    } else {
        console.error('❌ FAIL:', message);
        failed++;
    }
}

// Test Fraction Simplify
const f1 = new Fraction(4, 8);
assert(f1.n === 1 && f1.d === 2, 'Fraction 4/8 simplifies to 1/2');

const f2 = new Fraction(10, 3);
assert(f2.n === 10 && f2.d === 3, 'Fraction 10/3 stays 10/3');

// Test Multiply
const f3 = f1.multiply(new Fraction(2, 3));
assert(f3.n === 1 && f3.d === 3, '1/2 * 2/3 simplifies to 1/3');

console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exit(1);
