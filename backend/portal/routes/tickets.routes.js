// Tickets — creación, consulta, asignación, atención y cierre.
// Cliente: crea y consulta SUS tickets. Admin HISTECH: ve y gestiona todos.
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler, HttpError } = require("../lib/http");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { upload, optimizeAndUpload } = require("../lib/uploads");
const { streamTicketPdf } = require("../lib/pdf");
const { notifyNewTicket, notifyAssigned, notifyUpdated, notifyClosed } = require("../lib/mail");
const {
  nextTicketNumber,
  logEvent,
  ticketInclude,
  ticketListInclude,
} = require("../lib/tickets");
const {
  ticketCreateSchema,
  ticketAssignSchema,
  ticketStatusSchema,
  ticketAttendSchema,
  ticketCloseSchema,
  idParam,
} = require("../validators/schemas");

const router = Router();
router.use(requireAuth);

const isAdmin = (req) => req.auth.role === "ADMIN_HISTECH";

// Construye el filtro de acceso base: el cliente solo ve SUS tickets; el admin ve todo.
function baseScope(req) {
  if (isAdmin(req)) return {};
  return { companyId: req.auth.companyId, createdById: req.auth.userId };
}

// Carga un ticket verificando acceso. Devuelve el ticket (con include indicado).
async function loadTicket(req, id, include = ticketInclude) {
  const ticket = await prisma.ticket.findUnique({ where: { id }, include });
  if (!ticket) throw new HttpError(404, "Ticket no encontrado");
  if (!isAdmin(req)) {
    if (ticket.companyId !== req.auth.companyId || ticket.createdById !== req.auth.userId) {
      throw new HttpError(403, "No tienes acceso a este ticket");
    }
  }
  return ticket;
}

// ── Dashboard del cliente: contadores + últimos tickets ──
router.get(
  "/tickets/dashboard",
  asyncHandler(async (req, res) => {
    const where = baseScope(req);
    const [grouped, latest] = await Promise.all([
      prisma.ticket.groupBy({ by: ["status"], where, _count: { _all: true } }),
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: ticketListInclude,
      }),
    ]);
    const counts = { NUEVO: 0, ASIGNADO: 0, EN_PROCESO: 0, PENDIENTE_CLIENTE: 0, RESUELTO: 0, CERRADO: 0 };
    for (const g of grouped) counts[g.status] = g._count._all;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    res.json({
      counts,
      total,
      abiertos: counts.NUEVO + counts.ASIGNADO,
      enProceso: counts.EN_PROCESO + counts.PENDIENTE_CLIENTE,
      resueltos: counts.RESUELTO,
      cerrados: counts.CERRADO,
      latest,
    });
  }),
);

// ── Listado con filtros ──
router.get(
  "/tickets",
  asyncHandler(async (req, res) => {
    const { status, category, priority, companyId, assetId, assignedToId, q } = req.query;
    const where = { ...baseScope(req) };
    if (status) where.status = String(status);
    if (category) where.category = String(category);
    if (priority) where.priority = String(priority);
    if (assetId) where.assetId = String(assetId);
    if (assignedToId) where.assignedToId = String(assignedToId);
    if (isAdmin(req) && companyId) where.companyId = String(companyId);
    if (q) {
      where.OR = [
        { number: { contains: String(q), mode: "insensitive" } },
        { subject: { contains: String(q), mode: "insensitive" } },
      ];
    }
    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: ticketListInclude,
    });
    res.json(tickets);
  }),
);

// ── Crear ticket ──
router.post(
  "/tickets",
  validate({ body: ticketCreateSchema }),
  asyncHandler(async (req, res) => {
    const body = req.valid.body;

    // La empresa: cliente → su propia; admin → la que indique (obligatoria para admin).
    let companyId;
    if (isAdmin(req)) {
      if (!body.companyId) throw new HttpError(400, "Debes indicar la empresa del ticket");
      companyId = body.companyId;
    } else {
      companyId = req.auth.companyId;
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new HttpError(404, "Empresa no encontrada");
    if (company.status !== "ACTIVE") throw new HttpError(400, "La empresa está desactivada");

    // Si se asocia un equipo, debe pertenecer a la misma empresa.
    if (body.assetId) {
      const asset = await prisma.asset.findUnique({ where: { id: body.assetId } });
      if (!asset || asset.companyId !== companyId) {
        throw new HttpError(400, "El equipo seleccionado no pertenece a la empresa");
      }
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const number = await nextTicketNumber(tx);
      const created = await tx.ticket.create({
        data: {
          number,
          companyId,
          createdById: req.auth.userId,
          assetId: body.assetId ?? null,
          area: body.area ?? null,
          category: body.category,
          priority: body.priority,
          subject: body.subject,
          description: body.description,
          status: "NUEVO",
        },
      });
      await logEvent(tx, {
        ticketId: created.id,
        userId: req.auth.userId,
        action: "Ticket creado",
        toStatus: "NUEVO",
      });
      return created;
    });

    const full = await prisma.ticket.findUnique({ where: { id: ticket.id }, include: ticketInclude });
    notifyNewTicket(full); // notificación por email (no bloquea la respuesta)
    res.status(201).json(full);
  }),
);

// ── Detalle ──
router.get(
  "/tickets/:id",
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const ticket = await loadTicket(req, req.valid.params.id);
    res.json(ticket);
  }),
);

// ── Descargar PDF del ticket (con identidad HISTECH) ──
router.get(
  "/tickets/:id/pdf",
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const ticket = await loadTicket(req, req.valid.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${ticket.number}.pdf"`,
    );
    await streamTicketPdf(ticket, res);
  }),
);

// ── Asignar técnico (Admin) ──
router.patch(
  "/tickets/:id/assign",
  requireAdmin,
  validate({ params: idParam, body: ticketAssignSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.valid.params;
    const { assignedToId } = req.valid.body;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new HttpError(404, "Ticket no encontrado");
    const tech = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!tech) throw new HttpError(404, "Técnico no encontrado");

    const updated = await prisma.$transaction(async (tx) => {
      const nextStatus = ticket.status === "NUEVO" ? "ASIGNADO" : ticket.status;
      const u = await tx.ticket.update({
        where: { id },
        data: {
          assignedToId,
          status: nextStatus,
          // Marca de "atención iniciada" (para el tiempo promedio de atención).
          startedAt: ticket.startedAt ?? new Date(),
        },
      });
      await logEvent(tx, {
        ticketId: id,
        userId: req.auth.userId,
        action: `Asignado a ${tech.fullName}`,
        fromStatus: ticket.status,
        toStatus: nextStatus,
      });
      return u;
    });
    const full = await prisma.ticket.findUnique({ where: { id: updated.id }, include: ticketInclude });
    notifyAssigned(full);
    res.json(full);
  }),
);

// ── Cambiar estado (Admin) ──
router.patch(
  "/tickets/:id/status",
  requireAdmin,
  validate({ params: idParam, body: ticketStatusSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.valid.params;
    const { status, note } = req.valid.body;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new HttpError(404, "Ticket no encontrado");

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({ where: { id }, data: { status } });
      await logEvent(tx, {
        ticketId: id,
        userId: req.auth.userId,
        action: `Estado cambiado a ${status}`,
        note,
        fromStatus: ticket.status,
        toStatus: status,
      });
    });
    const full = await prisma.ticket.findUnique({ where: { id }, include: ticketInclude });
    notifyUpdated(full);
    res.json(full);
  }),
);

// ── Registrar atención técnica (Admin) ──
router.post(
  "/tickets/:id/attend",
  requireAdmin,
  validate({ params: idParam, body: ticketAttendSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.valid.params;
    const body = req.valid.body;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new HttpError(404, "Ticket no encontrado");
    if (ticket.status === "CERRADO") throw new HttpError(400, "El ticket ya está cerrado");

    const nextStatus = body.status ?? (ticket.status === "NUEVO" || ticket.status === "ASIGNADO" ? "EN_PROCESO" : ticket.status);

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: {
          diagnosis: body.diagnosis ?? ticket.diagnosis,
          actions: body.actions ?? ticket.actions,
          solution: body.solution ?? ticket.solution,
          recommendations: body.recommendations ?? ticket.recommendations,
          technicalObservations: body.technicalObservations ?? ticket.technicalObservations,
          startedAt: body.startedAt ? new Date(body.startedAt) : (ticket.startedAt ?? new Date()),
          finishedAt: body.finishedAt ? new Date(body.finishedAt) : ticket.finishedAt,
          timeSpentMin: body.timeSpentMin ?? ticket.timeSpentMin,
          status: nextStatus,
          assignedToId: ticket.assignedToId ?? req.auth.userId,
        },
      });
      await logEvent(tx, {
        ticketId: id,
        userId: req.auth.userId,
        action: "Atención registrada",
        fromStatus: ticket.status,
        toStatus: nextStatus,
      });
    });
    const full = await prisma.ticket.findUnique({ where: { id }, include: ticketInclude });
    notifyUpdated(full);
    res.json(full);
  }),
);

// ── Cerrar ticket (Admin) ──
router.post(
  "/tickets/:id/close",
  requireAdmin,
  validate({ params: idParam, body: ticketCloseSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.valid.params;
    const body = req.valid.body;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new HttpError(404, "Ticket no encontrado");
    if (ticket.status === "CERRADO") throw new HttpError(400, "El ticket ya está cerrado");

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: {
          finalSolution: body.finalSolution,
          finalObservations: body.finalObservations ?? null,
          timeSpentMin: body.timeSpentMin ?? ticket.timeSpentMin,
          status: "CERRADO",
          closedById: req.auth.userId,
          closedAt: new Date(),
          assignedToId: ticket.assignedToId ?? req.auth.userId,
          finishedAt: ticket.finishedAt ?? new Date(),
        },
      });
      await logEvent(tx, {
        ticketId: id,
        userId: req.auth.userId,
        action: "Ticket cerrado",
        note: body.finalSolution,
        fromStatus: ticket.status,
        toStatus: "CERRADO",
      });
    });
    const full = await prisma.ticket.findUnique({ where: { id }, include: ticketInclude });
    notifyClosed(full);
    res.json(full);
  }),
);

// ── Adjuntar imágenes (máx. 2 por tipo; solo imágenes optimizadas) ──
router.post(
  "/tickets/:id/attachments",
  validate({ params: idParam }),
  upload.array("images", 2),
  asyncHandler(async (req, res) => {
    const ticket = await loadTicket(req, req.valid.params.id, { attachments: true });
    if (ticket.status === "CERRADO" && !isAdmin(req)) {
      throw new HttpError(400, "El ticket está cerrado");
    }
    // El cliente solo adjunta como CLIENT; el admin puede adjuntar evidencia técnica.
    const kind = isAdmin(req) && req.query.kind === "TECH_EVIDENCE" ? "TECH_EVIDENCE" : "CLIENT";
    const files = req.files || [];
    if (files.length === 0) throw new HttpError(400, "No se recibió ninguna imagen");

    const existing = ticket.attachments.filter((a) => a.kind === kind).length;
    if (existing + files.length > 2) {
      throw new HttpError(400, `Máximo 2 imágenes por ticket (ya hay ${existing}).`);
    }

    const created = [];
    for (const file of files) {
      const url = await optimizeAndUpload(file.buffer);
      const att = await prisma.ticketAttachment.create({
        data: { ticketId: ticket.id, url, kind, uploadedById: req.auth.userId },
      });
      created.push(att);
    }
    await logEvent(prisma, {
      ticketId: ticket.id,
      userId: req.auth.userId,
      action: `${created.length} imagen(es) adjuntada(s)`,
    });
    res.status(201).json(created);
  }),
);

module.exports = router;
