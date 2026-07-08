// Gestión de Equipos (Activos). Administración: solo Admin HISTECH.
// Lectura: el cliente puede ver los equipos de su empresa (para crear tickets).
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler, HttpError } = require("../lib/http");
const { requireAuth, requireAdmin, assertCompanyAccess } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  assetCreateSchema,
  assetUpdateSchema,
  idParam,
  companyIdParam,
} = require("../validators/schemas");

const router = Router();
router.use(requireAuth);

// GET /companies/:companyId/assets — equipos de una empresa (admin o cliente de esa empresa).
router.get(
  "/companies/:companyId/assets",
  validate({ params: companyIdParam }),
  asyncHandler(async (req, res) => {
    const { companyId } = req.valid.params;
    assertCompanyAccess(req, companyId);
    const assets = await prisma.asset.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: {
        assignedUser: { select: { id: true, fullName: true } },
        _count: { select: { tickets: true } },
      },
    });
    res.json(assets);
  }),
);

// POST /companies/:companyId/assets — crear equipo (solo Admin).
router.post(
  "/companies/:companyId/assets",
  requireAdmin,
  validate({ params: companyIdParam, body: assetCreateSchema }),
  asyncHandler(async (req, res) => {
    const { companyId } = req.valid.params;
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new HttpError(404, "Empresa no encontrada");
    const asset = await prisma.asset.create({
      data: { ...req.valid.body, companyId },
    });
    res.status(201).json(asset);
  }),
);

// GET /assets/:id — detalle con historial de tickets del equipo.
router.get(
  "/assets/:id",
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const asset = await prisma.asset.findUniqueOrThrow({
      where: { id: req.valid.params.id },
      include: {
        assignedUser: { select: { id: true, fullName: true } },
        company: { select: { id: true, name: true } },
        tickets: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true, number: true, subject: true, status: true, priority: true,
            createdAt: true, closedAt: true, timeSpentMin: true,
            assignedTo: { select: { id: true, fullName: true } },
          },
        },
      },
    });
    assertCompanyAccess(req, asset.companyId);
    res.json(asset);
  }),
);

// PUT /assets/:id — editar (solo Admin).
router.put(
  "/assets/:id",
  requireAdmin,
  validate({ params: idParam, body: assetUpdateSchema }),
  asyncHandler(async (req, res) => {
    const asset = await prisma.asset.update({
      where: { id: req.valid.params.id },
      data: req.valid.body,
    });
    res.json(asset);
  }),
);

module.exports = router;
