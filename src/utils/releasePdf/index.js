import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { getLists } from "./utils"
import { parseDateDash } from "../date"
import { reportTitle, content, footer } from "./contents"

const releasePDF = async (event, releases, payment, date, mustDownload = false) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise((resolve) => {
    const { money, pix, debit, credit } = payment.gross
    const total = money + pix + debit + credit

    const releasesList = getLists.releases(releases)
    const receiptList = getLists.receipt(payment.gross, total)
    const receivesList = getLists.receives({
      debitGross: payment.gross.debit,
      debitNet: payment.net.debit,
      creditGross: payment.gross.credit,
      creditNet: payment.net.credit,
      pixGross: payment.gross.pix,
      pixNet: payment.net.pix,
    })
    const totalLiquidReceives =
      payment.net.debit + payment.net.credit + payment.net.pix

    const filename = parseDateDash(new Date())

    const totals = {
      payments: total,
      liquids: totalLiquidReceives,
      releases: releasesList.totals,
      allTotal: totalLiquidReceives + releasesList.totals,
    }

    const docDefs = {
      pageSize: "A4",
      pageMargins: [38, 80, 38, 40],
      header: [reportTitle],
      content: [
        ...content(
          event,
          {
            name: event.clientName,
            document: event.clientDocument
          },
          releasesList.table,
          receiptList,
          receivesList,
          totals,
          date
        ),
      ],
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
