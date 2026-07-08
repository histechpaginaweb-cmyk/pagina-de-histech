import { NextResponse, type NextRequest } from "next/server";

// Protección de rutas privadas del Portal. Comprueba la presencia de la cookie
// de sesión (httpOnly). La verificación real (firma, rol, empresa) la hace el
// backend en cada llamada al API; esto es la primera barrera de acceso.
const SESSION_COOKIE = "histech_portal";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // El login es público; todo lo demás bajo /portal requiere sesión.
  if (pathname === "/portal/login") return NextResponse.next();

  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Solo intercepta las rutas del portal (no afecta al sitio corporativo).
  matcher: ["/portal/:path*"],
};
