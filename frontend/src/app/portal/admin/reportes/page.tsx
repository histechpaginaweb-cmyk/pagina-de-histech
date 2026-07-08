"use client";

// Reportes: filtra tickets y exporta a Excel (.xlsx). La descarga usa un enlace
// mismo-origen (la cookie de sesión viaja automáticamente por el rewrite).
import * as React from "react";
import { FileSpreadsheet } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Field, Select, Input, Alert } from "@/components/portal/ui";
import { PORTAL_BASE, portalApi } from "@/lib/portal/api";
import { STATUS_OPTIONS, CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/lib/portal/constants";
import type { Company, PortalUser, Asset } from "@/lib/portal/types";

export default function ReportesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [techs, setTechs] = React.useState<PortalUser[]>([]);
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [f, setF] = React.useState({
    companyId: "", status: "", category: "", priority: "", assignedToId: "", assetId: "", from: "", to: "",
  });

  React.useEffect(() => {
    portalApi.get<Company[]>("/companies").then(setCompanies).catch((e) => setError(e.message));
    portalApi.get<PortalUser[]>("/users?role=ADMIN_HISTECH").then(setTechs).catch(() => {});
  }, []);

  // Los equipos dependen de la empresa seleccionada.
  React.useEffect(() => {
    if (!f.companyId) { setAssets([]); return; }
    portalApi.get<Asset[]>(`/companies/${f.companyId}/assets`).then(setAssets).catch(() => setAssets([]));
    setF((s) => ({ ...s, assetId: "" }));
  }, [f.companyId]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const downloadUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && params.set(k, v));
    const qs = params.toString();
    return `${PORTAL_BASE}/reports/tickets.xlsx${qs ? `?${qs}` : ""}`;
  }, [f]);

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Reportes"
      description="Filtra y exporta los tickets a Excel."
    >
      {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}

      <PortalCard className="max-w-3xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Empresa" htmlFor="r-company">
            <Select id="r-company" value={f.companyId} onChange={set("companyId")}>
              <option value="">Todas</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Estado" htmlFor="r-status">
            <Select id="r-status" value={f.status} onChange={set("status")}>
              <option value="">Todos</option>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Categoría" htmlFor="r-cat">
            <Select id="r-cat" value={f.category} onChange={set("category")}>
              <option value="">Todas</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="Prioridad" htmlFor="r-prio">
            <Select id="r-prio" value={f.priority} onChange={set("priority")}>
              <option value="">Todas</option>
              {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </Field>
          <Field label="Técnico" htmlFor="r-tech">
            <Select id="r-tech" value={f.assignedToId} onChange={set("assignedToId")}>
              <option value="">Todos</option>
              {techs.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </Select>
          </Field>
          <Field label="Equipo" htmlFor="r-asset">
            <Select id="r-asset" value={f.assetId} onChange={set("assetId")} disabled={!f.companyId}>
              <option value="">{f.companyId ? "Todos" : "Elige una empresa"}</option>
              {assets.map((a) => <option key={a.id} value={a.id}>{a.internalCode} — {a.name}</option>)}
            </Select>
          </Field>
          <Field label="Desde" htmlFor="r-from">
            <Input id="r-from" type="date" value={f.from} onChange={set("from")} />
          </Field>
          <Field label="Hasta" htmlFor="r-to">
            <Input id="r-to" type="date" value={f.to} onChange={set("to")} />
          </Field>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-5">
          <p className="text-sm text-muted-foreground">
            Se exportan los tickets que cumplan los filtros seleccionados.
          </p>
          <a
            href={downloadUrl}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <FileSpreadsheet className="size-4" /> Descargar Excel
          </a>
        </div>
      </PortalCard>
    </PortalShell>
  );
}
