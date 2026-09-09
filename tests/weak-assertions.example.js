import { describe, expect, it } from 'vitest';
import { checkout, couponDiscount, subtotal } from '../src/lib/checkout.js';

// THE 100%-COVERAGE LIE
// An example, *not* a test file
//
// Copy the tests below to tests/weak.test.js
// We'll need to disable the existing test suite
// Open up a terminal and run:
//     mv tests/checkout.test.js tests/checkout.test.js.bak
//     npm run test:coverage => ~100% lines: the gate is green
//     npm run mutate => 26.8% mutation score: 52 of 71 mutants survive
//
// REMEMBER: Coverage measures which lines your tests EXECUTE. Mutation testing
// measures which bugs your tests NOTICE. These assertions run every line
// and would not notice the engine returning garbage.
// Delete weak.test.js when you're done and restore the original test suite.

const mug = (quantity = 1) => ({ id: 'mug', priceCents: 1200, quantity });

describe('everything works, allegedly', () => {
  it('runs the engine without complaining', () => {
    expect(checkout({ items: [mug(2)] }).totalCents).toBeDefined();
    expect(checkout({ items: [] }).totalCents).toBeDefined();
    expect(checkout({ items: [mug(10)], couponCode: 'SAVE10' }).discountCents).toBeDefined();
    expect(checkout({ items: [mug(3)], couponCode: 'TAKE5' }).discountCents).toBeDefined();
    expect(checkout({ items: [mug(1)], couponCode: 'nope' }).totalCents).toBeDefined();
    expect(couponDiscount(100, 42)).toBeDefined();
    for (const bad of ['mug', [{ priceCents: 0, quantity: 1 }], [{ priceCents: 100, quantity: 0 }]]) {
      try {
        subtotal(bad);
      } catch {
        // errors happen to other people!
      }
    }
  });
});
