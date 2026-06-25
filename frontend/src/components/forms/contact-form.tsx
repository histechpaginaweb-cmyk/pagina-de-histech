"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { serviceOptions } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const initialState: ContactState = { ok: false, message: "" };

function FieldError({ id, errors }: { id?: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-1 text-xs font-medium text-red-600">
      {errors[0]}
    </p>
  );
}

/** Atributos de accesibilidad para asociar un campo con su mensaje de error. */
function a11y(field: string, errors?: string[]) {
  return {
    "aria-invalid": errors?.length ? (true as const) : undefined,
    "aria-describedby": errors?.length ? `${field}-error` : undefined,
  };
}

const inputBase =
  "h-11 w-full rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/30";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(111,61,255,0.7)] transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Enviando…
        </>
      ) : (
        <>
          Enviar mensaje
          <Send className="size-4" />
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.ok) {
    return (
      <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="size-14 text-brand-cyan" />
        <h3 className="text-2xl font-semibold">¡Mensaje enviado!</h3>
        <p className="max-w-md text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && !state.ok && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="size-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
            Nombre
          </label>
          <input id="firstName" name="firstName" autoComplete="given-name" className={inputBase} placeholder="Tu nombre" {...a11y("firstName", state.errors?.firstName)} />
          <FieldError id="firstName-error" errors={state.errors?.firstName} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
            Apellido
          </label>
          <input id="lastName" name="lastName" autoComplete="family-name" className={inputBase} placeholder="Tu apellido" {...a11y("lastName", state.errors?.lastName)} />
          <FieldError id="lastName-error" errors={state.errors?.lastName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Empresa / Organización
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputBase} placeholder="Tu empresa" {...a11y("company", state.errors?.company)} />
          <FieldError id="company-error" errors={state.errors?.company} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Celular
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputBase} placeholder="+57 300 000 0000" {...a11y("phone", state.errors?.phone)} />
          <FieldError id="phone-error" errors={state.errors?.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Correo de contacto
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className={inputBase} placeholder="tu@empresa.com" {...a11y("email", state.errors?.email)} />
        <FieldError id="email-error" errors={state.errors?.email} />
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
          ¿Cómo podemos ayudarte?
        </label>
        <select
          id="service"
          name="service"
          defaultValue=""
          className={cn(inputBase, "appearance-none")}
          {...a11y("service", state.errors?.service)}
        >
          <option value="" disabled>
            Selecciona un servicio
          </option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FieldError id="service-error" errors={state.errors?.service} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={cn(inputBase, "h-auto py-3 resize-y")}
          placeholder="Cuéntanos sobre tu proyecto o necesidad…"
          {...a11y("message", state.errors?.message)}
        />
        <FieldError id="message-error" errors={state.errors?.message} />
      </div>

      {/* Honeypot (hidden from users) */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">No llenar</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="privacy"
          name="privacy"
          type="checkbox"
          className="mt-1 size-4 rounded border-[#D1D5DB] bg-white accent-brand-purple"
          {...a11y("privacy", state.errors?.privacy)}
        />
        <label htmlFor="privacy" className="text-sm text-muted-foreground">
          Acepto la{" "}
          <a href="/privacidad" className="text-brand-cyan underline-offset-2 hover:underline">
            Política de Privacidad
          </a>{" "}
          y el tratamiento de mis datos personales.
        </label>
      </div>
      <FieldError id="privacy-error" errors={state.errors?.privacy} />

      <SubmitButton />
    </form>
  );
}
