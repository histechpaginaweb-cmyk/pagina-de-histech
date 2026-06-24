import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { PartnerLogo } from "./partner-logo";
import { homePartners } from "@/lib/partners";

export function Partners() {
  return (
    <Section id="aliados" className="border-y border-[#E5E7EB] bg-[#FAFAFB]">
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

      <Container>
        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
          {homePartners.map((p) => (
            <PartnerLogo key={p.name} partner={p} />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
