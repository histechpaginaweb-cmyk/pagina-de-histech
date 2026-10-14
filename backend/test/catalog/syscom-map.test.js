const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../../catalog/import/syscom-ruijie-reyee.json");
const { CATEGORY_MAP, BRANDS, selectImportable, toCatalogProduct } = require("../../catalog/import/syscom-map");
const { parseProductInput, parseCategoryInput, parseBrandInput } = require("../../catalog/validation");

const raw = (over = {}) => ({
  syscomId: 1,
  name: "Switch PoE 8 puertos Gigabit",
  model: "RG-ES208GC-P",
  line: "Reyee",
  priceCop: 227411.6,
  onOrder: false,
  requestDistribution: false,
  breadcrumb: ["Redes", "Switches", "Switches PoE", "Switches PoE"],
  features: ["8 puertos", "PoE 802.3af/at"],
  specsText: "Potencia: 60 W",
  images: Array.from({ length: 8 }, (_, i) => `https://img.syscom.mx/${i}.jpg`),
  ...over,
});

test("selectImportable keeps only the 76 items with a published price", () => {
  const picked = selectImportable(data.products);
  assert.equal(data.products.length, 128);
  assert.equal(picked.length, 76);
  assert.ok(picked.every((p) => !p.onOrder && !p.requestDistribution));
});

test("toCatalogProduct maps names, slug, price and status", () => {
  const p = toCatalogProduct(raw());
  assert.equal(p.name, "Reyee RG-ES208GC-P");
  assert.equal(p.slug, "reyee-rg-es208gc-p");
  assert.equal(p.sku, "RG-ES208GC-P");
  assert.equal(p.shortDescription, "Switch PoE 8 puertos Gigabit");
  assert.equal(p.price, 227412);
  assert.equal(p.priceCurrency, "COP");
  assert.equal(p.consultPrice, false);
  assert.equal(p.status, "published");
  assert.equal(p.availability, "in_stock");
  assert.equal(p.categorySlug, "switches-poe");
  assert.equal(p.brandSlug, "reyee");
});

test("toCatalogProduct builds the Markdown description", () => {
  const { description } = toCatalogProduct(raw());
  assert.match(description, /## Características principales\n\n- 8 puertos\n- PoE 802\.3af\/at/);
  assert.match(description, /## Especificaciones\n\nPotencia: 60 W$/);
});

test("toCatalogProduct limits images to 6 in order with alt text", () => {
  const { images } = toCatalogProduct(raw());
  assert.equal(images.length, 6);
  assert.equal(images[0].url, "https://img.syscom.mx/0.jpg");
  assert.equal(images[5].url, "https://img.syscom.mx/5.jpg");
  assert.equal(images[0].alt, "Reyee RG-ES208GC-P");
});

test("toCatalogProduct maps Ruijie line to the ruijie brand", () => {
  assert.equal(toCatalogProduct(raw({ line: "Ruijie" })).brandSlug, "ruijie");
});

test("categories and brands pass validation", () => {
  for (const c of Object.values(CATEGORY_MAP)) parseCategoryInput(c);
  for (const b of BRANDS) parseBrandInput(b);
});

test("all 76 mapped products pass the product schema and reference known taxonomy", () => {
  const slugs = new Set();
  for (const item of selectImportable(data.products)) {
    const { categorySlug, brandSlug, ...input } = toCatalogProduct(item);
    parseProductInput({ ...input, categoryId: "x", brandId: "x" });
    assert.ok(Object.values(CATEGORY_MAP).some((c) => c.slug === categorySlug), categorySlug);
    assert.ok(BRANDS.some((b) => b.slug === brandSlug), brandSlug);
    assert.ok(!slugs.has(input.slug), `duplicate slug ${input.slug}`);
    slugs.add(input.slug);
  }
  assert.equal(slugs.size, 76);
});
