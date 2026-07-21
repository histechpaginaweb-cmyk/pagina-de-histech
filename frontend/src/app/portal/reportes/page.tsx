"use client";

// Reportes del Líder de Empresa: filtra y exporta a Excel los tickets de SU
// empresa (el backend fuerza el alcance del lado servidor; aquí no se pide ni
// se envía companyId). La descarga usa un enlace mismo-origen (la cookie de
// sesión viaja automáticamente por el rewrite).
import * as React from "react";
import { FileSpreadsheet } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Field, Select, Input } from "@/components/portal/ui";
import { PORTAL_BASE } from "@/lib/portal/api";
import { STATUS_OPTIONS, CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/lib/portal/constants";

export default function LiderReportesPage() {
  const [f, setF] = React.useState({ status: "", category: "", priority: "", from: "", to: "" });

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
      requiredRole="LIDER"
      title="Reportes"
      description="Exporta a Excel los tickets de tu empresa."
    >
      <PortalCard className="max-w-3xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <Field label="Desde" htmlFor="r-from">
            <Input id="r-from" type="date" value={f.from} onChange={set("from")} />
          </Field>
          <Field label="Hasta" htmlFor="r-to">
            <Input id="r-to" type="date" value={f.to} onChange={set("to")} />
          </Field>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-5">
          <p className="text-sm text-muted-foreground">
            Se exportan los tickets de tu empresa que cumplan los filtros seleccionados.
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
