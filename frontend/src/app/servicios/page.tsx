import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { servicesContent, serviceSlugs } from "@/lib/services-content";

export const metadata = buildMetadata({
  title: "Soluciones y Servicios",
  description:
    "Portafolio completo de HISTECH: Inteligencia Artificial, Ciberseguridad, Cloud, Infraestructura, Transformación Digital y más.",
  path: "/servicios",
});

export default function ServicesPage() {
  const all = serviceSlugs.map((s) => servicesContent[s]);
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Soluciones", path: "/servicios" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Soluciones</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Tecnología integral para cada reto de tu empresa
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Desde la estrategia hasta la operación: un portafolio diseñado
              para hacer crecer tu organización con solidez y visión de futuro.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-8">
        <Container>
          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="card-surface group flex h-full flex-col p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={s.icon} className="size-6 text-brand-cyan" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.subtitle}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan">
                  Conocer más
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
