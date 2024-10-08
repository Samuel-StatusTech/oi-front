import { format } from "currency-formatter"

export const getTable = (op) => {
  const total =
    op.payments.pix + op.payments.money + op.payments.credit + op.payments.debit

  let prodsQt = 0
  let prodsTotal = 0

  const prods = op.products.map((p) => {
    prodsQt += p.quantity
    prodsTotal += +p.price_total

    return [
      { text: p.product_name, fontSize: 11 },
      { text: p.quantity, fontSize: 11 },
      { text: format(p.price_unit / 100, { code: "BRL" }), fontSize: 11 },
      { text: format(+p.price_total / 100, { code: "BRL" }), fontSize: 11 },
    ]
  })

  const opBlock = [

    // Payment info
    {
      style: "header",
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: "Vendas",
              style: "headerItem",
              fontSize: 11,
              bold: true,
            },
          ],
          [""],
        ],
        widths: ["*"],
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
              text: "Transação",
              fontSize: 11,
              bold: true,
            },
            {
              text: "Valor",
              fontSize: 11,
              bold: true,
            },
          ],
          [
            {
              text: "Pix",
              fontSize: 11,
            },
            {
              text: format(op.payments.pix / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            {
              text: "Dinheiro",
              fontSize: 11,
            },
            {
              text: format(op.payments.money / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            {
              text: "Débito",
              fontSize: 11,
            },
            {
              text: format(op.payments.debit / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            {
              text: "Crédito",
              fontSize: 11,
            },
            {
              text: format(op.payments.credit / 100, { code: "BRL" }),
              fontSize: 11,
            },
          ],
          [
            {
              text: "Total",
              fontSize: 11,
              bold: true,
            },
            {
              text: format(total / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
            },
          ],
        ],
        widths: ["*", 100],
      },
      margin: [0, 5, 0, 0],
      layout: "noBorders",
    },

    // Products info
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
          ...prods,
          [
            {
              text: "Total",
              fontSize: 11,
              bold: true,
            },
            {
              text: prodsQt,
              fontSize: 11,
              bold: true,
            },
            "",
            {
              text: format(prodsTotal / 100, { code: "BRL" }),
              fontSize: 11,
              bold: true,
            },
          ],
        ],
        widths: ["*", 60, 60, 100],
      },
      margin: [0, 24, 0, 0],
      layout: "headerLineOnly",
    },
  ]

  return opBlock
}

export const getEventAndFilters = ({ event, dateIni, dateEnd, operators }) => {
  return [
    {
      text: `Evento: ${event.name}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Data de início: ${dateIni}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      text: `Data de término: ${dateEnd}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
    {
      text: `Operador${operators.length > 1 ? "es" : ""}: ${operators.join(
        ", "
      )}`,
      fontSize: 12,
      margin: [0, 0, 0, 0],
    },
  ]
}

export const getNames = (users) => {
  let names = []

  users.forEach((user) => {
    names.push(user.user.name)
  })

  return names
}
