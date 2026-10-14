// Price visibility rule for the public catalog (pure, no I/O).
//
// Each product stores its own `price` (VAT excluded) in `priceCurrency`
// ("COP" or "USD"). A price is shown to the public only when ALL of these hold:
//   1. the global `showPrices` setting is exactly `true`,
//   2. the product is not flagged `consultPrice`,
//   3. `price` is a positive finite number and `priceCurrency` is known.
// Otherwise the public payload carries no price and a `consultPrice: true`
// indicator, so clients render "Consultar precio" and omit Offer price data.

const CURRENCIES = ["COP", "USD"];

function isPositiveAmount(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isPriceVisible(product, showPrices) {
  return (
    showPrices === true &&
    product.consultPrice !== true &&
    isPositiveAmount(product.price) &&
    CURRENCIES.includes(product.priceCurrency)
  );
}

/** Price-related fields of the public product payload. */
function publicPriceFields(product, showPrices) {
  if (!isPriceVisible(product, showPrices)) return { consultPrice: true };
  return {
    consultPrice: false,
    price: product.price,
    priceCurrency: product.priceCurrency,
    priceUpdatedAt: product.priceUpdatedAt ?? null,
  };
}

module.exports = { CURRENCIES, isPositiveAmount, isPriceVisible, publicPriceFields };
