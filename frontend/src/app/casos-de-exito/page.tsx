import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata, JsonLd, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { getCases } from "@/lib/get-cases";
import { servicesContent } from "@/lib/services-content";

export const metadata = buildMetadata({
  title: "Casos de Éxito",
  description:
    "Casos de éxito reales de HISTECH en automatización, integración de sistemas, inteligencia artificial y desarrollo de software. Resultados medibles: del reto a la solución.",
  path: "/casos-de-exito",
  keywords: [
    "casos de éxito tecnología",
    "casos de éxito automatización",
    "casos de éxito inteligencia artificial",
    "proyectos de transformación digital",
    "HISTECH resultados",
  ],
});

export default async function CasesPage() {
  const cases = await getCases();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Casos de éxito de HISTECH",
    itemListElement: cases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: c.title,
        about: c.category,
        description: `Reto: ${c.challenge} Solución: ${c.solution} Resultado: ${c.result}`,
        url: absoluteUrl(`/casos-de-exito#${c.slug}`),
      },
    })),
  };

  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Casos de Éxito", path: "/casos-de-exito" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Casos de Éxito</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Del caos operativo al ecosistema inteligente
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Proyectos reales donde transformamos procesos manuales en
              ecosistemas automatizados, seguros y escalables. Cada caso muestra
              el reto, la solución técnica y el resultado medible.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          <div className="grid gap-8">
            {cases.map((c) => {
              const related = c.relatedServices
                .map((slug) => servicesContent[slug])
                .filter(Boolean);
              return (
                <Reveal key={c.slug}>
                  <article
                    id={c.slug}
                    className="card-surface scroll-mt-28 overflow-hidden p-8 sm:p-10"
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                        <Icon name={c.icon} className="size-6 text-brand-cyan" />
                      </div>
                      <div>
                        <span className="eyebrow">{c.category}</span>
                        <h2 className="mt-1 text-2xl font-semibold">{c.title}</h2>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="font-display text-3xl font-bold text-gradient-brand">
                          {c.metric}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {c.metricLabel}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-cyan/80">
                          El reto
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {c.challenge}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-cyan/80">
                          La solución
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {c.solution}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#7C3AED]/10 to-[#A855F7]/10 p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-cyan/80">
                          El resultado
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                          {c.result}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {c.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {related.length > 0 && (
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E5E7EB] pt-5 text-sm">
                        <span className="text-muted-foreground">
                          Soluciones aplicadas:
                        </span>
                        {related.map((r) => (
                          <Link
                            key={r.slug}
                            href={`/${r.slug}`}
                            className="inline-flex items-center gap-1 font-medium text-brand-cyan"
                          >
                            {r.name}
                            <ArrowRight className="size-3.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Metodología */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Cómo lo logramos"
            title="Nuestra metodología: AS IS → TO BE → TO DO"
            align="left"
          />
          <RevealStagger className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "AS IS — El problema",
                d: "Diagnosticamos cuellos de botella, riesgos humanos y fugas de capital en tu operación actual.",
              },
              {
                t: "TO BE — La visión",
                d: "Diseñamos el estado futuro ideal: operaciones rentables, en tiempo real y sin fricciones.",
              },
              {
                t: "TO DO — La ejecución",
                d: "Construimos la arquitectura técnica (IA, RPA, APIs) para hacer la visión realidad.",
              },
            ].map((s) => (
              <div key={s.t} className="card-surface p-7">
                <h3 className="text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.d}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      <CtaBanner />

      <JsonLd
        data={webPageJsonLd({
          title: "Casos de Éxito de HISTECH",
          description:
            "Proyectos reales de automatización, IA, integración y desarrollo de software con resultados medibles.",
          path: "/casos-de-exito",
        })}
      />
      <JsonLd data={itemListLd} />
    </>
  );
}
