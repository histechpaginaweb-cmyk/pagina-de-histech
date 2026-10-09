import { describe, expect, it } from "vitest";
import { buildContactEmail, parseProductContext } from "./contact-email";
import type { ContactInput } from "./contact-schema";

const data: ContactInput = {
  firstName: "Ana",
  lastName: "Pérez",
  company: "ACME",
  email: "ana@acme.co",
  phone: "3001234567",
  service: "Otro",
  message: "Necesito una cotización",
  privacy: true,
};

describe("buildContactEmail without product context", () => {
  it("keeps the original subject and body untouched", () => {
    const { subject, text } = buildContactEmail(data);
    expect(subject).toBe("Nuevo contacto — Ana Pérez (Otro)");
    expect(text).toBe(
      [
        "Nombre: Ana Pérez",
        "Empresa: ACME",
        "Correo: ana@acme.co",
        "Celular: 3001234567",
        "Servicio: Otro",
        "",
        "Mensaje:",
        "Necesito una cotización",
      ].join("\n"),
    );
  });
});

describe("buildContactEmail with product context", () => {
  const product = {
    name: "Teltonika RUT956",
    reference: "RUT956",
    url: "https://histech.com.co/tienda/producto/teltonika-rut956",
  };

  it("flags the email as a quote request and lists the product", () => {
    const { subject, text } = buildContactEmail(data, product);
    expect(subject).toBe("Solicitud de cotización — Teltonika RUT956 — Ana Pérez");
    expect(text).toContain("Producto: Teltonika RUT956");
    expect(text).toContain("Referencia: RUT956");
    expect(text).toContain("Enlace: https://histech.com.co/tienda/producto/teltonika-rut956");
    expect(text).toContain("Necesito una cotización");
  });

  it("omits the reference line when there is none", () => {
    const { text } = buildContactEmail(data, { ...product, reference: "" });
    expect(text).not.toContain("Referencia:");
  });
});

describe("parseProductContext", () => {
  const form = (entries: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entries)) fd.set(k, v);
    return fd;
  };

  it("returns null when no product name is sent (normal contact form)", () => {
    expect(parseProductContext(form({}))).toBeNull();
    expect(parseProductContext(form({ productName: "   " }))).toBeNull();
  });

  it("reads the hidden fields", () => {
    expect(
      parseProductContext(
        form({ productName: "RUT956", productReference: "R1", productUrl: "https://histech.com.co/tienda/producto/x" }),
      ),
    ).toEqual({ name: "RUT956", reference: "R1", url: "https://histech.com.co/tienda/producto/x" });
  });

  it("flattens line breaks and caps lengths so spoofed fields cannot forge extra lines", () => {
    const result = parseProductContext(form({ productName: "A\nPara: evil@x.co\r\nB", productUrl: "javascript:alert(1)" }));
    expect(result?.name).toBe("A Para: evil@x.co B");
    expect(result?.url).toBe("");
    expect(parseProductContext(form({ productName: "x".repeat(500) }))?.name).toHaveLength(160);
  });
});
