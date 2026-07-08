"use client";

// Detalle de ticket reutilizable (cliente y admin). El cliente ve la información,
// la línea de tiempo y puede adjuntar imágenes si el ticket no está cerrado. El
// admin dispone además del panel de gestión: asignar, atender y cerrar.
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import { PORTAL_BASE } from "@/lib/portal/api";
import { PortalCard, Field, Input, Textarea, Select, Alert, Spinner } from "@/components/portal/ui";
import { StatusBadge, PriorityBadge } from "@/components/portal/ticket-badges";
import { Timeline } from "@/components/portal/timeline";
import { AttachmentGallery, AttachmentUploader } from "@/components/portal/attachments";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import {
  CATEGORY_LABEL,
  STATUS_OPTIONS,
  formatDateTime,
  minutesToHuman,
} from "@/lib/portal/constants";
import type { Ticket, PortalUser } from "@/lib/portal/types";

export function TicketDetail({
  ticket,
  isAdmin,
  backHref,
  onRefresh,
}: {
  ticket: Ticket;
  isAdmin: boolean;
  backHref: string;
  onRefresh: () => void;
}) {
  const clientImages = ticket.attachments.filter((a) => a.kind === "CLIENT");
  const techImages = ticket.attachments.filter((a) => a.kind === "TECH_EVIDENCE");
  const closed = ticket.status === "CERRADO";

  return (
    <>
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand-purple"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-brand-purple">{ticket.number}</p>
          <h1 className="mt-1 text-display-lg">{ticket.subject}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <a
          href={`${PORTAL_BASE}/tickets/${ticket.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#374151] transition hover:border-brand-purple/50 hover:text-brand-purple"
        >
          <FileDown className="size-4" /> Descargar PDF
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Columna principal */}
        <div className="space-y-6">
          <PortalCard>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Info label="Empresa" value={ticket.company?.name} />
              <Info label="Solicitante" value={ticket.createdBy?.fullName} />
              <Info label="Equipo" value={ticket.asset ? `${ticket.asset.internalCode} — ${ticket.asset.name}` : "—"} />
              <Info label="Área" value={ticket.area || "—"} />
              <Info label="Categoría" value={ticket.category ? CATEGORY_LABEL[ticket.category] : "—"} />
              <Info label="Técnico asignado" value={ticket.assignedTo?.fullName || "Sin asignar"} />
              <Info label="Creado" value={formatDateTime(ticket.createdAt)} />
              <Info label="Cerrado" value={ticket.closedAt ? formatDateTime(ticket.closedAt) : "—"} />
            </dl>
            <div className="mt-5 border-t border-[#E5E7EB] pt-4">
              <p className="mb-1 text-sm font-medium">Descripción</p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{ticket.description}</p>
            </div>
          </PortalCard>

          {(clientImages.length > 0 || !closed) && (
            <PortalCard className="space-y-4">
              <AttachmentGallery title="Imágenes del cliente" attachments={clientImages} />
              {!closed && (
                <AttachmentUploader
                  ticketId={ticket.id}
                  kind="CLIENT"
                  existingCount={clientImages.length}
                  onUploaded={onRefresh}
                />
              )}
            </PortalCard>
          )}

          {(ticket.diagnosis || ticket.solution || ticket.finalSolution || techImages.length > 0) && (
            <PortalCard className="space-y-4">
              <p className="text-sm font-semibold">Atención técnica</p>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Info label="Diagnóstico" value={ticket.diagnosis || "—"} block />
                <Info label="Acciones realizadas" value={ticket.actions || "—"} block />
                <Info label="Solución" value={ticket.solution || "—"} block />
                <Info label="Recomendaciones" value={ticket.recommendations || "—"} block />
                <Info label="Tiempo invertido" value={minutesToHuman(ticket.timeSpentMin)} />
                {ticket.finalSolution && <Info label="Solución final" value={ticket.finalSolution} block />}
              </div>
              <AttachmentGallery title="Evidencia técnica" attachments={techImages} />
            </PortalCard>
          )}

          <PortalCard>
            <p className="mb-4 text-sm font-semibold">Línea de tiempo</p>
            <Timeline events={ticket.events} />
          </PortalCard>
        </div>

        {/* Panel de gestión (solo admin) */}
        {isAdmin && (
          <div className="space-y-6">
            <AdminPanel ticket={ticket} onRefresh={onRefresh} techImages={techImages.length} />
          </div>
        )}
      </div>
    </>
  );
}

function Info({ label, value, block }: { label: string; value?: React.ReactNode; block?: boolean }) {
  return (
    <div className={block ? "sm:col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{value}</dd>
    </div>
  );
}

function AdminPanel({
  ticket,
  onRefresh,
  techImages,
}: {
  ticket: Ticket;
  onRefresh: () => void;
  techImages: number;
}) {
  const [techs, setTechs] = React.useState<PortalUser[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const closed = ticket.status === "CERRADO";

  React.useEffect(() => {
    portalApi.get<PortalUser[]>("/users?role=ADMIN_HISTECH").then(setTechs).catch(() => {});
  }, []);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
      onRefresh();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "Ocurrió un error.");
    }
  }

  return (
    <>
      {error && <Alert variant="error">{error}</Alert>}

      {/* Asignar */}
      <PortalCard className="space-y-3">
        <p className="text-sm font-semibold">Asignación</p>
        <AssignForm ticket={ticket} techs={techs} onSubmit={(assignedToId) => run(() => portalApi.patch(`/tickets/${ticket.id}/assign`, { assignedToId }))} disabled={closed} />
      </PortalCard>

      {/* Cambiar estado */}
      {!closed && (
        <PortalCard className="space-y-3">
          <p className="text-sm font-semibold">Estado</p>
          <StatusForm current={ticket.status} onSubmit={(status, note) => run(() => portalApi.patch(`/tickets/${ticket.id}/status`, { status, note }))} />
        </PortalCard>
      )}

      {/* Atender */}
      {!closed && (
        <PortalCard className="space-y-3">
          <p className="text-sm font-semibold">Registrar atención</p>
          <AttendForm ticket={ticket} onSubmit={(data) => run(() => portalApi.post(`/tickets/${ticket.id}/attend`, data))} />
          <AttachmentUploader ticketId={ticket.id} kind="TECH_EVIDENCE" existingCount={techImages} onUploaded={onRefresh} />
        </PortalCard>
      )}

      {/* Cerrar */}
      {!closed && (
        <PortalCard className="space-y-3">
          <p className="text-sm font-semibold text-red-600">Cerrar ticket</p>
          <CloseForm onSubmit={(data) => run(() => portalApi.post(`/tickets/${ticket.id}/close`, data))} />
        </PortalCard>
      )}
    </>
  );
}

function AssignForm({
  ticket,
  techs,
  onSubmit,
  disabled,
}: {
  ticket: Ticket;
  techs: PortalUser[];
  onSubmit: (id: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState(ticket.assignedTo?.id ?? "");
  return (
    <div className="space-y-2">
      <Select value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled}>
        <option value="">Selecciona un técnico</option>
        {techs.map((t) => (
          <option key={t.id} value={t.id}>{t.fullName}</option>
        ))}
      </Select>
      <button
        type="button"
        onClick={() => value && onSubmit(value)}
        disabled={disabled || !value}
        className="h-10 w-full rounded-full bg-brand-purple text-sm font-semibold text-white transition hover:bg-brand-deep disabled:opacity-50"
      >
        Asignar
      </button>
    </div>
  );
}

function StatusForm({
  current,
  onSubmit,
}: {
  current: string;
  onSubmit: (status: string, note?: string) => void;
}) {
  const [status, setStatus] = React.useState(current);
  const [note, setNote] = React.useState("");
  return (
    <div className="space-y-2">
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUS_OPTIONS.filter((s) => s.value !== "CERRADO").map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </Select>
      <Input placeholder="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        type="button"
        onClick={() => onSubmit(status, note || undefined)}
        className="h-10 w-full rounded-full bg-brand-purple text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        Actualizar estado
      </button>
    </div>
  );
}

function AttendForm({
  ticket,
  onSubmit,
}: {
  ticket: Ticket;
  onSubmit: (data: Record<string, unknown>) => void;
}) {
  const [f, setF] = React.useState({
    diagnosis: ticket.diagnosis ?? "",
    actions: ticket.actions ?? "",
    solution: ticket.solution ?? "",
    recommendations: ticket.recommendations ?? "",
    technicalObservations: ticket.technicalObservations ?? "",
    timeSpentMin: ticket.timeSpentMin?.toString() ?? "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));
  return (
    <div className="space-y-2">
      <Textarea rows={2} placeholder="Diagnóstico" value={f.diagnosis} onChange={set("diagnosis")} />
      <Textarea rows={2} placeholder="Acciones realizadas" value={f.actions} onChange={set("actions")} />
      <Textarea rows={2} placeholder="Solución" value={f.solution} onChange={set("solution")} />
      <Textarea rows={2} placeholder="Recomendaciones" value={f.recommendations} onChange={set("recommendations")} />
      <Input type="number" min={0} placeholder="Tiempo invertido (min)" value={f.timeSpentMin} onChange={set("timeSpentMin")} />
      <button
        type="button"
        onClick={() =>
          onSubmit({
            diagnosis: f.diagnosis || undefined,
            actions: f.actions || undefined,
            solution: f.solution || undefined,
            recommendations: f.recommendations || undefined,
            technicalObservations: f.technicalObservations || undefined,
            timeSpentMin: f.timeSpentMin ? Number(f.timeSpentMin) : undefined,
          })
        }
        className="h-10 w-full rounded-full bg-brand-purple text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        Guardar atención
      </button>
    </div>
  );
}

function CloseForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [finalSolution, setFinalSolution] = React.useState("");
  const [finalObservations, setFinalObservations] = React.useState("");
  const [timeSpentMin, setTimeSpentMin] = React.useState("");
  return (
    <div className="space-y-2">
      <Field label="Solución final" htmlFor="close-sol" required>
        <Textarea id="close-sol" rows={3} value={finalSolution} onChange={(e) => setFinalSolution(e.target.value)} placeholder="Describe la solución aplicada…" />
      </Field>
      <Input placeholder="Observaciones finales (opcional)" value={finalObservations} onChange={(e) => setFinalObservations(e.target.value)} />
      <Input type="number" min={0} placeholder="Tiempo total (min)" value={timeSpentMin} onChange={(e) => setTimeSpentMin(e.target.value)} />
      <button
        type="button"
        disabled={finalSolution.trim().length < 3}
        onClick={() =>
          onSubmit({
            finalSolution: finalSolution.trim(),
            finalObservations: finalObservations || undefined,
            timeSpentMin: timeSpentMin ? Number(timeSpentMin) : undefined,
          })
        }
        className="h-10 w-full rounded-full bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        Cerrar ticket
      </button>
    </div>
  );
}
