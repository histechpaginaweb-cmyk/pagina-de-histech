import * as React from "react";
import Link from "next/link";
import { parseMarkdown, type Block, type Inline } from "@/lib/catalog/markdown";

const linkClass = "font-medium text-brand-purple underline-offset-2 hover:underline";

function renderInline(nodes: Inline[]): React.ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "text":
        return <React.Fragment key={i}>{node.value}</React.Fragment>;
      case "code":
        return (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
            {node.value}
          </code>
        );
      case "strong":
        return (
          <strong key={i} className="font-semibold text-foreground">
            {renderInline(node.children)}
          </strong>
        );
      case "em":
        return <em key={i}>{renderInline(node.children)}</em>;
      case "link":
        return node.href.startsWith("/") ? (
          <Link key={i} href={node.href} className={linkClass}>
            {renderInline(node.children)}
          </Link>
        ) : (
          <a key={i} href={node.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {renderInline(node.children)}
          </a>
        );
    }
  });
}

const HEADINGS = {
  2: "mt-10 font-display text-2xl font-bold text-foreground",
  3: "mt-8 font-display text-xl font-semibold text-foreground",
  4: "mt-6 font-display text-lg font-semibold text-foreground",
} as const;

function renderBlock(block: Block, i: number): React.ReactNode {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4";
      return (
        <Tag key={i} className={HEADINGS[block.level]}>
          {renderInline(block.children)}
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p key={i} className="mt-4 leading-relaxed text-foreground/85">
          {renderInline(block.children)}
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          key={i}
          className={`mt-4 space-y-2 pl-6 text-foreground/85 marker:text-brand-purple ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote key={i} className="mt-5 border-l-2 border-brand-purple bg-muted/50 py-2 pl-4 pr-3 italic text-foreground/85">
          {renderInline(block.children)}
        </blockquote>
      );
    case "hr":
      return <hr key={i} className="my-8 border-[#E5E7EB]" />;
  }
}

/** Renders admin-authored Markdown as plain React elements (no HTML passthrough). */
export function MarkdownContent({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  if (blocks.length === 0) return null;
  return <div className="max-w-3xl [&>*:first-child]:mt-0">{blocks.map(renderBlock)}</div>;
}
