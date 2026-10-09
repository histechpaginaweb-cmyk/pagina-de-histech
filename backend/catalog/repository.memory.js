// In-memory implementation of the catalog repository. Used by tests so they
// never touch a real database; it mirrors the behavior the Prisma repository
// guarantees (unique slug/sku, restricted deletes, ordering, search).
//
// The repository contract (all methods are async):
//   Products
//     listProducts({ status?, category?, brand?, q?, page, pageSize }) -> { items, total }
//       `category` / `brand` are slugs; `q` matches name, model, sku or brand name.
//       Order: featured first, newest first.
//     findProductById(id), findProductBySlug(slug) -> product | null
//     listRelatedProducts(product, limit) -> published products of the same category
//     createProduct(data) -> product            (CONFLICT on duplicate slug / sku)
//     updateProduct(id, data) -> product        (NOT_FOUND, CONFLICT)
//     deleteProduct(id)                         (NOT_FOUND)
//   Categories / Brands
//     listCategories() / listBrands() -> records plus { productCount, publishedCount }
//     findCategoryById / findCategoryBySlug / findBrandById / findBrandBySlug -> record | null
//     createCategory / createBrand, updateCategory(id, data) / updateBrand(id, data),
//     deleteCategory(id) / deleteBrand(id)      (IN_USE while products reference them)
//   Misc
//     isSlugTaken(kind, slug, excludeId?) with kind in "product" | "category" | "brand"
//     getSettings() -> { showPrices }, updateSettings({ showPrices })
//
// Products are returned with embedded `brand` and `category` records (or null).
const crypto = require("crypto");
const { notFound, conflict, inUse } = require("./errors");

const clone = (value) => structuredClone(value);

function compareProducts(a, b) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const byDate = b.createdAt.getTime() - a.createdAt.getTime();
  return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
}

function createMemoryRepository({ now = () => new Date() } = {}) {
  const products = new Map();
  const categories = new Map();
  const brands = new Map();
  let settings = { showPrices: true };

  const byKind = { product: products, category: categories, brand: brands };

  const findBySlug = (map, slug) => [...map.values()].find((r) => r.slug === slug) ?? null;

  function withRelations(product) {
    const out = clone(product);
    out.brand = product.brandId && brands.has(product.brandId) ? clone(brands.get(product.brandId)) : null;
    out.category = categories.has(product.categoryId) ? clone(categories.get(product.categoryId)) : null;
    return out;
  }

  function assertUnique(data, excludeId) {
    for (const p of products.values()) {
      if (p.id === excludeId) continue;
      if (data.slug !== undefined && p.slug === data.slug) {
        throw conflict("Ya existe un producto con ese slug", ["slug"]);
      }
      if (data.sku != null && p.sku === data.sku) {
        throw conflict("Ya existe un producto con ese SKU", ["sku"]);
      }
    }
  }

  function matchesQuery(product, q) {
    const needle = q.toLowerCase();
    const brandName = product.brandId ? brands.get(product.brandId)?.name : "";
    return [product.name, product.model, product.sku, brandName].some(
      (field) => field && String(field).toLowerCase().includes(needle),
    );
  }

  function counts(field, id) {
    const linked = [...products.values()].filter((p) => p[field] === id);
    return { productCount: linked.length, publishedCount: linked.filter((p) => p.status === "published").length };
  }

  // Generic CRUD for categories and brands.
  function taxonomy(kind, map, field) {
    const label = kind === "category" ? "categoría" : "marca";
    return {
      list() {
        return [...map.values()].map((r) => ({ ...clone(r), ...counts(field, r.id) }));
      },
      create(data) {
        if (findBySlug(map, data.slug)) throw conflict(`Ya existe una ${label} con ese slug`, ["slug"]);
        const stamp = now();
        const record = { ...clone(data), id: crypto.randomUUID(), createdAt: stamp, updatedAt: stamp };
        map.set(record.id, record);
        return clone(record);
      },
      update(id, data) {
        const current = map.get(id);
        if (!current) throw notFound(kind === "category" ? "Categoría" : "Marca");
        if (data.slug !== undefined && [...map.values()].some((r) => r.id !== id && r.slug === data.slug)) {
          throw conflict(`Ya existe una ${label} con ese slug`, ["slug"]);
        }
        const next = { ...current, ...clone(data), id, updatedAt: now() };
        map.set(id, next);
        return clone(next);
      },
      remove(id) {
        if (!map.has(id)) throw notFound(kind === "category" ? "Categoría" : "Marca");
        if (counts(field, id).productCount > 0) {
          throw inUse(`No se puede eliminar: hay productos asociados a esta ${label}`);
        }
        map.delete(id);
      },
    };
  }

  const cat = taxonomy("category", categories, "categoryId");
  const brd = taxonomy("brand", brands, "brandId");

  return {
    async listProducts({ status, category, brand, q, page, pageSize }) {
      let rows = [...products.values()];
      if (status) rows = rows.filter((p) => p.status === status);
      if (category) rows = rows.filter((p) => categories.get(p.categoryId)?.slug === category);
      if (brand) rows = rows.filter((p) => p.brandId && brands.get(p.brandId)?.slug === brand);
      if (q) rows = rows.filter((p) => matchesQuery(p, q));
      rows.sort(compareProducts);
      const start = (page - 1) * pageSize;
      return { items: rows.slice(start, start + pageSize).map(withRelations), total: rows.length };
    },
    async findProductById(id) {
      return products.has(id) ? withRelations(products.get(id)) : null;
    },
    async findProductBySlug(slug) {
      const found = findBySlug(products, slug);
      return found ? withRelations(found) : null;
    },
    async listRelatedProducts(product, limit) {
      return [...products.values()]
        .filter((p) => p.id !== product.id && p.status === "published" && p.categoryId === product.categoryId)
        .sort(compareProducts)
        .slice(0, limit)
        .map(withRelations);
    },
    async createProduct(data) {
      assertUnique(data);
      const stamp = now();
      const record = { ...clone(data), id: crypto.randomUUID(), createdAt: stamp, updatedAt: stamp };
      products.set(record.id, record);
      return withRelations(record);
    },
    async updateProduct(id, data) {
      const current = products.get(id);
      if (!current) throw notFound("Producto");
      assertUnique(data, id);
      const next = { ...current, ...clone(data), id, updatedAt: now() };
      products.set(id, next);
      return withRelations(next);
    },
    async deleteProduct(id) {
      if (!products.delete(id)) throw notFound("Producto");
    },

    async listCategories() {
      return cat.list();
    },
    async findCategoryById(id) {
      return categories.has(id) ? clone(categories.get(id)) : null;
    },
    async findCategoryBySlug(slug) {
      const found = findBySlug(categories, slug);
      return found ? clone(found) : null;
    },
    async createCategory(data) {
      return cat.create(data);
    },
    async updateCategory(id, data) {
      return cat.update(id, data);
    },
    async deleteCategory(id) {
      cat.remove(id);
    },

    async listBrands() {
      return brd.list();
    },
    async findBrandById(id) {
      return brands.has(id) ? clone(brands.get(id)) : null;
    },
    async findBrandBySlug(slug) {
      const found = findBySlug(brands, slug);
      return found ? clone(found) : null;
    },
    async createBrand(data) {
      return brd.create(data);
    },
    async updateBrand(id, data) {
      return brd.update(id, data);
    },
    async deleteBrand(id) {
      brd.remove(id);
    },

    async isSlugTaken(kind, slug, excludeId) {
      return [...byKind[kind].values()].some((r) => r.slug === slug && r.id !== excludeId);
    },
    async getSettings() {
      return { ...settings };
    },
    async updateSettings(data) {
      settings = { ...settings, ...data };
      return { ...settings };
    },
  };
}

module.exports = { createMemoryRepository, compareProducts };
