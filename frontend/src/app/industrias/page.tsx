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
import { industriesContent, industrySlugs } from "@/lib/industries-content";

export const metadata = buildMetadata({
  title: "Soluciones por Industria",
  description:
    "Soluciones tecnológicas adaptadas a cada sector: manufactura, salud, banca, retail, educación, sector público y más.",
  path: "/industrias",
});

export default function IndustriesPage() {
  const all = industrySlugs.map((s) => industriesContent[s]);
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Industrias", path: "/industrias" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Industrias</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Resolvemos desafíos de TI en todas las industrias
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Conocemos las necesidades, regulaciones y oportunidades de cada
              sector. Elige el tuyo y descubre cómo podemos ayudarte.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-8">
        <Container>
          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((s) => (
              <Link
                key={s.slug}
                href={`/industrias/${s.slug}`}
                className="card-surface group flex h-full flex-col p-7"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={s.icon} className="size-6 text-brand-cyan" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.subtitle}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan">
                  Ver industria
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
