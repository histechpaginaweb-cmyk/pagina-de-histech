// Gestión de Empresas — solo Administrador HISTECH.
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../lib/http");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  companyCreateSchema,
  companyUpdateSchema,
  statusSchema,
  idParam,
} = require("../validators/schemas");

const router = Router();

// Guardias POR RUTA (no a nivel de router): al montarse bajo "/companies", un
// `router.use` global filtraría también /companies/:id/assets (que el cliente sí
// puede leer). Por eso cada ruta declara sus propios middlewares.
const adminOnly = [requireAuth, requireAdmin];

// GET /companies — lista con conteos de usuarios/equipos/tickets.
router.get(
  "/",
  ...adminOnly,
  asyncHandler(async (req, res) => {
    const { q, status } = req.query;
    const where = {};
    if (status) where.status = String(status);
    if (q) where.name = { contains: String(q), mode: "insensitive" };

    const companies = await prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { users: true, assets: true, tickets: true } } },
    });
    res.json(companies);
  }),
);

// GET /companies/:id
router.get(
  "/:id",
  ...adminOnly,
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const company = await prisma.company.findUniqueOrThrow({
      where: { id: req.valid.params.id },
      include: { _count: { select: { users: true, assets: true, tickets: true } } },
    });
    res.json(company);
  }),
);

// POST /companies
router.post(
  "/",
  ...adminOnly,
  validate({ body: companyCreateSchema }),
  asyncHandler(async (req, res) => {
    const company = await prisma.company.create({ data: req.valid.body });
    res.status(201).json(company);
  }),
);

// PUT /companies/:id
router.put(
  "/:id",
  ...adminOnly,
  validate({ params: idParam, body: companyUpdateSchema }),
  asyncHandler(async (req, res) => {
    const company = await prisma.company.update({
      where: { id: req.valid.params.id },
      data: req.valid.body,
    });
    res.json(company);
  }),
);

// PATCH /companies/:id/status — activar / desactivar.
router.patch(
  "/:id/status",
  ...adminOnly,
  validate({ params: idParam, body: statusSchema }),
  asyncHandler(async (req, res) => {
    const company = await prisma.company.update({
      where: { id: req.valid.params.id },
      data: { status: req.valid.body.status },
    });
    res.json(company);
  }),
);

module.exports = router;
