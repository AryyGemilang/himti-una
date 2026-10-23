import test from "node:test"
import assert from "node:assert/strict"
import { hashPassword, verifyPassword } from "./passwords.js"

test("password hashes verify only the original password", async () => {
  const encoded = await hashPassword("contoh-kata-sandi-lokal-123")
  assert.equal(await verifyPassword("contoh-kata-sandi-lokal-123", encoded), true)
  assert.equal(await verifyPassword("kata-sandi-yang-salah", encoded), false)
})

test("malformed password hashes are rejected", async () => {
  assert.equal(await verifyPassword("apa pun", "invalid"), false)
})
