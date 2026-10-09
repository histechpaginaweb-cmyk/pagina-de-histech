import { describe, expect, it } from "vitest";
import { parseMarkdown, safeUrl } from "./markdown";

describe("parseMarkdown", () => {
  it("shifts headings down so the page keeps a single h1", () => {
    expect(parseMarkdown("# Title\n## Sub\n### Deep")).toEqual([
      { type: "heading", level: 2, children: [{ type: "text", value: "Title" }] },
      { type: "heading", level: 3, children: [{ type: "text", value: "Sub" }] },
      { type: "heading", level: 4, children: [{ type: "text", value: "Deep" }] },
    ]);
  });

  it("groups lines into paragraphs and lists", () => {
    const blocks = parseMarkdown("Intro line\ncontinues\n\n- one\n- two\n\n1. first\n2. second");
    expect(blocks[0]).toMatchObject({ type: "paragraph" });
    expect(blocks[1]).toMatchObject({ type: "list", ordered: false });
    expect(blocks[2]).toMatchObject({ type: "list", ordered: true });
    expect((blocks[1] as { items: unknown[] }).items).toHaveLength(2);
  });

  it("parses inline emphasis, code and links", () => {
    const [p] = parseMarkdown("**bold** and *it* and `code` and [site](https://histech.com.co)");
    expect(p).toEqual({
      type: "paragraph",
      children: [
        { type: "strong", children: [{ type: "text", value: "bold" }] },
        { type: "text", value: " and " },
        { type: "em", children: [{ type: "text", value: "it" }] },
        { type: "text", value: " and " },
        { type: "code", value: "code" },
        { type: "text", value: " and " },
        { type: "link", href: "https://histech.com.co", children: [{ type: "text", value: "site" }] },
      ],
    });
  });

  it("never emits raw HTML: tags stay as text", () => {
    const [p] = parseMarkdown("<script>alert(1)</script> <img src=x onerror=alert(1)>");
    expect(p).toEqual({
      type: "paragraph",
      children: [{ type: "text", value: "<script>alert(1)</script> <img src=x onerror=alert(1)>" }],
    });
  });

  it("drops unsafe link targets but keeps the label", () => {
    const [p] = parseMarkdown("[click](javascript:alert(1)) and [d](data:text/html,x)");
    expect(JSON.stringify(p)).not.toContain("javascript");
    expect(JSON.stringify(p)).not.toContain('"link"');
    expect(JSON.stringify(p)).toContain("click");
  });

  it("returns an empty list for blank input", () => {
    expect(parseMarkdown("")).toEqual([]);
    expect(parseMarkdown("  \n\n ")).toEqual([]);
  });
});

describe("safeUrl", () => {
  it("allows http(s), mailto, tel and site-relative paths only", () => {
    expect(safeUrl("https://a.co/x")).toBe("https://a.co/x");
    expect(safeUrl("http://a.co")).toBe("http://a.co");
    expect(safeUrl("mailto:a@b.co")).toBe("mailto:a@b.co");
    expect(safeUrl("tel:+57300")).toBe("tel:+57300");
    expect(safeUrl("/tienda")).toBe("/tienda");
    expect(safeUrl("//evil.com")).toBeNull();
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl(" JaVaScRiPt:alert(1)")).toBeNull();
    expect(safeUrl("data:text/html,x")).toBeNull();
  });
});
