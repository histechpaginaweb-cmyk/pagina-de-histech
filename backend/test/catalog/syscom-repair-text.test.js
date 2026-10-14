const test = require("node:test");
const assert = require("node:assert/strict");
const { createMemoryRepository } = require("../../catalog/repository.memory");
const { runSyscomRepairText } = require("../../catalog/import/syscom-repair-text");

async function seed() {
  const repo = createMemoryRepository();
  const category = await repo.createCategory({ slug: "switches", name: "Switches", description: null, sortOrder: 0 });
  const base = {
    categoryId: category.id,
    brandId: null,
    model: "M",
    datasheetUrl: null,
    images: [],
    price: 1000,
    priceUpdatedAt: new Date("2026-01-01"),
    priceCurrency: "COP",
    consultPrice: false,
    availability: "in_stock",
    status: "published",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    specs: [],
    shortDescription: "ok",
    description: "ok",
  };
  await repo.createProduct({
    ...base,
    slug: "broken",
    sku: "B",
    name: "Switch DiseÃ±o",
    description: "OperaciÃ³n de -40â„ƒ a 80â„ƒ",
    seoDescription: "cÃ¡maras",
    specs: [{ label: "FÃ¡cil", value: "Ãšnico" }, { label: "Puertos", value: "24" }],
  });
  await repo.createProduct({ ...base, slug: "clean", sku: "C", name: "Switch Diseño" });
  await repo.createProduct({ ...base, slug: "unrecoverable", sku: "U", name: "DifÃciles" });
  return repo;
}

test("dry run logs findings, returns stats and writes nothing", async () => {
  const repo = await seed();
  const before = await repo.findProductBySlug("broken");
  const logs = [];
  const stats = await runSyscomRepairText({ repo, apply: false, log: (m) => logs.push(m) });
  assert.deepEqual(stats, { scanned: 3, affected: 1, fields: 5, updated: 0, failed: 0 });
  assert.ok(logs.some((l) => l.includes("broken: name") && l.includes("DiseÃ±o") && l.includes("Diseño")));
  assert.ok(logs.some((l) => l.includes("broken: specs[0].label")));
  assert.ok(logs.some((l) => l.includes("dry-run")));
  assert.deepEqual(await repo.findProductBySlug("broken"), before);
});

test("apply updates only the affected fields of affected rows", async () => {
  const repo = await seed();
  const clean = await repo.findProductBySlug("clean");
  const unrecoverable = await repo.findProductBySlug("unrecoverable");
  const before = await repo.findProductBySlug("broken");
  const stats = await runSyscomRepairText({ repo, apply: true, log: () => {} });
  assert.deepEqual(stats, { scanned: 3, affected: 1, fields: 5, updated: 1, failed: 0 });
  const after = await repo.findProductBySlug("broken");
  assert.equal(after.name, "Switch Diseño");
  assert.equal(after.description, "Operación de -40℃ a 80℃");
  assert.equal(after.seoDescription, "cámaras");
  assert.deepEqual(after.specs, [{ label: "Fácil", value: "Único" }, { label: "Puertos", value: "24" }]);
  for (const key of ["slug", "sku", "model", "price", "priceCurrency", "status", "availability", "categoryId", "shortDescription", "seoTitle", "priceUpdatedAt", "createdAt"]) {
    assert.deepEqual(after[key], before[key], key);
  }
  assert.deepEqual(await repo.findProductBySlug("clean"), clean);
  assert.deepEqual(await repo.findProductBySlug("unrecoverable"), unrecoverable);
});

test("apply is idempotent: a second run finds nothing", async () => {
  const repo = await seed();
  await runSyscomRepairText({ repo, apply: true, log: () => {} });
  const stats = await runSyscomRepairText({ repo, apply: true, log: () => {} });
  assert.deepEqual(stats, { scanned: 3, affected: 0, fields: 0, updated: 0, failed: 0 });
});

test("a row that fails validation is counted as failed and the run continues", async () => {
  const repo = await seed();
  const original = repo.updateProduct;
  repo.updateProduct = async (id, data) => {
    if (data.name === "Switch Diseño") throw new Error("boom");
    return original(id, data);
  };
  const stats = await runSyscomRepairText({ repo, apply: true, log: () => {} });
  assert.equal(stats.failed, 1);
  assert.equal(stats.updated, 0);
});
