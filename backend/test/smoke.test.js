const test = require("node:test");
const assert = require("node:assert/strict");

test("backend test runner is wired", () => {
  assert.equal(typeof require("../auth").requireAdmin, "function");
});
