import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { styles } from "./styles"
import { reportTitle, footer, content } from "./contents"
import { generateTicketID } from "../toolbox/qrcode"

const downloadOrderPdf = async (eventData, tickets, shouldDownload = false) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return new Promise(async (resolve) => {
    try {
      const tkts = tickets.map((t) => {
        const tid = generateTicketID(
          false,
          "ecommerce",
          t.opuid,
          eventData.oid,
          eventData.dbName
        )

        return {
          ...t,
          qr_TID: tid,
          date: new Date(t.date).toISOString(),
        }
      })

      // ---

      const filename = `Meus Tickets para ${eventData.name.trim()}.pdf`

      let logo = ""

      const docDefs = {
        images: {
          logo: {
            url: logo,
          },
        },
        pageSize: "A4",
        pageMargins: [38, 80, 38, 40],
        header:
          eventData.logo && !!logo
            ? [{ ...reportTitle[0], image: "logo" }]
            : undefined,
        content: [...content(eventData, tkts)],
        footer: [footer(eventData)],
        styles: styles,
      }

      const pdf = pdfMake.createPdf(docDefs)

      if (shouldDownload) pdf.download(filename)
      else {
        pdf.getBlob((blob) => {
          const file = new File([blob], filename, { type: "application/pdf" })
          resolve(file)
        })
      }
    } catch (error) {
      console.log(error)
    }
  })
}

export default downloadOrderPdf
