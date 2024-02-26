import { formatDate } from "../../utils/date"
import { format } from "currency-formatter"

export const getTable = (products, totals) => {
  let lines = []

  let sellsCount = 0

  products = products.sort((a, b) => (a.name > b.name ? 1 : -1))

  for (let i in products) {
    const p = products[i]

    let data = [
      p.name,
      p.quantity,
      format(p.price_sell / 100, { code: "BRL" }),
      format(+p.price_total / 100, { code: "BRL" }),
    ]

    lines.push(data)
    sellsCount += p.quantity
  }

  return [
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "Produtos",
              fontSize: 11,
              bold: true,
            },
            {
              text: "Vendidos",
              fontSize: 11,
              bold: true,
            },
            {
              text: "Valor un.",
              fontSize: 11,
              bold: true,
            },
            {
              text: "Total",
              fontSize: 11,
              bold: true,
            },
          ],
          ...lines,
        ],
        widths: ["*", 60, 60, 100],
      },
      margin: [0, 10, 0, 0],
      layout: "headerLineOnly",
    },
    {
      style: "tableExample",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "Totais",
              fontSize: 11,
              bold: true,
            },
            {
              text: sellsCount,
              fontSize: 11,
            },
            "",
          ],
          [
            "",
            "Dinheiro",
            {
              text: format(totals.money / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            "",
            "Débito",
            {
              text: format(totals.debit.net / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            "",
            "Crédito",
            {
              text: format(totals.credit.net / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            "",
            "Pix",
            {
              text: format(totals.pix / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            "",
            {
              text: "Total geral",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(totals.all / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
            },
          ],
        ],
        widths: ["*", 135, 100],
      },
      margin: [0, 10, 0, 0],
      layout: "headerLineOnly",
    },
  ]
}

export const getEventAndFilters = ({
  event,
  dateIni,
  dateEnd,
  operators,
  groupsStr
}) => {

  console.log(dateIni)
  console.log(dateEnd)
  return [
    {
      text: `Evento: ${event.name}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Data de início: ${dateIni}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Data de término: ${dateEnd}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Operador${operators.length > 1 ? "es" : ""}: ${operators.join(
        ", "
      )}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Grupos: ${groupsStr}`,
      fontSize: 12,
      margin: [0, 10, 0, 20],
    },
  ]
}

export const getGroups = (products) => {
  let groups = []

  for (let i in products) {
    const p = products[i]
    if (!groups.includes(p.group_name)) groups.push(p.group_name)
  }

  return groups.sort((a, b) => a > b)
}
