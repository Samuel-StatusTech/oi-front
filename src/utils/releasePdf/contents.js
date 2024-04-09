import { format } from "currency-formatter"
import { logo } from "./utils"
import { contractTxts } from "./contract"
import { formatDate } from "../date"

const marginRight10 = [0, 0, 10, 0]

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
  org,
  releasesList,
  receiptList,
  receivesList,
  totals,
  date,
  showTaxes,
  taxes
) => {

  let eData = [
    {
      text: `Contratante: ${org.name}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      text: `CPF / CNPJ: ${org.document}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      text: `Cidade: ${event.city}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      text: `Evento: ${event.name}`,
      fontSize: 12,
      margin: [0, 0, 0, 20],
    },
  ]

  let data = [
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
      style: "header",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "Resumo Financeiro",
              style: "headerItem",
              fontSize: 14,
              bold: true,
            },
          ],
          [""],
        ],
        widths: ["*"],
      },
      margin: [0, 10, 0, 10],
      layout: "headerLineOnly",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Formas de Pagamento", style: "contentTableHeader" },
            { text: "Valor Total", style: ["contentTableHeader", "right"] },
          ],
          ...receiptList,
        ],
        widths: ["*", 100],
        columnGap: 10,
      },
      margin: marginRight10,
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
              text: "Total Evento",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.payments / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.payments < 0 ? ["debitValue", "right"] : "right",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 90, 100],
      },
      margin: [0, 10, 10, 0],
      layout: "noBorders",
    },

    // Receives
    {
      style: "header",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "Repasse de Recebimentos (Cartão/Pix)",
              style: "headerItem",
              fontSize: 14,
              bold: true,
            },
          ],
          [""],
        ],
        widths: ["*"],
      },
      margin: [0, 10, 0, 10],
      layout: "headerLineOnly",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            { text: "Lançamento", style: "contentTableHeader" },
            { text: "Descrição", style: "contentTableHeader" },
            { text: "Taxa / Qtde", style: "contentTableHeader" },
            { text: "Valor Bruto", style: "contentTableHeader" },
            { text: "Valor Líquido", style: ["contentTableHeader", "right"] },
          ],
          ...receivesList,
          ...releasesList
        ],
        widths: [80, "*", 90, 90, 100],
        columnGap: 10,
      },
      margin: marginRight10,
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
              bold: true
            },
            {
              text: format(totals.liquids / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
              style: totals.liquids < 0 ? ["debitValue", "right"] : "right",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 185, 100],
      },
      margin: [0, 10, 10, -6],
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
              style: totals.liquids < 0 ? ["debitValue", "right"] : "right",
            },
          ],
          ["", "", ""]
        ],
        widths: ["*", 185, 100],
      },
      margin: [0, 0, 10, -6],
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
              style: totals.liquids < 0 ? ["debitValue", "right"] : "right",
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 185, 100],
      },
      margin: [0, 0, 10, 0],
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
              text: "Previsão de Pagamento:",
              fontSize: 11,
              bold: true,
            },
            {
              text: formatDate(date),
              fontSize: 11,
              bold: true,
              style: "right"
            },
          ],
          ["", "", ""],
        ],
        widths: ["*", 185, 100],
      },
      margin: [0, 10, 10, 0],
      layout: "noBorders",
    }
  ]

  if (showTaxes === true) {
    data = [
      ...data,
      ...[
        {
          text: "Informações complementares",
          fontSize: 12,
          bold: true,
          style: "additionalInfo",
          margin: [0, 20, 0, 10],
          pageBreak: "before",
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            body: [
              [
                {
                  text: format(taxes / 100, { code: "BRL" }),
                  fontSize: 11,
                  style: "additionalInfoMain",
                },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
          layout: "noBorders",
        },
        {
          text: "A Nota Fiscal será referente aos serviços de Sistema de Gestão, Locação de Maquininhas e/ou Intermediação de Pagamentos prestados pela Oi Tickets.",
          fontSize: 11,
          style: "additionalInfoDesc",
          margin: [0, 0, 0, 10],
        },
        {
          text: "A Oi Tickets não efetua venda de produtos e/ou serviços que não seja a Gestão e Intermediação de pagamentos.",
          fontSize: 11,
          style: "additionalInfoDesc",
          margin: [0, 0, 0, 20],
        },
        {
          canvas: [
            { type: 'line', x1: -4, y1: -10, x2: 510, y2: -10, lineWidth: 1 }, //Up line
            { type: 'line', x1: -4, y1: -140, x2: 510, y2: -140, lineWidth: 1 }, //Bottom line
            { type: 'line', x1: -4, y1: -10, x2: -4, y2: -140, lineWidth: 1 }, //Left line
            { type: 'line', x1: 510, y1: -10, x2: 510, y2: -140, lineWidth: 1 }, //Rigth line
          ],
        },
      ]
    ]
  }

  const contract = [
    {
      text: "DISPOSIÇÕES GERAIS",
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
    }
  ]

  data = [
    ...data,
    ...contract
  ]

  return data

}

export const footer = [
  {
    text: `Documento emitido em ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
    fontSize: 11,
    style: "dateFooter",
    margin: [0, 0, 38, 0],
  },
]
