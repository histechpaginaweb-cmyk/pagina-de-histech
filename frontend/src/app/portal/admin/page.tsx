"use client";

// Dashboard ejecutivo del Administrador HISTECH: métricas globales, tiempos
// promedio, distribuciones (estado/prioridad/categoría/empresa) y últimos tickets.
import * as React from "react";
import Link from "next/link";
import { FileSpreadsheet, ArrowRight } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Spinner, Alert } from "@/components/portal/ui";
import { BarList, type BarItem } from "@/components/portal/bar-list";
import { TicketsTable } from "@/components/portal/tickets-table";
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS,
  CATEGORY_LABEL,
  minutesToHuman,
} from "@/lib/portal/constants";
import { portalApi } from "@/lib/portal/api";
import type { AdminDashboard, TicketStatus, TicketPriority } from "@/lib/portal/types";

// Tintas sólidas para las barras de estado/prioridad (paleta reservada de estado,
// siempre acompañada de etiqueta y valor — nunca color solo).
const STATUS_BAR: Record<TicketStatus, string> = {
  NUEVO: "bg-brand-purple",
  ASIGNADO: "bg-indigo-500",
  EN_PROCESO: "bg-sky-500",
  PENDIENTE_CLIENTE: "bg-amber-500",
  RESUELTO: "bg-emerald-500",
  CERRADO: "bg-slate-400",
};
const PRIORITY_BAR: Record<TicketPriority, string> = {
  BAJA: "bg-slate-400",
  MEDIA: "bg-sky-500",
  ALTA: "bg-amber-500",
  CRITICA: "bg-red-500",
};

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<AdminDashboard | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    portalApi.get<AdminDashboard>("/dashboard/admin").then(setData).catch((e) => setError(e.message));
  }, []);

  const statusBars: BarItem[] = data
    ? STATUS_OPTIONS.map((s) => ({ label: s.label, value: data.counts[s.value] ?? 0, barClass: STATUS_BAR[s.value] }))
    : [];
  const priorityBars: BarItem[] = data
    ? PRIORITY_OPTIONS.map((p) => ({ label: p.label, value: data.priority[p.value] ?? 0, barClass: PRIORITY_BAR[p.value] }))
    : [];
  const categoryBars: BarItem[] = data
    ? CATEGORY_OPTIONS.map((c) => ({ label: c.label, value: data.category[c.value] ?? 0 }))
    : [];
  const companyBars: BarItem[] = data
    ? data.byCompany.map((c) => ({ label: c.name, value: c.count }))
    : [];

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Panel de administración"
      description="Visión ejecutiva del soporte: volumen, tiempos y distribución."
      actions={
        <Link
          href="/portal/admin/reportes"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#374151] transition hover:border-brand-purple/50 hover:text-brand-purple"
        >
          <FileSpreadsheet className="size-4" /> Reportes
        </Link>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}

      {!data && !error ? (
        <div className="flex justify-center py-20"><Spinner className="size-8 text-brand-purple" /></div>
      ) : data ? (
        <div className="space-y-6">
          {/* Cifras clave */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Stat label="Tickets totales" value={data.total} />
            <Stat label="Abiertos" value={data.abiertos} accent="text-brand-purple" />
            <Stat label="Cerrados" value={data.cerrados} accent="text-slate-500" />
            <Stat label="T. prom. atención" value={minutesToHuman(data.avgAttentionMin)} small />
            <Stat label="T. prom. resolución" value={minutesToHuman(data.avgResolutionMin)} small />
          </div>

          {/* Distribuciones */}
          <div className="grid gap-4 lg:grid-cols-2">
            <PortalCard>
              <h2 className="mb-4 text-sm font-semibold">Tickets por estado</h2>
              <BarList items={statusBars} />
            </PortalCard>
            <PortalCard>
              <h2 className="mb-4 text-sm font-semibold">Tickets por prioridad</h2>
              <BarList items={priorityBars} />
            </PortalCard>
            <PortalCard>
              <h2 className="mb-4 text-sm font-semibold">Tickets por categoría</h2>
              <BarList items={categoryBars} />
            </PortalCard>
            <PortalCard>
              <h2 className="mb-4 text-sm font-semibold">Tickets por empresa</h2>
              <BarList items={companyBars} emptyLabel="Aún no hay tickets por empresa." />
            </PortalCard>
          </div>

          {/* Últimos tickets */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Últimos tickets creados</h2>
              <Link href="/portal/admin/tickets" className="inline-flex items-center gap-1 text-sm text-brand-purple hover:underline">
                Ver todos <ArrowRight className="size-4" />
              </Link>
            </div>
            {data.latest.length === 0 ? (
              <PortalCard className="py-10 text-center text-muted-foreground">
                Aún no hay tickets registrados.
              </PortalCard>
            ) : (
              <PortalCard className="overflow-hidden p-0">
                <TicketsTable tickets={data.latest} basePath="/portal/admin/tickets" showCompany />
              </PortalCard>
            )}
          </div>
        </div>
      ) : null}
    </PortalShell>
  );
}

function Stat({
  label,
  value,
  accent = "text-foreground",
  small,
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
  small?: boolean;
}) {
  return (
    <PortalCard className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 font-bold ${accent} ${small ? "text-xl" : "text-3xl"}`}>{value}</p>
    </PortalCard>
  );
}
