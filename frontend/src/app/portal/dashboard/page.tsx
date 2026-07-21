"use client";

// Dashboard del Cliente: contadores + últimos tickets + botón "Crear ticket".
import * as React from "react";
import Link from "next/link";
import { Plus, Ticket as TicketIcon } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Spinner, Alert } from "@/components/portal/ui";
import { TicketsTable } from "@/components/portal/tickets-table";
import { usePortalAuth } from "@/components/portal/auth-context";
import { portalApi } from "@/lib/portal/api";
import type { ClientDashboard } from "@/lib/portal/types";

export default function ClientDashboardPage() {
  const { user } = usePortalAuth();
  const isLeader = user?.role === "LIDER";
  const [data, setData] = React.useState<ClientDashboard | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    portalApi
      .get<ClientDashboard>("/tickets/dashboard")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <PortalShell
      requiredRole={["CLIENT", "LIDER"]}
      title={isLeader ? "Tickets de la empresa" : "Mis tickets"}
      description={
        isLeader
          ? "Consulta y da seguimiento a todos los tickets de tu empresa."
          : "Consulta y da seguimiento a tus solicitudes de soporte."
      }
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

      {!data && !error ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Abiertos" value={data.abiertos} accent="text-brand-purple" />
            <Stat label="En proceso" value={data.enProceso} accent="text-sky-600" />
            <Stat label="Resueltos" value={data.resueltos} accent="text-emerald-600" />
            <Stat label="Cerrados" value={data.cerrados} accent="text-slate-500" />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Últimos tickets</h2>
              <Link href="/portal/tickets" className="text-sm text-brand-purple hover:underline">
                Ver todos
              </Link>
            </div>
            {data.latest.length === 0 ? (
              <PortalCard className="flex flex-col items-center gap-3 py-14 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-purple/[0.08] text-brand-purple">
                  <TicketIcon className="size-6" />
                </span>
                <p className="text-sm text-muted-foreground">
                  {isLeader
                    ? "Aún no hay tickets en tu empresa. Crea el primero cuando necesites soporte."
                    : "Aún no tienes tickets. Crea el primero cuando necesites soporte."}
                </p>
                <Link
                  href="/portal/tickets/nuevo"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-gradient px-4 text-sm font-semibold text-white"
                >
                  <Plus className="size-4" /> Crear ticket
                </Link>
              </PortalCard>
            ) : (
              <PortalCard className="overflow-hidden p-0">
                <TicketsTable tickets={data.latest} basePath="/portal/tickets" showCreatedBy={isLeader} />
              </PortalCard>
            )}
          </div>
        </div>
      ) : null}
    </PortalShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <PortalCard className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
    </PortalCard>
  );
}
