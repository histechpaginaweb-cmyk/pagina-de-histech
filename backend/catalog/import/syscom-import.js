// Idempotent import of the scraped Syscom Ruijie/Reyee catalog.
//
// Categories, brands and products are looked up by slug and created only when
// missing, so re-running never duplicates rows nor overwrites admin edits.
// Images are downloaded from Syscom, verified by magic bytes and size, and
// re-hosted on R2 before the product is created through the catalog service.
//
// Usage (from backend/; uses PORTAL_DATABASE_URL and the R2_* env vars):
//   npm run catalog:import:syscom            # dry run, no writes
//   npm run catalog:import:syscom -- --apply # real import
const { createCatalogService } = require("../service");
const { sniffFileType, IMAGE_TYPES, MAX_IMAGE_BYTES } = require("../uploads");
const { CATEGORY_MAP, BRANDS, selectImportable, toCatalogProduct } = require("./syscom-map");

const TAG = "[catalog:import:syscom]";

/** Runs `fn` over `items` with at most `limit` in flight. */
async function mapPool(items, limit, fn) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await fn(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
}

async function runSyscomImport({
  data,
  repo,
  uploadImage,
  fetchImage,
  apply = false,
  log = console.log,
  concurrency = 4,
}) {
  const service = createCatalogService({ repo });
  const mode = apply ? "" : "[dry-run] ";
  const stats = {
    categories: { created: 0, skipped: 0 },
    brands: { created: 0, skipped: 0 },
    products: { created: 0, skipped: 0, failed: 0 },
    images: { uploaded: 0, failed: 0 },
  };

  // Resolves slug -> id, creating missing records only when applying.
  async function ensureTaxonomy(kind, records, find, create, bucket) {
    const ids = new Map();
    for (const record of records) {
      const found = await find(record.slug);
      if (found) {
        bucket.skipped += 1;
        ids.set(record.slug, found.id);
        continue;
      }
      bucket.created += 1;
      log(`${TAG} ${mode}${kind} ${record.slug}: create`);
      ids.set(record.slug, apply ? (await create(record)).id : null);
    }
    return ids;
  }

  const categoryIds = await ensureTaxonomy(
    "category",
    Object.values(CATEGORY_MAP),
    (slug) => repo.findCategoryBySlug(slug),
    (c) => service.createCategory(c),
    stats.categories,
  );
  const brandIds = await ensureTaxonomy(
    "brand",
    BRANDS,
    (slug) => repo.findBrandBySlug(slug),
    (b) => service.createBrand(b),
    stats.brands,
  );

  async function rehostImage(slug, image) {
    try {
      const buffer = await fetchImage(image.url);
      const type = sniffFileType(buffer);
      if (!IMAGE_TYPES.includes(type)) throw new Error("not a supported image");
      if (buffer.length > MAX_IMAGE_BYTES) throw new Error(`exceeds ${MAX_IMAGE_BYTES} bytes`);
      const url = await uploadImage(buffer, type);
      stats.images.uploaded += 1;
      return { url, alt: image.alt };
    } catch (err) {
      stats.images.failed += 1;
      log(`${TAG} ${slug}: image skipped (${image.url}): ${err.message}`);
      return null;
    }
  }

  async function importProduct(raw) {
    let slug = raw.model;
    try {
      const { categorySlug, brandSlug, ...product } = toCatalogProduct(raw);
      slug = product.slug;
      if (await repo.findProductBySlug(slug)) {
        stats.products.skipped += 1;
        log(`${TAG} product ${slug}: skipped (exists)`);
        return;
      }
      if (!apply) {
        stats.products.created += 1;
        log(`${TAG} ${mode}product ${slug}: would create with ${product.images.length} image(s)`);
        return;
      }
      const images = [];
      for (const image of product.images) {
        const hosted = await rehostImage(slug, image);
        if (hosted) images.push(hosted);
      }
      if (images.length === 0) log(`${TAG} WARN ${slug}: no images; creating without photos`);
      await service.createProduct({
        ...product,
        images,
        categoryId: categoryIds.get(categorySlug),
        brandId: brandIds.get(brandSlug),
      });
      stats.products.created += 1;
      log(`${TAG} product ${slug}: created with ${images.length} image(s)`);
    } catch (err) {
      stats.products.failed += 1;
      log(`${TAG} product ${slug}: FAILED ${err.message}`);
    }
  }

  const importable = selectImportable(data.products);
  log(`${TAG} ${mode}${importable.length} importable of ${data.products.length} scraped products`);
  await mapPool(importable, concurrency, importProduct);

  const { categories: c, brands: b, products: p, images: i } = stats;
  log(
    `${TAG} ${mode}done: categories ${c.created} new/${c.skipped} existing, brands ${b.created} new/${b.skipped} existing, ` +
      `products ${p.created} ${apply ? "created" : "to create"}/${p.skipped} skipped/${p.failed} failed, ` +
      `images ${i.uploaded} uploaded/${i.failed} failed`,
  );
  return stats;
}

async function main(argv = process.argv.slice(2)) {
  require("dotenv").config();
  const apply = argv.includes("--apply");
  const r2 = require("../../r2");
  if (apply && !r2.isConfigured()) {
    console.error(`${TAG} --apply refused: R2 is not configured (set the R2_* env vars).`);
    process.exitCode = 1;
    return;
  }
  const { prisma } = require("../../portal/lib/prisma");
  const { createPrismaRepository } = require("../repository.prisma");
  try {
    await runSyscomImport({
      data: require("./syscom-ruijie-reyee.json"),
      repo: createPrismaRepository(prisma),
      uploadImage: r2.uploadImage,
      fetchImage: async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
      },
      apply,
      concurrency: 4,
    });
  } catch (err) {
    console.error(`${TAG} failed:`, err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) main();

module.exports = { runSyscomImport };
