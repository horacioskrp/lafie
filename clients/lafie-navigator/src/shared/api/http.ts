// Wrapper HTTP minimal. À enrichir (intercepteur JWT, ProblemDetails, base URL)
// et/ou remplacer par le client OpenAPI généré (voir docs/frontend/README.md §À venir).
export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
