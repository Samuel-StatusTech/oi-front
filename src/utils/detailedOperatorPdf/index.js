import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { parseDateDash } from "../date"
import generateContent from "./contents"

const detailedOperatorPDF = async (data) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  
  const { event, dateIni, dateEnd, user, mustDownload = false } = data

  return new Promise((resolve) => {

    const content = generateContent({event, dateIni, dateEnd, user})

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
      pdf.download(`Relatório de vendas ${event.name} - operador ${user.user.name}, ${filename}.pdf`)
    else pdf.getBlob((blob) => resolve(blob))
  })
}

export default detailedOperatorPDF
