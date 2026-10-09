// Production wiring of the catalog module: Prisma repository + R2 uploader.
// Mounted from server.js with a single line:
//   app.use("/api", buildCatalogRouter({ requireAdmin, uploader }))
const { prisma } = require("../portal/lib/prisma");
const { createPrismaRepository } = require("./repository.prisma");
const { createCatalogService } = require("./service");
const { createCatalogRouter } = require("./router");

function buildCatalogRouter({ requireAdmin, uploader }) {
  const service = createCatalogService({ repo: createPrismaRepository(prisma) });
  return createCatalogRouter({ service, requireAdmin, uploader });
}

module.exports = { buildCatalogRouter };
