import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, ServerCrash } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { ProductAdvisorActions } from "@/components/catalog/advisor-actions";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";
import { MarkdownContent } from "@/components/catalog/markdown-content";
import { PriceBlock } from "@/components/catalog/price-block";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { SpecsTable } from "@/components/catalog/specs-table";
import { getAllCatalogProducts, getCatalogProduct } from "@/lib/get-catalog";
import { productReference } from "@/lib/catalog/contact";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

// ISR: the product is rebuilt at most every 60s after the first request.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Empty when the backend is unreachable: pages are then rendered on demand.
  const products = await getAllCatalogProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lookup = await getCatalogProduct(slug);
  if (lookup.status !== "ok") return {};
  const { product } = lookup;
  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    path: `/tienda/producto/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const lookup = await getCatalogProduct(slug);
  if (lookup.status === "not_found") notFound();

  if (lookup.status === "unavailable") {
    return (
      <Section className="pt-40">
        <Container className="max-w-xl text-center">
          <ServerCrash className="mx-auto size-12 text-brand-purple/60" aria-hidden />
          <h1 className="mt-5 text-display-lg">Producto no disponible por ahora</h1>
          <p className="mt-4 text-muted-foreground">
            No pudimos cargar la información en este momento. Inténtalo de nuevo en unos minutos o vuelve a la tienda.
          </p>
          <Link href="/tienda" className="mt-6 inline-block font-medium text-brand-purple underline-offset-2 hover:underline">
            Volver a la tienda
          </Link>
        </Container>
      </Section>
    );
  }

  const { product } = lookup;
  const path = `/tienda/producto/${product.slug}`;
  const reference = [product.model, product.sku].filter(Boolean).join(" · ");
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Tienda", path: "/tienda" },
    ...(product.category ? [{ name: product.category.name, path: `/tienda/${product.category.slug}` }] : []),
    { name: product.name, path },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora variant="soft" />
        <Container>
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <ProductGallery images={product.images} name={product.name} />
            </Reveal>

            <Reveal delay={0.08} className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                {product.brand ? <Badge>{product.brand.name}</Badge> : null}
                <AvailabilityBadge availability={product.availability} />
              </div>
              <h1 className="text-display-lg text-balance">{product.name}</h1>
              {reference ? (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">Referencia:</span> {reference}
                </p>
              ) : null}
              {product.shortDescription ? (
                <p className="text-lg leading-relaxed text-muted-foreground text-pretty">{product.shortDescription}</p>
              ) : null}

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                <PriceBlock product={product} />
              </div>

              <ProductAdvisorActions product={product} />

              {product.datasheetUrl ? (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-brand-purple underline-offset-2 hover:underline"
                >
                  <FileText className="size-4" aria-hidden />
                  Descargar ficha técnica
                </a>
              ) : null}
            </Reveal>
          </div>
        </Container>
      </section>

      {product.description ? (
        <Section className="py-10 sm:py-12">
          <Container>
            <h2 className="font-display text-2xl font-bold">Descripción</h2>
            <div className="mt-4">
              <MarkdownContent source={product.description} />
            </div>
          </Container>
        </Section>
      ) : null}

      {product.specs.length > 0 ? (
        <Section className="py-10 sm:py-12">
          <Container className="max-w-4xl">
            <h2 className="font-display text-2xl font-bold">Especificaciones</h2>
            <div className="mt-5">
              <SpecsTable specs={product.specs} />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section id="cotizacion" className="scroll-mt-24 py-10 sm:py-12">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold">Solicita una cotización</h2>
          <p className="mt-2 text-muted-foreground">
            Déjanos tus datos y un asesor de HISTECH te enviará la cotización de {product.name}.
          </p>
          <div className="card-surface !transform-none mt-6 p-7 sm:p-9">
            <ContactForm
              product={{
                name: product.name,
                reference: productReference(product) ?? "",
                url: absoluteUrl(path),
              }}
            />
          </div>
        </Container>
      </Section>

      {product.related.length > 0 ? (
        <Section className="py-10 sm:py-12">
          <Container>
            <h2 className="font-display text-2xl font-bold">Productos relacionados</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.related.map((related) => (
                <li key={related.id}>
                  <ProductCard product={related} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
