import { describe, expect, it } from "vitest";
import { absoluteUrl, cn } from "@/lib/utils";

describe("utils smoke test", () => {
  it("merges conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("builds absolute urls with a single leading slash", () => {
    expect(absoluteUrl("/tienda")).toMatch(/\/tienda$/);
    expect(absoluteUrl("tienda")).toMatch(/\/tienda$/);
  });
});
