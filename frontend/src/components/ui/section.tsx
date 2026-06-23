import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

/** Standard vertical rhythm wrapper for page sections. */
export function Section({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-28", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container", className)} {...props}>
      {children}
    </div>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <Badge>
          <span className="size-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="text-display-lg text-balance">{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
