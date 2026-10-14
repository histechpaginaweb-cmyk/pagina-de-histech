const test = require("node:test");
const assert = require("node:assert/strict");
const { isPriceVisible, publicPriceFields } = require("../../catalog/pricing");

const priced = { price: 1500000, priceCurrency: "COP", consultPrice: false, priceUpdatedAt: new Date("2026-01-02T00:00:00Z") };

test("price is visible only when every condition holds", () => {
  assert.equal(isPriceVisible(priced, true), true);
});

test("price is hidden when the global showPrices switch is off", () => {
  assert.equal(isPriceVisible(priced, false), false);
});

test("price is hidden when the product is flagged consultPrice", () => {
  assert.equal(isPriceVisible({ ...priced, consultPrice: true }, true), false);
});

test("price is hidden when price is missing, zero, negative or not a finite number", () => {
  for (const price of [null, undefined, 0, -10, "100", NaN, Infinity]) {
    assert.equal(isPriceVisible({ ...priced, price }, true), false, String(price));
  }
});

test("price accepts decimals (USD cents)", () => {
  assert.equal(isPriceVisible({ ...priced, price: 71.19, priceCurrency: "USD" }, true), true);
});

test("price is hidden when the currency is unknown", () => {
  assert.equal(isPriceVisible({ ...priced, priceCurrency: "EUR" }, true), false);
});

test("showPrices must be strictly true (fails closed)", () => {
  assert.equal(isPriceVisible(priced, undefined), false);
  assert.equal(isPriceVisible(priced, "true"), false);
});

test("visible price exposes price, priceCurrency and priceUpdatedAt with consultPrice false", () => {
  assert.deepEqual(publicPriceFields(priced, true), {
    consultPrice: false,
    price: 1500000,
    priceCurrency: "COP",
    priceUpdatedAt: priced.priceUpdatedAt,
  });
});

test("USD price keeps its currency and decimals", () => {
  const out = publicPriceFields({ ...priced, price: 71.19, priceCurrency: "USD" }, true);
  assert.equal(out.price, 71.19);
  assert.equal(out.priceCurrency, "USD");
});

test("hidden price carries no price keys and consultPrice true", () => {
  const out = publicPriceFields(priced, false);
  assert.deepEqual(out, { consultPrice: true });
  assert.equal("price" in out, false);
  assert.equal("priceCurrency" in out, false);
  assert.equal("priceUpdatedAt" in out, false);
});
