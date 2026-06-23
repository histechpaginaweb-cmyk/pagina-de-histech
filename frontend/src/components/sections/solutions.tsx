import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const featured = [
  {
    title: "Inteligencia Artificial Empresarial",
    href: "/inteligencia-artificial",
    icon: "BrainCircuit",
    description:
      "Agentes inteligentes, automatización y analítica avanzada para decisiones en tiempo real.",
    span: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    title: "Ciberseguridad",
    href: "/ciberseguridad",
    icon: "ShieldCheck",
    description: "Protección de perímetro, endpoints y cumplimiento normativo.",
  },
  {
    title: "Cloud y Continuidad",
    href: "/cloud-continuidad",
    icon: "Cloud",
    description: "Nube híbrida, respaldo y recuperación ante desastres.",
  },
  {
    title: "Transformación Digital",
    href: "/transformacion-digital",
    icon: "Workflow",
    description: "Estrategia y metodología para modernizar tu operación.",
  },
  {
    title: "Infraestructura de Redes",
    href: "/infraestructura-de-redes",
    icon: "Network",
    description: "Conectividad robusta zero-touch con networking inteligente.",
  },
];

export function Solutions() {
  return (
    <Section id="soluciones">
      <Container>
        <SectionHeader
          eyebrow="Soluciones Estratégicas"
          title={
            <>
              Un portafolio diseñado para{" "}
              <span className="text-gradient-brand">hacer crecer tu empresa</span>
            </>
          }
          description="Integramos tecnología de punta en cada capa de tu organización: desde la infraestructura hasta la inteligencia artificial que impulsa tus decisiones."
        />

        <RevealStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[200px]">
          {featured.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`card-surface group flex flex-col justify-between p-6 ${s.span ?? ""}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10 ${
                    s.featured ? "size-14" : "size-11"
                  }`}
                >
                  <Icon
                    name={s.icon}
                    className={`text-brand-cyan ${s.featured ? "size-7" : "size-5"}`}
                  />
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-cyan" />
              </div>
              <div className="mt-6">
                <h3
                  className={`font-display font-semibold ${
                    s.featured ? "text-2xl" : "text-lg"
                  }`}
                >
                  {s.title}
                </h3>
                <p
                  className={`mt-2 text-muted-foreground ${
                    s.featured ? "text-base max-w-md" : "text-sm"
                  }`}
                >
                  {s.description}
                </p>
              </div>
            </Link>
          ))}
        </RevealStagger>

        <Reveal className="mt-10 flex justify-center">
          <Button href="/servicios" variant="outline" size="lg">
            Ver todas las soluciones
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
