"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { serviceOptions } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const initialState: ContactState = { ok: false, message: "" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-400">{errors[0]}</p>;
}

const inputBase =
  "h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30";

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
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
            Nombre
          </label>
          <input id="firstName" name="firstName" autoComplete="given-name" className={inputBase} placeholder="Tu nombre" />
          <FieldError errors={state.errors?.firstName} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
            Apellido
          </label>
          <input id="lastName" name="lastName" autoComplete="family-name" className={inputBase} placeholder="Tu apellido" />
          <FieldError errors={state.errors?.lastName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Empresa / Organización
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputBase} placeholder="Tu empresa" />
          <FieldError errors={state.errors?.company} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Celular
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputBase} placeholder="+57 300 000 0000" />
          <FieldError errors={state.errors?.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Correo de contacto
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className={inputBase} placeholder="tu@empresa.com" />
        <FieldError errors={state.errors?.email} />
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
          ¿Cómo podemos ayudarte?
        </label>
        <select id="service" name="service" defaultValue="" className={cn(inputBase, "appearance-none")}>
          <option value="" disabled>
            Selecciona un servicio
          </option>
          {serviceOptions.map((s) => (
            <option key={s} value={s} className="bg-brand-space">
              {s}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.service} />
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
        />
        <FieldError errors={state.errors?.message} />
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
          className="mt-1 size-4 rounded border-white/20 bg-white/5 accent-brand-purple"
        />
        <label htmlFor="privacy" className="text-sm text-muted-foreground">
          Acepto la{" "}
          <a href="/privacidad" className="text-brand-cyan underline-offset-2 hover:underline">
            Política de Privacidad
          </a>{" "}
          y el tratamiento de mis datos personales.
        </label>
      </div>
      <FieldError errors={state.errors?.privacy} />

      <SubmitButton />
    </form>
  );
}
