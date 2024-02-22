import { formatDate } from "../date"

export const generateTable = (products, totals) => {
  let lines = []

  // return [
  //   [
  //     "Vendas",
  //     "Débito",
  //     `${getTaxPercent(debitGross, debitNet)}`,
  //     format(debitGross / 100, { code: "BRL" }),
  //     format(debitNet / 100, { code: "BRL" }),
  //   ],
  //   [
  //     "Vendas",
  //     "Crédito",
  //     `${getTaxPercent(creditGross / creditNet)}`,
  //     format(creditGross / 100, { code: "BRL" }),
  //     format(creditNet / 100, { code: "BRL" }),
  //   ],
  //   [
  //     "Vendas",
  //     "Pix",
  //     `${getTaxPercent(pixGross / pixNet)}`,
  //     format(pixGross / 100, { code: "BRL" }),
  //     format(pixNet / 100, { code: "BRL" }),
  //   ],
  // ]

  return lines
}

export const getEventAndFilters = (event, operators, groupsStr) => {
  return [
    {
      text: `Evento: ${event.name}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Data de início: ${formatDate(event.date_ini)}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Data de término: ${formatDate(event.date_end)}`,
      fontSize: 12,
      margin: [0, 10, 0, 0],
    },
    {
      text: `Operador${operators.length > 1 ? 's' : ''}: ${operators.join(", ")}`,
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
  
  for(let i in products) {
    const p = products[i]
    if (!groups.includes(p.group_name)) groups.push(p.group_name)
  }

  return groups.sort((a, b) => a > b)
}