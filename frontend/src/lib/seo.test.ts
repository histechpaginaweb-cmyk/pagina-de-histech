import { describe, expect, it } from "vitest";
import { buildMetadata } from "./seo";

describe("buildMetadata extensions", () => {
  it("keeps the default Open Graph image and indexing when no options are given", () => {
    const meta = buildMetadata({ title: "Contacto", path: "/contacto" });
    expect(meta.openGraph?.images).toEqual([
      { url: "/opengraph-image", width: 1200, height: 630, alt: "HISTECH" },
    ]);
    expect(meta.robots).toBeUndefined();
  });

  it("uses a custom Open Graph image (absolute url) when provided", () => {
    const meta = buildMetadata({ title: "P", path: "/tienda/producto/x", image: "/tienda/x.webp" });
    const og = meta.openGraph?.images as { url: string; alt: string }[];
    expect(og[0].url).toMatch(/^https?:\/\/.+\/tienda\/x\.webp$/);
    expect(og[0].alt).toBe("P | HISTECH");
    expect((meta.twitter?.images as string[])[0]).toMatch(/\/tienda\/x\.webp$/);
  });

  it("supports noindex while keeping the canonical", () => {
    const meta = buildMetadata({ title: "Tienda", path: "/tienda", noindex: true });
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.alternates?.canonical).toMatch(/\/tienda$/);
  });
});
