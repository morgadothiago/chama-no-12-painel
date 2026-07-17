const API_URL = process.env.API_URL ?? "http://localhost:3000";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: { page: number; total: number; limit: number };
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    // Sem isso o Next cacheia a resposta indefinidamente (force-cache padrão)
    // e o dashboard fica preso em dados velhos até o processo reiniciar.
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    const error = body.error ?? body.message ?? "Erro desconhecido";
    throw new Error(typeof error === "string" ? error : error.message ?? JSON.stringify(error));
  }

  return body;
}

export const api = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  post: <T>(path: string, data?: unknown, token?: string) =>
    request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  patch: <T>(path: string, data: unknown, token?: string) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};
