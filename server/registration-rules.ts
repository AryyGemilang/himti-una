export type FormField = { id: string; label: string; type: "text" | "textarea" | "select" | "checkbox"; required: boolean; options?: string[] }

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

export function normalizeNpm(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : ""
}

export function validateAnswers(schema: FormField[], input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return "Jawaban formulir tidak valid."
  const answers = input as Record<string, unknown>
  const allowedIds = new Set(schema.map(field => field.id))
  if (Object.keys(answers).some(key => !allowedIds.has(key))) return "Formulir berubah atau berisi jawaban yang tidak dikenal. Muat ulang halaman dan coba kembali."
  for (const field of schema) {
    const value = answers[field.id]
    if (((value === undefined || value === null || value === "") || (Array.isArray(value) && value.length === 0)) && field.required) return `Pertanyaan “${field.label}” wajib diisi.`
    if (value === undefined || value === null || value === "") continue
    if (field.type === "checkbox") {
      if (!Array.isArray(value) || value.some(entry => typeof entry !== "string" || !field.options?.includes(entry))) return `Jawaban untuk “${field.label}” tidak valid.`
    } else if (typeof value !== "string" || value.length > 4000) return `Jawaban untuk “${field.label}” tidak valid.`
    else if (field.type === "select" && !field.options?.includes(value)) return `Pilih salah satu opsi yang tersedia untuk “${field.label}”.`
  }
  return null
}

export function isRegistrationOpen(input: { published: boolean; manual_closed: boolean; opens_at: Date | string; closes_at: Date | string }, now = Date.now()) {
  return input.published && !input.manual_closed && new Date(input.opens_at).getTime() <= now && now < new Date(input.closes_at).getTime()
}

export function reachedRegistrationLimit(emailCount: number, npmCount: number, includesNpm: boolean) {
  return emailCount >= 3 || (includesNpm && npmCount >= 3)
}
