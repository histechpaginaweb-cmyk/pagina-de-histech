// Seed data must satisfy the same validation the admin API enforces, and the
// runner must be idempotent (upsert by slug, never clobbering admin edits).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { categories, brands, products } = require("../../catalog/seed-data");
const { runSeed } = require("../../catalog/seed");
const { parseCategoryInput, parseBrandInput, parseProductInput } = require("../../catalog/validation");

test("seed categories and brands pass validation and have unique slugs", () => {
  for (const c of categories) parseCategoryInput(c);
  for (const b of brands) parseBrandInput(b);
  assert.equal(new Set(categories.map((c) => c.slug)).size, categories.length);
  assert.equal(new Set(brands.map((b) => b.slug)).size, brands.length);
});

test("seed products pass product validation", () => {
  assert.ok(products.length >= 2);
  for (const { categorySlug, brandSlug, ...input } of products) {
    parseProductInput({ ...input, categoryId: "placeholder", brandId: "placeholder" });
    assert.ok(categories.some((c) => c.slug === categorySlug), `unknown category ${categorySlug}`);
    assert.ok(brands.some((b) => b.slug === brandSlug), `unknown brand ${brandSlug}`);
  }
});

test("seed products never invent prices and are not published", () => {
  for (const p of products) {
    assert.equal(p.status, "draft");
    assert.equal(p.consultPrice, true);
    assert.equal(p.priceCop, null);
  }
});

test("seed product images exist under frontend/public", () => {
  const publicDir = path.join(__dirname, "../../../frontend/public");
  for (const p of products) {
    for (const image of p.images) {
      assert.ok(image.url.startsWith("/tienda/"));
      assert.ok(fs.existsSync(path.join(publicDir, image.url)), `missing ${image.url}`);
    }
  }
});

function fakePrisma() {
  const tables = { catalogCategory: [], catalogBrand: [], catalogProduct: [] };
  const model = (name) => ({
    async findUnique({ where }) {
      return tables[name].find((r) => r.slug === where.slug) ?? null;
    },
    async create({ data }) {
      const row = { id: `${name}-${tables[name].length + 1}`, ...data };
      tables[name].push(row);
      return row;
    },
  });
  return { tables, catalogCategory: model("catalogCategory"), catalogBrand: model("catalogBrand"), catalogProduct: model("catalogProduct") };
}

test("runSeed creates everything once and is idempotent", async () => {
  const prisma = fakePrisma();
  const first = await runSeed(prisma, { categories, brands, products }, () => {});
  assert.equal(prisma.tables.catalogProduct.length, products.length);
  assert.equal(first.created, categories.length + brands.length + products.length);

  const second = await runSeed(prisma, { categories, brands, products }, () => {});
  assert.equal(second.created, 0);
  assert.equal(second.skipped, first.created);
  assert.equal(prisma.tables.catalogProduct.length, products.length);
});

test("runSeed links products to their category and brand ids", async () => {
  const prisma = fakePrisma();
  await runSeed(prisma, { categories, brands, products }, () => {});
  const row = prisma.tables.catalogProduct[0];
  const category = prisma.tables.catalogCategory.find((c) => c.slug === products[0].categorySlug);
  assert.equal(row.categoryId, category.id);
  assert.ok(row.brandId);
  assert.equal(row.categorySlug, undefined);
});

test("runSeed does not overwrite an existing product edited in the admin", async () => {
  const prisma = fakePrisma();
  await runSeed(prisma, { categories, brands, products }, () => {});
  prisma.tables.catalogProduct[0].priceCop = 123456;
  prisma.tables.catalogProduct[0].status = "published";
  await runSeed(prisma, { categories, brands, products }, () => {});
  assert.equal(prisma.tables.catalogProduct[0].priceCop, 123456);
  assert.equal(prisma.tables.catalogProduct[0].status, "published");
});
