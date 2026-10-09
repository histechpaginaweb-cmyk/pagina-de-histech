// Prisma implementation of the catalog repository (contract documented in
// repository.memory.js). The Prisma client is injected so tests can stub it.
const { CatalogError, notFound, conflict, inUse } = require("./errors");

const SETTINGS_ID = "global";
const PRODUCT_ORDER = [{ featured: "desc" }, { createdAt: "desc" }, { id: "asc" }];
const WITH_RELATIONS = { brand: true, category: true };

/** Maps Prisma error codes to catalog errors; unknown errors pass through. */
function translateError(err, { what = "Registro", onForeignKey = "VALIDATION" } = {}) {
  switch (err?.code) {
    case "P2002": {
      const target = [].concat(err.meta?.target ?? []).join(",");
      const message = target.includes("sku")
        ? "Ya existe un producto con ese SKU"
        : "Ya existe un registro con ese slug";
      return conflict(message, err.meta?.target);
    }
    case "P2025":
      return notFound(what);
    case "P2003":
      return onForeignKey === "IN_USE"
        ? inUse("No se puede eliminar: hay productos asociados")
        : new CatalogError("VALIDATION", "Datos inválidos", [
            { path: "categoryId", message: "La categoría o la marca no existe" },
          ]);
    default:
      return err;
  }
}

function buildProductWhere({ status, category, brand, q } = {}) {
  const where = {};
  if (status) where.status = status;
  if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (q) {
    const contains = { contains: q, mode: "insensitive" };
    where.OR = [{ name: contains }, { model: contains }, { sku: contains }, { brand: { name: contains } }];
  }
  return where;
}

// JSON columns come back as `unknown`; keep the contract of ordered arrays.
function toProduct(row) {
  if (!row) return null;
  return {
    ...row,
    specs: Array.isArray(row.specs) ? row.specs : [],
    images: Array.isArray(row.images) ? row.images : [],
  };
}

function createPrismaRepository(prisma) {
  const models = { product: prisma.catalogProduct, category: prisma.catalogCategory, brand: prisma.catalogBrand };

  async function guard(promise, context) {
    try {
      return await promise;
    } catch (err) {
      throw translateError(err, context);
    }
  }

  // Published / total product counts per category or brand id.
  async function countsBy(field) {
    const [all, published] = await Promise.all([
      prisma.catalogProduct.groupBy({ by: [field], _count: { _all: true } }),
      prisma.catalogProduct.groupBy({ by: [field], where: { status: "published" }, _count: { _all: true } }),
    ]);
    const toMap = (rows) => new Map(rows.map((r) => [r[field], r._count._all]));
    return { total: toMap(all), published: toMap(published) };
  }

  async function listWithCounts(model, field, orderBy) {
    const [rows, counts] = await Promise.all([model.findMany({ orderBy }), countsBy(field)]);
    return rows.map((r) => ({
      ...r,
      productCount: counts.total.get(r.id) ?? 0,
      publishedCount: counts.published.get(r.id) ?? 0,
    }));
  }

  return {
    async listProducts({ status, category, brand, q, page, pageSize }) {
      const where = buildProductWhere({ status, category, brand, q });
      const [rows, total] = await Promise.all([
        prisma.catalogProduct.findMany({
          where,
          include: WITH_RELATIONS,
          orderBy: PRODUCT_ORDER,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.catalogProduct.count({ where }),
      ]);
      return { items: rows.map(toProduct), total };
    },
    async findProductById(id) {
      return toProduct(await prisma.catalogProduct.findUnique({ where: { id }, include: WITH_RELATIONS }));
    },
    async findProductBySlug(slug) {
      return toProduct(await prisma.catalogProduct.findUnique({ where: { slug }, include: WITH_RELATIONS }));
    },
    async listRelatedProducts(product, limit) {
      const rows = await prisma.catalogProduct.findMany({
        where: { status: "published", categoryId: product.categoryId, NOT: { id: product.id } },
        include: WITH_RELATIONS,
        orderBy: PRODUCT_ORDER,
        take: limit,
      });
      return rows.map(toProduct);
    },
    async createProduct(data) {
      return toProduct(await guard(prisma.catalogProduct.create({ data, include: WITH_RELATIONS })));
    },
    async updateProduct(id, data) {
      return toProduct(
        await guard(prisma.catalogProduct.update({ where: { id }, data, include: WITH_RELATIONS }), {
          what: "Producto",
        }),
      );
    },
    async deleteProduct(id) {
      await guard(prisma.catalogProduct.delete({ where: { id } }), { what: "Producto" });
    },

    listCategories: () => listWithCounts(prisma.catalogCategory, "categoryId", [{ sortOrder: "asc" }, { name: "asc" }]),
    findCategoryById: (id) => prisma.catalogCategory.findUnique({ where: { id } }),
    findCategoryBySlug: (slug) => prisma.catalogCategory.findUnique({ where: { slug } }),
    createCategory: (data) => guard(prisma.catalogCategory.create({ data })),
    updateCategory: (id, data) => guard(prisma.catalogCategory.update({ where: { id }, data }), { what: "Categoría" }),
    async deleteCategory(id) {
      await guard(prisma.catalogCategory.delete({ where: { id } }), { what: "Categoría", onForeignKey: "IN_USE" });
    },

    listBrands: () => listWithCounts(prisma.catalogBrand, "brandId", [{ name: "asc" }]),
    findBrandById: (id) => prisma.catalogBrand.findUnique({ where: { id } }),
    findBrandBySlug: (slug) => prisma.catalogBrand.findUnique({ where: { slug } }),
    createBrand: (data) => guard(prisma.catalogBrand.create({ data })),
    updateBrand: (id, data) => guard(prisma.catalogBrand.update({ where: { id }, data }), { what: "Marca" }),
    async deleteBrand(id) {
      await guard(prisma.catalogBrand.delete({ where: { id } }), { what: "Marca", onForeignKey: "IN_USE" });
    },

    async isSlugTaken(kind, slug, excludeId) {
      const where = excludeId ? { slug, NOT: { id: excludeId } } : { slug };
      return Boolean(await models[kind].findFirst({ where, select: { id: true } }));
    },
    async getSettings() {
      const row = await prisma.catalogSettings.findUnique({ where: { id: SETTINGS_ID } });
      return { showPrices: row ? row.showPrices : true };
    },
    async updateSettings({ showPrices }) {
      const row = await prisma.catalogSettings.upsert({
        where: { id: SETTINGS_ID },
        update: { showPrices },
        create: { id: SETTINGS_ID, showPrices },
      });
      return { showPrices: row.showPrices };
    },
  };
}

module.exports = { createPrismaRepository, buildProductWhere, translateError, PRODUCT_ORDER };
