import test from "node:test"
import assert from "node:assert/strict"
import { isRegistrationOpen, normalizeEmail, normalizeNpm, reachedRegistrationLimit, validateAnswers, type FormField } from "./registration-rules.js"

const fields: FormField[] = [
  { id: "motivation", label: "Alasan mendaftar", type: "textarea", required: true },
  { id: "interests", label: "Bidang minat", type: "checkbox", required: true, options: ["Web", "Data"] },
]

test("email and optional NPM identifiers normalize consistently", () => {
  assert.equal(normalizeEmail("  USER@Example.ID "), "user@example.id")
  assert.equal(normalizeNpm("  001234 "), "001234")
  assert.equal(normalizeNpm(undefined), "")
})

test("dynamic form validation enforces required fields and configured options", () => {
  assert.match(validateAnswers(fields, { motivation: "", interests: [] }) || "", /wajib diisi/)
  assert.match(validateAnswers(fields, { motivation: "Belajar", interests: ["Web", "Bukan opsi"] }) || "", /tidak valid/)
  assert.equal(validateAnswers(fields, { motivation: "Belajar", interests: ["Web"] }), null)
})

test("registration is open only inside the published, non-overridden time window", () => {
  const window = { published: true, manual_closed: false, opens_at: "2030-01-01T10:00:00Z", closes_at: "2030-01-01T12:00:00Z" }
  assert.equal(isRegistrationOpen(window, Date.parse("2030-01-01T11:00:00Z")), true)
  assert.equal(isRegistrationOpen({ ...window, manual_closed: true }, Date.parse("2030-01-01T11:00:00Z")), false)
  assert.equal(isRegistrationOpen(window, Date.parse("2030-01-01T12:00:00Z")), false)
})

test("three-submission caps apply independently to email and enabled NPM", () => {
  assert.equal(reachedRegistrationLimit(2, 3, true), true)
  assert.equal(reachedRegistrationLimit(3, 0, false), true)
  assert.equal(reachedRegistrationLimit(2, 3, false), false)
})
