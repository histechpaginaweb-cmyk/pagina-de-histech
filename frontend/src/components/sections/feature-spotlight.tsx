import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type FeatureSpotlightProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
  href: string;
  cta?: string;
  icon: string;
  reverse?: boolean;
  /** Imagen alusiva (en /public/inicio/<slug>.png). Si falta, se usa el visual de ícono. */
  image?: string;
  /** decorative visual variant */
  visual?: "orbit" | "shield" | "grid" | "stream";
};

export function FeatureSpotlight({
  eyebrow,
  title,
  description,
  bullets,
  href,
  cta = "Conocer más",
  icon,
  reverse = false,
  image,
  visual = "orbit",
}: FeatureSpotlightProps) {
  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <Reveal>
            <Badge>
              <Icon name={icon} className="size-3.5 text-brand-cyan" />
              {eyebrow}
            </Badge>
            <h2 className="mt-5 text-display-lg text-balance">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                    <Check className="size-3 text-brand-cyan" />
                  </span>
                  <span className="text-foreground/90">{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={href}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan"
            >
              {cta}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            {image ? (
              <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={eyebrow}
                  width={1200}
                  height={800}
                  decoding="async"
                  loading="lazy"
                  className="aspect-[3/2] h-full w-full object-cover"
                />
              </div>
            ) : (
              <SpotlightVisual variant={visual} icon={icon} />
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function SpotlightVisual({
  variant,
  icon,
}: {
  variant: FeatureSpotlightProps["visual"];
  icon: string;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#F7F6FB] to-white">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-purple/20 blur-[90px]" />
      <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-brand-cyan/15 blur-[90px]" />

      {/* central glyph */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid size-28 place-items-center rounded-3xl border border-[#E5E7EB] bg-white shadow-glow backdrop-blur">
          <Icon name={icon} className="size-12 text-brand-cyan" />
          {variant === "orbit" && (
            <>
              <span className="absolute -inset-8 rounded-full border border-dashed border-[#7C3AED]/25 animate-spin-slow" />
              <span className="absolute -inset-16 rounded-full border border-[#7C3AED]/15 animate-spin-slow [animation-direction:reverse]" />
              <span className="absolute -top-8 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-brand-cyan animate-pulse-glow" />
            </>
          )}
          {variant === "shield" && (
            <span className="absolute -inset-10 rounded-3xl border border-brand-purple/30 animate-pulse-glow" />
          )}
          {variant === "stream" && (
            <>
              <span className="absolute left-0 top-1/2 h-px w-32 -translate-x-full bg-gradient-to-r from-transparent to-brand-cyan" />
              <span className="absolute right-0 top-1/3 h-px w-32 translate-x-full bg-gradient-to-l from-transparent to-brand-purple" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
