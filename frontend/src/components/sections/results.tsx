import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { RevealStagger, Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { results } from "@/lib/content";

export function Results() {
  return (
    <Section id="resultados" className="relative">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px]" />
      </div>
      <Container>
        <SectionHeader
          eyebrow="Resultados Reales"
          title={
            <>
              Impacto medible, <span className="text-gradient-brand">no promesas</span>
            </>
          }
          description="Proyectos reales de transformación. Por confidencialidad, algunos casos se presentan de forma anónima por tipo de resultado obtenido."
        />

        <RevealStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <article key={r.title} className="card-surface group h-full p-7">
              <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                <Icon name={r.icon} className="size-6 text-brand-cyan" />
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-gradient-brand">
                  {r.metric}
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.metricLabel}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
            </article>
          ))}
        </RevealStagger>

        <Reveal className="mt-10 flex justify-center">
          <Button href="/resultados" variant="outline" size="lg">
            Ver todos los resultados
            <ArrowRight className="size-4" />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
