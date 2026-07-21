// Esquemas de validación (Zod) del Portal — Fase 1: Auth, Empresas, Usuarios.
const { z } = require("zod");

const trimmed = (min, max, label) =>
  z
    .string({ required_error: `${label} es obligatorio` })
    .trim()
    .min(min, `${label} es obligatorio`)
    .max(max, `${label} es demasiado largo`);

const optionalString = (max = 200) =>
  z.string().trim().max(max).optional().or(z.literal("")).transform((v) => v || null);

const entityStatus = z.enum(["ACTIVE", "INACTIVE"]);

// ── Auth ──
const loginSchema = z.object({
  identifier: trimmed(2, 120, "Usuario o correo"), // acepta username o email
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// ── Empresas ──
const companyCreateSchema = z.object({
  name: trimmed(2, 160, "El nombre"),
  status: entityStatus.optional().default("ACTIVE"),
  internalNotes: optionalString(2000),
});

const companyUpdateSchema = companyCreateSchema.partial();

const statusSchema = z.object({ status: entityStatus });

// ── Usuarios ──
// No se pide la empresa: se toma del parámetro de ruta (creado desde la empresa).
const userCreateSchema = z.object({
  fullName: trimmed(2, 160, "El nombre completo"),
  username: trimmed(3, 60, "El usuario")
    .regex(/^[a-zA-Z0-9._-]+$/, "El usuario solo admite letras, números, . _ -"),
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["ADMIN_HISTECH", "CLIENT", "LIDER"]).optional().default("CLIENT"),
  area: optionalString(120),
  position: optionalString(120),
  phone: optionalString(40),
  whatsapp: optionalString(40),
  status: entityStatus.optional().default("ACTIVE"),
});

const userUpdateSchema = userCreateSchema
  .partial()
  .omit({ password: true }); // la contraseña se cambia por el endpoint dedicado

const resetPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

// ── Equipos (Activos) ──
const assetCreateSchema = z.object({
  internalCode: trimmed(1, 60, "El código interno"),
  name: trimmed(2, 160, "El nombre del equipo"),
  assignedUserId: z.string().min(1).optional().nullable(),
  location: optionalString(160),
  brand: optionalString(120),
  model: optionalString(120),
  serialNumber: optionalString(120),
  observations: optionalString(2000),
  status: entityStatus.optional().default("ACTIVE"),
});

const assetUpdateSchema = assetCreateSchema.partial();

// ── Tickets ──
const TICKET_CATEGORIES = [
  "HARDWARE", "SOFTWARE", "RED", "INTERNET", "IMPRESORAS",
  "OFFICE", "CORREO", "ACCESOS", "OTRO",
];
const TICKET_PRIORITIES = ["BAJA", "MEDIA", "ALTA", "CRITICA"];
const TICKET_STATUSES = [
  "NUEVO", "ASIGNADO", "EN_PROCESO", "PENDIENTE_CLIENTE", "RESUELTO", "CERRADO",
];

const ticketCreateSchema = z.object({
  // El cliente NO envía empresa: se toma de su sesión. El admin puede indicarla.
  companyId: z.string().min(1).optional(),
  assetId: z.string().min(1).optional().nullable(),
  area: optionalString(120),
  category: z.enum(TICKET_CATEGORIES),
  priority: z.enum(TICKET_PRIORITIES).optional().default("MEDIA"),
  subject: trimmed(3, 180, "El asunto"),
  description: trimmed(5, 5000, "La descripción"),
});

const ticketAssignSchema = z.object({
  assignedToId: z.string().min(1, "Selecciona un técnico"),
});

const ticketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
  note: optionalString(2000),
});

const ticketAttendSchema = z.object({
  diagnosis: optionalString(5000),
  actions: optionalString(5000),
  solution: optionalString(5000),
  recommendations: optionalString(5000),
  technicalObservations: optionalString(5000),
  startedAt: z.string().datetime().optional().nullable(),
  finishedAt: z.string().datetime().optional().nullable(),
  timeSpentMin: z.coerce.number().int().min(0).optional().nullable(),
  status: z.enum(TICKET_STATUSES).optional(),
});

const ticketCloseSchema = z.object({
  finalSolution: trimmed(3, 5000, "La solución final"),
  finalObservations: optionalString(5000),
  timeSpentMin: z.coerce.number().int().min(0).optional().nullable(),
});

const idParam = z.object({ id: z.string().min(1) });
const companyIdParam = z.object({ companyId: z.string().min(1) });

module.exports = {
  loginSchema,
  companyCreateSchema,
  companyUpdateSchema,
  statusSchema,
  userCreateSchema,
  userUpdateSchema,
  resetPasswordSchema,
  assetCreateSchema,
  assetUpdateSchema,
  ticketCreateSchema,
  ticketAssignSchema,
  ticketStatusSchema,
  ticketAttendSchema,
  ticketCloseSchema,
  idParam,
  companyIdParam,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
};
