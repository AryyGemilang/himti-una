import test from "node:test"
import assert from "node:assert/strict"
import { createPdf } from "./pdf.js"

test("PDF output handles Indonesian and Unicode text", async () => {
  const output = await createPdf("Bukti Pendaftaran", "Dokumen lokal", [{ label: "Kegiatan", value: "Pelatihan Cendekia — Kominfo & Kaderisasi" }])
  assert.equal(output.subarray(0, 5).toString("ascii"), "%PDF-")
  assert.ok(output.length > 500)
})
