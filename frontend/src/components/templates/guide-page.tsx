import Link from "next/link";
import { ArrowRight, Clock, Check, Sparkles } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd, articleJsonLd, webPageJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/blog";
import { servicesContent } from "@/lib/services-content";
import { guides, type Guide } from "@/lib/resources-content";

/** Renderiza un párrafo con enlaces markdown internos [texto](/ruta). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          return (
            <Link
              key={i}
              href={m[2]}
              className="font-medium text-brand-cyan underline decoration-brand-cyan/30 underline-offset-2 transition hover:decoration-brand-cyan"
            >
              {m[1]}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function GuidePage({ data }: { data: Guide }) {
  const path = `/recursos/${data.slug}`;
  const related = data.relatedServices
    .map((slug) => servicesContent[slug])
    .filter(Boolean);
  const relatedGuides = data.relatedGuides
    .map((slug) => guides[slug])
    .filter(Boolean);

  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Recursos", path: "/recursos" },
    { name: data.title, path },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-8 pt-32 sm:pt-40">
        <Aurora variant="soft" />
        <Container className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <Reveal className="mt-8">
            <Badge>{data.category}</Badge>
            <h1 className="mt-5 text-display-lg text-balance">
              <span className="text-gradient">{data.title}</span>
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Actualizado: {formatDate(data.updated)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {data.readingTime}
              </span>
            </div>
            <p className="mt-6 text-xl leading-relaxed text-foreground/90 text-pretty">
              {data.intro}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Respuesta rápida (AEO / AI Overviews) */}
      <Section className="pt-4">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/10 via-white to-[#A855F7]/10 p-7 sm:p-9">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-cyan">
                <Sparkles className="size-4" />
                Respuesta rápida
              </div>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90 text-pretty">
                {data.quickAnswer}
              </p>
              <ul className="mt-6 grid gap-3">
                {data.keyPoints.map((k) => (
                  <li key={k} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                      <Check className="size-3.5 text-brand-cyan" />
                    </span>
                    <span className="text-foreground/90">{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Cuerpo del artículo */}
      <Section className="pt-8">
        <Container className="max-w-3xl">
          <article className="space-y-12">
            {data.sections.map((s) => (
              <Reveal key={s.heading}>
                <section>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {s.heading}
                  </h2>
                  {s.body?.map((p, i) => (
                    <p
                      key={i}
                      className="mt-4 leading-relaxed text-muted-foreground"
                    >
                      <RichText text={p} />
                    </p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-5 grid gap-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                            <Check className="size-3.5 text-brand-cyan" />
                          </span>
                          <span className="text-foreground/90">
                            <RichText text={b} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            ))}
          </article>
        </Container>
      </Section>

      {/* Servicios relacionados (interlinking semántico) */}
      {related.length > 0 && (
        <Section className="py-12">
          <Container>
            <SectionHeader
              eyebrow="Soluciones HISTECH"
              title="Servicios relacionados"
              align="left"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="card-surface group p-6">
                  <Icon name={r.icon} className="size-7 text-brand-cyan" />
                  <h3 className="mt-4 font-semibold">{r.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-cyan">
                    Conocer más
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Guías relacionadas */}
      {relatedGuides.length > 0 && (
        <Section className="pb-12 pt-0">
          <Container>
            <SectionHeader
              eyebrow="Sigue aprendiendo"
              title="Guías relacionadas"
              align="left"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {relatedGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/recursos/${g.slug}`}
                  className="card-surface group flex h-full flex-col p-7"
                >
                  <Badge>{g.category}</Badge>
                  <h3 className="mt-4 text-lg font-semibold">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {g.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan">
                    Leer guía
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Faq items={data.faqs} title="Preguntas frecuentes" />
      <CtaBanner />

      <JsonLd
        data={articleJsonLd({
          title: data.title,
          description: data.description,
          path,
          date: data.date,
          author: "Equipo HISTECH",
        })}
      />
      <JsonLd data={webPageJsonLd({ title: data.title, description: data.description, path })} />
    </>
  );
}
