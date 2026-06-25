import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { servicesContent } from "@/lib/services-content";
import { locationsContent, type LocationContent } from "@/lib/locations-content";

export function LocationPage({ data }: { data: LocationContent }) {
  const path = `/${data.slug}`;
  const services = data.services
    .map((slug) => servicesContent[slug])
    .filter(Boolean);
  const regions = Object.values(locationsContent).filter(
    (l) => l.scope === "regional" && l.slug !== data.slug,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: data.name, path },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>
              <MapPin className="size-3.5 text-brand-cyan" />
              {data.eyebrow}
            </Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">{data.title}</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {data.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/agenda-consultoria" size="lg">
                Agenda una consultoría
                <ArrowRight className="size-4" />
              </Button>
              <Button href="/contacto" variant="secondary" size="lg">
                Contáctanos
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Intro */}
      <Section className="py-10">
        <Container className="max-w-3xl">
          <Reveal className="space-y-4">
            {data.intro.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-foreground/90 text-pretty">
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* Highlights */}
      <Section className="py-12">
        <Container>
          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.highlights.map((h) => (
              <div key={h.title} className="card-surface h-full p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={h.icon} className="size-6 text-brand-cyan" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{h.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.description}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      {/* Context */}
      <Section className="py-12">
        <Container className="max-w-3xl">
          <SectionHeader eyebrow="El contexto" title={data.context.heading} align="left" />
          <Reveal className="mt-6 space-y-4">
            {data.context.body.map((p, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </Reveal>

          {data.showAddress && (
            <Reveal className="mt-8">
              <div className="card-surface grid gap-4 p-7 sm:grid-cols-3">
                <a
                  href={siteConfig.contact.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3"
                >
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand-cyan" />
                  <span className="text-sm text-foreground/90">
                    {siteConfig.contact.address}, {siteConfig.contact.city}
                  </span>
                </a>
                <a href={`tel:${siteConfig.contact.phoneRaw}`} className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-brand-cyan" />
                  <span className="text-sm text-foreground/90">{siteConfig.contact.phone}</span>
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-brand-cyan" />
                  <span className="text-sm text-foreground/90">{siteConfig.contact.email}</span>
                </a>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* Servicios destacados */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Soluciones HISTECH"
            title={`Cómo ayudamos a las empresas de ${data.name}`}
            align="left"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="card-surface group p-6">
                <Icon name={s.icon} className="size-7 text-brand-cyan" />
                <h3 className="mt-4 font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-cyan">
                  Conocer más
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {data.scope === "nacional" && regions.length > 0 && (
        <Section className="py-12">
          <Container>
            <SectionHeader eyebrow="Presencia regional" title="Cobertura por región" align="left" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="card-surface group p-6">
                  <MapPin className="size-6 text-brand-cyan" />
                  <h3 className="mt-4 font-semibold">{r.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.subtitle}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-cyan">
                    Ver cobertura
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Faq items={data.faqs} title={`Preguntas frecuentes · ${data.name}`} />
      <CtaBanner />

      <JsonLd
        data={webPageJsonLd({ title: data.title, description: data.subtitle, path })}
      />
    </>
  );
}
