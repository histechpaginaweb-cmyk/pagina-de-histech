import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** Estilos tipográficos para el contenido MDX del blog. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 scroll-mt-24 font-display text-2xl font-bold text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 font-display text-xl font-semibold text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="mt-5 leading-relaxed text-foreground/85" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-foreground/85 marker:text-brand-cyan" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-foreground/85 marker:text-brand-cyan" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-7 border-l-2 border-brand-purple bg-white/[0.03] py-3 pl-5 pr-4 text-lg italic text-foreground/90"
      {...props}
    />
  ),
  a: ({ href = "#", ...props }) => {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-cyan underline-offset-2 hover:underline"
          {...props}
        />
      );
    }
    return (
      <Link
        href={href}
        className="font-medium text-brand-cyan underline-offset-2 hover:underline"
        {...props}
      />
    );
  },
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  code: (props) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-brand-cyan" {...props} />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
};
