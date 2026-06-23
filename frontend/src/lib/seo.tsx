import type { Metadata } from "next";
import { siteConfig } from "./site";
import { absoluteUrl } from "./utils";

/** Build page-level metadata with sensible enterprise defaults. */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Tecnología Inteligente para Empresas`;
  const metaDescription = description ?? siteConfig.description;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url,
      siteName: siteConfig.legalName,
      title: metaTitle,
      description: metaDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

/** JSON-LD: Organization + ProfessionalService + LocalBusiness. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.legalName,
    url: siteConfig.url,
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    telephone: siteConfig.contact.phoneRaw,
    email: siteConfig.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "Bogotá",
      addressRegion: "Bogotá D.C.",
      addressCountry: "CO",
    },
    areaServed: ["CO", "Latinoamérica"],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ].filter(Boolean),
    knowsAbout: [
      "Inteligencia Artificial Empresarial",
      "Ciberseguridad",
      "Transformación Digital",
      "Cloud Computing",
      "Infraestructura de Redes",
    ],
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
