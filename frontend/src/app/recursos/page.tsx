import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/blog";
import { guides } from "@/lib/resources-content";

export const metadata = buildMetadata({
  title: "Centro de Conocimiento",
  description:
    "Guías prácticas sobre inteligencia artificial, automatización, ciberseguridad y transformación digital para empresas. Contenido educativo de HISTECH.",
  path: "/recursos",
  keywords: [
    "centro de conocimiento",
    "guías de transformación digital",
    "recursos de inteligencia artificial",
    "guías de ciberseguridad empresarial",
  ],
});

export default function RecursosPage() {
  const all = Object.values(guides);

  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Recursos", path: "/recursos" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Centro de Conocimiento</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Guías para liderar la transformación tecnológica
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Explicaciones claras y prácticas sobre inteligencia artificial,
              automatización, ciberseguridad y transformación digital. Contenido
              que aporta valor antes de vender.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((g) => (
              <Link
                key={g.slug}
                href={`/recursos/${g.slug}`}
                className="card-surface group flex h-full flex-col p-7"
              >
                <Badge>{g.category}</Badge>
                <h2 className="mt-4 text-lg font-semibold">{g.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
                <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(g.updated)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {g.readingTime}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan">
                  Leer guía
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
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
