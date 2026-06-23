import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { industriesContent, industrySlugs } from "@/lib/industries-content";

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = industriesContent[slug];
  if (!data) return {};
  return buildMetadata({
    title: `${data.name} — Soluciones por Industria`,
    description: data.subtitle,
    path: `/industrias/${data.slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = industriesContent[slug];
  if (!data) notFound();

  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Industrias", path: "/industrias" },
              { name: data.name, path: `/industrias/${data.slug}` },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>
              <Icon name={data.icon} className="size-3.5 text-brand-cyan" />
              Industria · {data.name}
            </Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">{data.title}</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {data.subtitle}
            </p>
            <div className="mt-8">
              <Button href="/agenda-consultoria" size="lg">
                Hablar con un especialista
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Outcomes */}
      <Section className="py-10">
        <Container>
          <RevealStagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {data.outcomes.map((o) => (
              <div key={o.label} className="card-surface p-7 text-center">
                <div className="font-display text-3xl font-bold text-gradient-brand">
                  {o.metric}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{o.label}</p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      {/* Intro + Challenges */}
      <Section className="py-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeader eyebrow="El contexto" title="Tu sector, a fondo" align="left" />
              <p className="mt-5 text-lg leading-relaxed text-foreground/90">
                {data.intro}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-cyan/80">
                Retos que resolvemos
              </h3>
              <ul className="mt-5 space-y-3">
                {data.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                      <Check className="size-3.5 text-brand-cyan" />
                    </span>
                    <span className="text-foreground/90">{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Recommended solutions */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Soluciones recomendadas"
            title="Cómo te ayudamos"
            align="left"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.solutions.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="card-surface group p-6">
                <h3 className="font-semibold">{s.service}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-cyan">
                  Ver solución
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
