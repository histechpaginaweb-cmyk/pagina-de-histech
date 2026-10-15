import { Section, Container } from "@/components/ui/section";
import { categoryFaqJsonLd, type FaqItem } from "@/lib/catalog/category-faq";
import { JsonLd } from "@/lib/seo";

/** Visible FAQ plus FAQPage JSON-LD, both rendered from the same items. */
export function CategoryFaq({ categoryName, faq }: { categoryName: string; faq: FaqItem[] }) {
  return (
    <Section className="py-10 sm:py-12">
      <Container>
        <h2 className="font-display text-2xl font-bold">Preguntas frecuentes sobre {categoryName}</h2>
        <dl className="mt-6 max-w-3xl space-y-6">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold">{item.q}</dt>
              <dd className="mt-2 text-muted-foreground text-pretty">{item.a}</dd>
            </div>
          ))}
        </dl>
        <JsonLd data={categoryFaqJsonLd(faq)} />
      </Container>
    </Section>
  );
}
