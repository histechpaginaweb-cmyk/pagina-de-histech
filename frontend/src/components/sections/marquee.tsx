import { cn } from "@/lib/utils";

/** Infinite horizontal marquee (CSS only). Duplicates items for seamless loop. */
export function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("group relative overflow-hidden mask-fade-x", className)}>
      <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-muted-foreground",
              itemClassName,
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
