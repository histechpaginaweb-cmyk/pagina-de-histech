import { describe, expect, it } from "vitest";
import { canOptimizeImage, productImageAlt } from "./images";

describe("canOptimizeImage", () => {
  it("optimizes site-relative and https images", () => {
    expect(canOptimizeImage("/tienda/rut956.webp")).toBe(true);
    expect(canOptimizeImage("https://cdn.example.com/a.jpg")).toBe(true);
  });

  it("skips the optimizer for plain http or unknown schemes (next/image would throw)", () => {
    expect(canOptimizeImage("http://cdn.example.com/a.jpg")).toBe(false);
    expect(canOptimizeImage("ftp://x/a.jpg")).toBe(false);
    expect(canOptimizeImage("//cdn.example.com/a.jpg")).toBe(false);
  });
});

describe("productImageAlt", () => {
  it("prefers the authored alt text", () => {
    expect(productImageAlt({ url: "/a.jpg", alt: "  Vista frontal  " }, "RUT956", 0)).toBe("Vista frontal");
  });

  it("falls back to the product name with the image position", () => {
    expect(productImageAlt({ url: "/a.jpg", alt: "" }, "RUT956", 0)).toBe("RUT956");
    expect(productImageAlt({ url: "/a.jpg", alt: "" }, "RUT956", 2)).toBe("RUT956 — imagen 3");
  });
});
