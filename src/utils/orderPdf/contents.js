import { formatCNPJ } from "../toolbox/formatCNPJ"
import { format } from "currency-formatter"
import { formatDate } from "../date"

export const reportTitle = [
  {
    image: "",
    margin: [0, 28, 17, 0],
    width: 170,
    style: { alignment: "right" },
  },
]

export const footer = (event) => [
  {
    text: [
      {
        text: `Razão Social: `,
        fontSize: 10,
        style: "companyFooterTag",
      },
      {
        text: `${event.corporateName}          `,
        fontSize: 10,
        style: "companyFooter",
      },
      {
        text: `CNPJ: `,
        fontSize: 10,
        style: "companyFooterTag",
      },
      {
        text: `${formatCNPJ(event.CNPJ)}`,
        fontSize: 10,
        style: "companyFooter",
      },
    ],
    margin: [38, 0, 10, -12],
  },
  {
    text: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
    fontSize: 10,
    style: "dateFooter",
    margin: [0, 0, 38, 0],
    width: ["*"],
  },
]

const ticketData = (event, ticket, ticketsLength, newPage) => {
  const getHours = (date) => {
    let str = ""

    const d = new Date(date)

    str = `${String(d.getHours()).padStart(2, "0")}:`
    str += String(d.getMinutes()).padStart(2, "0")

    return str
  }

  let data = []

  let body = []

  // event
  body.push({
    pageBreak: newPage ? "before" : undefined,
    style: "eventTable",
    table: {
      body: [
        // event
        [{ text: event.name, bold: true }],
        [
          {
            text: `Data do evento: ${formatDate(event.date_ini)}`,
          },
        ],
        [{ text: `Início do evento: ${getHours(event.date_ini)}` }],
        //   local
        [{ text: `${event.city}, ${event?.uf}` }],
      ],
      widths: ["*"],
    },
    layout: {
      hLineColor: function (i, node) {
        return "#dedede"
      },
      vLineColor: function (i, node) {
        return "#dedede"
      },
      hLineWidth: function (i, node) {
        return i === 0 || i === node.table.body.length ? 1 : 0
      },
      vLineWidth: function (i, node) {
        return i === 0 || i === node.table.widths.length ? 1 : 0
      },
      hLineStyle: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return null
        }
        return { dash: { length: 10, space: 4 } }
      },
      vLineStyle: function (i, node) {
        if (i === 0 || i === node.table.widths.length) {
          return null
        }
        return { dash: { length: 4 } }
      },
      paddingLeft: function () {
        return 10
      },
      paddingRight: function () {
        return 10
      },
      paddingTop: function (i) {
        return i === 0 ? 10 : 2
      },
      paddingBottom: function (i) {
        return i === ticketsLength - 1 ? 10 : 2
      },
    },
  })

  // ticket

  let tableBody = [
    [{ text: "Ingresso", bold: true, style: "tableTitle" }],
    [
      {
        text: `Comprado dia ${formatDate(ticket.date)}`,
        style: "purchaseDate",
      },
    ],
    [
      {
        text: `${ticket.batch_name ?? ""} - ${ticket.name}`,
      },
    ],
    [
      {
        text: format((ticket.price_unit * ticket.quantity) / 100, {
          code: "BRL",
        }),
      },
    ],
  ]

  // nominal
  if (event.nominal && ticket.user) {
    tableBody.push([
      { text: "Participante", bold: true, margin: [0, 16, 0, 0] },
    ])
    tableBody.push([
      { text: ticket.user.name ?? "Não especificado", margin: [0, 0, 0, 16] },
    ])
  }

  tableBody.push([
    {
      qr: `${ticket.qr_data}`,
      style: "qrcode",
    },
  ]) // ticket.qr_data only
  tableBody.push([
    {
      text: ticket.qr_TID,
      style: "qrcodetext",
    },
  ]) // ticket.qr_data only

  body.push({
    style: "eventTable",
    table: {
      body: tableBody,
      widths: ["*"],
    },
    layout: {
      hLineColor: function (i, node) {
        return "#dedede"
      },
      vLineColor: function (i, node) {
        return "#dedede"
      },
      hLineWidth: function (i, node) {
        return i === 0 || i === node.table.body.length ? 1 : 0
      },
      vLineWidth: function (i, node) {
        return i === 0 || i === node.table.widths.length ? 1 : 0
      },
      hLineStyle: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return null
        }
        return { dash: { length: 10, space: 4 } }
      },
      vLineStyle: function (i, node) {
        if (i === 0 || i === node.table.widths.length) {
          return null
        }
        return { dash: { length: 4 } }
      },
      paddingLeft: function (i) {
        return i === 0 ? 10 : 0
      },
      paddingRight: function () {
        return 10
      },
      paddingTop: function (i) {
        return i === 0 ? 5 : i === 1 ? 10 : 2
      },
      paddingBottom: function (i) {
        return i === 0 ? 5 : 2 // and last item
      },
    },
  })

  // info
  body.push({
    style: "eventTable",
    table: {
      body: [
        // event
        [{ text: "INFORMAÇÕES IMPORTANTES", bold: true }],
        [{ text: "", style: "infoAnswer" }],
        [
          {
            text: "1. Esse documento já é seu Ingresso Digital.",
            style: "infoAnswer",
          },
        ],
        [
          {
            text: "2. No dia do evento, basta apresentar o QR Code na portaria (impresso ou no celular).",
            style: "infoAnswer",
          },
        ],
        [{ text: "", style: "infoAnswer" }],
        [
          {
            text: "*** Comprei para mais pessoas. Preciso chegar junto?",
            style: "infoQuestion",
          },
        ],
        [
          {
            text: "Não precisa. Cada ingresso é único e possui seu prório QR Code, podendo ser validado sozinho.",
            style: "infoAnswer",
          },
        ],
        [{ text: "", style: "infoAnswer" }],
        [{ text: "*** Posso imprimir os ingressos?", style: "infoQuestion" }],
        [
          {
            text: "Não é necessário, mas se preferir pode imprimir seus ingressos em uma impressora comum (Papel A4 com fundo branco).",
            style: "infoAnswer",
          },
        ],
      ],
      widths: ["*"],
    },
    layout: {
      hLineColor: function (i, node) {
        return "#dedede"
      },
      vLineColor: function (i, node) {
        return "#dedede"
      },
      hLineWidth: function (i, node) {
        return i === 0 || i === node.table.body.length ? 1 : 0
      },
      vLineWidth: function (i, node) {
        return i === 0 || i === node.table.widths.length ? 1 : 0
      },
      hLineStyle: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return null
        }
        return { dash: { length: 10, space: 4 } }
      },
      vLineStyle: function (i, node) {
        if (i === 0 || i === node.table.widths.length) {
          return null
        }
        return { dash: { length: 4 } }
      },
      paddingLeft: function () {
        return 10
      },
      paddingRight: function () {
        return 10
      },
      paddingTop: function (i) {
        return i === 0 ? 10 : 2
      },
      paddingBottom: function (i) {
        return i === 9 ? 10 : 2
      },
    },
  })

  data = body

  return data
}

export const content = (event, tickets) => {
  let data = []

  // Event content
  data = [
    ...data,
    tickets.map((t, i) => ticketData(event, t, tickets.length, i > 0)),
  ]

  return data
}
