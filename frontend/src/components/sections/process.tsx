import { Section, Container, SectionHeader } from "@/components/ui/section";
import { RevealStagger } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { process } from "@/lib/content";

export function Process() {
  return (
    <Section id="proceso">
      <Container>
        <SectionHeader
          eyebrow="¿Qué pasa después?"
          title={
            <>
              Un proceso <span className="text-gradient-brand">claro y sin fricción</span>
            </>
          }
          description="Desde la primera conversación hasta la propuesta, te acompañamos con transparencia total."
        />

        <RevealStagger className="mt-14 grid gap-6 md:grid-cols-3">
          {process.map((p, i) => (
            <div key={p.step} className="relative card-surface p-7">
              <div className="font-display text-5xl font-bold text-[#7C3AED]/15">
                {p.step}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              {i < process.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-6 top-9 hidden text-2xl text-brand-cyan/40 md:block"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </RevealStagger>

        <Reveal className="mt-10 flex justify-center">
          <Button href="/agenda-consultoria" size="lg">
            Agenda tu reunión
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
