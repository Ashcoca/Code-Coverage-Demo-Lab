import { describe, expect, it } from 'vitest';
import {
  COUPONS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_CENTS,
  checkout,
  couponDiscount,
  subtotal,
} from '../src/lib/checkout.js';

// These starter tests show the pattern and get you close to the goal of 80% coverage.
// Your job: write tests until "npm run test:coverage" passes!
// (The imports above also serve the reference solution commented out below.)

const mug = (quantity = 1) => ({ id: 'mug', priceCents: 1200, quantity });
const tee = (quantity = 1) => ({ id: 'tee', priceCents: 2500, quantity });

describe('subtotal', () => {
  it('sums priceCents × quantity across items', () => {
    expect(subtotal([mug(2), tee()])).toBe(4900);
  });

  it('rejects an item priced at zero', () => {
    expect(() => subtotal([{ id: 'mug', priceCents: 0, quantity: 1 }])).toThrow(RangeError);
  });
});

describe('couponDiscount', () => {
  it('SAVE10 takes 10% off the subtotal', () => {
    expect(couponDiscount(4900, 'SAVE10')).toBe(490);
  });

  it('unknown codes discount nothing', () => {
    expect(couponDiscount(4900, 'NOPE')).toBe(0);
  });
});

describe('checkout', () => {
  it('prices a small order at full price plus flat shipping', () => {
    expect(checkout({ items: [mug(2), tee()] })).toEqual({
      subtotalCents: 4900,
      discountCents: 0,
      shippingCents: SHIPPING_CENTS,
      totalCents: 5495,
    });
  });
});
