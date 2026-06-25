/**
 * HISTECH — Single source of truth para identidad, contacto y navegación.
 * Cambiar datos aquí los propaga a todo el sitio (header, footer, SEO, JSON-LD).
 */

export const siteConfig = {
  name: "HISTECH",
  legalName: "HISTECH Tecnología",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://histech.com.co",
  locale: "es-CO",
  slogan: "El futuro tecnológico de tu empresa comienza aquí.",
  tagline:
    "Un aliado estratégico en tecnología, comprometido en poner a su disposición soluciones inteligentes.",
  description:
    "HISTECH impulsa la transformación digital de las empresas con Infraestructura, Ciberseguridad, Cloud e Inteligencia Artificial. Aliado estratégico para la evolución tecnológica empresarial en Colombia y Latinoamérica.",
  hero: {
    title:
      "Tecnología inteligente para maximizar la eficiencia y conectividad de tu empresa.",
    subtitle:
      "Infraestructura, Ciberseguridad, Cloud e Inteligencia Artificial para acelerar la transformación digital de tu organización.",
  },
  contact: {
    phone: "+57 318 0008 152",
    phoneRaw: "+573180008152",
    email: "consultor@histech.com.co",
    address: "Calle 116 # 70D-06 Ofi 301",
    city: "Bogotá D.C.",
    country: "Colombia",
    whatsapp: "https://wa.me/573180008152",
    maps: "https://maps.app.goo.gl/Rxa2tJApPr3Z2KA36",
  },
  social: {
    // Pendientes por definir: se muestran en el footer pero aún no enlazan a nada.
    linkedin: "",
    facebook: "",
    youtube: "https://www.youtube.com/@H1sT3ch",
    twitter: "https://twitter.com/histech",
  },
  verse: "Salmos 37:5 — Encomienda a Jehová tu camino, y confía en él; y él hará.",
} as const;

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; items: NavLink[] };

/** Servicios — usados en mega-menú, home, /servicios y páginas individuales. */
export const services: (NavLink & { short: string })[] = [
  {
    label: "Inteligencia Artificial Empresarial",
    href: "/inteligencia-artificial",
    short: "IA aplicada",
    description:
      "Automatización, agentes inteligentes y analítica avanzada para decisiones en tiempo real.",
  },
  {
    label: "Transformación Digital",
    href: "/transformacion-digital",
    short: "Transformación",
    description:
      "Metodologías y estrategias para modernizar tu empresa con tecnología e innovación.",
  },
  {
    label: "Ecosistemas Digitales",
    href: "/ecosistemas-digitales",
    short: "Ecosistemas",
    description:
      "Conectamos personas, procesos, datos y tecnología en organizaciones eficientes y escalables.",
  },
  {
    label: "Ciberseguridad",
    href: "/ciberseguridad",
    short: "Ciberseguridad",
    description:
      "Protección de perímetro, endpoints, accesos y cumplimiento normativo frente a amenazas.",
  },
  {
    label: "Cloud y Continuidad",
    href: "/cloud-continuidad",
    short: "Cloud",
    description:
      "Nube híbrida, respaldo, recuperación ante desastres y alta disponibilidad.",
  },
  {
    label: "Infraestructura de Redes",
    href: "/infraestructura-de-redes",
    short: "Redes",
    description:
      "Conectividad robusta zero-touch con networking inteligente y experiencia óptima.",
  },
  {
    label: "Cómputo",
    href: "/computo",
    short: "Cómputo",
    description:
      "Equipos y servidores corporativos de alto rendimiento para entornos híbridos.",
  },
  {
    label: "Consultoría en IT",
    href: "/consultoria-it",
    short: "Consultoría",
    description:
      "Diagnóstico, adopción tecnológica y acompañamiento experto en cada paso.",
  },
  {
    label: "Servicios Gestionados",
    href: "/managed-services",
    short: "Managed",
    description:
      "Monitoreo 24/7, soporte y administración de infraestructura con costos predecibles.",
  },
  {
    label: "Soluciones Web",
    href: "/soluciones-web",
    short: "Web",
    description:
      "Plataformas y aplicaciones web de alto rendimiento, seguras y escalables.",
  },
];

/** Industrias — sectores atendidos. */
export const industries: NavLink[] = [
  { label: "Manufactura", href: "/industrias/manufactura" },
  { label: "Salud", href: "/industrias/salud" },
  { label: "Banca y Seguros", href: "/industrias/banca-seguros" },
  { label: "Transporte y Logística", href: "/industrias/transporte-logistica" },
  { label: "Educación", href: "/industrias/educacion" },
  { label: "Retail", href: "/industrias/retail" },
  { label: "Sector Público", href: "/industrias/sector-publico" },
  { label: "Consultoría", href: "/industrias/consultoria" },
  { label: "ONG", href: "/industrias/ong" },
];

/** Navegación principal (mega-menú). */
export const mainNav: { label: string; href?: string; groups?: NavGroup[] }[] = [
  {
    label: "Infraestructura & Operación",
    groups: [
      { label: "Infraestructura & Operación", items: services.slice(5) },
    ],
  },
  {
    label: "Estrategia & IA",
    groups: [{ label: "Estrategia & IA", items: services.slice(0, 5) }],
  },
  {
    label: "Industrias",
    groups: [{ label: "Sectores", items: industries }],
  },
  { label: "Casos de Éxito", href: "/casos-de-exito" },
  { label: "Resultados", href: "/resultados" },
  { label: "Laboratorio IA", href: "/laboratorio-ia" },
  { label: "Recursos", href: "/recursos" },
  { label: "Blog", href: "/blog" },
  { label: "Nosotros", href: "/nosotros" },
];

export const footerNav = {
  soluciones: services.slice(0, 6),
  compania: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "Casos de Éxito", href: "/casos-de-exito" },
    { label: "Resultados", href: "/resultados" },
    { label: "Laboratorio IA", href: "/laboratorio-ia" },
    { label: "Recursos", href: "/recursos" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ],
  cobertura: [
    { label: "Colombia", href: "/colombia" },
    { label: "Bogotá", href: "/bogota" },
    { label: "Cundinamarca", href: "/cundinamarca" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "/terminos" },
    { label: "Política de Privacidad", href: "/privacidad" },
  ],
} as const;
