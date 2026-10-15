import { describe, expect, it } from "vitest";
import { categoryFaqJsonLd, CATEGORY_FAQ_SLUGS, getCategoryFaq } from "./category-faq";

describe("category FAQ", () => {
  it("covers the known category slugs", () => {
    expect([...CATEGORY_FAQ_SLUGS].sort()).toEqual(
      [
        "convertidores-medios",
        "inyectores-poe",
        "networking-industrial",
        "routers-firewalls",
        "switches",
        "switches-poe",
        "transceptores-fibra",
      ].sort(),
    );
  });

  it("has 3 to 5 non-empty Q&A per category", () => {
    for (const slug of CATEGORY_FAQ_SLUGS) {
      const faq = getCategoryFaq(slug)!;
      expect(faq.length).toBeGreaterThanOrEqual(3);
      expect(faq.length).toBeLessThanOrEqual(5);
      for (const item of faq) {
        expect(item.q.trim().endsWith("?")).toBe(true);
        expect(item.a.trim().length).toBeGreaterThan(40);
      }
    }
  });

  it("returns undefined for unknown slugs", () => {
    expect(getCategoryFaq("desconocida")).toBeUndefined();
  });

  it("builds FAQPage JSON-LD from the same data as the visible FAQ", () => {
    const faq = getCategoryFaq("switches-poe")!;
    const ld = categoryFaqJsonLd(faq);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity.map((e) => [e.name, e.acceptedAnswer.text])).toEqual(faq.map((f) => [f.q, f.a]));
  });
});
