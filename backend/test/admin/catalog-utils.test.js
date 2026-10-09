const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parsePriceInput,
  formatCop,
  counterState,
  moveItem,
  cleanSpecs,
  cleanImages,
  buildProductPayload,
  AVAILABILITY_LABELS,
  STATUS_LABELS,
} = require("../../public/admin/catalog-utils");

test("parsePriceInput accepts plain and thousands-separated integers", () => {
  assert.deepEqual(parsePriceInput("1500000"), { ok: true, value: 1500000 });
  assert.deepEqual(parsePriceInput("1.500.000"), { ok: true, value: 1500000 });
  assert.deepEqual(parsePriceInput("1,500,000"), { ok: true, value: 1500000 });
  assert.deepEqual(parsePriceInput(" 250 000 "), { ok: true, value: 250000 });
  assert.deepEqual(parsePriceInput(250000), { ok: true, value: 250000 });
});

test("parsePriceInput treats blank as no price", () => {
  assert.deepEqual(parsePriceInput(""), { ok: true, value: null });
  assert.deepEqual(parsePriceInput("   "), { ok: true, value: null });
  assert.deepEqual(parsePriceInput(null), { ok: true, value: null });
});

test("parsePriceInput rejects decimals, zero, negatives and text", () => {
  for (const raw of ["1500,50", "12.5", "0", "-10", "abc", "1.5.5", "$100"]) {
    const out = parsePriceInput(raw);
    assert.equal(out.ok, false, raw);
    assert.equal(typeof out.error, "string");
  }
});

test("formatCop groups thousands with dots", () => {
  assert.equal(formatCop(1500000), "$1.500.000");
  assert.equal(formatCop(950), "$950");
  assert.equal(formatCop(null), "—");
});

test("counterState reports length against the recommended size", () => {
  assert.deepEqual(counterState("a".repeat(42), 60), { text: "42 / 60", level: "ok" });
  assert.deepEqual(counterState("a".repeat(61), 60), { text: "61 / 60", level: "over" });
  assert.deepEqual(counterState("", 160), { text: "0 / 160", level: "ok" });
  assert.deepEqual(counterState(null, 160), { text: "0 / 160", level: "ok" });
});

test("moveItem swaps neighbours without mutating and clamps at the edges", () => {
  const list = ["a", "b", "c"];
  assert.deepEqual(moveItem(list, 1, -1), ["b", "a", "c"]);
  assert.deepEqual(moveItem(list, 1, 1), ["a", "c", "b"]);
  assert.deepEqual(moveItem(list, 0, -1), ["a", "b", "c"]);
  assert.deepEqual(moveItem(list, 2, 1), ["a", "b", "c"]);
  assert.deepEqual(list, ["a", "b", "c"]);
});

test("cleanSpecs trims, keeps order, drops blank rows and counts incomplete ones", () => {
  const out = cleanSpecs([
    { label: " Puertos ", value: " 4 LAN " },
    { label: "", value: "" },
    { label: "Solo etiqueta", value: "" },
    { label: "WAN", value: "1" },
  ]);
  assert.deepEqual(out.specs, [
    { label: "Puertos", value: "4 LAN" },
    { label: "WAN", value: "1" },
  ]);
  assert.equal(out.incomplete, 1);
});

test("cleanImages keeps order and drops rows without url", () => {
  assert.deepEqual(
    cleanImages([{ url: " https://x/a.jpg ", alt: " Frente " }, { url: "", alt: "x" }, { url: "/b.png", alt: "" }]),
    [{ url: "https://x/a.jpg", alt: "Frente" }, { url: "/b.png", alt: "" }],
  );
});

const baseForm = {
  name: " RUT956 ",
  slug: "",
  categoryId: "c1",
  brandId: "",
  model: "",
  sku: " ",
  shortDescription: "",
  description: "",
  priceCop: "1.200.000",
  consultPrice: false,
  availability: "in_stock",
  status: "draft",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  datasheetUrl: "",
  specs: [{ label: "Puertos", value: "4" }],
  images: [{ url: "https://x/a.jpg", alt: "Frente" }],
};

test("buildProductPayload normalizes a form into the API payload", () => {
  const out = buildProductPayload(baseForm);
  assert.equal(out.ok, true);
  assert.equal(out.payload.name, "RUT956");
  assert.equal(out.payload.priceCop, 1200000);
  assert.equal(out.payload.brandId, null);
  assert.equal(out.payload.sku, null);
  assert.equal("slug" in out.payload, false, "blank slug is omitted so the server generates or keeps it");
  assert.deepEqual(out.payload.specs, [{ label: "Puertos", value: "4" }]);
});

test("buildProductPayload keeps an explicit slug", () => {
  assert.equal(buildProductPayload({ ...baseForm, slug: " rut956 " }).payload.slug, "rut956");
});

test("buildProductPayload requires a name and a category", () => {
  assert.equal(buildProductPayload({ ...baseForm, name: "  " }).ok, false);
  assert.equal(buildProductPayload({ ...baseForm, categoryId: "" }).ok, false);
});

test("buildProductPayload surfaces invalid prices and incomplete specs", () => {
  const price = buildProductPayload({ ...baseForm, priceCop: "12,5" });
  assert.equal(price.ok, false);
  assert.match(price.error, /precio/i);
  const specs = buildProductPayload({ ...baseForm, specs: [{ label: "Solo", value: "" }] });
  assert.equal(specs.ok, false);
  assert.match(specs.error, /especificaci/i);
});

test("labels cover every availability and status value", () => {
  assert.deepEqual(Object.keys(AVAILABILITY_LABELS).sort(), ["in_stock", "on_request", "out_of_stock"]);
  assert.deepEqual(Object.keys(STATUS_LABELS).sort(), ["draft", "published"]);
});
