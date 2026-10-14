// Pure mapping from the scraped Syscom Ruijie/Reyee catalog to catalog products.
// No I/O: the runner (syscom-import.js) owns downloads, uploads and writes.
const { slugify } = require("../slug");
const { fixMojibake } = require("./mojibake");

const MAX_IMAGES = 6;

const CATEGORY_MAP = {
  "Switches PoE": { slug: "switches-poe", name: "Switches PoE", description: "Switches con alimentación PoE para cámaras, access points y telefonía IP.", sortOrder: 10 },
  Switches: { slug: "switches", name: "Switches", description: "Switches administrables, gestionados en la nube y de núcleo para redes empresariales.", sortOrder: 20 },
  "Routers, Firewalls, Balanceadores": { slug: "routers-firewalls", name: "Routers y firewalls", description: "Routers, gateways, firewalls y balanceadores para la red empresarial.", sortOrder: 30 },
  "Transceptores de Fibra": { slug: "transceptores-fibra", name: "Transceptores de fibra", description: "Módulos SFP, SFP+ y BiDi para enlaces de fibra óptica.", sortOrder: 40 },
  "Inyectores PoE": { slug: "inyectores-poe", name: "Inyectores PoE", description: "Inyectores PoE para alimentar equipos de red.", sortOrder: 50 },
  Industrial: { slug: "networking-industrial", name: "Networking industrial", description: "Switches industriales para entornos exigentes.", sortOrder: 60 },
  "Convertidores de Medios": { slug: "convertidores-medios", name: "Convertidores de medios", description: "Convertidores de cobre a fibra óptica.", sortOrder: 70 },
};

const BRANDS = [
  { slug: "ruijie", name: "Ruijie", logoUrl: null },
  { slug: "reyee", name: "Reyee", logoUrl: null },
];

const truncate = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

/** Owner decision: only items with a published Syscom price (in stock, COP). */
const selectImportable = (products) => products.filter((p) => !p.onOrder && !p.requestDistribution);

const fixSpec = (s) => ({ ...s, label: fixMojibake(s.label), value: fixMojibake(s.value) });

/** Repairs mojibake in every text the mapping emits. */
const fixProductTexts = (product) => ({
  ...product,
  name: fixMojibake(product.name),
  shortDescription: fixMojibake(product.shortDescription),
  description: fixMojibake(product.description),
  specs: product.specs.map(fixSpec),
});

/** Maps a scraped item to a catalog product; every emitted text is mojibake-repaired. */
function toCatalogProduct(p) {
  const categoryName = [...new Set(p.breadcrumb)].pop();
  const category = CATEGORY_MAP[categoryName];
  if (!category) throw new Error(`Unmapped Syscom category "${categoryName}" for ${p.model}`);
  const line = p.line === "Reyee" ? "Reyee" : "Ruijie";
  const name = `${line} ${p.model}`;
  const description = [
    p.name,
    "",
    "## Características principales",
    "",
    ...p.features.map((f) => `- ${f}`),
    ...(p.specsText ? ["", "## Especificaciones", "", p.specsText] : []),
  ].join("\n");
  return fixProductTexts({
    slug: slugify(name),
    name: truncate(name, 160),
    categorySlug: category.slug,
    brandSlug: line.toLowerCase(),
    model: p.model,
    sku: p.model,
    shortDescription: truncate(p.name, 300),
    description,
    specs: [],
    images: p.images.slice(0, MAX_IMAGES).map((url) => ({ url, alt: name })),
    datasheetUrl: null,
    price: Math.round(p.priceCop),
    priceCurrency: "COP",
    consultPrice: false,
    availability: "in_stock",
    status: "published",
    featured: false,
    seoTitle: null,
    seoDescription: null,
  });
}

module.exports = { CATEGORY_MAP, BRANDS, MAX_IMAGES, selectImportable, toCatalogProduct, fixMojibake };
