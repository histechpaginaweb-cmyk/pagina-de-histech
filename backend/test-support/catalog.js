const { createMemoryRepository } = require("../catalog/repository.memory");
const { createCatalogService } = require("../catalog/service");

/** Service wired to the in-memory repository with a deterministic, ticking clock. */
function makeService() {
  let tick = Date.UTC(2026, 0, 1);
  const now = () => new Date((tick += 1000));
  const repo = createMemoryRepository({ now });
  const service = createCatalogService({ repo, now });
  return { repo, service, now };
}

/** Creates a category and a brand and returns them. */
async function seedTaxonomy(service) {
  const category = await service.createCategory({ name: "Routers" });
  const brand = await service.createBrand({ name: "Teltonika" });
  return { category, brand };
}

module.exports = { makeService, seedTaxonomy };
