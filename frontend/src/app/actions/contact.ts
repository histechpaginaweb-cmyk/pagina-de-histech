"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { buildContactEmail, parseProductContext } from "@/lib/contact-email";
import { siteConfig } from "@/lib/site";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
    privacy: formData.get("privacy") === "on" || formData.get("privacy") === "true",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Por favor revisa los campos del formulario.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot — silently accept bots without sending
  if (data.website && data.website.length > 0) {
    return { ok: true, message: "¡Gracias! Te contactaremos pronto." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Graceful fallback when email isn't configured yet (dev / pre-hosting)
  if (!apiKey) {
    console.info("[contacto] Resend no configurado. Lead recibido:", data);
    return {
      ok: true,
      message:
        "¡Gracias! Hemos recibido tu mensaje. Un asesor te contactará pronto.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.contact.email;
    const from = process.env.CONTACT_FROM_EMAIL ?? "Histech Web <onboarding@resend.dev>";

    // Optional product context from the store's quote form (null on /contacto).
    const { subject, text } = buildContactEmail(data, parseProductContext(formData));

    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
    });

    return {
      ok: true,
      message: "¡Gracias! Hemos recibido tu mensaje. Te contactaremos muy pronto.",
    };
  } catch (err) {
    console.error("[contacto] Error al enviar:", err);
    return {
      ok: false,
      message:
        "Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.",
    };
  }
}
