import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 px-8 py-16 text-center sm:px-16">
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-brand-gradient opacity-90" />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute -bottom-24 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-white/20 blur-[100px]" />
            </div>
            <h2 className="mx-auto max-w-3xl text-display-lg text-white text-balance">
              {siteConfig.slogan}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
              Agenda una consultoría sin costo y descubre cómo acelerar la
              transformación digital de tu organización.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href="/agenda-consultoria"
                size="lg"
                className="bg-white text-brand-space hover:bg-white/90"
              >
                Agenda una consultoría
                <ArrowRight className="size-4" />
              </Button>
              <Button
                href={siteConfig.contact.whatsapp}
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Hablar por WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
