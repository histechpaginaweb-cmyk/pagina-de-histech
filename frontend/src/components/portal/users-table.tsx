"use client";

// Tabla de usuarios reutilizable (ficha de empresa y listado global).
import * as React from "react";
import { Pencil, KeyRound, Power } from "lucide-react";
import { StatusPill } from "@/components/portal/ui";
import type { PortalUser } from "@/lib/portal/types";

const ROLE_LABEL: Record<PortalUser["role"], string> = {
  ADMIN_HISTECH: "Admin HISTECH",
  CLIENT: "Cliente",
  LIDER: "Líder",
};

export function UsersTable({
  users,
  showCompany = false,
  onEdit,
  onReset,
  onToggle,
}: {
  users: PortalUser[];
  showCompany?: boolean;
  onEdit: (u: PortalUser) => void;
  onReset: (u: PortalUser) => void;
  onToggle: (u: PortalUser) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">Nombre</th>
            <th className="px-5 py-3 font-medium">Usuario</th>
            <th className="px-5 py-3 font-medium">Correo</th>
            {showCompany && <th className="px-5 py-3 font-medium">Empresa</th>}
            <th className="px-5 py-3 font-medium">Rol</th>
            <th className="px-5 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[#F1F1F4] last:border-0 hover:bg-brand-purple/[0.02]">
              <td className="px-5 py-3 font-medium">{u.fullName}</td>
              <td className="px-5 py-3 text-muted-foreground">{u.username}</td>
              <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
              {showCompany && (
                <td className="px-5 py-3 text-muted-foreground">{u.company?.name ?? "—"}</td>
              )}
              <td className="px-5 py-3 text-muted-foreground">{ROLE_LABEL[u.role]}</td>
              <td className="px-5 py-3"><StatusPill status={u.status} /></td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <RowBtn title="Editar" onClick={() => onEdit(u)}><Pencil className="size-4" /></RowBtn>
                  <RowBtn title="Restablecer contraseña" onClick={() => onReset(u)}><KeyRound className="size-4" /></RowBtn>
                  <RowBtn title={u.status === "ACTIVE" ? "Desactivar" : "Activar"} onClick={() => onToggle(u)}><Power className="size-4" /></RowBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-brand-purple/[0.08] hover:text-brand-purple"
    >
      {children}
    </button>
  );
}
