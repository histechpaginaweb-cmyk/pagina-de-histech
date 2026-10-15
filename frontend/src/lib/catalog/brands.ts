import { ORG_ID } from "@/lib/seo";
import type { MetadataInput } from "./seo";

export const BRAND_PAGE_SLUGS = ["ruijie", "reyee"] as const;
export type BrandPageSlug = (typeof BRAND_PAGE_SLUGS)[number];

export type BrandPage = {
  slug: BrandPageSlug;
  name: string;
  /** Visible H1. */
  heading: string;
  /** Meta title (the " | HISTECH" suffix is added by buildMetadata). */
  title: string;
  description: string;
  /** Intro paragraphs shown above the product grid. */
  intro: string[];
};

const PAGES: Record<BrandPageSlug, BrandPage> = {
  ruijie: {
    slug: "ruijie",
    name: "Ruijie",
    heading: "Ruijie en Colombia",
    title: "Ruijie en Colombia: switches, routers y Wi-Fi",
    description:
      "Equipos de red Ruijie en Colombia: switches, switches PoE, routers y firewalls con precios con IVA incluido. Asesoría y cotización con HISTECH.",
    intro: [
      "HISTECH distribuye equipos de red Ruijie en Colombia: switches de acceso y agregación, switches PoE, routers, firewalls y transceptores para redes empresariales.",
      "Los precios publicados son con IVA incluido. Si necesitas ayuda para elegir el modelo o cotizar un proyecto, un asesor de HISTECH te acompaña.",
    ],
  },
  reyee: {
    slug: "reyee",
    name: "Reyee",
    heading: "Reyee en Colombia",
    title: "Reyee en Colombia: redes administradas desde la nube",
    description:
      "Equipos Reyee en Colombia: switches, routers y puntos de acceso para redes administradas desde la nube, con precios con IVA incluido y asesoría de HISTECH.",
    intro: [
      "Reyee es la línea de Ruijie para redes pequeñas y medianas con administración sencilla. HISTECH la distribuye en Colombia: switches, routers y accesorios de red.",
      "Los precios publicados son con IVA incluido. Un asesor de HISTECH puede ayudarte a dimensionar tu red y preparar una cotización.",
    ],
  },
};

export const isBrandPageSlug = (slug: string): slug is BrandPageSlug =>
  (BRAND_PAGE_SLUGS as readonly string[]).includes(slug);

export const getBrandPage = (slug: string): BrandPage | undefined => (isBrandPageSlug(slug) ? PAGES[slug] : undefined);

export const brandPagePath = (slug: string) => `/tienda/marca/${slug}`;

/** Search variants are `noindex`; the canonical always points to the clean brand path. */
export function brandMetadataInput(page: BrandPage, params: { q?: string; page: number }): MetadataInput {
  return {
    title: page.title,
    description: page.description,
    path: brandPagePath(page.slug),
    noindex: Boolean(params.q),
  };
}

/** CollectionPage about the Brand. The product ItemList and breadcrumbs are emitted by the listing. */
export function brandCollectionJsonLd(page: BrandPage, { siteUrl }: { siteUrl: string }) {
  const url = `${siteUrl.replace(/\/$/, "")}${brandPagePath(page.slug)}`;
  return {
    "@context": "https://schema.org" as const,
    "@type": "CollectionPage" as const,
    "@id": `${url}#collection`,
    url,
    name: page.heading,
    description: page.description,
    inLanguage: "es-CO",
    about: { "@type": "Brand" as const, name: page.name },
    publisher: { "@id": ORG_ID },
  };
}
