const test = require("node:test");
const assert = require("node:assert/strict");
const { fixMojibake, hasMojibake } = require("../../catalog/import/mojibake");
const { toCatalogProduct } = require("../../catalog/import/syscom-map");

// Simulates the scrape bug: UTF-8 bytes decoded as Windows-1252.
const CP1252 = {
  0x80: "€", 0x82: "‚", 0x83: "ƒ", 0x84: "„", 0x85: "…", 0x86: "†", 0x87: "‡", 0x88: "ˆ", 0x89: "‰",
  0x8a: "Š", 0x8b: "‹", 0x8c: "Œ", 0x8e: "Ž", 0x91: "‘", 0x92: "’", 0x93: "“", 0x94: "”", 0x95: "•",
  0x96: "–", 0x97: "—", 0x98: "˜", 0x99: "™", 0x9a: "š", 0x9b: "›", 0x9c: "œ", 0x9e: "ž", 0x9f: "Ÿ",
};
const garble = (s) =>
  [...Buffer.from(s, "utf8")].map((b) => (b < 0x80 ? String.fromCharCode(b) : CP1252[b] ?? String.fromCharCode(b))).join("");

test("sanity: garble helper reproduces the real examples", () => {
  assert.equal(garble("Diseño"), "DiseÃ±o");
  assert.equal(garble("℃"), "â„ƒ");
  assert.equal(garble("Único"), "Ãšnico");
});

test("repairs the real examples", () => {
  const cases = [
    ["DiseÃ±o", "Diseño"],
    ["OperaciÃ³n", "Operación"],
    ["FÃ¡cil", "Fácil"],
    ["Ãšnico", "Único"],
    ["Ãºnico", "único"],
    ["cÃ¡maras", "cámaras"],
    ["prevenciÃ³n", "prevención"],
    ["-40â„ƒ a 80â„ƒ", "-40℃ a 80℃"],
    ["DifÃ­ciles", "Difíciles"],
  ];
  for (const [bad, good] of cases) assert.equal(fixMojibake(bad), good, bad);
});

test("repairs only broken runs inside mixed strings", () => {
  assert.equal(fixMojibake("Diseño y OperaciÃ³n fÃ¡cil"), "Diseño y Operación fácil");
  assert.equal(fixMojibake("Diseño ñ á é ℃ y cÃ¡maras"), "Diseño ñ á é ℃ y cámaras");
});

test("a lone A-tilde with a missing soft hyphen is left unchanged (unrecoverable)", () => {
  assert.equal(fixMojibake("DifÃciles"), "DifÃciles");
  assert.equal(fixMojibake("Ã"), "Ã");
  assert.equal(fixMojibake("Ã al final"), "Ã al final");
});

test("leaves invalid sequences untouched", () => {
  // C3 followed by 0x80-0xBF is fine, but E0 80 80 is an invalid UTF-8 (overlong) sequence.
  assert.equal(fixMojibake("à\u0080\u0080"), "à\u0080\u0080");
});

test("is idempotent and leaves clean text unchanged", () => {
  const clean = ["Diseño fácil", "Operación única", "-40℃ a 80℃", "plain ascii", "", "Ñandú ¿qué? 100 Mbps — PoE+"];
  for (const s of clean) assert.equal(fixMojibake(s), s);
  const once = fixMojibake("DiseÃ±o y â„ƒ");
  assert.equal(fixMojibake(once), once);
});

test("non-strings pass through", () => {
  assert.equal(fixMojibake(null), null);
  assert.equal(fixMojibake(undefined), undefined);
  assert.equal(fixMojibake(5), 5);
});

test("hasMojibake detects only repairable text", () => {
  assert.equal(hasMojibake("DiseÃ±o"), true);
  assert.equal(hasMojibake("Diseño"), false);
  assert.equal(hasMojibake("DifÃciles"), false);
});

test("toCatalogProduct repairs every emitted text", () => {
  const p = toCatalogProduct({
    name: "Switch FÃ¡cil",
    model: "RG-X",
    line: "Reyee",
    priceCop: 100,
    breadcrumb: ["Redes", "Switches"],
    features: ["DiseÃ±o compacto", "OperaciÃ³n de -40â„ƒ a 80â„ƒ"],
    specsText: "Ãšnico puerto",
    images: [],
  });
  assert.equal(p.shortDescription, "Switch Fácil");
  assert.match(p.description, /^Switch Fácil/);
  assert.ok(p.description.includes("- Diseño compacto"));
  assert.ok(p.description.includes("- Operación de -40℃ a 80℃"));
  assert.ok(p.description.includes("Único puerto"));
  assert.ok(!hasMojibake(p.description));
});
