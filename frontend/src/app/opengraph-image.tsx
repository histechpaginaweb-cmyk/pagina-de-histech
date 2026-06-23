import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "HISTECH — Tecnología Inteligente para Empresas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(800px 400px at 30% 0%, #3a1d8f 0%, #050816 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            HIS<span style={{ color: "#A78BFA" }}>TECH</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
            letterSpacing: -2,
          }}
        >
          {siteConfig.hero.title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#94A3B8",
            maxWidth: 850,
          }}
        >
          Infraestructura · Ciberseguridad · Cloud · Inteligencia Artificial
        </div>
        <div
          style={{
            marginTop: 48,
            height: 8,
            width: 280,
            borderRadius: 999,
            background: "linear-gradient(90deg,#6F3DFF,#8B5CFF,#A78BFA)",
          }}
        />
      </div>
    ),
    size,
  );
}
