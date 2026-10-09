// Catalog seed. Idempotent: every record is looked up by slug and created only
// when missing, so re-running never duplicates rows nor overwrites edits made
// in the admin (prices, publication status, photos...).
//
// Usage (against the database in PORTAL_DATABASE_URL; run it only when intended):
//   npm run catalog:seed
require("dotenv").config();

const { categories, brands, products } = require("./seed-data");

/** Creates the record unless one with the same slug exists. Returns "created" | "skipped". */
async function createIfMissing(model, slug, data) {
  if (await model.findUnique({ where: { slug } })) return { status: "skipped" };
  return { status: "created", row: await model.create({ data }) };
}

async function runSeed(prisma, data = { categories, brands, products }, log = console.log) {
  const stats = { created: 0, skipped: 0 };
  const count = (kind, slug, status) => {
    stats[status] += 1;
    log(`[catalog:seed] ${kind} ${slug}: ${status}`);
  };

  const categoryIds = new Map();
  for (const category of data.categories) {
    const result = await createIfMissing(prisma.catalogCategory, category.slug, category);
    categoryIds.set(category.slug, result.row?.id ?? (await prisma.catalogCategory.findUnique({ where: { slug: category.slug } })).id);
    count("category", category.slug, result.status);
  }

  const brandIds = new Map();
  for (const brand of data.brands) {
    const result = await createIfMissing(prisma.catalogBrand, brand.slug, brand);
    brandIds.set(brand.slug, result.row?.id ?? (await prisma.catalogBrand.findUnique({ where: { slug: brand.slug } })).id);
    count("brand", brand.slug, result.status);
  }

  for (const { categorySlug, brandSlug, ...product } of data.products) {
    const result = await createIfMissing(prisma.catalogProduct, product.slug, {
      ...product,
      categoryId: categoryIds.get(categorySlug),
      brandId: brandIds.get(brandSlug) ?? null,
    });
    count("product", product.slug, result.status);
  }

  log(`[catalog:seed] done: ${stats.created} created, ${stats.skipped} already present`);
  return stats;
}

if (require.main === module) {
  const { prisma } = require("../portal/lib/prisma");
  runSeed(prisma)
    .catch((err) => {
      console.error("[catalog:seed] failed:", err);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { runSeed };
