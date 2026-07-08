"use client";

// Restablecer contraseña de un usuario (solo Administrador HISTECH).
import * as React from "react";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import { Field, Input, Alert, Spinner } from "@/components/portal/ui";
import type { PortalUser } from "@/lib/portal/types";

export function ResetPasswordForm({
  user,
  onDone,
  onCancel,
}: {
  user: PortalUser;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await portalApi.post(`/users/${user.id}/reset-password`, { password });
      onDone();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo restablecer.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}
      <p className="text-sm text-muted-foreground">
        Nueva contraseña para <strong className="text-foreground">{user.fullName}</strong> ({user.username}).
      </p>
      <Field label="Nueva contraseña" htmlFor="rp" required hint="Mínimo 8 caracteres.">
        <Input
          id="rp"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </Field>
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
          Restablecer
        </button>
      </div>
    </form>
  );
}
