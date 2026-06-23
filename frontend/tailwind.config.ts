import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ── HISTECH brand tokens — Identidad Púrpura Tecnológica ──
        // Paleta corporativa centralizada. Las claves `blue` y `cyan`
        // se conservan como alias para no romper componentes, pero ahora
        // apuntan a tonos púrpura (sin azul/cyan en toda la web).
        brand: {
          purple: "#7C3AED", // Primary    — Color oficial de marca (logo)
          blue: "#A855F7", // Secondary  — Púrpura medio (gradientes)
          cyan: "#7C3AED", // Accent     — Morado corporativo (textos/iconos; antes lavanda, ilegible sobre claro)
          deep: "#4C1D95", // Deep       — Púrpura profundo (sombras/profundidad)
          space: "#050816", // Dark       — Fondo base / Headers / Footer
          surface: "#0B1020", // Surface    — Tarjetas / superficies elevadas
          gray: "#64748B", // Gris tecnológico
        },
        // semantic aliases driven by CSS variables (see globals.css)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-lg": ["clamp(1.875rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #7C3AED 0%, #9333EA 55%, #A855F7 100%)",
        "brand-radial":
          "radial-gradient(80% 80% at 50% 0%, rgba(111,61,255,0.35) 0%, rgba(139,92,255,0.12) 45%, rgba(5,8,22,0) 75%)",
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(111,61,255,0.25), 0 18px 60px -15px rgba(111,61,255,0.45)",
        // Glow de acento (lavanda púrpura) — alias histórico `glow-cyan`
        "glow-cyan": "0 0 40px -8px rgba(139,92,255,0.55)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -30px rgba(2,6,23,0.8)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        dash: {
          to: { "stroke-dashoffset": "-240" },
        },
        "float-soft": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        shimmer: "shimmer 2.2s infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        marquee: "marquee 48s linear infinite",
        dash: "dash 9s linear infinite",
        "float-soft": "float-soft 7s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
