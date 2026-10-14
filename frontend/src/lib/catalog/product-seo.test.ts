import { describe, expect, it } from "vitest";
import {
  buildProductDescription,
  buildProductTitle,
  extractProductType,
  productOpenGraphMeta,
  productReferences,
  searchAliases,
} from "./product-seo";
import type { PublicProduct } from "./types";

function product(overrides: Record<string, unknown> = {}): PublicProduct {
  return {
    id: "p1",
    slug: "reyee-rg-es116g-l",
    name: "Reyee RG-ES116G-L",
    brand: { id: "b1", slug: "reyee", name: "Reyee", logoUrl: null },
    category: null,
    model: "RG-ES116G-L",
    sku: "RG-ES116G-L",
    shortDescription: "Switch no administrable, Sin PoE de 16 puertos 10/100/1000Mbps.",
    description: null,
    datasheetUrl: null,
    specs: [],
    images: [],
    availability: "in_stock",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    consultPrice: false,
    price: 189900,
    priceCurrency: "COP",
    priceUpdatedAt: null,
    ...overrides,
  } as PublicProduct;
}

describe("extractProductType", () => {
  const cases: [string, string][] = [
    ["Switch no administrable, Sin PoE de 16 puertos 10/100/1000Mbps.", "Switch 16 puertos Gigabit"],
    ["Switch PoE de 6 Puertos 10/100 Mbps, No Administrable, 54 W, Diseño de Alta Calidad", "Switch PoE 6 puertos Fast Ethernet"],
    [
      "Switch PoE Administrable Capa 3 con 48 Puertos Gigabit 802.3af/at, 4 Puertos SFP+ de 10Gb para Fibra",
      "Switch PoE 48 puertos Gigabit",
    ],
    ["Switch non-PoE de 8 puertos 10/100/1000 Mbps no administrable", "Switch 8 puertos Gigabit"],
    ["Switch Ruijie Multi-GE de 24 Puertos con Gestión en la Nube, PoE++", "Switch PoE 24 puertos Multi-Gigabit"],
    [
      "Router Administrable Cloud con POE+ 54W, 5 Puertos LAN Gigabit, 2 Puertos WAN Gigabit",
      "Router PoE 5 puertos Gigabit",
    ],
    ["Router Core balanceador con función SD-WAN / 1 puerto LAN", "Router 1 puerto"],
    ["RG-WALL 1600-Z3200-S, Firewall de la serie Z de próxima generación", "Firewall"],
    ["Transceptor MINI-GBIC 10GBASE-LR SFP+ 1310nm 10GB Monomodo, Hasta 10Km", "Transceptor SFP+ 10G Monomodo"],
    ["Módulo transceptor óptico SFP 1000BASE-SX de 850 nm y 550 m, fibra multimodo", "Transceptor SFP 1G Multimodo"],
    ["Transceptor SFP 2.5Gb LC Monomodo Bi-direccional", "Transceptor SFP 2.5G Monomodo"],
    ["Inyector PoE estándar 802.3at Gigabit, 30W", "Inyector PoE Gigabit 30W"],
    ["RG-POE-AF15, adaptador PoE de 1 puerto", "Adaptador PoE 1 puerto"],
    ["Paquete Licencia 1 año (5 en 1), para Funciones Avanzadas Firewall modelo RG-WALL", "Licencia 1 año"],
    ["Licencia perpetua para expansion de rendimiento del firewall", "Licencia perpetua"],
    ["Tarjeta de 48 puertos Gigabit en RJ-45 para RG-CS88-08", "Tarjeta 48 puertos Gigabit"],
    ["Fuente de Alimentación para Switch Ruijie, Potencia de Salida de hasta 1000 W", "Fuente de alimentación 1000 W"],
    ["Jumper de fibra óptica con MINI-GBIC SFP+ 10GB de 3 metros", "Jumper de fibra SFP+ 10G"],
    ["Cable óptico activo de conexión directa QSFP-40G-AOC5M", "Cable óptico"],
    ["RG-NBF5200M-8FS16GT4XS SWITCH CORE E-LIGHTEN", "Switch"],
    ["Switch Core Administrable Capa 3 con 48 SFP y 4 SFP+ para fibra 10Gb", "Switch"],
  ];

  it.each(cases)("%s", (title, expected) => {
    expect(extractProductType(title)).toBe(expected);
  });

  it("returns an empty string when nothing is recognizable or the input is empty", () => {
    expect(extractProductType("Producto genérico sin tipo conocido")).toBe("");
    expect(extractProductType(null)).toBe("");
    expect(extractProductType("   ")).toBe("");
  });
});

describe("buildProductTitle", () => {
  it("puts the part number first, then brand, type and Precio", () => {
    expect(buildProductTitle(product())).toBe("RG-ES116G-L Reyee Switch 16 puertos Gigabit – Precio");
  });

  it("respects the admin seoTitle override verbatim", () => {
    expect(buildProductTitle(product({ seoTitle: "  Mi título  " }))).toBe("Mi título");
  });

  it("falls back to the product name when there is no part number", () => {
    const title = buildProductTitle(product({ model: null, sku: null, shortDescription: null }));
    expect(title).toBe("Reyee RG-ES116G-L – Precio");
  });

  it("uses the sku when the model is missing and skips an unknown type", () => {
    expect(buildProductTitle(product({ model: null, shortDescription: "Producto sin tipo" }))).toBe(
      "RG-ES116G-L Reyee – Precio",
    );
  });

  it("keeps the title within 65 characters, truncating the type at a word boundary", () => {
    const long = product({
      model: "RG-NBS3100-24GT4SFP-P-V2-EXTENDED",
      shortDescription: "Switch PoE Administrable Capa 3 con 48 Puertos Multi-Gigabit",
    });
    const title = buildProductTitle(long);
    expect(title.length).toBeLessThanOrEqual(65);
    expect(title.startsWith("RG-NBS3100-24GT4SFP-P-V2-EXTENDED Reyee")).toBe(true);
    expect(title.endsWith(" – Precio")).toBe(true);
    expect(title).not.toMatch(/ {2}|\.\.\./);
  });
});

describe("buildProductDescription", () => {
  it("follows the template with the formatted price and stays within 160 chars", () => {
    const desc = buildProductDescription(product({ shortDescription: "Switch no administrable de 16 puertos Gigabit." }));
    expect(desc).toBe(
      "RG-ES116G-L de Reyee: Switch no administrable de 16 puertos Gigabit. Precio $ 189.900 + IVA en Colombia. Asesoría y cotización inmediata con HISTECH.",
    );
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("trims the description part so the whole text is at most ~160 chars", () => {
    const desc = buildProductDescription(
      product({
        price: 12345678,
        shortDescription:
          "Switch Administrable PoE con 8 Puertos Gigabit PoE 802.3af/at + 1 Puerto Uplink Gigabit + 1 Puerto Combo SFP/RJ45 Gigabit, Gestión Gratuita desde la Nube, 120W",
      }),
    );
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("…");
    expect(desc).toContain("Precio $ 12.345.678 + IVA en Colombia.");
    expect(desc.endsWith("Asesoría y cotización inmediata con HISTECH.")).toBe(true);
  });

  it("asks to consult the price when it is hidden or set to consult", () => {
    const hidden = buildProductDescription(product({ consultPrice: true, price: undefined, priceCurrency: undefined }));
    expect(hidden).toContain("Consulta el precio con un asesor.");
    expect(hidden).not.toMatch(/\$|IVA/);
  });

  it("formats USD prices with the existing formatter", () => {
    expect(buildProductDescription(product({ price: 71.19, priceCurrency: "USD" }))).toContain(
      "Precio US$ 71,19 + IVA en Colombia.",
    );
  });

  it("respects the admin seoDescription override verbatim", () => {
    expect(buildProductDescription(product({ seoDescription: " Descripción propia " }))).toBe("Descripción propia");
  });

  it("drops a duplicated leading model and entity fragments from the description", () => {
    const desc = buildProductDescription(
      product({ shortDescription: "RG-ES116G-L, Switch Gabinete Met&aac" }),
    );
    expect(desc.startsWith("RG-ES116G-L de Reyee: Switch Gabinete Met")).toBe(true);
    expect(desc).not.toContain("&");
  });

  it("works without brand or short description", () => {
    const desc = buildProductDescription(product({ brand: null, shortDescription: null }));
    expect(desc.startsWith("RG-ES116G-L. Precio $ 189.900 + IVA en Colombia.")).toBe(true);
  });
});

describe("searchAliases", () => {
  it("returns the hyphen-less and space-separated variants", () => {
    expect(searchAliases("RG-ES116G-L")).toEqual(["RGES116GL", "RG ES116G L"]);
  });

  it("omits duplicates and aliases equal to the original", () => {
    expect(searchAliases("RUT956")).toEqual([]);
    expect(searchAliases("RG-E-120(GE)")).toEqual(["RGE120(GE)", "RG E 120(GE)"]);
    expect(searchAliases("XG SFP")).toEqual(["XGSFP"]);
  });

  it("handles empty input", () => {
    expect(searchAliases(null)).toEqual([]);
    expect(searchAliases("  ")).toEqual([]);
  });
});

describe("productReferences", () => {
  it("shows a single reference when model and sku are equal", () => {
    expect(productReferences({ model: "RG-ES116G-L", sku: "RG-ES116G-L" })).toEqual(["RG-ES116G-L"]);
  });

  it("shows both when they differ, and ignores blanks", () => {
    expect(productReferences({ model: "RUT956", sku: "RUT956-SKU" })).toEqual(["RUT956", "RUT956-SKU"]);
    expect(productReferences({ model: null, sku: " X1 " })).toEqual(["X1"]);
    expect(productReferences({ model: null, sku: null })).toEqual([]);
  });
});

describe("productOpenGraphMeta", () => {
  it("sets og:type product with price tags when the price is visible", () => {
    expect(productOpenGraphMeta(product())).toEqual({
      "og:type": "product",
      "product:price:amount": "189900",
      "product:price:currency": "COP",
    });
  });

  it("omits price tags when the price is hidden", () => {
    expect(productOpenGraphMeta(product({ consultPrice: true }))).toEqual({ "og:type": "product" });
  });
});
