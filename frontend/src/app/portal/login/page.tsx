"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, LogOut, ArrowRight } from "lucide-react";
import { LogoImage } from "@/components/brand/logo";
import { usePortalAuth } from "@/components/portal/auth-context";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import { Field, Input, Alert, Spinner } from "@/components/portal/ui";
import type { PortalUser } from "@/lib/portal/types";

function destinationFor(user: PortalUser, from: string | null) {
  if (from && from.startsWith("/portal") && from !== "/portal/login") return from;
  return user.role === "ADMIN_HISTECH" ? "/portal/admin" : "/portal/dashboard";
}

export default function PortalLoginPage() {
  // useSearchParams requiere un límite de Suspense para el prerender de Next 15.
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner className="size-8 text-brand-purple" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, refresh, logout } = usePortalAuth();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await portalApi.post<{ user: PortalUser }>("/auth/login", {
        identifier: identifier.trim(),
        password,
      });
      await refresh();
      router.replace(destinationFor(user, params.get("from")));
    } catch (err) {
      setError(
        err instanceof PortalApiError
          ? err.message
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
      );
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="size-8 text-brand-purple" />
      </div>
    );
  }

  // Si ya hay una sesión activa (misma cookie del navegador), no expulsamos en
  // silencio: mostramos quién está conectado y permitimos cambiar de cuenta.
  if (user) {
    const dest = destinationFor(user, params.get("from"));
    const roleLabel =
      user.role === "ADMIN_HISTECH" ? "Administrador HISTECH" : user.company?.name ?? "Cliente";
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <LogoImage className="h-11" priority />
          </div>
          <div className="card-surface space-y-5 p-8 text-center">
            <p className="text-sm text-muted-foreground">Ya has iniciado sesión como</p>
            <div>
              <p className="text-lg font-semibold">{user.fullName}</p>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => router.replace(dest)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(111,61,255,0.7)] transition hover:-translate-y-0.5"
              >
                Ir a mi panel <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => logout()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#E5E7EB] text-sm font-medium text-[#374151] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-4" /> Cerrar sesión e ingresar con otra cuenta
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              ¿Necesitas usar dos cuentas a la vez en este equipo? Abre la segunda en una
              ventana de incógnito.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoImage className="h-11" priority />
          <h1 className="mt-6 text-2xl font-semibold">Portal de Soporte Empresarial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con las credenciales que te entregó HISTECH.
          </p>
        </div>

        <form onSubmit={onSubmit} className="card-surface space-y-5 p-8" noValidate>
          {error && <Alert variant="error">{error}</Alert>}

          <Field label="Usuario o correo" htmlFor="identifier" required>
            <Input
              id="identifier"
              name="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="tu.usuario"
              required
            />
          </Field>

          <Field label="Contraseña" htmlFor="password" required>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(111,61,255,0.7)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Spinner className="size-4" /> Ingresando…
              </>
            ) : (
              <>
                <LogIn className="size-4" /> Iniciar sesión
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            El acceso es exclusivo para clientes de HISTECH. No hay registro público.
          </p>
        </form>
      </div>
    </div>
  );
}
