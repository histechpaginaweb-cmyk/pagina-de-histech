// One-off repair of mojibake (UTF-8 decoded as Windows-1252) already stored in
// catalog products imported from Syscom, e.g. "DiseÃ±o" -> "Diseño".
//
// Only text fields that contain repairable mojibake are rewritten; every other
// field and every clean row stays untouched. Writes go through the catalog
// service, so validation runs.
//
// Usage (from backend/; uses PORTAL_DATABASE_URL):
//   npm run catalog:repair:text            # dry run, no writes
//   npm run catalog:repair:text -- --apply # real repair
const { createCatalogService } = require("../service");
const { fixMojibake } = require("./mojibake");

const TAG = "[catalog:repair:text]";
const PAGE_SIZE = 100;
const TEXT_FIELDS = ["name", "shortDescription", "description", "seoTitle", "seoDescription"];

const sample = (text) => {
  const oneLine = text.replace(/\s+/g, " ");
  return oneLine.length <= 60 ? oneLine : `${oneLine.slice(0, 59)}…`;
};

/** Index of the first repairable run, so the sample shows the broken part. */
function around(before, after) {
  let i = 0;
  while (i < before.length && before[i] === after[i]) i += 1;
  const start = Math.max(0, i - 15);
  return [before.slice(start), after.slice(start)];
}

/** Returns { changes: {field: newValue}, findings: [{field, before, after}] } for one product. */
function repairProduct(product) {
  const changes = {};
  const findings = [];
  const check = (field, value, assign) => {
    if (typeof value !== "string") return;
    const fixed = fixMojibake(value);
    if (fixed === value) return;
    assign(fixed);
    findings.push({ field, before: value, after: fixed });
  };
  for (const field of TEXT_FIELDS) check(field, product[field], (fixed) => (changes[field] = fixed));
  const specs = (product.specs ?? []).map((spec) => ({ ...spec }));
  let specsChanged = false;
  specs.forEach((spec, i) => {
    for (const key of ["label", "value"]) {
      check(`specs[${i}].${key}`, spec[key], (fixed) => {
        spec[key] = fixed;
        specsChanged = true;
      });
    }
  });
  if (specsChanged) changes.specs = specs;
  return { changes, findings };
}

async function listAllProducts(repo) {
  const all = [];
  for (let page = 1; ; page += 1) {
    const { items, total } = await repo.listProducts({ page, pageSize: PAGE_SIZE });
    all.push(...items);
    if (all.length >= total || items.length === 0) return all;
  }
}

// updateProduct revalidates the whole product, so send the stored one with the repaired fields.
const toInput = (p, changes) => ({
  slug: p.slug,
  name: p.name,
  categoryId: p.categoryId,
  brandId: p.brandId ?? null,
  model: p.model,
  sku: p.sku,
  shortDescription: p.shortDescription,
  description: p.description,
  specs: p.specs,
  images: p.images,
  datasheetUrl: p.datasheetUrl,
  price: p.price,
  priceCurrency: p.priceCurrency,
  consultPrice: p.consultPrice,
  availability: p.availability,
  status: p.status,
  featured: p.featured,
  seoTitle: p.seoTitle,
  seoDescription: p.seoDescription,
  ...changes,
});

async function runSyscomRepairText({ repo, apply = false, log = console.log }) {
  const service = createCatalogService({ repo });
  const mode = apply ? "" : "[dry-run] ";
  const stats = { scanned: 0, affected: 0, fields: 0, updated: 0, failed: 0 };

  const products = await listAllProducts(repo);
  for (const product of products) {
    stats.scanned += 1;
    const { changes, findings } = repairProduct(product);
    if (findings.length === 0) continue;
    stats.affected += 1;
    stats.fields += findings.length;
    for (const { field, before, after } of findings) {
      const [b, a] = around(before, after);
      log(`${TAG} ${mode}${product.slug}: ${field}  "${sample(b)}" -> "${sample(a)}"`);
    }
    if (!apply) continue;
    try {
      await service.updateProduct(product.id, toInput(product, changes));
      stats.updated += 1;
    } catch (err) {
      stats.failed += 1;
      log(`${TAG} ${product.slug}: FAILED ${err.message}`);
    }
  }

  log(
    `${TAG} ${mode}done: ${stats.scanned} scanned, ${stats.affected} affected (${stats.fields} field(s)), ` +
      `${stats.updated} updated, ${stats.failed} failed`,
  );
  return stats;
}

async function main(argv = process.argv.slice(2)) {
  require("dotenv").config();
  const apply = argv.includes("--apply");
  const { prisma } = require("../../portal/lib/prisma");
  const { createPrismaRepository } = require("../repository.prisma");
  try {
    await runSyscomRepairText({ repo: createPrismaRepository(prisma), apply });
  } catch (err) {
    console.error(`${TAG} failed:`, err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) main();

module.exports = { runSyscomRepairText, repairProduct };
