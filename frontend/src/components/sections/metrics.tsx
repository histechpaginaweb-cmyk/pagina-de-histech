import { Section, Container } from "@/components/ui/section";
import { RevealStagger } from "@/components/ui/reveal";
import { metrics } from "@/lib/content";

export function Metrics() {
  return (
    <Section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/10 via-white to-[#A855F7]/10 p-10 sm:p-14">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
          <RevealStagger className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                  {m.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </Container>
    </Section>
  );
}
