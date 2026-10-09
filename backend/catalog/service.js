// Catalog business logic. Depends only on a repository (see repository.memory.js
// for the contract) and a clock, so it runs unchanged against Prisma or memory.
const { CatalogError } = require("./errors");
const { uniqueSlug } = require("./slug");
const { publicPriceFields } = require("./pricing");
const {
  RESERVED_CATEGORY_SLUGS,
  parseProductInput,
  parseProductPatch,
  parseCategoryInput,
  parseBrandInput,
  parseSettingsInput,
  parseListQuery,
} = require("./validation");

const RELATED_LIMIT = 4;
const ADMIN_MAX_PAGE_SIZE = 100;

const fieldError = (path, message) => new CatalogError("VALIDATION", "Datos inválidos", [{ path, message }]);

const publicBrand = (b) => (b ? { id: b.id, slug: b.slug, name: b.name, logoUrl: b.logoUrl ?? null } : null);
const publicCategory = (c) => (c ? { id: c.id, slug: c.slug, name: c.name } : null);

/** Public product payload: published-only fields, price gated by the visibility rule. */
function toPublicProduct(product, showPrices) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: publicBrand(product.brand),
    category: publicCategory(product.category),
    model: product.model,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: product.description,
    specs: product.specs,
    images: product.images,
    datasheetUrl: product.datasheetUrl,
    availability: product.availability,
    featured: product.featured,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ...publicPriceFields(product, showPrices),
  };
}

function toPublicCategory(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    seoTitle: c.seoTitle ?? null,
    seoDescription: c.seoDescription ?? null,
    sortOrder: c.sortOrder,
    productCount: c.publishedCount,
  };
}

const toPublicBrandWithCount = (b) => ({ ...publicBrand(b), productCount: b.publishedCount });

const byOrderThenName = (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
const byName = (a, b) => a.name.localeCompare(b.name);

function createCatalogService({ repo, now = () => new Date() }) {
  async function assertTaxonomy({ categoryId, brandId }) {
    if (!(await repo.findCategoryById(categoryId))) {
      throw fieldError("categoryId", "La categoría no existe");
    }
    if (brandId && !(await repo.findBrandById(brandId))) {
      throw fieldError("brandId", "La marca no existe");
    }
  }

  // priceUpdatedAt moves only when the price value actually changes.
  function priceStamp(previous, nextPrice) {
    if (previous.priceCop === nextPrice) return previous.priceUpdatedAt ?? null;
    return nextPrice == null ? null : now();
  }

  async function resolveSlug(kind, explicit, base, excludeId) {
    if (explicit) {
      if (await repo.isSlugTaken(kind, explicit, excludeId)) {
        throw new CatalogError("CONFLICT", "Ya existe un registro con ese slug", { path: "slug" });
      }
      return explicit;
    }
    const reserved = kind === "category" ? RESERVED_CATEGORY_SLUGS : [];
    return uniqueSlug(
      base,
      async (candidate) => reserved.includes(candidate) || (await repo.isSlugTaken(kind, candidate, excludeId)),
    );
  }

  async function publicContext() {
    return (await repo.getSettings()).showPrices === true;
  }

  const requireFound = (record, what) => {
    if (!record) throw new CatalogError("NOT_FOUND", `${what} no encontrado`);
    return record;
  };

  return {
    // ── Public (published products only) ──
    async listPublicProducts(query) {
      const q = parseListQuery(query);
      const showPrices = await publicContext();
      const { items, total } = await repo.listProducts({ ...q, status: "published" });
      return { items: items.map((p) => toPublicProduct(p, showPrices)), total, page: q.page, pageSize: q.pageSize };
    },

    async getPublicProduct(slug) {
      const product = await repo.findProductBySlug(String(slug));
      if (!product || product.status !== "published") throw new CatalogError("NOT_FOUND", "Producto no encontrado");
      const showPrices = await publicContext();
      const related = await repo.listRelatedProducts(product, RELATED_LIMIT);
      return { ...toPublicProduct(product, showPrices), related: related.map((p) => toPublicProduct(p, showPrices)) };
    },

    async listPublicCategories() {
      return (await repo.listCategories()).sort(byOrderThenName).map(toPublicCategory);
    },

    async listPublicBrands() {
      return (await repo.listBrands()).sort(byName).map(toPublicBrandWithCount);
    },

    async getPublicSettings() {
      return { showPrices: await publicContext() };
    },

    // ── Admin: products ──
    async listAdminProducts(query) {
      const q = parseListQuery(query, { maxPageSize: ADMIN_MAX_PAGE_SIZE, allowStatus: true });
      const { items, total } = await repo.listProducts(q);
      return { items, total, page: q.page, pageSize: q.pageSize };
    },

    async getAdminProduct(id) {
      return requireFound(await repo.findProductById(String(id)), "Producto");
    },

    async createProduct(body) {
      const input = parseProductInput(body);
      await assertTaxonomy(input);
      const slug = await resolveSlug("product", input.slug, input.name);
      return repo.createProduct({
        ...input,
        slug,
        priceUpdatedAt: input.priceCop == null ? null : now(),
      });
    },

    async updateProduct(id, body) {
      const input = parseProductInput(body);
      const current = requireFound(await repo.findProductById(String(id)), "Producto");
      await assertTaxonomy(input);
      const slug =
        input.slug && input.slug !== current.slug
          ? await resolveSlug("product", input.slug, null, current.id)
          : current.slug;
      return repo.updateProduct(current.id, {
        ...input,
        slug,
        priceUpdatedAt: priceStamp(current, input.priceCop),
      });
    },

    async patchProduct(id, body) {
      const patch = parseProductPatch(body);
      const current = requireFound(await repo.findProductById(String(id)), "Producto");
      const data = { ...patch };
      if ("priceCop" in patch) data.priceUpdatedAt = priceStamp(current, patch.priceCop);
      return repo.updateProduct(current.id, data);
    },

    async deleteProduct(id) {
      await repo.deleteProduct(String(id));
    },

    // ── Admin: categories ──
    async listAdminCategories() {
      return (await repo.listCategories()).sort(byOrderThenName);
    },

    async createCategory(body) {
      const input = parseCategoryInput(body);
      const slug = await resolveSlug("category", input.slug, input.name, null);
      return repo.createCategory({ ...input, slug });
    },

    async updateCategory(id, body) {
      const input = parseCategoryInput(body);
      const current = requireFound(await repo.findCategoryById(String(id)), "Categoría");
      const slug =
        input.slug && input.slug !== current.slug
          ? await resolveSlug("category", input.slug, null, current.id)
          : current.slug;
      return repo.updateCategory(current.id, { ...input, slug });
    },

    async deleteCategory(id) {
      await repo.deleteCategory(String(id));
    },

    // ── Admin: brands ──
    async listAdminBrands() {
      return (await repo.listBrands()).sort(byName);
    },

    async createBrand(body) {
      const input = parseBrandInput(body);
      const slug = await resolveSlug("brand", input.slug, input.name, null);
      return repo.createBrand({ ...input, slug });
    },

    async updateBrand(id, body) {
      const input = parseBrandInput(body);
      const current = requireFound(await repo.findBrandById(String(id)), "Marca");
      const slug =
        input.slug && input.slug !== current.slug
          ? await resolveSlug("brand", input.slug, null, current.id)
          : current.slug;
      return repo.updateBrand(current.id, { ...input, slug });
    },

    async deleteBrand(id) {
      await repo.deleteBrand(String(id));
    },

    // ── Settings ──
    async getSettings() {
      return repo.getSettings();
    },

    async updateSettings(body) {
      return repo.updateSettings(parseSettingsInput(body));
    },
  };
}

module.exports = { createCatalogService, toPublicProduct };
