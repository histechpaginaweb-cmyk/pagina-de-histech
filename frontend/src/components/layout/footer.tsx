import Link from "next/link";
import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { footerNav, siteConfig } from "@/lib/site";

const socials = [
  { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[#E5E7EB] bg-[#FAFAFB]">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-60" />
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand + contact */}
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="size-4 text-brand-cyan" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2.5 text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="size-4 text-brand-cyan" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2.5 text-muted-foreground transition hover:text-foreground"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-cyan" />
                  <span>
                    {siteConfig.contact.address}
                    <br />
                    {siteConfig.contact.city}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Soluciones */}
          <FooterColumn title="Soluciones" links={footerNav.soluciones} />
          {/* Compañía */}
          <FooterColumn title="Compañía" links={footerNav.compania} />

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Centro de Innovación
            </h3>
            <p className="text-sm text-muted-foreground">
              Tendencias en IA, ciberseguridad y transformación digital,
              directo a tu correo.
            </p>
            <form className="flex gap-2" action="/contacto">
              <input
                type="email"
                name="email"
                required
                placeholder="tu@empresa.com"
                aria-label="Correo electrónico"
                className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white px-4 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-brand-purple"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-full bg-brand-gradient px-4 text-sm font-medium text-white"
              >
                Suscribir
              </button>
            </form>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#E5E7EB] text-muted-foreground transition hover:border-brand-purple/50 hover:text-foreground"
                  >
                    <s.icon className="size-4" />
                  </a>
                ) : (
                  <span
                    key={s.label}
                    aria-label={`${s.label} (próximamente)`}
                    aria-disabled="true"
                    className="inline-flex size-9 cursor-default items-center justify-center rounded-full border border-[#E5E7EB] text-muted-foreground"
                  >
                    <s.icon className="size-4" />
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Verse */}
        <p className="mt-14 border-t border-[#E5E7EB] pt-8 text-center text-xs italic text-muted-foreground/80">
          {siteConfig.verse}
        </p>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
