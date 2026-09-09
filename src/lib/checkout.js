/*
 * Checkout engine for our little Demo Shop — THIS IS THE CODE BEING TESTED.
 *
 * Remember, every "if" below is a branch your tests can either hit or skip
 * You can get 100% branch coverage without testing every possible input, 
 * but you CANT get 100% code coverage without hitting every branch.
 *
 * @module checkout
 */

/* We're pretty generous to our loyal customers with these great coupons */
export const COUPONS = {
  SAVE10: { kind: 'percent', value: 10, description: '10% off your items' },
  TAKE5: { kind: 'flat', value: 500, description: '$5 off your items' },
};

/** Shipping is a flat rate of $5.95, and free once the amount due reaches $50. */
export const SHIPPING_CENTS = 595;
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

/**
 * Sum the basket.
 * @param {Array<{id?: string, priceCents: number, quantity: number}>} items
 * @returns {number} subtotal in cents
 * @throws {TypeError} if items is not an array
 * @throws {RangeError} if an item has a non-positive price or a quantity below 1
 */
export function subtotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  let sum = 0;
  for (const item of items) {
    if (!Number.isInteger(item.priceCents) || item.priceCents <= 0) {
      throw new RangeError(`item ${item.id ?? '(unknown)'} has an invalid price`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new RangeError(`item ${item.id ?? '(unknown)'} has an invalid quantity`);
    }
    sum += item.priceCents * item.quantity;
  }
  return sum;
}

/**
 * What a coupon takes off the subtotal. Missing or unknown codes discount
 * nothing, and a flat coupon never takes more than the subtotal itself.
 * @returns {number} the discount in cents
 */
export function couponDiscount(subtotalCents, code = null) {
  if (typeof code !== 'string') {
    return 0;
  }
  const coupon = COUPONS[code.trim().toUpperCase()];
  if (!coupon) {
    return 0;
  }
  if (coupon.kind === 'percent') {
    return Math.round((subtotalCents * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotalCents);
}

/**
 * The whole calculation: subtotal => coupon => shipping.
 * An empty basket is valid and costs nothing.
 * @returns {{subtotalCents: number, discountCents: number, shippingCents: number, totalCents: number}}
 */
export function checkout({ items, couponCode = null } = {}) {
  const before = subtotal(items);
  if (before === 0) {
    return { subtotalCents: 0, discountCents: 0, shippingCents: 0, totalCents: 0 };
  }
  const discountCents = couponDiscount(before, couponCode);
  const after = before - discountCents;
  const shippingCents = after < FREE_SHIPPING_THRESHOLD_CENTS ? SHIPPING_CENTS : 0;
  return {
    subtotalCents: before,
    discountCents,
    shippingCents,
    totalCents: after + shippingCents,
  };
}
