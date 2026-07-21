"use client";

// Detalle de ticket (Cliente).
import * as React from "react";
import { useParams } from "next/navigation";
import { PortalShell } from "@/components/portal/shell";
import { Spinner, Alert } from "@/components/portal/ui";
import { TicketDetail } from "@/components/portal/ticket-detail";
import { portalApi } from "@/lib/portal/api";
import type { Ticket } from "@/lib/portal/types";

export default function ClientTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    portalApi.get<Ticket>(`/tickets/${id}`).then(setTicket).catch((e) => setError(e.message));
  }, [id]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <PortalShell requiredRole={["CLIENT", "LIDER"]}>
      {error && <Alert variant="error">{error}</Alert>}
      {!ticket && !error ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : ticket ? (
        <TicketDetail ticket={ticket} isAdmin={false} backHref="/portal/tickets" onRefresh={load} />
      ) : null}
    </PortalShell>
  );
}
