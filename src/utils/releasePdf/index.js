import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { getLists } from "./utils"
import { parseDateDash } from "../date"
import { reportTitle, content, footer } from "./contents"

const releasePDF = async (event, releases, payment, mustDownload = false) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise((resolve) => {
    const { money, pix, debit, credit } = payment.gross
    const total = money + pix + debit + credit

    const releasesList = getLists.releases(releases)
    const receiptList = getLists.receipt(payment.gross, total)

    const filename = parseDateDash(new Date())

    const docDefs = {
      pageSize: "A4",
      pageMargins: [38, 68, 38, 40],
      header: [reportTitle],
      content: [...content(event, releases, releasesList, receiptList, total)],
      footer: [footer],
      styles: styles,
    }

    const pdf = pdfMake.createPdf(docDefs)

    if (mustDownload)
      pdf.download(`Relatório financeiro ${event.name} ${filename}.pdf`)
    else pdf.getBlob((blob) => resolve(blob))
  })
}

export default releasePDF
