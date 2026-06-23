"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/partners";

export function PartnerLogo({
  partner,
  className,
}: {
  partner: Partner;
  className?: string;
}) {
  const [errored, setErrored] = React.useState(false);
  const showImage = partner.logo && !errored;

  return (
    <div className={cn("partner-card", className)} title={partner.name}>
      <div className="partner-card__inner">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo}
            alt={`${partner.name} — partner tecnológico de HISTECH`}
            loading="lazy"
            decoding="async"
            className="partner-card__logo"
            onError={() => setErrored(true)}
          />
        ) : (
          <span className="text-sm font-semibold text-[#4B5563] transition duration-300 group-hover:text-[#111827]">
            {partner.name}
          </span>
        )}
      </div>
    </div>
  );
}
