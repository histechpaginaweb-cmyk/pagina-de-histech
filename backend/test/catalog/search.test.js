const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeSearch, matchesSearch } = require("../../catalog/search");

test("normalizeSearch lowercases and drops hyphens, spaces and punctuation", () => {
  assert.equal(normalizeSearch("RG-ES116G-L"), "rges116gl");
  assert.equal(normalizeSearch(" rg es116g l "), "rges116gl");
  assert.equal(normalizeSearch("Módulo_SFP+"), "modulosfp");
  assert.equal(normalizeSearch(null), "");
});

test("matchesSearch ignores hyphens, spaces and case, and still supports plain substrings", () => {
  const fields = ["Reyee RG-ES116G-L", "RG-ES116G-L", "RG-ES116G-L", "Reyee"];
  for (const q of ["rges116gl", "RG ES116G L", "es116g-l", "rg-es116g-l", "reyee rg", "ES116"]) {
    assert.equal(matchesSearch(fields, q), true, q);
  }
  assert.equal(matchesSearch(fields, "RG-ES106F-P"), false);
  assert.equal(matchesSearch(fields, "---"), false);
  assert.equal(matchesSearch([null, undefined], "x"), false);
});
