"use client";

// Listado de tickets del Cliente, con filtro por estado.
import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Spinner, Alert } from "@/components/portal/ui";
import { TicketsTable } from "@/components/portal/tickets-table";
import { STATUS_OPTIONS } from "@/lib/portal/constants";
import { portalApi } from "@/lib/portal/api";
import type { TicketSummary } from "@/lib/portal/types";

export default function ClientTicketsPage() {
  const [tickets, setTickets] = React.useState<TicketSummary[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    const qs = status ? `?status=${status}` : "";
    setTickets(null);
    portalApi
      .get<TicketSummary[]>(`/tickets${qs}`)
      .then(setTickets)
      .catch((e) => setError(e.message));
  }, [status]);

  return (
    <PortalShell
      requiredRole="CLIENT"
      title="Mis tickets"
      description="Todas tus solicitudes de soporte."
      actions={
        <Link
          href="/portal/tickets/nuevo"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" /> Crear ticket
        </Link>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}

      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {!tickets && !error ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : tickets && tickets.length === 0 ? (
        <PortalCard className="py-12 text-center text-muted-foreground">
          No hay tickets con este filtro.
        </PortalCard>
      ) : (
        <PortalCard className="overflow-hidden p-0">
          <TicketsTable tickets={tickets ?? []} basePath="/portal/tickets" />
        </PortalCard>
      )}
    </PortalShell>
  );
}
