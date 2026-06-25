import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { results } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Resultados Reales",
  description:
    "Proyectos reales de transformación con impacto medible. Casos presentados de forma anónima por tipo de resultado obtenido.",
  path: "/resultados",
});

export default function ResultsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Resultados", path: "/resultados" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Resultados Reales</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">Impacto medible, no promesas</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Estos son resultados de proyectos reales de transformación
              tecnológica, automatización e inteligencia artificial. Por
              confidencialidad, algunos casos se presentan de forma anónima por
              tipo de resultado obtenido.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Casos por tipo de impacto"
              title="Lo que logramos para nuestros clientes"
              align="left"
            />
            <Button href="/casos-de-exito" variant="secondary">
              Ver casos de éxito detallados
            </Button>
          </div>
          <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <article key={r.title} className="card-surface h-full p-7">
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
                <h2 className="mt-3 text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.description}
                </p>
              </article>
            ))}
          </RevealStagger>

          <Reveal className="mt-10">
            <p className="rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6] p-6 text-sm text-muted-foreground">
              <strong className="text-foreground">Nota de confidencialidad:</strong>{" "}
              respetamos los acuerdos con nuestros clientes. Por estrategia
              comercial, los casos pueden mostrarse por sector o tipo de
              proyecto, e incorporar nombres de clientes autorizados en una fase
              posterior.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
