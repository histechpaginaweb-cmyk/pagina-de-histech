const test = require("node:test");
const assert = require("node:assert/strict");
const { makeService, seedTaxonomy } = require("../../test-support/catalog");

async function rejectsWith(promise, code) {
  await assert.rejects(promise, (err) => {
    assert.equal(err.code, code, `expected ${code}, got ${err.code}: ${err.message}`);
    return true;
  });
}

test("create generates a slug from the name and de-duplicates it", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const a = await service.createProduct({ name: "Router RUT956", categoryId: category.id });
  const b = await service.createProduct({ name: "Router RUT956", categoryId: category.id });
  assert.equal(a.slug, "router-rut956");
  assert.equal(b.slug, "router-rut956-2");
  assert.equal(a.status, "draft");
  assert.equal(a.category.slug, "routers");
});

test("create rejects an explicit slug that is already taken", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  await service.createProduct({ name: "A", slug: "taken", categoryId: category.id });
  await rejectsWith(service.createProduct({ name: "B", slug: "taken", categoryId: category.id }), "CONFLICT");
});

test("create rejects a duplicate sku", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  await service.createProduct({ name: "A", sku: "RUT956", categoryId: category.id });
  await rejectsWith(service.createProduct({ name: "B", sku: "RUT956", categoryId: category.id }), "CONFLICT");
});

test("create rejects unknown category or brand with a validation error on the field", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  await assert.rejects(service.createProduct({ name: "A", categoryId: "nope" }), (e) => {
    assert.equal(e.code, "VALIDATION");
    assert.equal(e.details[0].path, "categoryId");
    return true;
  });
  await assert.rejects(service.createProduct({ name: "A", categoryId: category.id, brandId: "nope" }), (e) => {
    assert.equal(e.details[0].path, "brandId");
    return true;
  });
});

test("priceUpdatedAt is set on create, kept when price is unchanged, bumped when it changes", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const noPrice = await service.createProduct({ name: "Free", categoryId: category.id });
  assert.equal(noPrice.priceUpdatedAt, null);

  const p = await service.createProduct({ name: "P", categoryId: category.id, priceCop: 100000 });
  assert.ok(p.priceUpdatedAt instanceof Date);

  const same = await service.updateProduct(p.id, { name: "P renamed", categoryId: category.id, priceCop: 100000 });
  assert.equal(same.priceUpdatedAt.getTime(), p.priceUpdatedAt.getTime());

  const changed = await service.updateProduct(p.id, { name: "P renamed", categoryId: category.id, priceCop: 120000 });
  assert.ok(changed.priceUpdatedAt.getTime() > p.priceUpdatedAt.getTime());

  const cleared = await service.updateProduct(p.id, { name: "P renamed", categoryId: category.id, priceCop: null });
  assert.equal(cleared.priceCop, null);
  assert.equal(cleared.priceUpdatedAt, null);
});

test("update keeps the slug when only the name changes and rejects unknown ids", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const p = await service.createProduct({ name: "Original", categoryId: category.id });
  const u = await service.updateProduct(p.id, { name: "Renamed", categoryId: category.id });
  assert.equal(u.slug, "original");
  assert.equal(u.name, "Renamed");
  await rejectsWith(service.updateProduct("missing", { name: "x", categoryId: category.id }), "NOT_FOUND");
});

test("update may change the slug explicitly but not to a slug used by another product", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const a = await service.createProduct({ name: "A", categoryId: category.id });
  await service.createProduct({ name: "B", categoryId: category.id });
  const moved = await service.updateProduct(a.id, { name: "A", slug: "a-new", categoryId: category.id });
  assert.equal(moved.slug, "a-new");
  await rejectsWith(service.updateProduct(a.id, { name: "A", slug: "b", categoryId: category.id }), "CONFLICT");
});

test("patch updates price, availability and status and bumps priceUpdatedAt only on price change", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const p = await service.createProduct({ name: "P", categoryId: category.id, priceCop: 50000 });
  const avail = await service.patchProduct(p.id, { availability: "in_stock", status: "published" });
  assert.equal(avail.availability, "in_stock");
  assert.equal(avail.status, "published");
  assert.equal(avail.priceUpdatedAt.getTime(), p.priceUpdatedAt.getTime());
  const priced = await service.patchProduct(p.id, { priceCop: 60000 });
  assert.equal(priced.priceCop, 60000);
  assert.ok(priced.priceUpdatedAt.getTime() > p.priceUpdatedAt.getTime());
  await rejectsWith(service.patchProduct("missing", { priceCop: 1 }), "NOT_FOUND");
  await rejectsWith(service.patchProduct(p.id, {}), "VALIDATION");
});

test("delete removes a product and reports unknown ids", async () => {
  const { service } = makeService();
  const { category } = await seedTaxonomy(service);
  const p = await service.createProduct({ name: "P", categoryId: category.id });
  await service.deleteProduct(p.id);
  await rejectsWith(service.getAdminProduct(p.id), "NOT_FOUND");
  await rejectsWith(service.deleteProduct(p.id), "NOT_FOUND");
});

test("categories and brands in use cannot be deleted; unused ones can", async () => {
  const { service } = makeService();
  const { category, brand } = await seedTaxonomy(service);
  const p = await service.createProduct({ name: "P", categoryId: category.id, brandId: brand.id });
  await rejectsWith(service.deleteCategory(category.id), "IN_USE");
  await rejectsWith(service.deleteBrand(brand.id), "IN_USE");
  await service.deleteProduct(p.id);
  await service.deleteCategory(category.id);
  await service.deleteBrand(brand.id);
  assert.equal((await service.listAdminCategories()).length, 0);
});

test("category slugs never use the reserved producto segment", async () => {
  const { service } = makeService();
  const c = await service.createCategory({ name: "Producto" });
  assert.equal(c.slug, "producto-2");
  await rejectsWith(service.createCategory({ name: "X", slug: "producto" }), "VALIDATION");
});

test("category and brand slugs are unique", async () => {
  const { service } = makeService();
  await service.createCategory({ name: "Redes" });
  const second = await service.createCategory({ name: "Redes" });
  assert.equal(second.slug, "redes-2");
  await rejectsWith(service.createCategory({ name: "Otra", slug: "redes" }), "CONFLICT");
  await service.createBrand({ name: "Acme" });
  await rejectsWith(service.createBrand({ name: "Acme 2", slug: "acme" }), "CONFLICT");
});

test("category and brand updates keep their slug unless one is provided", async () => {
  const { service } = makeService();
  const { category, brand } = await seedTaxonomy(service);
  const c = await service.updateCategory(category.id, { name: "Enrutadores", sortOrder: 5 });
  assert.equal(c.slug, "routers");
  assert.equal(c.sortOrder, 5);
  const b = await service.updateBrand(brand.id, { name: "Teltonika Networks", slug: "teltonika-networks" });
  assert.equal(b.slug, "teltonika-networks");
  await rejectsWith(service.updateBrand("missing", { name: "x" }), "NOT_FOUND");
});

test("settings default to showPrices true and can be updated", async () => {
  const { service } = makeService();
  assert.deepEqual(await service.getSettings(), { showPrices: true });
  assert.deepEqual(await service.updateSettings({ showPrices: false }), { showPrices: false });
  assert.deepEqual(await service.getPublicSettings(), { showPrices: false });
  await rejectsWith(service.updateSettings({ showPrices: "no" }), "VALIDATION");
});

async function seedCatalog(service) {
  const routers = await service.createCategory({ name: "Routers" });
  const switches = await service.createCategory({ name: "Switches", sortOrder: -1 });
  const tel = await service.createBrand({ name: "Teltonika" });
  const tp = await service.createBrand({ name: "TP-Link" });
  const mk = (data) => service.createProduct({ status: "published", ...data });
  const rut956 = await mk({ name: "RUT956", model: "RUT956-NA", sku: "SKU-956", categoryId: routers.id, brandId: tel.id, priceCop: 1200000, availability: "in_stock", featured: true });
  const rut200 = await mk({ name: "RUT200", categoryId: routers.id, brandId: tel.id, consultPrice: true, priceCop: 500000 });
  const sw = await mk({ name: "Switch gestionado", categoryId: switches.id, brandId: tp.id });
  const draft = await service.createProduct({ name: "Borrador", categoryId: routers.id, brandId: tel.id, priceCop: 1 });
  return { routers, switches, tel, tp, rut956, rut200, sw, draft };
}

test("public listing returns only published products with pagination metadata", async () => {
  const { service } = makeService();
  const s = await seedCatalog(service);
  const out = await service.listPublicProducts({});
  assert.equal(out.total, 3);
  assert.equal(out.page, 1);
  assert.equal(out.pageSize, 12);
  assert.ok(!out.items.some((i) => i.id === s.draft.id));
  assert.equal(out.items[0].slug, "rut956", "featured products come first");
});

test("public listing filters by category, brand and q across name, model, sku and brand", async () => {
  const { service } = makeService();
  await seedCatalog(service);
  assert.deepEqual((await service.listPublicProducts({ category: "switches" })).items.map((i) => i.slug), ["switch-gestionado"]);
  assert.equal((await service.listPublicProducts({ brand: "teltonika" })).total, 2);
  assert.equal((await service.listPublicProducts({ category: "routers", brand: "tp-link" })).total, 0);
  assert.equal((await service.listPublicProducts({ q: "gestionado" })).total, 1);
  assert.equal((await service.listPublicProducts({ q: "956-na" })).total, 1);
  assert.equal((await service.listPublicProducts({ q: "sku-956" })).total, 1);
  assert.equal((await service.listPublicProducts({ q: "TP-LINK" })).total, 1);
  assert.equal((await service.listPublicProducts({ q: "inexistente" })).total, 0);
});

test("public listing paginates and bounds the page size", async () => {
  const { service } = makeService();
  await seedCatalog(service);
  const p1 = await service.listPublicProducts({ page: "1", pageSize: "2" });
  const p2 = await service.listPublicProducts({ page: "2", pageSize: "2" });
  assert.equal(p1.items.length, 2);
  assert.equal(p2.items.length, 1);
  assert.equal(p1.total, 3);
  assert.equal((await service.listPublicProducts({ pageSize: "9999" })).pageSize, 48);
});

test("public payload applies the price visibility rule", async () => {
  const { service } = makeService();
  await seedCatalog(service);
  const items = (await service.listPublicProducts({})).items;
  const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  assert.equal(bySlug["rut956"].priceCop, 1200000);
  assert.equal(bySlug["rut956"].consultPrice, false);
  assert.equal("priceCop" in bySlug["rut200"], false, "consultPrice product leaks no price");
  assert.equal(bySlug["rut200"].consultPrice, true);
  assert.equal(bySlug["switch-gestionado"].consultPrice, true, "no price means consult");

  await service.updateSettings({ showPrices: false });
  const hidden = (await service.listPublicProducts({})).items;
  for (const item of hidden) {
    assert.equal(item.consultPrice, true);
    assert.equal("priceCop" in item, false);
    assert.equal("priceUpdatedAt" in item, false);
  }
});

test("public payload hides admin-only fields and embeds brand and category", async () => {
  const { service } = makeService();
  await seedCatalog(service);
  const item = (await service.listPublicProducts({})).items[0];
  assert.equal("status" in item, false);
  assert.equal("categoryId" in item, false);
  assert.equal(item.brand.slug, "teltonika");
  assert.equal(item.category.slug, "routers");
});

test("public detail returns brand, category and related products", async () => {
  const { service } = makeService();
  const s = await seedCatalog(service);
  const detail = await service.getPublicProduct("rut956");
  assert.equal(detail.id, s.rut956.id);
  assert.equal(detail.brand.name, "Teltonika");
  assert.deepEqual(detail.related.map((r) => r.slug), ["rut200"], "same category, published, excluding itself and drafts");
  assert.equal("related" in detail.related[0], false);
});

test("public detail 404s for drafts and unknown slugs", async () => {
  const { service } = makeService();
  const s = await seedCatalog(service);
  await rejectsWith(service.getPublicProduct(s.draft.slug), "NOT_FOUND");
  await rejectsWith(service.getPublicProduct("nope"), "NOT_FOUND");
});

test("public categories and brands report published product counts, ordered", async () => {
  const { service } = makeService();
  await seedCatalog(service);
  const cats = await service.listPublicCategories();
  assert.deepEqual(cats.map((c) => [c.slug, c.productCount]), [["switches", 1], ["routers", 2]]);
  const brands = await service.listPublicBrands();
  assert.deepEqual(brands.map((b) => [b.slug, b.productCount]), [["teltonika", 2], ["tp-link", 1]]);
});

test("admin listing includes drafts and supports a status filter", async () => {
  const { service } = makeService();
  const s = await seedCatalog(service);
  assert.equal((await service.listAdminProducts({})).total, 4);
  const drafts = await service.listAdminProducts({ status: "draft" });
  assert.deepEqual(drafts.items.map((i) => i.id), [s.draft.id]);
  assert.equal(drafts.items[0].priceCop, 1, "admin view always carries the raw price");
});
