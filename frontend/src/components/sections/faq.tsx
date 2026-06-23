import { Plus } from "lucide-react";
import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd, faqJsonLd } from "@/lib/seo";

type Faq = { q: string; a: string };

export function Faq({
  items,
  eyebrow = "Preguntas frecuentes",
  title = "Resolvemos tus dudas",
}: {
  items: readonly Faq[];
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  return (
    <Section id="faq">
      <Container className="max-w-3xl">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <Reveal className="mt-12 space-y-3">
          {items.map((f) => (
            <details
              key={f.q}
              className="group card-surface overflow-hidden p-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-left font-medium">
                {f.q}
                <Plus className="size-5 shrink-0 text-brand-cyan transition group-open:rotate-45" />
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </Reveal>
      </Container>
      <JsonLd data={faqJsonLd(items as Faq[])} />
    </Section>
  );
}
