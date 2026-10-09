import { FileText, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildGenericAdvisorMessage,
  buildPhoneUrl,
  buildWhatsAppUrl,
  productAdvisorLinks,
  productReference,
} from "@/lib/catalog/contact";
import type { PublicProduct } from "@/lib/catalog/types";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Advisor CTA for a single product, shown prominently on its page. */
export function ProductAdvisorActions({ product }: { product: PublicProduct }) {
  const links = productAdvisorLinks(product, {
    whatsapp: siteConfig.contact.whatsapp,
    phoneRaw: siteConfig.contact.phoneRaw,
    productUrl: absoluteUrl(`/tienda/producto/${product.slug}`),
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button href={links.whatsapp} size="lg" {...external}>
        <MessageCircle aria-hidden />
        Hablar con un asesor
      </Button>
      <Button href={links.phone} size="lg" variant="outline">
        <Phone aria-hidden />
        Llamar: {siteConfig.contact.phone}
      </Button>
      <Button href={links.quote} size="lg" variant="secondary" {...external}>
        <FileText aria-hidden />
        Solicitar cotización
      </Button>
    </div>
  );
}

/** Compact version for product cards. Sits above the card's stretched link. */
export function ProductCardAdvisor({ product }: { product: PublicProduct }) {
  const links = productAdvisorLinks(product, {
    whatsapp: siteConfig.contact.whatsapp,
    phoneRaw: siteConfig.contact.phoneRaw,
    productUrl: absoluteUrl(`/tienda/producto/${product.slug}`),
  });
  const reference = productReference(product);

  return (
    <div className="relative z-10 flex items-center gap-2">
      <Button href={links.whatsapp} size="sm" className="flex-1" {...external} aria-label={`Hablar con un asesor sobre ${product.name}${reference ? ` (${reference})` : ""}`}>
        <MessageCircle aria-hidden />
        Hablar con un asesor
      </Button>
      <Button href={links.phone} size="sm" variant="outline" aria-label={`Llamar a un asesor: ${siteConfig.contact.phone}`}>
        <Phone aria-hidden />
      </Button>
    </div>
  );
}

/** Generic advisor CTA for the store listings. */
export function StoreAdvisorActions() {
  const whatsapp = buildWhatsAppUrl(siteConfig.contact.whatsapp, buildGenericAdvisorMessage(absoluteUrl("/tienda")));
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button href={whatsapp} size="lg" {...external}>
        <MessageCircle aria-hidden />
        Hablar con un asesor
      </Button>
      <Button href={buildPhoneUrl(siteConfig.contact.phoneRaw)} size="lg" variant="outline">
        <Phone aria-hidden />
        Llamar: {siteConfig.contact.phone}
      </Button>
    </div>
  );
}
