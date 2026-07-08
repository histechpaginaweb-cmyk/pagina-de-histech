// Constantes y helpers de presentación del Portal (categorías, prioridades,
// estados) y utilidades de formato. Fuente única para selects y etiquetas.
import type { TicketCategory, TicketPriority, TicketStatus } from "./types";

export const CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE", label: "Software" },
  { value: "RED", label: "Red" },
  { value: "INTERNET", label: "Internet" },
  { value: "IMPRESORAS", label: "Impresoras" },
  { value: "OFFICE", label: "Office" },
  { value: "CORREO", label: "Correo" },
  { value: "ACCESOS", label: "Accesos" },
  { value: "OTRO", label: "Otro" },
];

export const CATEGORY_LABEL: Record<TicketCategory, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<TicketCategory, string>;

export const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Crítica" },
];

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

// Colores de prioridad (coherentes con la paleta; sin salir del sistema).
export const PRIORITY_STYLE: Record<TicketPriority, string> = {
  BAJA: "bg-slate-100 text-slate-600",
  MEDIA: "bg-sky-100 text-sky-700",
  ALTA: "bg-amber-100 text-amber-700",
  CRITICA: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "ASIGNADO", label: "Asignado" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "PENDIENTE_CLIENTE", label: "Pendiente del cliente" },
  { value: "RESUELTO", label: "Resuelto" },
  { value: "CERRADO", label: "Cerrado" },
];

export const STATUS_LABEL: Record<TicketStatus, string> = {
  NUEVO: "Nuevo",
  ASIGNADO: "Asignado",
  EN_PROCESO: "En proceso",
  PENDIENTE_CLIENTE: "Pendiente del cliente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

// Color por estado (usa la marca púrpura para los activos).
export const STATUS_STYLE: Record<TicketStatus, string> = {
  NUEVO: "bg-brand-purple/[0.10] text-brand-purple",
  ASIGNADO: "bg-indigo-100 text-indigo-700",
  EN_PROCESO: "bg-sky-100 text-sky-700",
  PENDIENTE_CLIENTE: "bg-amber-100 text-amber-700",
  RESUELTO: "bg-emerald-100 text-emerald-700",
  CERRADO: "bg-slate-200 text-slate-600",
};

export function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function minutesToHuman(min?: number | null) {
  if (min == null) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
