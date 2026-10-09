import { describe, expect, it } from "vitest";
import {
  buildGenericAdvisorMessage,
  buildPhoneUrl,
  buildProductAdvisorMessage,
  buildWhatsAppUrl,
  productAdvisorLinks,
  productReference,
} from "./contact";
import type { PublicProduct } from "./types";

const WA = "https://wa.me/573180008152";
const URL_ = "https://histech.com.co/tienda/producto/teltonika-rut956";

function product(overrides: Record<string, unknown> = {}): PublicProduct {
  return {
    id: "p1",
    slug: "teltonika-rut956",
    name: "Teltonika RUT956",
    brand: null,
    category: null,
    model: "RUT956",
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

describe("productReference", () => {
  it("prefers sku, then model, then nothing", () => {
    expect(productReference({ sku: "SKU-1", model: "M" })).toBe("SKU-1");
    expect(productReference({ sku: null, model: "RUT956" })).toBe("RUT956");
    expect(productReference({ sku: null, model: null })).toBeNull();
  });
});

describe("buildProductAdvisorMessage", () => {
  it("includes name, reference, price without VAT and the canonical URL", () => {
    const message = buildProductAdvisorMessage({
      name: "Teltonika RUT956",
      reference: "RUT956",
      price: "$ 850.000",
      url: URL_,
    });
    expect(message).toContain("Teltonika RUT956");
    expect(message).toContain("Referencia: RUT956");
    expect(message).toContain("$ 850.000 sin IVA");
    expect(message).toContain(URL_);
  });

  it("omits price and reference lines when absent", () => {
    const message = buildProductAdvisorMessage({ name: "Router", reference: null, price: null, url: URL_ });
    expect(message).not.toContain("Referencia");
    expect(message).not.toContain("IVA");
    expect(message).not.toContain("$");
    expect(message).toContain("Router");
    expect(message).toContain(URL_);
  });
});

describe("buildWhatsAppUrl", () => {
  it("URL-encodes the message, including accents, newlines and symbols", () => {
    const url = buildWhatsAppUrl(WA, "Hola, ¿precio de A&B?\nGracias #1");
    expect(url.startsWith(`${WA}?text=`)).toBe(true);
    const text = url.slice(`${WA}?text=`.length);
    expect(text).not.toMatch(/[\s&#¿]/);
    expect(decodeURIComponent(text)).toBe("Hola, ¿precio de A&B?\nGracias #1");
  });

  it("appends with & when the base already has a query string", () => {
    expect(buildWhatsAppUrl("https://wa.me/57?x=1", "hi")).toBe("https://wa.me/57?x=1&text=hi");
  });
});

describe("buildPhoneUrl", () => {
  it("builds a tel: link from the raw number", () => {
    expect(buildPhoneUrl("+573180008152")).toBe("tel:+573180008152");
  });
});

describe("productAdvisorLinks", () => {
  it("builds WhatsApp and phone links from site config and the canonical product URL", () => {
    const links = productAdvisorLinks(product({ consultPrice: true }), {
      whatsapp: WA,
      phoneRaw: "+573180008152",
      productUrl: URL_,
    });
    expect(links.phone).toBe("tel:+573180008152");
    const text = decodeURIComponent(links.whatsapp.split("?text=")[1]);
    expect(text).toContain("Teltonika RUT956");
    expect(text).toContain("Referencia: RUT956");
    expect(text).toContain(URL_);
    expect(text).not.toContain("IVA");
  });

  it("adds the visible price (VAT excluded) only when the price is public", () => {
    const links = productAdvisorLinks(
      product({ consultPrice: false, priceCop: 850000, priceUpdatedAt: null }),
      { whatsapp: WA, phoneRaw: "+573180008152", productUrl: URL_ },
    );
    expect(decodeURIComponent(links.whatsapp.split("?text=")[1])).toContain("$ 850.000 sin IVA");
  });
});

describe("buildGenericAdvisorMessage", () => {
  it("asks for general advice about the store", () => {
    expect(buildGenericAdvisorMessage("https://histech.com.co/tienda")).toContain("https://histech.com.co/tienda");
  });
});
