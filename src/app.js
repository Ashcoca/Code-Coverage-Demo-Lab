// UI/UX for the demo shop interface. Deliberately simple, all the interesting
// stuff lives in src/lib/checkout.js, which is what the tests cover.
// NOTE: Receipt formatting stays here in the UI layer.

import { checkout } from './lib/checkout.js';

const form = document.querySelector('#order-form');
const receipt = document.querySelector('#receipt');

const PRODUCTS = [
  { id: 'mug', priceCents: 1200 },
  { id: 'tee', priceCents: 2500 },
];

function readItems() {
  return PRODUCTS
    .map((product) => ({
      id: product.id,
      priceCents: product.priceCents,
      quantity: Number(form.elements[`qty-${product.id}`].value),
    }))
    .filter((item) => item.quantity > 0);
}

function formatMoney(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function renderReceipt(order) {
  const lines = [`Subtotal: ${formatMoney(order.subtotalCents)}`];
  if (order.discountCents > 0) {
    lines.push(`Discount: -${formatMoney(order.discountCents)}`);
  }
  lines.push(
    order.shippingCents === 0
      ? 'Shipping: Free'
      : `Shipping: ${formatMoney(order.shippingCents)}`
  );
  lines.push(`Total: ${formatMoney(order.totalCents)}`);
  return lines.join('\n');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const order = checkout({
      items: readItems(),
      couponCode: form.elements.coupon.value.trim() || null,
    });
    receipt.textContent = renderReceipt(order);
  } catch (error) {
    receipt.textContent = `Could not price that order: ${error.message}`;
  }
});
