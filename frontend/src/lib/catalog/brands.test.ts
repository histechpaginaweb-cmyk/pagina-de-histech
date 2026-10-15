import { describe, expect, it } from "vitest";
import {
  brandCollectionJsonLd,
  brandMetadataInput,
  brandPagePath,
  getBrandPage,
  isBrandPageSlug,
  BRAND_PAGE_SLUGS,
} from "./brands";

describe("brand pages content", () => {
  it("knows ruijie and reyee only", () => {
    expect([...BRAND_PAGE_SLUGS]).toEqual(["ruijie", "reyee"]);
    expect(isBrandPageSlug("ruijie")).toBe(true);
    expect(isBrandPageSlug("reyee")).toBe(true);
    expect(isBrandPageSlug("teltonika")).toBe(false);
    expect(getBrandPage("nope")).toBeUndefined();
  });

  it("has neutral Spanish copy that mentions HISTECH and IVA included", () => {
    for (const slug of BRAND_PAGE_SLUGS) {
      const page = getBrandPage(slug)!;
      expect(page.heading).toBe(`${page.name} en Colombia`);
      expect(page.intro.join(" ")).toMatch(/HISTECH/);
      expect(page.intro.join(" ")).toMatch(/IVA incluido/);
    }
  });

  it("builds the brand path", () => {
    expect(brandPagePath("ruijie")).toBe("/tienda/marca/ruijie");
  });

  it("builds metadata input with canonical path, title and description", () => {
    const input = brandMetadataInput(getBrandPage("reyee")!, { q: undefined, page: 1 });
    expect(input.path).toBe("/tienda/marca/reyee");
    expect(input.title).toContain("Reyee");
    expect(input.description.length).toBeLessThanOrEqual(200);
    expect(input.noindex).toBe(false);
  });

  it("noindexes searched variants", () => {
    expect(brandMetadataInput(getBrandPage("reyee")!, { q: "poe", page: 1 }).noindex).toBe(true);
  });
});

describe("brandCollectionJsonLd", () => {
  it("is a CollectionPage about the Brand", () => {
    const ld = brandCollectionJsonLd(getBrandPage("ruijie")!, { siteUrl: "https://histech.com.co" });
    expect(ld["@type"]).toBe("CollectionPage");
    expect(ld.url).toBe("https://histech.com.co/tienda/marca/ruijie");
    expect(ld.about).toMatchObject({ "@type": "Brand", name: "Ruijie" });
    expect(ld.inLanguage).toBe("es-CO");
  });
});
