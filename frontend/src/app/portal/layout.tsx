import type { Metadata } from "next";
import Link from "next/link";
import { LogoImage } from "@/components/brand/logo";
import { PortalAuthProvider } from "@/components/portal/auth-context";

// El portal es una zona privada de aplicación: NO debe indexarse (no afecta el
// SEO/AEO/GEO del sitio corporativo). Reutiliza el sistema de diseño pero NO el
// Header/Footer de marketing (ocultos por SiteFrame): tiene su propia barra.
export const metadata: Metadata = {
  title: "Portal de Soporte",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalAuthProvider>
      <div className="min-h-[70vh] bg-[#F7F6FB]">
        {/* Barra propia del portal: solo el logo (sin el mega-menú del sitio). */}
        <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/85 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/portal" aria-label="Portal de Soporte HISTECH" className="inline-flex items-center gap-3">
              <LogoImage className="h-9" priority />
              <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
                Portal de Soporte
              </span>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </PortalAuthProvider>
  );
}
