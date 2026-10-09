// Price visibility rule for the public catalog (pure, no I/O).
//
// Prices are stored in COP as integers, VAT excluded. A price is shown to the
// public only when ALL of these hold:
//   1. the global `showPrices` setting is exactly `true`,
//   2. the product is not flagged `consultPrice`,
//   3. `priceCop` is a positive integer.
// Otherwise the public payload carries no price and a `consultPrice: true`
// indicator, so clients render "Consultar precio" and omit Offer price data.

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isPriceVisible(product, showPrices) {
  return (
    showPrices === true &&
    product.consultPrice !== true &&
    isPositiveInteger(product.priceCop)
  );
}

/** Price-related fields of the public product payload. */
function publicPriceFields(product, showPrices) {
  if (!isPriceVisible(product, showPrices)) return { consultPrice: true };
  return {
    consultPrice: false,
    priceCop: product.priceCop,
    priceUpdatedAt: product.priceUpdatedAt ?? null,
  };
}

module.exports = { isPositiveInteger, isPriceVisible, publicPriceFields };
