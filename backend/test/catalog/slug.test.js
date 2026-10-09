const test = require("node:test");
const assert = require("node:assert/strict");
const { slugify, uniqueSlug } = require("../../catalog/slug");

test("slugify strips accents, punctuation and collapses separators", () => {
  assert.equal(slugify("  Teltonika RUT956 — Router 4G/LTE  "), "teltonika-rut956-router-4g-lte");
  assert.equal(slugify("Conmutador Gestionado Ñandú"), "conmutador-gestionado-nandu");
});

test("slugify falls back when nothing usable remains", () => {
  assert.equal(slugify("***"), "item");
  assert.equal(slugify("***", "marca"), "marca");
});

test("slugify caps the length at 80 characters without trailing dash", () => {
  const out = slugify("a".repeat(70) + " " + "b".repeat(70));
  assert.ok(out.length <= 80);
  assert.ok(!out.endsWith("-"));
});

test("uniqueSlug returns the base when free", async () => {
  assert.equal(await uniqueSlug("Router 4G", async () => false), "router-4g");
});

test("uniqueSlug appends the lowest free numeric suffix, deterministically", async () => {
  const taken = new Set(["router-4g", "router-4g-2"]);
  assert.equal(await uniqueSlug("Router 4G", async (s) => taken.has(s)), "router-4g-3");
});

test("uniqueSlug keeps suffixed slugs within 80 characters", async () => {
  const base = "x".repeat(100);
  const first = slugify(base);
  const out = await uniqueSlug(base, async (s) => s === first);
  assert.ok(out.length <= 80);
  assert.ok(out.endsWith("-2"));
});
