import { format } from "currency-formatter"
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

export const content = (
  event,
  releases,
  releasesList,
  receiptList,
  receivesList,
  totalLiquidReceives,
  total,
  totals
) => {
  let eData = [
    // {
    //   text: `Nome / Razão Social: ${event.name}`, // user?
    //   fontSize: 12,
    //   margin: [0, 10, 0, 0],
    // },
  ]

  if (event.cpfCnpj)
    eData.push({
      text: `CPF / CNPJ: ${event.cpfCnpj}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    })

  eData = [
    ...eData,
    {
      text: `Cidade: ${event.city}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Evento: ${event.name}`,
      fontSize: 12,
      margin: [0, 10, 0, 20],
    },
  ]

  return [
    {
      style: "header",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "DEMONSTRATIVO FINANCEIRO",
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
    ...eData,

    // Payment
    {
      text: "Resumo Financeiro",
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
            { text: "Forma de pagamento", style: "contentTableHeader" },
            { text: "Valor Total", style: "contentTableHeader" },
          ],
          ...receiptList,
        ],
        widths: ["*", 90],
        columnGap: 10,
      },
      layout: "noBorders",
    },

    // Receives
    {
      text: "Repasse de Recebimentos (Cartão/Pix)",
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
            { text: "Forma de pagamento", style: "contentTableHeader" },
            { text: "Valor Bruto", style: "contentTableHeader" },
            { text: "Valor Líquido", style: "contentTableHeader" },
          ],
          ...receivesList,
        ],
        widths: ["*", 110, 90],
        columnGap: 10,
      },
      layout: "noBorders",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            "",
            {
              text: "TOTAL LÍQUIDO",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.liquids / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.liquids < 0 ? "debitValue" : "",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 280, 90],
      },
      margin: [0, 50, 0, 0],
      layout: "noBorders",
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
            { text: "Valor Un.", style: "contentTableHeader" },
            { text: "Valor Total", style: "contentTableHeader" },
          ],
          ...releasesList,
        ],
        widths: [80, "*", 70, 70, 90],
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
              text: "LÍQUIDO CARTÕES / PIX",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.liquids / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.liquids < 0 ? "debitValue" : "",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 280, 90],
      },
      margin: [0, 50, 0, 0],
      layout: "noBorders",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            "",
            {
              text: "LANÇAMENTOS",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.releases / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.releases < 0 ? "debitValue" : "",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 280, 90],
      },
      margin: [0, 10, 0, 0],
      layout: "noBorders",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            "",
            {
              text: "SALDO",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.allTotal / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.allTotal < 0 ? "debitValue" : "",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 280, 90],
      },
      margin: [0, 10, 0, 0],
      layout: "noBorders",
    },

    // Contract
    {
      text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
      fontSize: 14,
      bold: true,
      style: "contractTitle",
      margin: [0, 50, 0, 24],
      pageBreak: "before",
    },
    ...contractTxts.map((line) => ({
      text: line,
      fontSize: 10,
      style: "contractText",
      margin: [0, 0, 0, 12],
    })),
    {
      text: "Oi Tickets é marca de Oi Ingressos Assessoria de Eventos Eireli",
      fontSize: 10,
      style: "contractFooter",
      margin: [0, 12, 0, 0],
    },
    {
      text: "CNPJ 15.217.618/0001-85  -  Joinville/SC  -  contato@oitickets.com.br",
      fontSize: 10,
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
