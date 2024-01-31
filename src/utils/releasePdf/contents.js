import { getTotal, logo } from "./utils"
import { contractTxts } from "./contract"

export const reportTitle = [
  {
    image: `data:image/png;base64, ${logo}`,
    margin: [0, 28, 17, 0],
    width: 170,
    style: { alignment: "right" },
  },
]

export const content = (event, releases, releasesList, receiptList, total) => {
  return [
    {
      style: "header",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "RELATÓRIO DE LANÇAMENTOS",
              style: "headerItem",
              fontSize: 11,
              bold: true,
            },
          ],
          [""],
        ],
        widths: ["*"],
      },
      layout: "headerLineOnly",
    },

    // Event Data
    {
      text: `EVENTO: ${event.name}`,
      fontSize: 12,
      margin: [0, 10, 0, 20],
    },

    // Releases table
    {
      text: "Resumo de lançamentos",
      fontSize: 14,
      margin: [0, 18, 0, 10],
      bold: true,
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Lançamento", style: "contentTableHeader" },
            { text: "Descrição", style: "contentTableHeader" },
            { text: "Taxa/Qnte", style: "contentTableHeader" },
            { text: "Valor Bruto", style: "contentTableHeader" },
          ],
          ...releasesList,
        ],
        widths: ["*", 190, 80, 100],
        columnGap: 10,
      },
      layout: "noBorders",
    },

    // Receipt table
    {
      text: "Resumo de pagamentos",
      fontSize: 14,
      margin: [0, 38, 0, 10],
      bold: true,
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Forma de pagamento", style: "contentTableHeader" },
            { text: "Proporção", style: "contentTableHeader" },
            { text: "Valor total", style: "contentTableHeader" },
          ],
          ...receiptList,
        ],
        widths: ["*", 280, 100],
        columnGap: 10,
      },
      layout: "noBorders",
    },

    // Totals
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            "",
            {
              text: "TOTAL GERAL",
              fontSize: 11,
              bold: true,
            },
            {
              text: getTotal(releases, total),
              fontSize: 11,
              bold: true,
              style: total < 0 ? "debitValue" : "",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 280, 100],
      },
      margin: [0, 50, 0, 0],
      layout: "noBorders",
    },

    // Contract
    {
      text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
      fontSize: 14,
      bold: true,
      style: "contractTitle",
      margin: [0, 50, 0, 24],
    },
    ...contractTxts.map((line) => ({
      text: line,
      fontSize: 11,
      style: "contractText",
      margin: [0, 0, 0, 12],
    })),
    {
      text: "Oi Tickets é marca de Oi Ingressos Assessoria de Eventos Eireli",
      style: "contractFooter",
      margin: [0, 12, 0, 0],
    },
    {
      text: "CNPJ 15.217.618/0001-85  -  Joinville/SC  -  contato@oitickets.com.br",
      style: "contractFooter",
      margin: [0, 0, 0, 12],
    },
  ]
}

export const footer = [
  {
    text: `Documento emitido em ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
    fontSize: 11,
    style: "dateFooter",
    margin: [0, 0, 38, 0],
  },
]
