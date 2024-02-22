import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { getLists } from "./utils"
import { parseDateDash } from "../date"
import { reportTitle, content, footer } from "./contents"

const sellsPDF = async (event, releases, payment, date, mustDownload = false) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  console.log(date)

  return new Promise((resolve) => {
    const { money, pix, debit, credit } = payment.gross
    const total = money + pix + debit + credit

    const products = getProductList(data)

    const filename = parseDateDash(new Date())

    const totals = {
      money: total,
      debit: totalLiquidReceives,
      credit: releasesList.totals,
      pix: totalLiquidReceives + releasesList.totals,
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
          products.table,
          products.count,
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

export default sellsPDF
