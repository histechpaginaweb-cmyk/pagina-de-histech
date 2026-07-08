// Dashboard ejecutivo del Administrador HISTECH: métricas globales de tickets,
// distribuciones (empresa, prioridad, categoría) y tiempos promedio.
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../lib/http");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { ticketListInclude } = require("../lib/tickets");

const router = Router();

const EMPTY_STATUS = {
  NUEVO: 0, ASIGNADO: 0, EN_PROCESO: 0, PENDIENTE_CLIENTE: 0, RESUELTO: 0, CERRADO: 0,
};

router.get(
  "/dashboard/admin",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [byStatus, byPriority, byCategory, byCompanyRaw, companies, latest, avg] =
      await Promise.all([
        prisma.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.ticket.groupBy({ by: ["priority"], _count: { _all: true } }),
        prisma.ticket.groupBy({ by: ["category"], _count: { _all: true } }),
        prisma.ticket.groupBy({ by: ["companyId"], _count: { _all: true } }),
        prisma.company.findMany({ select: { id: true, name: true } }),
        prisma.ticket.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: ticketListInclude,
        }),
        // Tiempos promedio (minutos) vía SQL: atención = startedAt-createdAt;
        // resolución = closedAt-createdAt.
        prisma.$queryRaw`
          SELECT
            AVG(EXTRACT(EPOCH FROM ("startedAt" - "createdAt")))/60 AS attention_min,
            AVG(EXTRACT(EPOCH FROM ("closedAt"  - "createdAt")))/60 AS resolution_min
          FROM tickets`,
      ]);

    const counts = { ...EMPTY_STATUS };
    for (const g of byStatus) counts[g.status] = g._count._all;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const priority = {};
    for (const g of byPriority) priority[g.priority] = g._count._all;

    const category = {};
    for (const g of byCategory) category[g.category] = g._count._all;

    const nameById = Object.fromEntries(companies.map((c) => [c.id, c.name]));
    const byCompany = byCompanyRaw
      .map((g) => ({ companyId: g.companyId, name: nameById[g.companyId] || "—", count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    const round = (v) => (v == null ? null : Math.round(Number(v)));

    res.json({
      counts,
      total,
      abiertos: counts.NUEVO + counts.ASIGNADO + counts.EN_PROCESO + counts.PENDIENTE_CLIENTE,
      cerrados: counts.CERRADO,
      priority,
      category,
      byCompany,
      avgAttentionMin: round(avg?.[0]?.attention_min),
      avgResolutionMin: round(avg?.[0]?.resolution_min),
      latest,
    });
  }),
);

module.exports = router;
