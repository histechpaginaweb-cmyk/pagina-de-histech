"use client";

// Administración de Tickets — tabla con filtros por empresa, estado, categoría,
// prioridad y búsqueda (número/asunto).
import * as React from "react";
import { Search } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Spinner, Alert } from "@/components/portal/ui";
import { TicketsTable } from "@/components/portal/tickets-table";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/portal/constants";
import { portalApi } from "@/lib/portal/api";
import type { TicketSummary, Company } from "@/lib/portal/types";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = React.useState<TicketSummary[] | null>(null);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    companyId: "", status: "", category: "", priority: "", q: "",
  });

  React.useEffect(() => {
    portalApi.get<Company[]>("/companies").then(setCompanies).catch(() => {});
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    const qs = params.toString();
    setTickets(null);
    portalApi
      .get<TicketSummary[]>(`/tickets${qs ? `?${qs}` : ""}`)
      .then(setTickets)
      .catch((e) => setError(e.message));
  }, [filters]);

  const set = (k: keyof typeof filters) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  const selectCls =
    "h-11 rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30";

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Tickets"
      description="Todos los tickets de todas las empresas."
    >
      {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={set("q")}
            placeholder="Buscar por número o asunto…"
            className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-4 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
          />
        </div>
        <select value={filters.companyId} onChange={set("companyId")} className={selectCls}>
          <option value="">Todas las empresas</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filters.status} onChange={set("status")} className={selectCls}>
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filters.category} onChange={set("category")} className={selectCls}>
          <option value="">Toda categoría</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={filters.priority} onChange={set("priority")} className={selectCls}>
          <option value="">Toda prioridad</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {!tickets && !error ? (
        <div className="flex justify-center py-16"><Spinner className="size-7 text-brand-purple" /></div>
      ) : tickets && tickets.length === 0 ? (
        <PortalCard className="py-12 text-center text-muted-foreground">
          No hay tickets con los filtros seleccionados.
        </PortalCard>
      ) : (
        <PortalCard className="overflow-hidden p-0">
          <TicketsTable tickets={tickets ?? []} basePath="/portal/admin/tickets" showCompany />
        </PortalCard>
      )}
    </PortalShell>
  );
}
