import Link from "next/link";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { RevealStagger } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { sectors } from "@/lib/content";

export function Sectors() {
  return (
    <Section id="industrias">
      <Container>
        <SectionHeader
          eyebrow="Sectores"
          title={
            <>
              Resolvemos desafíos de TI{" "}
              <span className="text-gradient-brand">en todas las industrias</span>
            </>
          }
          description="Conocemos las necesidades, regulaciones y oportunidades específicas de cada sector."
        />

        <RevealStagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {sectors.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="card-surface group flex items-center gap-4 p-5"
            >
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] transition group-hover:border-[#7C3AED]/20 group-hover:bg-[#7C3AED]/10">
                <Icon name={s.icon} className="size-6 text-brand-cyan" />
              </div>
              <span className="font-medium text-foreground/90 group-hover:text-foreground">
                {s.label}
              </span>
            </Link>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
