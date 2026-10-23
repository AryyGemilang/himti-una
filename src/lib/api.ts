const API_ROOT = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`

export function apiUrl(path: string) {
  return `${API_ROOT}${path.startsWith("/") ? path : `/${path}`}`
}

export function mediaUrl(path: string) {
  const normalized = path.replace(/^\//, "")
  return `${import.meta.env.BASE_URL}${normalized}`
}

export async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), { credentials: "same-origin", ...options })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(payload.error || `Permintaan gagal (${response.status}).`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function adminRequest<T>(path: string, csrfToken: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("x-csrf-token", csrfToken)
  if (options.body && !(options.body instanceof FormData)) headers.set("content-type", "application/json")
  return apiJson<T>(path, { ...options, headers })
}
