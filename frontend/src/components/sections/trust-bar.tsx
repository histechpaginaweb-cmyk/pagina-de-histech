import { LogoMarquee } from "./logo-marquee";

const clientLogos = [
  { name: "ESCORT", logo: "/clientes/ESCORT.png" },
  { name: "MADIGAS", logo: "/clientes/MADIGAS.png" },
  { name: "ONECT", logo: "/clientes/ONECT.png" },
  { name: "SIGMA", logo: "/clientes/SIGMA.png" },
  { name: "SOLENIS", logo: "/clientes/SOLENIS.png" },
  { name: "UNIPLES", logo: "/clientes/UNIPLES.png" },
  { name: "VELVET", logo: "/clientes/VELVET.png" },
  { name: "VSI", logo: "/clientes/VSI.png" },
];

export function TrustBar() {
  return (
    <section className="border-y border-[#E5E7EB] bg-[#FAFAFB] py-10">
      <div className="container">
        <p className="mb-7 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          Clientes
        </p>
      </div>
      <LogoMarquee partners={clientLogos} />
    </section>
  );
}
