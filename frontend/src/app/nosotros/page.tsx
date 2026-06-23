import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Metrics } from "@/components/sections/metrics";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { pillars } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Nosotros",
  description:
    "Somos HISTECH: profesionales apasionados por la tecnología, comprometidos con la transformación digital y el éxito de las empresas colombianas.",
  path: "/nosotros",
});

const values = [
  { title: "Pasión", description: "Trabajamos con compromiso y entusiasmo por transformar organizaciones a través de la tecnología.", icon: "Heart" },
  { title: "Respeto", description: "Valoramos a las personas, sus ideas y su diversidad, con relaciones basadas en confianza y empatía.", icon: "HeartHandshake" },
  { title: "Excelencia", description: "Nos exigimos al máximo para ofrecer soluciones que superen las expectativas de nuestros clientes.", icon: "Award" },
  { title: "Mejora", description: "Creemos en la evolución constante: aprender cada día para innovar y adaptarnos al futuro.", icon: "TrendingUp" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Nosotros", path: "/nosotros" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Nosotros</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Personas que trabajan para personas
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {siteConfig.tagline} Somos profesionales con amplia experiencia en
              proyectos tecnológicos, adopción digital e implementaciones
              corporativas a la medida.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Misión / Visión */}
      <Section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card-surface h-full p-8">
                <h2 className="font-display text-2xl font-bold text-gradient-brand">
                  Misión
                </h2>
                <p className="mt-4 leading-relaxed text-foreground/90">
                  HISTECH impulsa la adopción tecnológica a través de alianzas
                  con fabricantes especializados y servicios en redes,
                  ciberseguridad y cómputo. Ofrecemos soluciones digitales
                  adaptadas a tus necesidades, orientadas a cumplir tus
                  objetivos de negocio y generar impacto social en distintos
                  sectores del país.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-surface h-full p-8">
                <h2 className="font-display text-2xl font-bold text-gradient-brand">
                  Visión
                </h2>
                <p className="mt-4 leading-relaxed text-foreground/90">
                  Aspiramos a ser un aliado de confianza para nuestros clientes,
                  respaldados por un sólido proceso de consultoría y un
                  compromiso inquebrantable con la excelencia. Buscamos
                  distinguirnos por calidad, rendimiento y fiabilidad,
                  fortaleciendo relaciones duraderas.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Pilares */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Nuestros pilares"
            title="Lo que nos mueve"
            align="left"
          />
          <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="card-surface h-full p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={p.icon} className="size-6 text-brand-cyan" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      {/* Valores */}
      <Section className="py-12">
        <Container>
          <SectionHeader
            eyebrow="Valores corporativos"
            title="Cómo trabajamos"
            align="left"
          />
          <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card-surface h-full p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={v.icon} className="size-6 text-brand-cyan" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      <Metrics />
      <CtaBanner />
    </>
  );
}
