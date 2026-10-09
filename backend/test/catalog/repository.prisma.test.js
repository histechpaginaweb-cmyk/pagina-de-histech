// The Prisma repository cannot run against a database in tests, so these cover
// its pure parts (query building, error translation) and its wiring against a
// recording stub. Behavior parity with the in-memory repository is covered by
// service.test.js, which exercises the shared contract.
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createPrismaRepository,
  buildProductWhere,
  PRODUCT_ORDER,
  translateError,
} = require("../../catalog/repository.prisma");

test("buildProductWhere maps filters to Prisma conditions", () => {
  assert.deepEqual(buildProductWhere({}), {});
  const where = buildProductWhere({ status: "published", category: "routers", brand: "teltonika", q: "rut" });
  assert.equal(where.status, "published");
  assert.deepEqual(where.category, { slug: "routers" });
  assert.deepEqual(where.brand, { slug: "teltonika" });
  assert.equal(where.OR.length, 4);
  assert.ok(where.OR.every((cond) => JSON.stringify(cond).includes('"insensitive"')));
});

test("products are ordered featured first, newest first, id as tiebreaker", () => {
  assert.deepEqual(PRODUCT_ORDER, [{ featured: "desc" }, { createdAt: "desc" }, { id: "asc" }]);
});

test("translateError maps Prisma codes to catalog errors", () => {
  assert.equal(translateError({ code: "P2002", meta: { target: ["sku"] } }).code, "CONFLICT");
  assert.match(translateError({ code: "P2002", meta: { target: ["sku"] } }).message, /SKU/);
  assert.equal(translateError({ code: "P2025" }, { what: "Producto" }).code, "NOT_FOUND");
  assert.equal(translateError({ code: "P2003" }, { onForeignKey: "IN_USE" }).code, "IN_USE");
  assert.equal(translateError({ code: "P2003" }).code, "VALIDATION");
  const unknown = new Error("boom");
  assert.equal(translateError(unknown), unknown);
});

function stubPrisma(overrides = {}) {
  const calls = [];
  const record = (name, result) => async (args) => {
    calls.push([name, args]);
    return typeof result === "function" ? result(args) : result;
  };
  const prisma = {
    calls,
    catalogProduct: {
      findMany: record("product.findMany", []),
      count: record("product.count", 0),
      findUnique: record("product.findUnique", null),
      create: record("product.create", (a) => ({ id: "p1", ...a.data })),
      update: record("product.update", (a) => ({ id: a.where.id, ...a.data })),
      delete: record("product.delete", {}),
      groupBy: record("product.groupBy", []),
      findFirst: record("product.findFirst", null),
    },
    catalogCategory: { findMany: record("category.findMany", []), findFirst: record("category.findFirst", null) },
    catalogBrand: { findMany: record("brand.findMany", []), findFirst: record("brand.findFirst", null) },
    catalogSettings: {
      findUnique: record("settings.findUnique", null),
      upsert: record("settings.upsert", (a) => ({ id: "global", ...a.update })),
    },
    ...overrides,
  };
  return prisma;
}

test("listProducts paginates with skip/take and returns total", async () => {
  const prisma = stubPrisma();
  prisma.catalogProduct.count = async () => 25;
  prisma.catalogProduct.findMany = async (args) => {
    prisma.calls.push(["findMany", args]);
    return [{ id: "a", specs: null, images: null }];
  };
  const repo = createPrismaRepository(prisma);
  const out = await repo.listProducts({ status: "published", page: 3, pageSize: 10 });
  assert.equal(out.total, 25);
  const args = prisma.calls.find(([n]) => n === "findMany")[1];
  assert.equal(args.skip, 20);
  assert.equal(args.take, 10);
  assert.deepEqual(args.orderBy, PRODUCT_ORDER);
  assert.deepEqual(out.items[0].specs, [], "null JSON columns normalize to empty arrays");
  assert.deepEqual(out.items[0].images, []);
});

test("getSettings falls back to showPrices true when no row exists", async () => {
  const repo = createPrismaRepository(stubPrisma());
  assert.deepEqual(await repo.getSettings(), { showPrices: true });
});

test("updateSettings upserts the single global row", async () => {
  const prisma = stubPrisma();
  const repo = createPrismaRepository(prisma);
  assert.deepEqual(await repo.updateSettings({ showPrices: false }), { showPrices: false });
  const args = prisma.calls.find(([n]) => n === "settings.upsert")[1];
  assert.deepEqual(args.where, { id: "global" });
  assert.deepEqual(args.create, { id: "global", showPrices: false });
});

test("isSlugTaken excludes the record being edited", async () => {
  const prisma = stubPrisma();
  const repo = createPrismaRepository(prisma);
  await repo.isSlugTaken("product", "abc", "me");
  const args = prisma.calls.find(([n]) => n === "product.findFirst")[1];
  assert.deepEqual(args.where, { slug: "abc", NOT: { id: "me" } });
});

test("createProduct translates unique violations into conflicts", async () => {
  const prisma = stubPrisma();
  prisma.catalogProduct.create = async () => {
    throw Object.assign(new Error("dup"), { code: "P2002", meta: { target: ["slug"] } });
  };
  const repo = createPrismaRepository(prisma);
  await assert.rejects(repo.createProduct({ slug: "x" }), (e) => e.code === "CONFLICT");
});

test("deleteCategory reports IN_USE when products still reference it", async () => {
  const prisma = stubPrisma();
  prisma.catalogCategory.delete = async () => {
    throw Object.assign(new Error("fk"), { code: "P2003" });
  };
  const repo = createPrismaRepository(prisma);
  await assert.rejects(repo.deleteCategory("c1"), (e) => e.code === "IN_USE");
});
