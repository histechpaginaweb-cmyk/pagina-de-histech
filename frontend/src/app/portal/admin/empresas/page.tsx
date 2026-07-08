"use client";

// Gestión de Empresas — listado, creación, edición y activación/desactivación.
import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Power, Search, Eye } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, StatusPill, Spinner, Alert } from "@/components/portal/ui";
import { Modal } from "@/components/portal/modal";
import { CompanyForm } from "@/components/portal/forms/company-form";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import type { Company } from "@/lib/portal/types";

export default function EmpresasPage() {
  const [companies, setCompanies] = React.useState<Company[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [modal, setModal] = React.useState<{ open: boolean; company?: Company }>({
    open: false,
  });

  const load = React.useCallback(() => {
    portalApi
      .get<Company[]>("/companies")
      .then(setCompanies)
      .catch((e) => setError(e.message));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  function onSaved(saved: Company) {
    setCompanies((prev) => {
      if (!prev) return [saved];
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx === -1) return [saved, ...prev];
      const next = [...prev];
      next[idx] = { ...prev[idx], ...saved };
      return next;
    });
    setModal({ open: false });
  }

  async function toggleStatus(c: Company) {
    const status = c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const updated = await portalApi.patch<Company>(`/companies/${c.id}/status`, { status });
      setCompanies((prev) => prev?.map((x) => (x.id === c.id ? { ...x, ...updated } : x)) ?? null);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo cambiar el estado.");
    }
  }

  const filtered = companies?.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Empresas"
      description="Administra las empresas clientes del Portal de Soporte."
      actions={
        <button
          onClick={() => setModal({ open: true })}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" /> Nueva empresa
        </button>
      }
    >
      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empresa…"
          className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-4 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
        />
      </div>

      {!companies && !error ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <PortalCard className="py-12 text-center text-muted-foreground">
          {query ? "No hay empresas que coincidan con la búsqueda." : "Aún no hay empresas. Crea la primera."}
        </PortalCard>
      ) : (
        <PortalCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Usuarios</th>
                  <th className="px-5 py-3 font-medium">Creada</th>
                  <th className="px-5 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((c) => (
                  <tr key={c.id} className="border-b border-[#F1F1F4] last:border-0 hover:bg-brand-purple/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/portal/admin/empresas/${c.id}`} className="font-medium hover:text-brand-purple">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{c._count?.users ?? 0}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="Ver" href={`/portal/admin/empresas/${c.id}`}>
                          <Eye className="size-4" />
                        </IconBtn>
                        <IconBtn title="Editar" onClick={() => setModal({ open: true, company: c })}>
                          <Pencil className="size-4" />
                        </IconBtn>
                        <IconBtn
                          title={c.status === "ACTIVE" ? "Desactivar" : "Activar"}
                          onClick={() => toggleStatus(c)}
                        >
                          <Power className="size-4" />
                        </IconBtn>
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
        title={modal.company ? "Editar empresa" : "Nueva empresa"}
      >
        <CompanyForm
          company={modal.company}
          onSaved={onSaved}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </PortalShell>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  href,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-brand-purple/[0.08] hover:text-brand-purple";
  if (href) {
    return (
      <Link href={href} title={title} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" title={title} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
