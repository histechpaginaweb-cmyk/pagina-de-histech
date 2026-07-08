// Gestión de Usuarios — solo Administrador HISTECH. Sin registro público.
// Los usuarios se crean SIEMPRE desde una empresa (companyId en la ruta).
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { asyncHandler, HttpError } = require("../lib/http");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { hashPassword } = require("../lib/password");
const { publicUser } = require("../lib/serialize");
const {
  userCreateSchema,
  userUpdateSchema,
  resetPasswordSchema,
  statusSchema,
  idParam,
  companyIdParam,
} = require("../validators/schemas");

const router = Router();

// Guardias POR RUTA (no a nivel de router): este router se monta en "/", así que
// un `router.use` global filtraría TODAS las rutas del portal (p. ej. /tickets).
const adminOnly = [requireAuth, requireAdmin];

// GET /users — lista global (admin), filtrable por ?companyId, ?role, ?q.
router.get(
  "/users",
  ...adminOnly,
  asyncHandler(async (req, res) => {
    const { companyId, role, status, q } = req.query;
    const where = {};
    if (companyId) where.companyId = String(companyId);
    if (role) where.role = String(role);
    if (status) where.status = String(status);
    if (q) {
      where.OR = [
        { fullName: { contains: String(q), mode: "insensitive" } },
        { username: { contains: String(q), mode: "insensitive" } },
        { email: { contains: String(q), mode: "insensitive" } },
      ];
    }
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { company: { select: { id: true, name: true } } },
    });
    res.json(users.map(publicUser));
  }),
);

// GET /companies/:companyId/users — usuarios de una empresa.
router.get(
  "/companies/:companyId/users",
  ...adminOnly,
  validate({ params: companyIdParam }),
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      where: { companyId: req.valid.params.companyId },
      orderBy: { createdAt: "desc" },
    });
    res.json(users.map(publicUser));
  }),
);

// POST /companies/:companyId/users — crear usuario dentro de la empresa.
router.post(
  "/companies/:companyId/users",
  ...adminOnly,
  validate({ params: companyIdParam, body: userCreateSchema }),
  asyncHandler(async (req, res) => {
    const { companyId } = req.valid.params;
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new HttpError(404, "Empresa no encontrada");

    const { password, ...rest } = req.valid.body;
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { ...rest, companyId, passwordHash },
    });
    res.status(201).json(publicUser(user));
  }),
);

// GET /users/:id
router.get(
  "/users/:id",
  ...adminOnly,
  validate({ params: idParam }),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.valid.params.id },
      include: { company: { select: { id: true, name: true } } },
    });
    res.json(publicUser(user));
  }),
);

// PUT /users/:id — editar datos (no la contraseña).
router.put(
  "/users/:id",
  ...adminOnly,
  validate({ params: idParam, body: userUpdateSchema }),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.valid.params.id },
      data: req.valid.body,
    });
    res.json(publicUser(user));
  }),
);

// PATCH /users/:id/status — activar / desactivar.
router.patch(
  "/users/:id/status",
  ...adminOnly,
  validate({ params: idParam, body: statusSchema }),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.valid.params.id },
      data: { status: req.valid.body.status },
    });
    res.json(publicUser(user));
  }),
);

// POST /users/:id/reset-password — restablecer contraseña.
router.post(
  "/users/:id/reset-password",
  ...adminOnly,
  validate({ params: idParam, body: resetPasswordSchema }),
  asyncHandler(async (req, res) => {
    const passwordHash = await hashPassword(req.valid.body.password);
    await prisma.user.update({
      where: { id: req.valid.params.id },
      data: { passwordHash },
    });
    res.json({ ok: true });
  }),
);

module.exports = router;
