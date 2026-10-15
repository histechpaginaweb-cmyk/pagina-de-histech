import { describe, expect, it } from "vitest";
import { availabilityLabel, formatCop, formatUsd, getPriceDisplay, PRICE_REFERENCE_NOTE } from "./price";
import type { PublicProduct } from "./types";

function product(overrides: Partial<PublicProduct> = {}): PublicProduct {
  return {
    id: "p1",
    slug: "router",
    name: "Router",
    brand: null,
    category: null,
    model: null,
    sku: null,
    shortDescription: null,
    description: null,
    datasheetUrl: null,
    specs: [],
    images: [],
    availability: "on_request",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    consultPrice: true,
    ...overrides,
  } as PublicProduct;
}

describe("formatCop", () => {
  it("uses dots as thousands separators and no decimals", () => {
    expect(formatCop(1234567)).toBe("$ 1.234.567");
    expect(formatCop(950)).toBe("$ 950");
    expect(formatCop(1000)).toBe("$ 1.000");
  });

  it("rounds fractional input to whole pesos", () => {
    expect(formatCop(1999.6)).toBe("$ 2.000");
  });
});

describe("formatUsd", () => {
  it("uses es-CO grouping with a comma and always 2 decimals", () => {
    expect(formatUsd(71.19)).toBe("US$ 71,19");
    expect(formatUsd(70)).toBe("US$ 70,00");
    expect(formatUsd(1234.5)).toBe("US$ 1.234,50");
  });
});

describe("getPriceDisplay", () => {
  it("formats a USD price with cents and carries the currency", () => {
    const display = getPriceDisplay(
      product({ consultPrice: false, price: 71.19, priceCurrency: "USD", priceUpdatedAt: null }),
    );
    expect(display).toMatchObject({ kind: "price", amount: 71.19, currency: "USD", formatted: "US$ 71,19" });
  });

  it("falls back to consult for an unknown currency", () => {
    const odd = { ...product(), consultPrice: false, price: 10, priceCurrency: "EUR", priceUpdatedAt: null } as unknown as PublicProduct;
    expect(getPriceDisplay(odd).kind).toBe("consult");
  });

  it("returns the consult label when the price is hidden", () => {
    expect(getPriceDisplay(product({ consultPrice: true }))).toEqual({
      kind: "consult",
      label: "Consultar precio",
    });
  });

  it("returns a VAT-excluded price with a reference note when priceUpdatedAt exists", () => {
    const display = getPriceDisplay(
      product({ consultPrice: false, price: 850000, priceCurrency: "COP", priceUpdatedAt: "2026-02-01T00:00:00.000Z" }),
    );
    expect(display).toEqual({
      kind: "price",
      amount: 850000,
      currency: "COP",
      formatted: "$ 850.000",
      taxLabel: "IVA incluido",
      note: PRICE_REFERENCE_NOTE,
    });
    expect(PRICE_REFERENCE_NOTE).toBe("Precio de referencia, sujeto a confirmación del asesor");
  });

  it("omits the note when priceUpdatedAt is null", () => {
    const display = getPriceDisplay(
      product({ consultPrice: false, price: 850000, priceCurrency: "COP", priceUpdatedAt: null }),
    );
    expect(display.kind).toBe("price");
    if (display.kind === "price") expect(display.note).toBeNull();
  });

  it("falls back to consult when the payload claims a price but the amount is unusable", () => {
    const broken = { ...product(), consultPrice: false, price: 0, priceCurrency: "COP", priceUpdatedAt: null } as PublicProduct;
    expect(getPriceDisplay(broken).kind).toBe("consult");
    const missing = { ...product(), consultPrice: false } as PublicProduct;
    expect(getPriceDisplay(missing).kind).toBe("consult");
  });
});

describe("availabilityLabel", () => {
  it("maps every availability to Spanish copy", () => {
    expect(availabilityLabel("in_stock")).toBe("Disponible");
    expect(availabilityLabel("on_request")).toBe("Disponible bajo pedido");
    expect(availabilityLabel("out_of_stock")).toBe("Agotado");
  });
});
