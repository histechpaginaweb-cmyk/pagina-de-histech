import type { Availability, PublicProduct } from "./types";

export const PRICE_TAX_LABEL = "Precio sin IVA";
export const PRICE_CONSULT_LABEL = "Consultar precio";
export const PRICE_REFERENCE_NOTE = "Precio de referencia, sujeto a confirmación del asesor";

export type PriceDisplay =
  | { kind: "consult"; label: typeof PRICE_CONSULT_LABEL }
  | {
      kind: "price";
      amount: number;
      formatted: string;
      taxLabel: typeof PRICE_TAX_LABEL;
      note: string | null;
    };

/** COP with dot thousands separators and no decimals, e.g. `$ 1.234.567`. Locale-independent. */
export function formatCop(amount: number): string {
  const whole = Math.round(amount);
  const digits = String(Math.abs(whole)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${whole < 0 ? "-" : ""}$ ${digits}`;
}

/** True only for the payload shape the backend emits when the price is public. */
export function hasVisiblePrice(product: PublicProduct): product is PublicProduct & {
  consultPrice: false;
  priceCop: number;
} {
  return (
    product.consultPrice === false &&
    typeof product.priceCop === "number" &&
    Number.isInteger(product.priceCop) &&
    product.priceCop > 0
  );
}

/** Single decision point for the price block, shared by cards, pages and SEO. */
export function getPriceDisplay(product: PublicProduct): PriceDisplay {
  if (!hasVisiblePrice(product)) return { kind: "consult", label: PRICE_CONSULT_LABEL };
  return {
    kind: "price",
    amount: product.priceCop,
    formatted: formatCop(product.priceCop),
    taxLabel: PRICE_TAX_LABEL,
    note: product.priceUpdatedAt ? PRICE_REFERENCE_NOTE : null,
  };
}

const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: "Disponible",
  on_request: "Disponible bajo pedido",
  out_of_stock: "Agotado",
};

export function availabilityLabel(availability: Availability): string {
  return AVAILABILITY_LABELS[availability] ?? AVAILABILITY_LABELS.on_request;
}
