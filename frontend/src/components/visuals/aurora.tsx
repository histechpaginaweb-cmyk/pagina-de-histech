import { cn } from "@/lib/utils";

/**
 * Decorative ambient background: radial brand glow + faint grid.
 * Pure CSS, zero JS, paints behind content. aria-hidden.
 */
export function Aurora({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "soft" | "edge";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      {variant !== "soft" && (
        <>
          <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-purple/25 blur-[120px]" />
          <div className="absolute top-24 right-[8%] h-[360px] w-[360px] rounded-full bg-brand-cyan/15 blur-[110px]" />
          <div className="absolute top-40 left-[6%] h-[360px] w-[360px] rounded-full bg-brand-blue/20 blur-[110px]" />
        </>
      )}
      {variant === "soft" && (
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-purple/12 blur-[130px]" />
      )}
    </div>
  );
}
