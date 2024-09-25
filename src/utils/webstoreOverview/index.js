import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { parseDateDash } from "../date"
import generateContent from "./contents"

const webstoreOverviewPDF = async (data) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  try {
    const { event, dateIni, dateEnd, mustDownload = false, resume, dailySells, products } = data

    return new Promise((resolve) => {

      const content = generateContent({ event, dateIni, dateEnd, resume, dailySells, products })

      const filename = parseDateDash(new Date())

      const docDefs = {
        pageSize: "A4",
        pageMargins: [38, 80, 38, 40],
        header: content.header,
        content: content.body,
        footer: content.footer,
        styles: styles,
      }

      const pdf = pdfMake.createPdf(docDefs)

      if (mustDownload)
        pdf.download(`Visão Geral - loja virtual ${event.name}, ${filename}.pdf`)
      else pdf.getBlob((blob) => resolve(blob))
    })
  } catch (error) {
  }
}

export default webstoreOverviewPDF
