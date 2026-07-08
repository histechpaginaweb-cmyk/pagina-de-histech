"use client";

// Marco del sitio: Header, Footer y FAB de WhatsApp del sitio corporativo.
// Se ocultan por completo dentro del Portal de Soporte (/portal), que tiene su
// propio encabezado y navegación. El resto del sitio no cambia.
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");

  return (
    <>
      {!isPortal && <Header />}
      <main id="main" className="relative overflow-x-clip">
        {children}
      </main>
      {!isPortal && <Footer />}
      {!isPortal && <WhatsAppFab />}
    </>
  );
}
