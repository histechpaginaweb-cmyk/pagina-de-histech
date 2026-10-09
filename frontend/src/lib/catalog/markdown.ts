/**
 * Minimal, safe Markdown subset for product descriptions authored in the admin.
 *
 * The parser produces a small AST that React renders as elements, so text is
 * always escaped: there is no HTML passthrough and no JSX/expression evaluation
 * (unlike MDX, which `next-mdx-remote` evaluates as code). Supported: headings,
 * paragraphs, bullet/numbered lists, blockquotes, horizontal rules, and inline
 * bold, italic, code and links.
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; children: Inline[] }
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "blockquote"; children: Inline[] }
  | { type: "hr" };

/** http(s), mailto, tel and site-relative paths only. Returns `null` for anything else. */
export function safeUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  if (url.startsWith("/")) return url.startsWith("//") ? null : url;
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : null;
}

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|__(.+?)__|\*(?!\s)(.+?)\*|_(?!\s)(.+?)_|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/;

function pushText(out: Inline[], value: string) {
  if (!value) return;
  const last = out[out.length - 1];
  if (last?.type === "text") last.value += value;
  else out.push({ type: "text", value });
}

export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let rest = source;
  while (rest) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match) {
      pushText(out, rest);
      break;
    }
    pushText(out, rest.slice(0, match.index));
    const [whole, strongA, strongB, emA, emB, code, label, href] = match;
    if (strongA ?? strongB) out.push({ type: "strong", children: parseInline((strongA ?? strongB)!) });
    else if (emA ?? emB) out.push({ type: "em", children: parseInline((emA ?? emB)!) });
    else if (code) out.push({ type: "code", value: code });
    else {
      const safe = safeUrl(href);
      if (safe) out.push({ type: "link", href: safe, children: parseInline(label) });
      else out.push(...parseInline(label)); // unsafe target: keep the label only
    }
    rest = rest.slice(match.index + whole.length);
  }
  return out;
}

const HEADING = /^(#{1,3})\s+(.+?)\s*#*$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const QUOTE = /^\s*>\s?(.*)$/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", children: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: list.items.map(parseInline) });
    list = null;
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = (heading[1].length + 1) as 2 | 3 | 4; // page title is the only h1
      blocks.push({ type: "heading", level, children: parseInline(heading[2]) });
      continue;
    }
    if (RULE.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    const quote = QUOTE.exec(line);
    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: "blockquote", children: parseInline(quote[1]) });
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return blocks;
}
