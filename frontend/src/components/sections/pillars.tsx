import { Section, Container, SectionHeader } from "@/components/ui/section";
import { RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { pillars } from "@/lib/content";

export function Pillars() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Por qué HISTECH"
          title={
            <>
              Más que un proveedor,{" "}
              <span className="text-gradient-brand">un aliado estratégico</span>
            </>
          }
          description="Cuatro principios que guían cada solución que entregamos."
        />

        <RevealStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card-surface group h-full p-7">
              <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10 transition group-hover:scale-105">
                <Icon name={p.icon} className="size-6 text-brand-cyan" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
