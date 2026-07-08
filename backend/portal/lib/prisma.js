// Cliente Prisma del Portal (BD dedicada). Se genera en node_modules/.prisma/portal-client
// para no colisionar con ningún otro cliente Prisma del backend.
const { PrismaClient } = require("../node_modules/.prisma/portal-client");

// Singleton: evita abrir múltiples pools de conexiones en desarrollo (hot-reload).
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__portalPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__portalPrisma = prisma;
}

module.exports = { prisma };
