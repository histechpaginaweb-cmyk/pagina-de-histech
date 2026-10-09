const test = require("node:test");
const assert = require("node:assert/strict");
const { isPriceVisible, publicPriceFields } = require("../../catalog/pricing");

const priced = { priceCop: 1500000, consultPrice: false, priceUpdatedAt: new Date("2026-01-02T00:00:00Z") };

test("price is visible only when every condition holds", () => {
  assert.equal(isPriceVisible(priced, true), true);
});

test("price is hidden when the global showPrices switch is off", () => {
  assert.equal(isPriceVisible(priced, false), false);
});

test("price is hidden when the product is flagged consultPrice", () => {
  assert.equal(isPriceVisible({ ...priced, consultPrice: true }, true), false);
});

test("price is hidden when priceCop is missing, zero, negative or not an integer", () => {
  for (const priceCop of [null, undefined, 0, -10, 12.5, "100", NaN]) {
    assert.equal(isPriceVisible({ ...priced, priceCop }, true), false, String(priceCop));
  }
});

test("showPrices must be strictly true (fails closed)", () => {
  assert.equal(isPriceVisible(priced, undefined), false);
  assert.equal(isPriceVisible(priced, "true"), false);
});

test("visible price exposes priceCop and priceUpdatedAt with consultPrice false", () => {
  assert.deepEqual(publicPriceFields(priced, true), {
    consultPrice: false,
    priceCop: 1500000,
    priceUpdatedAt: priced.priceUpdatedAt,
  });
});

test("hidden price carries no price keys and consultPrice true", () => {
  const out = publicPriceFields(priced, false);
  assert.deepEqual(out, { consultPrice: true });
  assert.equal("priceCop" in out, false);
  assert.equal("priceUpdatedAt" in out, false);
});
