import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { ContactForm } from "@/components/forms/contact-form";
import { differentiators, process } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function ContactBlock() {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Left — info */}
        <Reveal className="space-y-8">
          <div className="space-y-3 text-sm">
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="flex items-center gap-3 text-foreground/90 transition hover:text-foreground"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                <Phone className="size-5 text-brand-cyan" />
              </span>
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 text-foreground/90 transition hover:text-foreground"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                <Mail className="size-5 text-brand-cyan" />
              </span>
              {siteConfig.contact.email}
            </a>
            <a
              href={siteConfig.contact.maps}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-foreground/90 transition hover:text-foreground"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[#7C3AED]/15 bg-[#7C3AED]/10">
                <MapPin className="size-5 text-brand-cyan" />
              </span>
              {siteConfig.contact.address}, {siteConfig.contact.city}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-cyan/80">
              Por qué trabajar con nosotros
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {differentiators.map((d) => (
                <li key={d.title} className="flex items-center gap-2.5 text-sm">
                  <Icon name={d.icon} className="size-4 text-brand-cyan" />
                  {d.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-cyan/80">
              ¿Qué pasa después?
            </h3>
            <ol className="mt-4 space-y-4">
              {process.map((p) => (
                <li key={p.step} className="flex gap-4">
                  <span className="font-display text-lg font-bold text-[#7C3AED]/30">
                    {p.step}
                  </span>
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <div className="card-surface p-7 sm:p-9">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
