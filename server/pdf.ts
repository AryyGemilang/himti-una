import PDFDocument from "pdfkit"
import { PassThrough } from "node:stream"
import { resolve } from "node:path"

type PdfPair = { label: string; value: string }

function formatJakartaDate(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value)) + " WIB"
}

export async function createPdf(title: string, subtitle: string, pairs: PdfPair[]) {
  const doc = new PDFDocument({ size: "A4", margin: 52, info: { Title: title, Author: "HIMTI Universitas Asahan" } })
  doc.registerFont("HIMTI Sans", resolve(process.cwd(), "server/assets/NotoSans-Regular.ttf"))
  doc.registerFont("HIMTI Sans Bold", resolve(process.cwd(), "server/assets/NotoSans-Bold.ttf"))
  const stream = new PassThrough()
  const chunks: Buffer[] = []
  stream.on("data", chunk => chunks.push(Buffer.from(chunk)))
  const result = new Promise<Buffer>((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)))
    stream.on("error", reject)
    doc.on("error", reject)
  })
  doc.pipe(stream)
  doc.fillColor("#00698F").fontSize(11).font("HIMTI Sans Bold").text("HIMTI · UNIVERSITAS ASAHAN")
  doc.moveDown(1.2).fillColor("#102A38").fontSize(22).font("HIMTI Sans Bold").text(title)
  doc.moveDown(0.35).fillColor("#49616D").fontSize(11).font("HIMTI Sans").text(subtitle)
  doc.moveDown(1.3).strokeColor("#D8E5EA").moveTo(52, doc.y).lineTo(543, doc.y).stroke().moveDown(1)
  for (const pair of pairs) {
    if (doc.y > 730) doc.addPage()
    doc.fillColor("#526B76").fontSize(9).font("HIMTI Sans Bold").text(pair.label.toUpperCase())
    doc.moveDown(0.2).fillColor("#102A38").fontSize(11).font("HIMTI Sans").text(pair.value || "—", { width: 490 })
    doc.moveDown(0.8)
  }
  doc.moveDown().fillColor("#526B76").fontSize(8).font("HIMTI Sans").text(`Dicetak pada ${formatJakartaDate(new Date())} · Simpan dokumen ini untuk arsip Anda.`)
  doc.end()
  return result
}
