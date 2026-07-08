"use client";

// Contexto de sesión del Portal. Consume /api/portal/auth/me y expone el usuario
// actual, su rol y acciones (refrescar/cerrar sesión). Toda la lógica vive en el
// backend; aquí solo se guarda el estado de presentación.
import * as React from "react";
import { useRouter } from "next/navigation";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import type { PortalUser } from "@/lib/portal/types";

type AuthState = {
  user: PortalUser | null;
  loading: boolean;
  refresh: () => Promise<PortalUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | null>(null);

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<PortalUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const { user } = await portalApi.get<{ user: PortalUser }>("/auth/me");
      setUser(user);
      return user;
    } catch (err) {
      if (err instanceof PortalApiError && err.status === 401) {
        setUser(null);
        return null;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await portalApi.post("/auth/logout");
    } finally {
      setUser(null);
      router.replace("/portal/login");
    }
  }, [router]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("usePortalAuth debe usarse dentro de PortalAuthProvider");
  return ctx;
}
