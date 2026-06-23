import { cn } from "@/lib/utils";
import { PartnerLogo } from "./partner-logo";
import type { Partner } from "@/lib/partners";

/** Marquee infinito de logos de partners (CSS). Duplica para loop continuo. */
export function LogoMarquee({
  partners,
  className,
  reverse = false,
}: {
  partners: Partner[];
  className?: string;
  reverse?: boolean;
}) {
  const doubled = [...partners, ...partners];
  return (
    <div className={cn("group relative overflow-hidden mask-fade-x", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {doubled.map((p, i) => (
          <PartnerLogo key={`${p.name}-${i}`} partner={p} />
        ))}
      </div>
    </div>
  );
}
