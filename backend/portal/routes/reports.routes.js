// Módulo de reportes: exportación de tickets a Excel (.xlsx) con filtros.
// Administrador HISTECH (todas las empresas) y LIDER (solo su propia empresa,
// forzado del lado servidor — no del query param). No se usa Power BI.
const { Router } = require("express");
const ExcelJS = require("exceljs");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../lib/http");
const { requireAuth, requireRole } = require("../middleware/auth");
const { ticketListInclude } = require("../lib/tickets");

const router = Router();

const STATUS_LABEL = {
  NUEVO: "Nuevo", ASIGNADO: "Asignado", EN_PROCESO: "En proceso",
  PENDIENTE_CLIENTE: "Pendiente del cliente", RESUELTO: "Resuelto", CERRADO: "Cerrado",
};
const PRIORITY_LABEL = { BAJA: "Baja", MEDIA: "Media", ALTA: "Alta", CRITICA: "Crítica" };
const CATEGORY_LABEL = {
  HARDWARE: "Hardware", SOFTWARE: "Software", RED: "Red", INTERNET: "Internet",
  IMPRESORAS: "Impresoras", OFFICE: "Office", CORREO: "Correo", ACCESOS: "Accesos", OTRO: "Otro",
};

router.get(
  "/reports/tickets.xlsx",
  requireAuth,
  requireRole("ADMIN_HISTECH", "LIDER"),
  asyncHandler(async (req, res) => {
    const isAdmin = req.auth.role === "ADMIN_HISTECH";
    const { companyId, status, category, priority, assignedToId, assetId, from, to } = req.query;
    const where = {};
    // LIDER: forzado del lado servidor a su propia empresa (nunca confiar en el
    // companyId del query — evitaría el aislamiento multi-tenant).
    if (isAdmin) {
      if (companyId) where.companyId = String(companyId);
    } else {
      where.companyId = req.auth.companyId;
    }
    if (status) where.status = String(status);
    if (category) where.category = String(category);
    if (priority) where.priority = String(priority);
    if (assignedToId) where.assignedToId = String(assignedToId);
    if (assetId) where.assetId = String(assetId);
    if (from || to) {
      where.createdAt = {};
      // Los límites del día se construyen con partes locales (mismo huso para
      // inicio y fin). Evita el bug de mezclar `new Date("YYYY-MM-DD")` (UTC) con
      // setHours (local), que excluía tickets del mismo día en husos negativos.
      const dayStart = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d, 0, 0, 0, 0); };
      const dayEnd = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d, 23, 59, 59, 999); };
      if (from) { const g = dayStart(from); if (!isNaN(+g)) where.createdAt.gte = g; }
      if (to) { const l = dayEnd(to); if (!isNaN(+l)) where.createdAt.lte = l; }
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: ticketListInclude,
    });

    const wb = new ExcelJS.Workbook();
    wb.creator = "HISTECH — Portal de Soporte";
    wb.created = new Date();
    const ws = wb.addWorksheet("Tickets", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    ws.columns = [
      { header: "N.º Ticket", key: "number", width: 18 },
      { header: "Empresa", key: "company", width: 26 },
      { header: "Solicitante", key: "createdBy", width: 24 },
      { header: "Equipo", key: "asset", width: 24 },
      { header: "Área", key: "area", width: 18 },
      { header: "Categoría", key: "category", width: 14 },
      { header: "Prioridad", key: "priority", width: 12 },
      { header: "Estado", key: "status", width: 20 },
      { header: "Técnico", key: "assignedTo", width: 24 },
      { header: "Asunto", key: "subject", width: 40 },
      { header: "Tiempo (min)", key: "time", width: 12 },
      { header: "Creado", key: "createdAt", width: 20 },
      { header: "Cerrado", key: "closedAt", width: 20 },
    ];

    // Encabezado con identidad de marca (púrpura HISTECH).
    const header = ws.getRow(1);
    header.height = 22;
    header.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF7C3AED" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    const fmt = (d) =>
      d ? new Date(d).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) : "";

    for (const t of tickets) {
      ws.addRow({
        number: t.number,
        company: t.company?.name ?? "",
        createdBy: t.createdBy?.fullName ?? "",
        asset: t.asset ? `${t.asset.internalCode} — ${t.asset.name}` : "",
        area: t.area ?? "",
        category: CATEGORY_LABEL[t.category] ?? t.category,
        priority: PRIORITY_LABEL[t.priority] ?? t.priority,
        status: STATUS_LABEL[t.status] ?? t.status,
        assignedTo: t.assignedTo?.fullName ?? "",
        subject: t.subject,
        time: t.timeSpentMin ?? "",
        createdAt: fmt(t.createdAt),
        closedAt: fmt(t.closedAt),
      });
    }

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="tickets-histech-${stamp}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  }),
);

module.exports = router;
