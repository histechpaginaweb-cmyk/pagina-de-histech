import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { servicesContent, type ServiceContent } from "@/lib/services-content";
import { getServiceTexts } from "@/lib/get-service-texts";

export async function ServicePage({ data }: { data: ServiceContent }) {
  const related = data.related
    .map((slug) => servicesContent[slug])
    .filter(Boolean);

  // Textos editables desde el admin (R2). Si no hay override, usa el estático.
  const overrides = await getServiceTexts();
  const o = overrides[data.slug] ?? {};
  const title = o.title ?? data.title;
  const subtitle = o.subtitle ?? data.subtitle;
  const intro = o.intro ?? data.intro;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Soluciones", path: "/servicios" },
              { name: data.name, path: `/${data.slug}` },
            ]}
          />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <Badge>
                <Icon name={data.icon} className="size-3.5 text-brand-cyan" />
                {data.eyebrow}
              </Badge>
              <h1 className="mt-5 text-display-xl text-balance">
                <span className="text-gradient">{title}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {subtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/agenda-consultoria" size="lg">
                  Solicitar Asesoría
                  <ArrowRight className="size-4" />
                </Button>
                <Button href="/contacto" variant="secondary" size="lg">
                  Contáctanos
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {data.image ? (
                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] shadow-glow">
                  {/* Glow decorativo detrás de la imagen */}
                  <span
                    aria-hidden
                    className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#7C3AED]/30 to-[#A855F7]/20 blur-2xl"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.image}
                    alt={`HISTECH — ${data.name}`}
                    width={1200}
                    height={800}
                    decoding="async"
                    loading="eager"
                    className="aspect-[3/2] h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative mx-auto aspect-square w-full max-w-md">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative grid size-40 place-items-center rounded-[2rem] border border-[#E5E7EB] bg-white shadow-glow backdrop-blur">
                      <Icon name={data.icon} className="size-20 text-brand-cyan" />
                      <span className="absolute -inset-10 rounded-full border border-dashed border-[#7C3AED]/25 animate-spin-slow" />
                      <span className="absolute -inset-20 rounded-full border border-[#7C3AED]/15 animate-spin-slow [animation-direction:reverse]" />
                    </div>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <Section className="py-12">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="text-xl leading-relaxed text-foreground/90 text-pretty">
              {intro}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Capacidades"
            title="Qué incluye este servicio"
            align="left"
          />
          <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.capabilities.map((c) => (
              <div key={c.title} className="card-surface h-full p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={c.icon} className="size-6 text-brand-cyan" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      {/* Benefits */}
      <Section className="py-12">
        <Container>
          <div className="rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/10 via-white to-[#A855F7]/10 p-8 sm:p-12">
            <SectionHeader eyebrow="Beneficios" title="El impacto en tu negocio" align="left" />
            <RevealStagger className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {data.benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                    <Check className="size-3.5 text-brand-cyan" />
                  </span>
                  <span className="text-foreground/90">{b}</span>
                </div>
              ))}
            </RevealStagger>
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="py-12">
          <Container>
            <SectionHeader eyebrow="Continúa explorando" title="Soluciones relacionadas" align="left" />
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

      <Faq items={data.faqs} title="Preguntas frecuentes" />
      <CtaBanner />
    </>
  );
}
