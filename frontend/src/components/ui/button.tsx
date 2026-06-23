import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-[0_10px_30px_-10px_rgba(111,61,255,0.7)] hover:shadow-[0_16px_45px_-12px_rgba(111,61,255,0.9)] hover:-translate-y-0.5",
        secondary:
          "glass text-foreground hover:border-brand-purple/50 hover:bg-[#7C3AED]/[0.05]",
        outline:
          "border border-[#E5E7EB] text-foreground hover:bg-[#7C3AED]/[0.04] hover:border-[#7C3AED]/40",
        ghost: "text-foreground/80 hover:text-foreground hover:bg-[#7C3AED]/[0.06]",
        accent:
          "bg-brand-cyan text-brand-space font-semibold hover:shadow-glow-cyan hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base py-3.5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type CommonProps = VariantProps<typeof buttonVariants> & { className?: string };

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { className, variant, size } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (typeof props.href === "string") {
    const { href, variant: _v, size: _s, className: _c, ...rest } = props;
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("tel:");
    if (isExternal) {
      return <a href={href} className={classes} {...rest} />;
    }
    return <Link href={href} className={classes} {...rest} />;
  }

  const { variant: _v, size: _s, className: _c, ...rest } = props;
  return <button className={classes} {...rest} />;
}

export { buttonVariants };
