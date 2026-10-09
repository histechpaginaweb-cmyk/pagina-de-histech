import { describe, expect, it, vi } from "vitest";
import { createCatalogClient } from "./client";

const okJson = (body: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

const product = { id: "1", slug: "rut956", name: "RUT956", consultPrice: true };

function client(fetchImpl: unknown, baseUrl: string | null = "https://api.test/") {
  return createCatalogClient({ baseUrl: baseUrl ?? undefined, fetchImpl: fetchImpl as typeof fetch, warn: () => {} });
}

describe("catalog client degradation", () => {
  it("returns an unavailable empty list when BACKEND_URL is missing", async () => {
    const fetchImpl = vi.fn();
    const result = await client(fetchImpl, null).listProducts({ page: 1 });
    expect(result).toMatchObject({ items: [], total: 0, unavailable: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("never throws when fetch rejects", async () => {
    const c = client(vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    await expect(c.listProducts({ page: 1 })).resolves.toMatchObject({ items: [], unavailable: true });
    await expect(c.listCategories()).resolves.toEqual({ items: [], unavailable: true });
    await expect(c.listBrands()).resolves.toEqual({ items: [], unavailable: true });
    await expect(c.getProduct("x")).resolves.toEqual({ status: "unavailable" });
    await expect(c.listAllPublishedProducts()).resolves.toEqual([]);
  });

  it("treats non-2xx and malformed bodies as unavailable", async () => {
    expect(await client(vi.fn().mockResolvedValue(okJson({}, 503))).listCategories()).toEqual({
      items: [],
      unavailable: true,
    });
    expect(await client(vi.fn().mockResolvedValue(okJson({ nope: true }))).listProducts({ page: 1 })).toMatchObject({
      unavailable: true,
    });
  });

  it("distinguishes 404 from an outage for a product", async () => {
    expect(await client(vi.fn().mockResolvedValue(okJson({ error: "x" }, 404))).getProduct("zzz")).toEqual({
      status: "not_found",
    });
    expect(await client(vi.fn().mockResolvedValue(okJson({}, 500))).getProduct("zzz")).toEqual({
      status: "unavailable",
    });
  });
});

describe("catalog client requests", () => {
  it("builds the products URL with the ISR revalidate hint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson({ items: [product], total: 1, page: 1, pageSize: 12 }));
    const result = await client(fetchImpl).listProducts({ category: "routers", page: 1 });
    expect(result).toMatchObject({ total: 1, unavailable: false });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.test/api/catalog/products?category=routers&page=1&pageSize=12");
    expect(init).toMatchObject({ next: { revalidate: 60 } });
  });

  it("encodes the slug when fetching one product", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okJson({ ...product, related: [] }));
    const result = await client(fetchImpl).getProduct("a b/c");
    expect(result.status).toBe("ok");
    expect(fetchImpl.mock.calls[0][0]).toBe("https://api.test/api/catalog/products/a%20b%2Fc");
  });

  it("collects every page of published products", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        okJson({ items: [{ ...product, slug: "a" }, { ...product, slug: "b" }], total: 3, page: 1, pageSize: 2 }),
      )
      .mockResolvedValueOnce(okJson({ items: [{ ...product, slug: "c" }], total: 3, page: 2, pageSize: 2 }));
    const c = createCatalogClient({
      baseUrl: "https://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      warn: () => {},
      sitemapPageSize: 2,
    });
    const all = await c.listAllPublishedProducts();
    expect(all.map((p) => p.slug)).toEqual(["a", "b", "c"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
