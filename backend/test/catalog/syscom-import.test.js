const test = require("node:test");
const assert = require("node:assert/strict");
const { createMemoryRepository } = require("../../catalog/repository.memory");
const { runSyscomImport } = require("../../catalog/import/syscom-import");
const { MAX_IMAGE_BYTES } = require("../../catalog/uploads");

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(16)]);

const item = (model, over = {}) => ({
  syscomId: model,
  name: `Equipo ${model}`,
  model,
  line: "Reyee",
  priceCop: 1000.4,
  onOrder: false,
  requestDistribution: false,
  breadcrumb: ["Redes", "Switches", "Switches"],
  features: ["a"],
  specsText: "",
  images: [`https://syscom.test/${model}-1.png`, `https://syscom.test/${model}-2.png`],
  ...over,
});

const setup = (products, over = {}) => {
  const repo = createMemoryRepository();
  const calls = { uploads: 0, fetches: 0, logs: [] };
  const deps = {
    data: { products },
    repo,
    apply: true,
    concurrency: 2,
    log: (m) => calls.logs.push(m),
    fetchImage: async () => {
      calls.fetches += 1;
      return PNG;
    },
    uploadImage: async () => `https://r2.test/products/${++calls.uploads}.png`,
    ...over,
  };
  return { repo, calls, deps };
};

test("apply creates taxonomy, uploads images and stores R2 URLs", async () => {
  const { repo, calls, deps } = setup([item("A1"), item("B2", { line: "Ruijie" }), item("C3", { onOrder: true })]);
  const stats = await runSyscomImport(deps);
  assert.deepEqual(stats.products, { created: 2, skipped: 0, failed: 0 });
  assert.deepEqual(stats.images, { uploaded: 4, failed: 0 });
  assert.equal(stats.categories.created, 7);
  assert.equal(stats.brands.created, 2);
  assert.equal(calls.uploads, 4);
  const product = await repo.findProductBySlug("reyee-a1");
  assert.ok(product.images.every((i) => i.url.startsWith("https://r2.test/")));
  assert.equal(product.images[0].alt, "Reyee A1");
  assert.equal(product.category.slug, "switches");
  assert.equal(product.brand.slug, "reyee");
  assert.equal(product.price, 1000);
  assert.equal(await repo.findProductBySlug("reyee-c3"), null);
});

test("re-running skips existing slugs and never overwrites admin edits", async () => {
  const { repo, calls, deps } = setup([item("A1")]);
  await runSyscomImport(deps);
  const existing = await repo.findProductBySlug("reyee-a1");
  await repo.updateProduct(existing.id, { price: 999 });
  const uploadsBefore = calls.uploads;
  const stats = await runSyscomImport(deps);
  assert.deepEqual(stats.products, { created: 0, skipped: 1, failed: 0 });
  assert.deepEqual(stats.categories, { created: 0, skipped: 7 });
  assert.deepEqual(stats.brands, { created: 0, skipped: 2 });
  assert.equal(calls.uploads, uploadsBefore);
  assert.equal((await repo.findProductBySlug("reyee-a1")).price, 999);
});

test("dry run performs no uploads, downloads or writes but reports what would happen", async () => {
  const { repo, calls, deps } = setup([item("A1"), item("B2")], { apply: false });
  const stats = await runSyscomImport(deps);
  assert.equal(calls.uploads, 0);
  assert.equal(calls.fetches, 0);
  assert.deepEqual((await repo.listProducts({ page: 1, pageSize: 10 })).total, 0);
  assert.equal((await repo.listCategories()).length, 0);
  assert.equal((await repo.listBrands()).length, 0);
  assert.equal(stats.products.created, 2);
  assert.deepEqual(stats.images, { uploaded: 0, failed: 0 });
  assert.ok(calls.logs.some((l) => l.includes("dry-run")));
});

test("a failed image download is skipped and logged; the product is still created", async () => {
  const { repo, calls, deps } = setup([item("A1")], {
    fetchImage: async (url) => {
      if (url.endsWith("-1.png")) throw new Error("HTTP 404");
      return PNG;
    },
  });
  const stats = await runSyscomImport(deps);
  assert.deepEqual(stats.images, { uploaded: 1, failed: 1 });
  assert.equal(stats.products.created, 1);
  assert.equal((await repo.findProductBySlug("reyee-a1")).images.length, 1);
  assert.ok(calls.logs.some((l) => l.includes("HTTP 404")));
});

test("a product with zero usable images is still created with a warning", async () => {
  const { repo, calls, deps } = setup([item("A1")], {
    fetchImage: async () => {
      throw new Error("boom");
    },
  });
  const stats = await runSyscomImport(deps);
  assert.equal(stats.products.created, 1);
  assert.equal(stats.images.failed, 2);
  assert.deepEqual((await repo.findProductBySlug("reyee-a1")).images, []);
  assert.ok(calls.logs.some((l) => /warn/i.test(l) && l.includes("reyee-a1")));
});

test("non-image buffers are rejected and never uploaded", async () => {
  const { calls, deps } = setup([item("A1")], { fetchImage: async () => Buffer.from("<html>not an image</html>") });
  const stats = await runSyscomImport(deps);
  assert.equal(calls.uploads, 0);
  assert.deepEqual(stats.images, { uploaded: 0, failed: 2 });
});

test("oversized images are rejected and never uploaded", async () => {
  const big = Buffer.concat([PNG, Buffer.alloc(MAX_IMAGE_BYTES)]);
  const { calls, deps } = setup([item("A1")], { fetchImage: async () => big });
  const stats = await runSyscomImport(deps);
  assert.equal(calls.uploads, 0);
  assert.equal(stats.images.failed, 2);
});

test("a product that fails to create is counted as failed and the run continues", async () => {
  const { deps } = setup([item("A1", { breadcrumb: ["Nope"] }), item("B2")]);
  const stats = await runSyscomImport(deps);
  assert.deepEqual(stats.products, { created: 1, skipped: 0, failed: 1 });
});
