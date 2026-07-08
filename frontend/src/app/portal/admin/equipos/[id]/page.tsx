"use client";

// Ficha de un Equipo: datos + historial completo de tickets (mantenimiento).
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Monitor } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, StatusPill, Spinner, Alert } from "@/components/portal/ui";
import { TicketsTable } from "@/components/portal/tickets-table";
import { minutesToHuman } from "@/lib/portal/constants";
import { portalApi } from "@/lib/portal/api";
import type { Asset } from "@/lib/portal/types";

export default function EquipoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = React.useState<Asset | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    portalApi.get<Asset>(`/assets/${id}`).then(setAsset).catch((e) => setError(e.message));
  }, [id]);

  const tickets = asset?.tickets ?? [];
  const totalTime = tickets.reduce((sum, t) => sum + (t.timeSpentMin ?? 0), 0);

  return (
    <PortalShell requiredRole="ADMIN_HISTECH">
      <Link
        href="/portal/admin/equipos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand-purple"
      >
        <ArrowLeft className="size-4" /> Volver a Equipos
      </Link>

      {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}

      {!asset ? (
        <div className="flex justify-center py-16"><Spinner className="size-7 text-brand-purple" /></div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/[0.08] text-brand-purple">
                <Monitor className="size-6" />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-display-lg">{asset.name}</h1>
                  <StatusPill status={asset.status} />
                </div>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{asset.internalCode}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Historial de incidencias</h2>
                <span className="text-sm text-muted-foreground">
                  {tickets.length} ticket{tickets.length === 1 ? "" : "s"} · {minutesToHuman(totalTime)} invertidos
                </span>
              </div>
              {tickets.length === 0 ? (
                <PortalCard className="py-12 text-center text-muted-foreground">
                  Este equipo no tiene tickets asociados.
                </PortalCard>
              ) : (
                <PortalCard className="overflow-hidden p-0">
                  <TicketsTable tickets={tickets} basePath="/portal/admin/tickets" />
                </PortalCard>
              )}
            </div>

            <PortalCard>
              <p className="mb-4 text-sm font-semibold">Ficha técnica</p>
              <dl className="space-y-3 text-sm">
                <Row label="Empresa" value={asset.company?.name} />
                <Row label="Asignado a" value={asset.assignedUser?.fullName ?? "Sin asignar"} />
                <Row label="Ubicación" value={asset.location || "—"} />
                <Row label="Marca" value={asset.brand || "—"} />
                <Row label="Modelo" value={asset.model || "—"} />
                <Row label="N.º de serie" value={asset.serialNumber || "—"} />
                {asset.observations && <Row label="Observaciones" value={asset.observations} />}
              </dl>
            </PortalCard>
          </div>
        </>
      )}
    </PortalShell>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F1F1F4] pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
