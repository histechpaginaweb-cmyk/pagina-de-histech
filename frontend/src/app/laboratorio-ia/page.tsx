import { ArrowRight } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Aurora } from "@/components/visuals/aurora";
import { NeuralNetwork } from "@/components/visuals/neural-network";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Laboratorio de Innovación e IA",
  description:
    "Nuestro espacio dedicado a proyectos emergentes: IA generativa, automatización avanzada, agentes inteligentes y soluciones de próxima generación.",
  path: "/laboratorio-ia",
});

const initiatives = [
  {
    title: "IA Generativa Aplicada",
    description:
      "Exploramos modelos generativos para crear contenido, asistir a equipos y acelerar procesos empresariales.",
    icon: "Sparkles",
  },
  {
    title: "Agentes Autónomos",
    description:
      "Agentes que ejecutan tareas de extremo a extremo dentro de tus sistemas, con supervisión humana.",
    icon: "BrainCircuit",
  },
  {
    title: "Automatización Avanzada",
    description:
      "Combinamos RPA, IA y orquestación para automatizar procesos complejos y de alto valor.",
    icon: "Workflow",
  },
  {
    title: "Analítica Predictiva",
    description:
      "Modelos que anticipan comportamientos, riesgos y oportunidades para decidir con ventaja.",
    icon: "Activity",
  },
  {
    title: "Visión por Computadora",
    description:
      "Procesamiento de imágenes para control de calidad, seguridad y automatización industrial.",
    icon: "Eye",
  },
  {
    title: "Integración Inteligente",
    description:
      "Conectamos IA con tus sistemas mediante APIs seguras y arquitecturas escalables.",
    icon: "Network",
  },
];

export default function LabPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <div className="absolute inset-0 -z-10">
          <NeuralNetwork className="absolute inset-0 h-full w-full opacity-50" />
        </div>
        <Aurora variant="soft" />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Laboratorio IA", path: "/laboratorio-ia" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>
              <span className="size-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
              Laboratorio de Innovación
            </Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Donde la próxima generación de tecnología toma forma
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Un espacio dedicado a proyectos emergentes: IA generativa,
              automatización avanzada, agentes inteligentes y soluciones de
              próxima generación que llevamos del experimento a tu operación.
            </p>
            <div className="mt-8">
              <Button href="/agenda-consultoria" size="lg">
                Co-crea con nosotros
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          <SectionHeader
            eyebrow="Líneas de investigación"
            title="En qué estamos trabajando"
            align="left"
          />
          <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((i) => (
              <div key={i.title} className="card-surface h-full p-7">
                <div className="inline-flex size-12 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                  <Icon name={i.icon} className="size-6 text-brand-cyan" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{i.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {i.description}
                </p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
