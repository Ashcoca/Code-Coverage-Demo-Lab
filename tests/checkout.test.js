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




/* ============================= REFERENCE SOLUTION ============================= */



describe('subtotal (solution)', () => {
  it('returns 0 for an empty basket', () => {
    expect(subtotal([])).toBe(0);
  });

  it('throws TypeError when items is not an array', () => {
    expect(() => subtotal('mug')).toThrow('items must be an array'); // the message is part of the contract
    expect(() => subtotal(undefined)).toThrow(TypeError);
  });

  it('rejects non integer, zero and negative prices', () => {
    expect(() => subtotal([{ priceCents: 12.5, quantity: 1 }])).toThrow(RangeError);
    expect(() => subtotal([{ priceCents: -100, quantity: 1 }])).toThrow(RangeError);
  });

  it('rejects non-integer and sub-1 quantities', () => {
    expect(() => subtotal([{ priceCents: 1200, quantity: 1.5 }])).toThrow(RangeError);
    expect(() => subtotal([{ priceCents: 1200, quantity: 0 }])).toThrow('(unknown)'); // asserts the message, not just the type
  });

  it('names the poroblem item in the error', () => {
    expect(() => subtotal([{ id: 'mug', priceCents: 0, quantity: 1 }])).toThrow('mug');
    expect(() => subtotal([{ priceCents: 0, quantity: 1 }])).toThrow('(unknown)');
    expect(() => subtotal([{ id: 'mug', priceCents: 1200, quantity: 0 }])).toThrow('mug'); // quantity errors name the item too
  });
});

describe('couponDiscount (solution)', () => {
  it('matches codes case-insensitively, ignoring whitespace', () => {
    expect(couponDiscount(4900, '  save10 ')).toBe(490);
  });

  it('discounts nothing for missing and non-string codes', () => {
    expect(couponDiscount(4900, null)).toBe(0);
    expect(couponDiscount(4900, 42)).toBe(0);
  });

  it('TAKE5 takes a flat $5 off', () => {
    expect(couponDiscount(4900, 'TAKE5')).toBe(500);
  });

  it('a flat coupon never takes more than the subtotal', () => {
    expect(couponDiscount(300, 'TAKE5')).toBe(300);
  });

  it('the coupon table is pinned, it is exported data, so pin it', () => {
    expect(COUPONS.SAVE10).toEqual({ kind: 'percent', value: 10, description: '10% off your items' });
    expect(COUPONS.TAKE5).toEqual({ kind: 'flat', value: 500, description: '$5 off your items' });
  });
});

describe('checkout (solution)', () => {
  it('an empty basket is valid and costs nothing', () => {
    expect(checkout({ items: [] })).toEqual({
      subtotalCents: 0,
      discountCents: 0,
      shippingCents: 0,
      totalCents: 0,
    });
  });

  it('rejects a call with no arguments at all', () => {
    expect(() => checkout()).toThrow(TypeError);
  });

  it('shipping is free once the amount due reaches $50', () => {
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(5000);
    expect(checkout({ items: [mug(5)] }).totalCents).toBe(6000); // 6000 due, no shipping
    expect(checkout({ items: [tee(2)] }).totalCents).toBe(5000); // due EXACTLY $50.00, qualifies for free shipping
  });

  it('the free shipping threshold applies after discounts', () => {
    // 2 tees = 5000 due, TAKE5 takes it to 4500: shipping applies after all.
    expect(checkout({ items: [tee(2)], couponCode: 'TAKE5' }).totalCents).toBe(5095);
  });

  it('stacks a coupon with the free shipping boundary', () => {
    // 5 mugs = 6000, SAVE10 -> 5400 due: still free shipping.
    expect(checkout({ items: [mug(5)], couponCode: 'SAVE10' }).totalCents).toBe(5400);
  });

  it('propagates basket validation errors', () => {
    expect(() => checkout({ items: [{ id: 'mug', priceCents: 0, quantity: 1 }] })).toThrow(RangeError);
  });
});

