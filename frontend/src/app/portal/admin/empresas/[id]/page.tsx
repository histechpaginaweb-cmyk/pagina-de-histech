"use client";

// Ficha de una Empresa: datos + usuarios de la empresa (crear/editar/estado/clave).
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, StatusPill, Spinner, Alert } from "@/components/portal/ui";
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

export default function EmpresaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = React.useState<Company | null>(null);
  const [users, setUsers] = React.useState<PortalUser[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [modal, setModal] = React.useState<ModalState>({ kind: "none" });

  const loadUsers = React.useCallback(() => {
    portalApi
      .get<PortalUser[]>(`/companies/${id}/users`)
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, [id]);

  React.useEffect(() => {
    portalApi.get<Company>(`/companies/${id}`).then(setCompany).catch((e) => setError(e.message));
    loadUsers();
  }, [id, loadUsers]);

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

  return (
    <PortalShell requiredRole="ADMIN_HISTECH">
      <Link
        href="/portal/admin/empresas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand-purple"
      >
        <ArrowLeft className="size-4" /> Volver a Empresas
      </Link>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {!company ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-7 text-brand-purple" />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-display-lg">{company.name}</h1>
                <StatusPill status={company.status} />
              </div>
              {company.internalNotes && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{company.internalNotes}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Creada el {new Date(company.createdAt).toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Users className="size-5 text-brand-purple" /> Usuarios
            </h2>
            <button
              onClick={() => setModal({ kind: "create" })}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" /> Nuevo usuario
            </button>
          </div>

          {!users ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-6 text-brand-purple" />
            </div>
          ) : users.length === 0 ? (
            <PortalCard className="py-12 text-center text-muted-foreground">
              Esta empresa aún no tiene usuarios. Crea el primero.
            </PortalCard>
          ) : (
            <PortalCard className="overflow-hidden p-0">
              <UsersTable
                users={users}
                onEdit={(u) => setModal({ kind: "edit", user: u })}
                onReset={(u) => setModal({ kind: "reset", user: u })}
                onToggle={toggleUser}
              />
            </PortalCard>
          )}
        </>
      )}

      <Modal
        open={modal.kind === "create" || modal.kind === "edit"}
        onClose={() => setModal({ kind: "none" })}
        title={modal.kind === "edit" ? "Editar usuario" : "Nuevo usuario"}
        size="lg"
      >
        {(modal.kind === "create" || modal.kind === "edit") && (
          <UserForm
            companyId={id}
            user={modal.kind === "edit" ? modal.user : undefined}
            onSaved={onUserSaved}
            onCancel={() => setModal({ kind: "none" })}
          />
        )}
      </Modal>

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
