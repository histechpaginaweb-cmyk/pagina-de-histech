"use client";

// Primitivas de UI del Portal — reutilizan los tokens del sistema de diseño
// (colores de marca, radios, sombras, tipografías). Mantienen coherencia visual
// con el resto del sitio sin duplicar estilos globales.
import * as React from "react";
import { cn } from "@/lib/utils";
import type { EntityStatus, TicketStatus, TicketPriority } from "@/lib/portal/types";

export const inputBase =
  "h-11 w-full rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/30 disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputBase, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(inputBase, "h-auto resize-y py-3", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(inputBase, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
});

export function PortalCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("card-surface p-6", className)}>{children}</div>
  );
}

export function Alert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    error: "border-red-300 bg-red-50 text-red-700",
    success: "border-green-300 bg-green-50 text-green-700",
    info: "border-brand-purple/30 bg-brand-purple/[0.05] text-brand-purple",
  }[variant];
  return (
    <div
      role="alert"
      className={cn("rounded-xl border px-4 py-3 text-sm", styles)}
    >
      {children}
    </div>
  );
}

// ── Badges de estado ──
const ENTITY_STATUS_STYLES: Record<EntityStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-200 text-gray-600",
};
const ENTITY_STATUS_LABEL: Record<EntityStatus, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
};

export function StatusPill({ status }: { status: EntityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        ENTITY_STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {ENTITY_STATUS_LABEL[status]}
    </span>
  );
}

// Etiquetas y colores de tickets (se usan desde la Fase 2 en adelante).
export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  NUEVO: "Nuevo",
  ASIGNADO: "Asignado",
  EN_PROCESO: "En proceso",
  PENDIENTE_CLIENTE: "Pendiente del cliente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

export const TICKET_PRIORITY_LABEL: Record<TicketPriority, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
