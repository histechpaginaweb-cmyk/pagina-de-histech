const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseProductInput,
  parseProductPatch,
  parseCategoryInput,
  parseBrandInput,
  parseSettingsInput,
  parseListQuery,
} = require("../../catalog/validation");
const { CatalogError } = require("../../catalog/errors");

const base = { name: "Router RUT956", categoryId: "cat1" };

function invalidPaths(fn) {
  try {
    fn();
  } catch (err) {
    assert.ok(err instanceof CatalogError);
    assert.equal(err.code, "VALIDATION");
    return err.details.map((d) => d.path);
  }
  assert.fail("expected a validation error");
}

test("product input applies defaults and trims text", () => {
  const out = parseProductInput({ ...base, name: "  Router RUT956 ", sku: "  " });
  assert.equal(out.name, "Router RUT956");
  assert.equal(out.sku, null);
  assert.equal(out.consultPrice, false);
  assert.equal(out.availability, "on_request");
  assert.equal(out.status, "draft");
  assert.equal(out.featured, false);
  assert.deepEqual(out.specs, []);
  assert.deepEqual(out.images, []);
  assert.equal(out.priceCop, null);
});

test("product input requires name and categoryId", () => {
  assert.deepEqual(invalidPaths(() => parseProductInput({})).sort(), ["categoryId", "name"]);
});

test("priceCop must be a positive integer or null", () => {
  assert.equal(parseProductInput({ ...base, priceCop: 250000 }).priceCop, 250000);
  assert.equal(parseProductInput({ ...base, priceCop: null }).priceCop, null);
  assert.equal(parseProductInput({ ...base, priceCop: "" }).priceCop, null);
  for (const priceCop of [0, -1, 10.5, "abc", 3_000_000_000]) {
    assert.deepEqual(invalidPaths(() => parseProductInput({ ...base, priceCop })), ["priceCop"]);
  }
});

test("availability and status accept only known values", () => {
  assert.deepEqual(invalidPaths(() => parseProductInput({ ...base, availability: "soon" })), ["availability"]);
  assert.deepEqual(invalidPaths(() => parseProductInput({ ...base, status: "archived" })), ["status"]);
  assert.equal(parseProductInput({ ...base, availability: "in_stock", status: "published" }).status, "published");
});

test("specs and images are validated item by item and keep their order", () => {
  const out = parseProductInput({
    ...base,
    specs: [{ label: "Puertos", value: "4 LAN" }, { label: "WAN", value: "1" }],
    images: [{ url: "https://cdn.example.com/a.jpg", alt: "Frente" }, { url: "/img/b.png", alt: "" }],
  });
  assert.deepEqual(out.specs.map((s) => s.label), ["Puertos", "WAN"]);
  assert.deepEqual(out.images.map((i) => i.url), ["https://cdn.example.com/a.jpg", "/img/b.png"]);
  assert.deepEqual(
    invalidPaths(() => parseProductInput({ ...base, specs: [{ label: "", value: "x" }] })),
    ["specs.0.label"],
  );
  assert.deepEqual(
    invalidPaths(() => parseProductInput({ ...base, images: [{ url: "javascript:alert(1)", alt: "" }] })),
    ["images.0.url"],
  );
});

test("datasheetUrl accepts http(s) or site-relative urls only", () => {
  assert.equal(parseProductInput({ ...base, datasheetUrl: "https://x.test/a.pdf" }).datasheetUrl, "https://x.test/a.pdf");
  assert.deepEqual(invalidPaths(() => parseProductInput({ ...base, datasheetUrl: "ftp://x" })), ["datasheetUrl"]);
});

test("explicit slug must be well formed", () => {
  assert.equal(parseProductInput({ ...base, slug: "rut956" }).slug, "rut956");
  assert.deepEqual(invalidPaths(() => parseProductInput({ ...base, slug: "Bad Slug!" })), ["slug"]);
});

test("patch accepts only the quick-edit fields, at least one of them", () => {
  assert.deepEqual(parseProductPatch({ priceCop: 100, availability: "in_stock" }), {
    priceCop: 100,
    availability: "in_stock",
  });
  assert.deepEqual(parseProductPatch({ status: "published" }), { status: "published" });
  assert.deepEqual(invalidPaths(() => parseProductPatch({})), ["_"]);
  assert.deepEqual(invalidPaths(() => parseProductPatch({ name: "x" })), ["_"]);
  assert.deepEqual(invalidPaths(() => parseProductPatch({ priceCop: -5 })), ["priceCop"]);
});

test("category input validates name, slug and the reserved route segment", () => {
  assert.equal(parseCategoryInput({ name: "Routers" }).sortOrder, 0);
  assert.deepEqual(invalidPaths(() => parseCategoryInput({})), ["name"]);
  assert.deepEqual(invalidPaths(() => parseCategoryInput({ name: "x", slug: "producto" })), ["slug"]);
});

test("brand input validates name and logoUrl", () => {
  assert.equal(parseBrandInput({ name: "Teltonika", logoUrl: "https://x.test/l.png" }).logoUrl, "https://x.test/l.png");
  assert.deepEqual(invalidPaths(() => parseBrandInput({ name: "T", logoUrl: "nope" })), ["logoUrl"]);
});

test("settings input requires a boolean showPrices", () => {
  assert.deepEqual(parseSettingsInput({ showPrices: false }), { showPrices: false });
  assert.deepEqual(invalidPaths(() => parseSettingsInput({ showPrices: "yes" })), ["showPrices"]);
});

test("list query clamps pagination to sane bounds", () => {
  assert.deepEqual(parseListQuery({}), { page: 1, pageSize: 12, category: undefined, brand: undefined, q: undefined, status: undefined });
  const out = parseListQuery({ page: "-3", pageSize: "9999", q: "  rut  ", category: "routers" });
  assert.equal(out.page, 1);
  assert.equal(out.pageSize, 48);
  assert.equal(out.q, "rut");
  assert.equal(out.category, "routers");
  assert.equal(parseListQuery({ pageSize: "abc" }).pageSize, 12);
  assert.equal(parseListQuery({ pageSize: "500" }, { maxPageSize: 100 }).pageSize, 100);
});

test("list query only honours status when allowed", () => {
  assert.equal(parseListQuery({ status: "draft" }).status, undefined);
  assert.equal(parseListQuery({ status: "draft" }, { allowStatus: true }).status, "draft");
  assert.equal(parseListQuery({ status: "bogus" }, { allowStatus: true }).status, undefined);
});
