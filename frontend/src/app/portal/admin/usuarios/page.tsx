"use client";

// Gestión global de Usuarios (todas las empresas). Crear, editar, restablecer
// contraseña y activar/desactivar. Al crear, se elige la empresa (los usuarios
// siempre pertenecen a una empresa).
import * as React from "react";
import { Plus, Search } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Spinner, Alert, Field, Select } from "@/components/portal/ui";
import { Modal } from "@/components/portal/modal";
import { UserForm } from "@/components/portal/forms/user-form";
import { ResetPasswordForm } from "@/components/portal/forms/reset-password-form";
import { UsersTable } from "@/components/portal/users-table";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import type { Company, PortalUser } from "@/lib/portal/types";

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; user: PortalUser }
  | { kind: "reset"; user: PortalUser };

export default function UsuariosPage() {
  const [users, setUsers] = React.useState<PortalUser[] | null>(null);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [companyFilter, setCompanyFilter] = React.useState("");
  const [createCompanyId, setCreateCompanyId] = React.useState("");
  const [modal, setModal] = React.useState<ModalState>({ kind: "none" });

  const loadUsers = React.useCallback(() => {
    portalApi
      .get<PortalUser[]>("/users")
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, []);

  React.useEffect(() => {
    loadUsers();
    portalApi
      .get<Company[]>("/companies")
      .then((cs) => {
        setCompanies(cs);
        if (cs[0]) setCreateCompanyId(cs[0].id);
      })
      .catch((e) => setError(e.message));
  }, [loadUsers]);

  function onUserSaved() {
    setModal({ kind: "none" });
    loadUsers();
  }

  async function toggleUser(u: PortalUser) {
    const status = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await portalApi.patch(`/users/${u.id}/status`, { status });
      loadUsers();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo cambiar el estado.");
    }
  }

  const filtered = users?.filter((u) => {
    if (companyFilter && u.companyId !== companyFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const canCreate = companies.length > 0;

  return (
    <PortalShell
      requiredRole="ADMIN_HISTECH"
      title="Usuarios"
      description="Todos los usuarios del portal, agrupados por empresa."
      actions={
        <button
          onClick={() => setModal({ kind: "create" })}
          disabled={!canCreate}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
          title={canCreate ? undefined : "Crea primero una empresa"}
        >
          <Plus className="size-4" /> Nuevo usuario
        </button>
      }
    >
      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, usuario o correo…"
            className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-4 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
          />
        </div>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="h-11 rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
        >
          <option value="">Todas las empresas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {!users && !error ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <PortalCard className="py-12 text-center text-muted-foreground">
          No hay usuarios que coincidan con los filtros.
        </PortalCard>
      ) : (
        <PortalCard className="overflow-hidden p-0">
          <UsersTable
            users={filtered ?? []}
            showCompany
            onEdit={(u) => setModal({ kind: "edit", user: u })}
            onReset={(u) => setModal({ kind: "reset", user: u })}
            onToggle={toggleUser}
          />
        </PortalCard>
      )}

      {/* Crear / editar */}
      <Modal
        open={modal.kind === "create" || modal.kind === "edit"}
        onClose={() => setModal({ kind: "none" })}
        title={modal.kind === "edit" ? "Editar usuario" : "Nuevo usuario"}
        size="lg"
      >
        {modal.kind === "create" && (
          <div className="space-y-4">
            <Field label="Empresa" htmlFor="create-company" required hint="El usuario pertenecerá a esta empresa.">
              <Select
                id="create-company"
                value={createCompanyId}
                onChange={(e) => setCreateCompanyId(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <UserForm
              key={createCompanyId}
              companyId={createCompanyId}
              onSaved={onUserSaved}
              onCancel={() => setModal({ kind: "none" })}
            />
          </div>
        )}
        {modal.kind === "edit" && (
          <UserForm
            companyId={modal.user.companyId}
            user={modal.user}
            onSaved={onUserSaved}
            onCancel={() => setModal({ kind: "none" })}
          />
        )}
      </Modal>

      {/* Restablecer contraseña */}
      <Modal
        open={modal.kind === "reset"}
        onClose={() => setModal({ kind: "none" })}
        title="Restablecer contraseña"
      >
        {modal.kind === "reset" && (
          <ResetPasswordForm
            user={modal.user}
            onDone={() => setModal({ kind: "none" })}
            onCancel={() => setModal({ kind: "none" })}
          />
        )}
      </Modal>
    </PortalShell>
  );
}
