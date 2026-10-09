import type { Metadata } from "next";
import { siteConfig, services } from "./site";
import { absoluteUrl } from "./utils";

/** @id estables para enlazar el grafo de entidades (Entity SEO). */
export const ORG_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

/**
 * Entidades temáticas con las que HISTECH quiere asociarse de forma consistente
 * (Entity SEO). Deben repetirse en schema, metadata, contenido e interlinking.
 */
export const BRAND_ENTITIES = [
  "Inteligencia Artificial aplicada a empresas",
  "Automatización de procesos (RPA)",
  "Desarrollo de Software a la medida",
  "Desarrollo Web",
  "Ciberseguridad empresarial",
  "Cloud Computing",
  "Transformación Digital",
  "Infraestructura de Redes",
  "Servicios Gestionados de TI",
  "Teltonika",
] as const;

/** Build page-level metadata with sensible enterprise defaults. */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
  noindex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  /** Open Graph / Twitter image (site-relative or absolute). Defaults to the site card. */
  image?: string;
  /** Keeps the canonical but asks crawlers not to index the page (links are still followed). */
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Tecnología Inteligente para Empresas`;
  const metaDescription = description ?? siteConfig.description;
  const ogImage = image
    ? { url: /^https?:\/\//.test(image) ? image : absoluteUrl(image), alt: metaTitle }
    : { url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name };

  return {
    // `absolute` evita que la plantilla del layout (`%s | HISTECH`) duplique la marca.
    title: { absolute: metaTitle },
    description: metaDescription,
    keywords,
    alternates: { canonical: url },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      locale: "es_CO",
      url,
      siteName: siteConfig.legalName,
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage.url],
    },
  };
}

/** Nodo Organization + LocalBusiness (ProfessionalService) con @id estable. */
export function organizationJsonLd() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: absoluteUrl("/logo-histech.webp"),
      width: 820,
      height: 253,
      caption: siteConfig.legalName,
    },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    slogan: siteConfig.slogan,
    telephone: siteConfig.contact.phoneRaw,
    email: siteConfig.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: siteConfig.contact.city,
      addressRegion: "Bogotá D.C.",
      addressCountry: "CO",
    },
    hasMap: siteConfig.contact.maps,
    areaServed: ["CO", "Latinoamérica"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phoneRaw,
      email: siteConfig.contact.email,
      contactType: "customer service",
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
      siteConfig.social.twitter,
    ].filter(Boolean),
    knowsAbout: [...BRAND_ENTITIES],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Soluciones tecnológicas HISTECH",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.label,
          url: absoluteUrl(s.href),
        },
      })),
    },
  };
}

/** Nodo WebSite con @id estable, enlazado a la organización como publisher. */
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "es-CO",
    publisher: { "@id": ORG_ID },
  };
}

/** Grafo global del sitio (se monta una sola vez en el layout). */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd()],
  };
}

/** Nodo WebPage por página, enlazado al WebSite y a la organización. */
export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "es-CO",
    publisher: { "@id": ORG_ID },
  };
}

/** JSON-LD: Service — mejora la citabilidad por motores de IA (AEO/GEO). */
export function serviceJsonLd({
  name,
  description,
  path,
  brand,
}: {
  name: string;
  description: string;
  path: string;
  /** Marca que HISTECH distribuye en este servicio (opcional). */
  brand?: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    serviceType: name,
    provider: { "@id": ORG_ID },
    areaServed: ["CO", "Latinoamérica"],
    isPartOf: { "@id": WEBSITE_ID },
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
  };
}

/** JSON-LD: Article/BlogPosting para entradas del blog (GEO). */
export function articleJsonLd({
  title,
  description,
  path,
  date,
  author,
  image,
}: {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: "es-CO",
    image: image ? absoluteUrl(image) : absoluteUrl("/opengraph-image"),
    author: { "@type": "Organization", name: author, url: siteConfig.url },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: url,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Render helper component for JSON-LD scripts. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
