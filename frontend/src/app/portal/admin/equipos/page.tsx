"use client";

// Administración de Equipos (Activos) por empresa. Selecciona una empresa para
// ver y gestionar su inventario.
import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, StatusPill, Spinner, Alert, Field, Select } from "@/components/portal/ui";
import { Modal } from "@/components/portal/modal";
import { AssetForm } from "@/components/portal/forms/asset-form";
import { portalApi } from "@/lib/portal/api";
import type { Asset, Company, PortalUser } from "@/lib/portal/types";

export default function AdminEquiposPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [companyId, setCompanyId] = React.useState("");
  const [assets, setAssets] = React.useState<Asset[] | null>(null);
  const [users, setUsers] = React.useState<PortalUser[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [modal, setModal] = React.useState<{ open: boolean; asset?: Asset }>({ open: false });

  React.useEffect(() => {
    portalApi.get<Company[]>("/companies").then((cs) => {
      setCompanies(cs);
      if (cs[0]) setCompanyId(cs[0].id);
    }).catch((e) => setError(e.message));
  }, []);

  const loadAssets = React.useCallback(() => {
    if (!companyId) return;
    setAssets(null);
    portalApi.get<Asset[]>(`/companies/${companyId}/assets`).then(setAssets).catch((e) => setError(e.message));
    portalApi.get<PortalUser[]>(`/companies/${companyId}/users`).then(setUsers).catch(() => setUsers([]));
  }, [companyId]);

  React.useEffect(() => { loadAssets(); }, [loadAssets]);

  function onSaved() {
    setModal({ open: false });
    loadAssets();
  }

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Equipos"
      description="Inventario de activos por empresa."
      actions={
        <button
          onClick={() => setModal({ open: true })}
          disabled={!companyId}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Plus className="size-4" /> Nuevo equipo
        </button>
      }
    >
      {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}

      <div className="mb-4 max-w-sm">
        <Field label="Empresa" htmlFor="eq-company">
          <Select id="eq-company" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
      </div>

      {!assets ? (
        <div className="flex justify-center py-16"><Spinner className="size-7 text-brand-purple" /></div>
      ) : assets.length === 0 ? (
        <PortalCard className="py-12 text-center text-muted-foreground">
          Esta empresa aún no tiene equipos. Crea el primero.
        </PortalCard>
      ) : (
        <PortalCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Código</th>
                  <th className="px-5 py-3 font-medium">Equipo</th>
                  <th className="px-5 py-3 font-medium">Asignado a</th>
                  <th className="px-5 py-3 font-medium">Tickets</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-[#F1F1F4] last:border-0 hover:bg-brand-purple/[0.02]">
                    <td className="px-5 py-3 font-mono text-xs">{a.internalCode}</td>
                    <td className="px-5 py-3">
                      <Link href={`/portal/admin/equipos/${a.id}`} className="font-medium hover:text-brand-purple">
                        {a.name}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        {[a.brand, a.model].filter(Boolean).join(" ") || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{a.assignedUser?.fullName ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a._count?.tickets ?? 0}</td>
                    <td className="px-5 py-3"><StatusPill status={a.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/portal/admin/equipos/${a.id}`} title="Ver historial" className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-brand-purple/[0.08] hover:text-brand-purple">
                          <Eye className="size-4" />
                        </Link>
                        <button title="Editar" onClick={() => setModal({ open: true, asset: a })} className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-brand-purple/[0.08] hover:text-brand-purple">
                          <Pencil className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalCard>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.asset ? "Editar equipo" : "Nuevo equipo"}
        size="lg"
      >
        {companyId && (
          <AssetForm
            companyId={companyId}
            asset={modal.asset}
            users={users}
            onSaved={onSaved}
            onCancel={() => setModal({ open: false })}
          />
        )}
      </Modal>
    </PortalShell>
  );
}
