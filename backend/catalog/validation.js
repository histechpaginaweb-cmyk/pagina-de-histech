// Input validation and normalization for the catalog (zod). Everything that
// enters the service goes through one of the `parse*` functions below, which
// throw a CatalogError("VALIDATION") listing the offending field paths.
const { z } = require("zod");
const { CatalogError } = require("./errors");

const AVAILABILITY = ["in_stock", "on_request", "out_of_stock"];
const STATUSES = ["draft", "published"];
const MAX_PRICE_COP = 2_000_000_000; // stays inside a signed 32-bit integer column
// `/tienda/producto/...` is the product route, so a category cannot use that slug.
const RESERVED_CATEGORY_SLUGS = ["producto"];

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_MAX_PAGE_SIZE = 48;

// "" and whitespace become null so optional form fields stay clean.
const blankToNull = (v) => (typeof v === "string" ? v.trim() || null : v);

const optionalText = (max) =>
  z
    .preprocess(
      blankToNull,
      z.string({ invalid_type_error: "Debe ser texto" }).max(max, `Máximo ${max} caracteres`).nullable().optional(),
    )
    .transform((v) => v ?? null);

const requiredText = (max, label) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z
      .string({ required_error: `${label} es obligatorio`, invalid_type_error: `${label} es obligatorio` })
      .min(1, `${label} es obligatorio`)
      .max(max, `Máximo ${max} caracteres`),
  );

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugField = z.preprocess(
  blankToNull,
  z.string().max(80).regex(slugPattern, "Solo minúsculas, números y guiones").nullable().optional(),
);

// http(s) absolute URL or a site-relative path. Rejects javascript:, data:, ftp:, etc.
function isSafeUrl(value) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
const urlField = z
  .preprocess(blankToNull, z.string().max(1000).refine(isSafeUrl, "URL no válida").nullable().optional())
  .transform((v) => v ?? null);

const priceField = z
  .preprocess(
    (v) => (v === "" ? null : v),
    z
      .number({ invalid_type_error: "El precio debe ser un número entero" })
      .int("El precio debe ser un número entero")
      .positive("El precio debe ser mayor que cero")
      .max(MAX_PRICE_COP, "El precio es demasiado alto")
      .nullable()
      .optional(),
  )
  .transform((v) => v ?? null);

const specSchema = z.object({
  label: requiredText(120, "La etiqueta"),
  value: requiredText(500, "El valor"),
});

const imageSchema = z.object({
  url: z
    .string({ required_error: "La URL es obligatoria" })
    .trim()
    .min(1, "La URL es obligatoria")
    .max(1000)
    .refine(isSafeUrl, "URL no válida"),
  alt: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(200).default("")),
});

const productShape = {
  slug: slugField,
  name: requiredText(160, "El nombre"),
  categoryId: requiredText(64, "La categoría"),
  brandId: z
    .preprocess(blankToNull, z.string().max(64).nullable().optional())
    .transform((v) => v ?? null),
  model: optionalText(120),
  sku: optionalText(80),
  shortDescription: optionalText(500),
  description: optionalText(20000),
  specs: z.array(specSchema).max(100).default([]),
  images: z.array(imageSchema).max(20).default([]),
  datasheetUrl: urlField,
  priceCop: priceField,
  consultPrice: z.boolean().default(false),
  availability: z.enum(AVAILABILITY).default("on_request"),
  status: z.enum(STATUSES).default("draft"),
  featured: z.boolean().default(false),
  seoTitle: optionalText(120),
  seoDescription: optionalText(320),
};
const productSchema = z.object(productShape);

// Quick edit from the admin list: price, availability and publication only.
const PATCH_KEYS = ["priceCop", "consultPrice", "availability", "status", "featured"];
const patchSchema = z
  .object({
    priceCop: productShape.priceCop,
    consultPrice: z.boolean(),
    availability: z.enum(AVAILABILITY),
    status: z.enum(STATUSES),
    featured: z.boolean(),
  })
  .partial();

const categorySchema = z.object({
  slug: slugField.refine((s) => !s || !RESERVED_CATEGORY_SLUGS.includes(s), "Slug reservado"),
  name: requiredText(120, "El nombre"),
  description: optionalText(2000),
  seoTitle: optionalText(120),
  seoDescription: optionalText(320),
  sortOrder: z.number().int().min(-100000).max(100000).default(0),
});

const brandSchema = z.object({
  slug: slugField,
  name: requiredText(120, "El nombre"),
  logoUrl: urlField,
});

const settingsSchema = z.object({
  showPrices: z.boolean({ required_error: "showPrices es obligatorio", invalid_type_error: "Debe ser verdadero o falso" }),
});

function run(schema, input) {
  const result = schema.safeParse(input && typeof input === "object" ? input : {});
  if (result.success) return result.data;
  throw new CatalogError(
    "VALIDATION",
    "Datos inválidos",
    result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  );
}

const parseProductInput = (input) => run(productSchema, input);
const parseCategoryInput = (input) => run(categorySchema, input);
const parseBrandInput = (input) => run(brandSchema, input);
const parseSettingsInput = (input) => run(settingsSchema, input);

function parseProductPatch(input) {
  const picked = {};
  for (const key of PATCH_KEYS) {
    if (input && Object.prototype.hasOwnProperty.call(input, key)) picked[key] = input[key];
  }
  if (Object.keys(picked).length === 0) {
    throw new CatalogError("VALIDATION", "Datos inválidos", [
      { path: "_", message: `Envía al menos uno de: ${PATCH_KEYS.join(", ")}` },
    ]);
  }
  return run(patchSchema, picked);
}

function toPositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

const cleanQueryText = (v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 100) : undefined);

/** Normalizes list query-string params. Never throws: bad values fall back. */
function parseListQuery(query = {}, { maxPageSize = DEFAULT_MAX_PAGE_SIZE, allowStatus = false } = {}) {
  return {
    page: toPositiveInt(query.page, 1),
    pageSize: Math.min(toPositiveInt(query.pageSize, DEFAULT_PAGE_SIZE), maxPageSize),
    category: cleanQueryText(query.category),
    brand: cleanQueryText(query.brand),
    q: cleanQueryText(query.q),
    status: allowStatus && STATUSES.includes(query.status) ? query.status : undefined,
  };
}

module.exports = {
  AVAILABILITY,
  STATUSES,
  RESERVED_CATEGORY_SLUGS,
  parseProductInput,
  parseProductPatch,
  parseCategoryInput,
  parseBrandInput,
  parseSettingsInput,
  parseListQuery,
};
