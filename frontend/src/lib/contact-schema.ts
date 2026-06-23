import { z } from "zod";

export const serviceOptions = [
  "Inteligencia Artificial",
  "Transformación Digital",
  "Ecosistemas Digitales",
  "Ciberseguridad",
  "Cloud y Continuidad",
  "Infraestructura de Redes",
  "Cómputo",
  "Consultoría en IT",
  "Servicios Gestionados",
  "Soluciones Web",
  "Otro",
] as const;

export const contactSchema = z.object({
  firstName: z.string().min(2, "Ingresa tu nombre").max(60),
  lastName: z.string().min(2, "Ingresa tu apellido").max(60),
  company: z.string().min(2, "Ingresa tu empresa u organización").max(120),
  email: z.string().email("Ingresa un correo válido"),
  phone: z
    .string()
    .min(7, "Ingresa un número válido")
    .max(20)
    .regex(/^[0-9+()\s-]+$/, "Número inválido"),
  service: z.enum(serviceOptions, {
    errorMap: () => ({ message: "Selecciona un servicio" }),
  }),
  message: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)").max(2000),
  // Honeypot anti-spam — debe quedar vacío
  website: z.string().max(0).optional(),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;
