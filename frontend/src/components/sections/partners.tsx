import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LogoMarquee } from "./logo-marquee";
import { partnersByCategory } from "@/lib/partners";

export function Partners() {
  return (
    <Section id="aliados" className="border-y border-white/10 bg-white/[0.015]">
      <Container>
        <SectionHeader
          eyebrow="Aliados Tecnológicos"
          title={
            <>
              Avalado por <span className="text-gradient-brand">los mejores</span>
            </>
          }
          description="No improvisamos. Trabajamos con fabricantes líderes para garantizar la calidad y el respaldo de cada solución."
        />
      </Container>

      <div className="mt-12 space-y-4">
        {partnersByCategory.map((row, i) => (
          <Reveal key={row.category} delay={i * 0.05}>
            <LogoMarquee partners={row.items} reverse={i % 2 === 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
