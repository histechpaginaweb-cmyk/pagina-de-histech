// Cliente HTTP centralizado del Portal. Todas las llamadas van a /api/portal/*,
// que Next reescribe (rewrite) hacia el backend manteniendo la cookie de sesión
// en el mismo origen. NO contiene lógica de negocio: solo transporte.

export const PORTAL_BASE = "/api/portal";

export class PortalApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown };

export async function portalFetch<T = unknown>(
  path: string,
  options: Options = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const res = await fetch(`${PORTAL_BASE}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && (data as { error: string }).error) ||
      "Ocurrió un error inesperado";
    throw new PortalApiError(res.status, message, (data as { details?: unknown })?.details);
  }
  return data as T;
}

export const portalApi = {
  get: <T>(path: string) => portalFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => portalFetch<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => portalFetch<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => portalFetch<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => portalFetch<T>(path, { method: "DELETE" }),
};
