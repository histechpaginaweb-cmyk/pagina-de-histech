// Tipos compartidos del Portal de Soporte (frontend). Reflejan el modelo del
// backend (Prisma) en su forma serializada por JSON.

export type EntityStatus = "ACTIVE" | "INACTIVE";
export type Role = "ADMIN_HISTECH" | "CLIENT" | "LIDER";

export type TicketStatus =
  | "NUEVO"
  | "ASIGNADO"
  | "EN_PROCESO"
  | "PENDIENTE_CLIENTE"
  | "RESUELTO"
  | "CERRADO";

export type TicketPriority = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export type TicketCategory =
  | "HARDWARE"
  | "SOFTWARE"
  | "RED"
  | "INTERNET"
  | "IMPRESORAS"
  | "OFFICE"
  | "CORREO"
  | "ACCESOS"
  | "OTRO";

export type Company = {
  id: string;
  name: string;
  status: EntityStatus;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { users: number; assets: number; tickets: number };
};

export type PortalUser = {
  id: string;
  companyId: string;
  fullName: string;
  username: string;
  email: string;
  area: string | null;
  position: string | null;
  phone: string | null;
  whatsapp: string | null;
  role: Role;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  company?: { id: string; name: string; status?: EntityStatus };
};

export type AttachmentKind = "CLIENT" | "TECH_EVIDENCE";

export type Asset = {
  id: string;
  companyId: string;
  internalCode: string;
  name: string;
  assignedUserId: string | null;
  assignedUser?: { id: string; fullName: string } | null;
  location: string | null;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  observations: string | null;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  company?: { id: string; name: string };
  _count?: { tickets: number };
  tickets?: TicketSummary[];
};

export type TicketSummary = {
  id: string;
  number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: TicketCategory;
  createdAt: string;
  closedAt: string | null;
  timeSpentMin?: number | null;
  company?: { id: string; name: string };
  createdBy?: { id: string; fullName: string };
  assignedTo?: { id: string; fullName: string } | null;
  asset?: { id: string; name: string; internalCode: string } | null;
};

export type TicketAttachment = {
  id: string;
  ticketId: string;
  url: string;
  kind: AttachmentKind;
  uploadedById: string;
  createdAt: string;
};

export type TicketEvent = {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  note: string | null;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;
  createdAt: string;
  user?: { id: string; fullName: string; role: Role };
};

export type Ticket = TicketSummary & {
  companyId: string;
  area: string | null;
  description: string;
  assetId: string | null;
  diagnosis: string | null;
  actions: string | null;
  solution: string | null;
  recommendations: string | null;
  technicalObservations: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  timeSpentMin: number | null;
  finalSolution: string | null;
  finalObservations: string | null;
  closedBy?: { id: string; fullName: string } | null;
  attachments: TicketAttachment[];
  events: TicketEvent[];
};

export type ClientDashboard = {
  counts: Record<TicketStatus, number>;
  total: number;
  abiertos: number;
  enProceso: number;
  resueltos: number;
  cerrados: number;
  latest: TicketSummary[];
};

export type AdminDashboard = {
  counts: Record<TicketStatus, number>;
  total: number;
  abiertos: number;
  cerrados: number;
  priority: Partial<Record<TicketPriority, number>>;
  category: Partial<Record<TicketCategory, number>>;
  byCompany: { companyId: string; name: string; count: number }[];
  avgAttentionMin: number | null;
  avgResolutionMin: number | null;
  latest: TicketSummary[];
};

export type ApiError = { error: string; details?: unknown };
