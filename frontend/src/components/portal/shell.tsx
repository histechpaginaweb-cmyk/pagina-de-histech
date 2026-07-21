"use client";

// Shell de las páginas autenticadas del Portal. Aporta la navegación lateral por
// rol, el encabezado de sesión y las guardas de acceso (redirige al login si no
// hay sesión; bloquea si el rol no corresponde). Reutiliza el sistema de diseño.
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Users,
  LayoutDashboard,
  Ticket,
  Monitor,
  BarChart3,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/components/portal/auth-context";
import { Spinner } from "@/components/portal/ui";
import type { Role } from "@/lib/portal/types";

type NavItem = { href: string; label: string; icon: LucideIcon; soon?: boolean };

const ADMIN_NAV: NavItem[] = [
  { href: "/portal/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/portal/admin/empresas", label: "Empresas", icon: Building2 },
  { href: "/portal/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/portal/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/portal/admin/equipos", label: "Equipos", icon: Monitor },
  { href: "/portal/admin/reportes", label: "Reportes", icon: BarChart3 },
];

const CLIENT_NAV: NavItem[] = [
  { href: "/portal/dashboard", label: "Mis tickets", icon: Ticket },
];

// LIDER: mismas páginas que el Cliente (con alcance de toda la empresa) +
// acceso a Reportes (Excel) de su propia empresa.
const LIDER_NAV: NavItem[] = [
  { href: "/portal/dashboard", label: "Tickets", icon: Ticket },
  { href: "/portal/reportes", label: "Reportes", icon: BarChart3 },
];

export function PortalShell({
  children,
  requiredRole,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const { user, loading, logout } = usePortalAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) router.replace("/portal/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="size-8 text-brand-purple" />
      </div>
    );
  }

  const allowedRoles = requiredRole
    ? Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole]
    : null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="text-muted-foreground">No tienes permisos para ver esta sección.</p>
        <Link href="/portal" className="text-brand-purple hover:underline">
          Volver al inicio del portal
        </Link>
      </div>
    );
  }

  const nav =
    user.role === "ADMIN_HISTECH" ? ADMIN_NAV : user.role === "LIDER" ? LIDER_NAV : CLIENT_NAV;

  const roleLabel =
    user.role === "ADMIN_HISTECH"
      ? "Administrador HISTECH"
      : user.role === "LIDER"
        ? `${user.company?.name ?? ""} · Líder`
        : user.company?.name;

  return (
    <div className="container py-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 lg:py-10">
      {/* Navegación: barra lateral en escritorio, barra horizontal deslizable en móvil */}
      <aside className="mb-6 lg:mb-0 lg:sticky lg:top-20 lg:self-start">
        <div className="card-surface p-3 lg:p-4">
          {/* Usuario + cerrar sesión (compacto en móvil) */}
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3 lg:mb-4 lg:pb-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">{user.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
            </div>
            <button
              onClick={() => logout()}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-muted-foreground transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 lg:hidden"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/portal/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              if (item.soon) {
                return (
                  <span
                    key={item.href}
                    className="flex shrink-0 cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm text-muted-foreground/60 lg:justify-between"
                    title="Disponible próximamente"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4" />
                      {item.label}
                    </span>
                    <span className="hidden rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide lg:inline">
                      Pronto
                    </span>
                  </span>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-brand-purple/[0.08] text-brand-purple"
                      : "text-[#374151] hover:bg-brand-purple/[0.05] hover:text-brand-purple",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Cerrar sesión completo (solo escritorio) */}
          <button
            onClick={() => logout()}
            className="mt-4 hidden w-full items-center gap-2.5 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#374151] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 lg:flex"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="min-w-0">
        {(title || actions) && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
            <div>
              {title && <h1 className="text-display-lg">{title}</h1>}
              {description && (
                <p className="mt-1 text-muted-foreground">{description}</p>
              )}
            </div>
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
