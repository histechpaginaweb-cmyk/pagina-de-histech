"use client";

// Formulario reutilizable de Usuario. En creación se envía a
// /companies/:companyId/users (la empresa NO se pide: viene del contexto).
// En edición se envía a /users/:id (sin contraseña; se cambia por separado).
import * as React from "react";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import { Field, Input, Select, Alert, Spinner } from "@/components/portal/ui";
import type { PortalUser, Role, EntityStatus } from "@/lib/portal/types";

type Props = {
  companyId: string; // requerido para crear
  user?: PortalUser; // presente en edición
  onSaved: (u: PortalUser) => void;
  onCancel: () => void;
};

export function UserForm({ companyId, user, onSaved, onCancel }: Props) {
  const editing = Boolean(user);
  const [form, setForm] = React.useState({
    fullName: user?.fullName ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    password: "",
    role: (user?.role ?? "CLIENT") as Role,
    area: user?.area ?? "",
    position: user?.position ?? "",
    phone: user?.phone ?? "",
    whatsapp: user?.whatsapp ?? "",
    status: (user?.status ?? "ACTIVE") as EntityStatus,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let saved: PortalUser;
      if (editing) {
        const { password, ...rest } = form;
        void password;
        saved = await portalApi.put<PortalUser>(`/users/${user!.id}`, rest);
      } else {
        saved = await portalApi.post<PortalUser>(`/companies/${companyId}/users`, form);
      }
      onSaved(saved);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      <Field label="Nombre completo" htmlFor="u-name" required>
        <Input id="u-name" value={form.fullName} onChange={set("fullName")} required />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Usuario" htmlFor="u-username" required>
          <Input id="u-username" value={form.username} onChange={set("username")} autoComplete="off" required />
        </Field>
        <Field label="Correo electrónico" htmlFor="u-email" required>
          <Input id="u-email" type="email" value={form.email} onChange={set("email")} autoComplete="off" required />
        </Field>
      </div>

      {!editing && (
        <Field label="Contraseña" htmlFor="u-password" required hint="Mínimo 8 caracteres.">
          <Input id="u-password" type="text" value={form.password} onChange={set("password")} autoComplete="new-password" required />
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Área" htmlFor="u-area">
          <Input id="u-area" value={form.area ?? ""} onChange={set("area")} />
        </Field>
        <Field label="Cargo" htmlFor="u-position">
          <Input id="u-position" value={form.position ?? ""} onChange={set("position")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" htmlFor="u-phone">
          <Input id="u-phone" value={form.phone ?? ""} onChange={set("phone")} />
        </Field>
        <Field label="WhatsApp" htmlFor="u-whatsapp">
          <Input id="u-whatsapp" value={form.whatsapp ?? ""} onChange={set("whatsapp")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rol" htmlFor="u-role">
          <Select id="u-role" value={form.role} onChange={set("role")}>
            <option value="CLIENT">Usuario Cliente</option>
            <option value="ADMIN_HISTECH">Administrador HISTECH</option>
          </Select>
        </Field>
        <Field label="Estado" htmlFor="u-status">
          <Select id="u-status" value={form.status} onChange={set("status")}>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </Select>
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-full border border-[#E5E7EB] px-5 text-sm font-medium text-[#374151] transition hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {saving && <Spinner className="size-4" />}
          {editing ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
