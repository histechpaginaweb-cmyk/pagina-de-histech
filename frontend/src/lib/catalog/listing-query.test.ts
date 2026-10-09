import { describe, expect, it } from "vitest";
import {
  buildListingHref,
  hasListingVariant,
  pageWindow,
  parseListingParams,
  toApiQuery,
  LISTING_PAGE_SIZE,
} from "./listing-query";

describe("parseListingParams", () => {
  it("returns defaults for empty params", () => {
    expect(parseListingParams({})).toEqual({ q: undefined, brand: undefined, page: 1 });
  });

  it("reads q, marca and pagina", () => {
    expect(parseListingParams({ q: "  rut956 ", marca: "teltonika", pagina: "3" })).toEqual({
      q: "rut956",
      brand: "teltonika",
      page: 3,
    });
  });

  it("takes the first value of repeated params", () => {
    expect(parseListingParams({ q: ["a", "b"], pagina: ["2", "5"] })).toMatchObject({ q: "a", page: 2 });
  });

  it("falls back on invalid pages", () => {
    for (const bad of ["0", "-2", "abc", "", "3x"]) {
      expect(parseListingParams({ pagina: bad }).page).toBe(1);
    }
  });

  it("caps search length and drops blank values", () => {
    expect(parseListingParams({ q: "x".repeat(300) }).q).toHaveLength(100);
    expect(parseListingParams({ q: "   ", marca: "" })).toMatchObject({ q: undefined, brand: undefined });
  });

  it("ignores brand values that are not slugs", () => {
    expect(parseListingParams({ marca: "Tel Tonika!" }).brand).toBeUndefined();
    expect(parseListingParams({ marca: "../etc" }).brand).toBeUndefined();
  });
});

describe("buildListingHref", () => {
  it("returns the clean path when no filters are active", () => {
    expect(buildListingHref("/tienda", {})).toBe("/tienda");
    expect(buildListingHref("/tienda", { page: 1 })).toBe("/tienda");
  });

  it("serializes only active filters and skips page 1", () => {
    expect(buildListingHref("/tienda/routers", { q: "rut", brand: "teltonika", page: 2 })).toBe(
      "/tienda/routers?q=rut&marca=teltonika&pagina=2",
    );
  });

  it("encodes the search text", () => {
    expect(buildListingHref("/tienda", { q: "router 4g & wifi" })).toBe("/tienda?q=router+4g+%26+wifi");
  });
});

describe("toApiQuery", () => {
  it("maps UI params to the catalog API", () => {
    expect(toApiQuery({ category: "routers", brand: "teltonika", q: "rut", page: 2 })).toBe(
      `category=routers&brand=teltonika&q=rut&page=2&pageSize=${LISTING_PAGE_SIZE}`,
    );
  });

  it("omits empty filters", () => {
    expect(toApiQuery({ page: 1 })).toBe(`page=1&pageSize=${LISTING_PAGE_SIZE}`);
  });
});

describe("hasListingVariant", () => {
  it("is false only for the clean first page", () => {
    expect(hasListingVariant({ page: 1 })).toBe(false);
    expect(hasListingVariant({ page: 2 })).toBe(true);
    expect(hasListingVariant({ page: 1, q: "x" })).toBe(true);
    expect(hasListingVariant({ page: 1, brand: "teltonika" })).toBe(true);
  });
});

describe("pageWindow", () => {
  it("lists every page when there are few", () => {
    expect(pageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses distant pages into ellipses", () => {
    expect(pageWindow(1, 20)).toEqual([1, 2, null, 20]);
    expect(pageWindow(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(pageWindow(20, 20)).toEqual([1, null, 19, 20]);
  });
});
