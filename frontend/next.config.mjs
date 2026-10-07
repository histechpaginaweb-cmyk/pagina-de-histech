/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // next-mdx-remote (RSC) debe pasar por el bundler de Next: si se externaliza,
  // carga `react/jsx-dev-runtime` de node_modules (otra copia de React) y en
  // `next dev` el render del MDX falla con "without development properties".
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // La página /aliados se eliminó; su contenido ("Avalado por los mejores")
      // vive ahora en la home. 301 para no dejar un 404 ni perder valor SEO.
      { source: "/aliados", destination: "/", permanent: true },
    ];
  },
  async rewrites() {
    // Portal de Soporte: proxy mismo-origen hacia el backend (Render/Express).
    // Mantiene las cookies de sesión en el dominio del sitio (sin CORS frágil).
    // La lógica de negocio sigue 100% en el backend; el sitio solo presenta.
    // Reutiliza BACKEND_URL (el mismo backend de productos/blog) si no se define
    // PORTAL_API_URL, para no duplicar configuración en Vercel.
    const portalApi = process.env.PORTAL_API_URL || process.env.BACKEND_URL;
    if (!portalApi) return [];
    return [
      {
        source: "/api/portal/:path*",
        destination: `${portalApi.replace(/\/$/, "")}/api/portal/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
