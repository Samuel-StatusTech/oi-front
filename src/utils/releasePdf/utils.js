import { format } from "currency-formatter"

export const logo =
  "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"

export const firstCapital = (word) => {
  let fLetter = word[0].toUpperCase()
  let rest = word.slice(1)

  return fLetter + rest
}

export const getTotal = (releases, totalGross) => {
  let total = 0

  for (let i = 0; i < releases.length; i++) {
    const r = releases[i]

    let val = Number.parseFloat(Number(r.total_value) / 100)
    total = r.operation === "creditar" ? total + val : total - val
  }

  total += totalGross / 100

  return format(total, { code: "BRL" })
}

export const getLists = {
  releases: (rels) => {
    let totals = 0

    const table = rels.map((r) => {
      const unVal = Number.parseFloat(Number(r.unitary_value) / 100)
      const val = Number.parseFloat(Number(r.total_value) / 100)

      totals = totals + Number.parseFloat(Number(r.total_value))

      return [
        r.type,
        r.description,
        Number(r.tax_quantity),
        { text: format(unVal, { code: "BRL" }) },
        {
          text: format(val, { code: "BRL" }),
          style: r.operation === "debitar" ? "debitValue" : "",
        },
      ]
    })

    return { table, totals }
  },
  receipt: ({ money, pix, debit, credit }, total) => {
    return [
      [
        "Dinheiro",
        // `${Math.round((money / total) * 100)}%`,
        format(money / 100, { code: "BRL" }),
      ],
      [
        "Débito",
        // `${Math.round((debit / total) * 100)}%`,
        format(debit / 100, { code: "BRL" }),
      ],
      [
        "Crédito",
        // `${Math.round((credit / total) * 100)}%`,
        format(credit / 100, { code: "BRL" }),
      ],
      [
        "Pix",
        // `${Math.round((pix / total) * 100)}%`,
        format(pix / 100, { code: "BRL" }),
      ],
    ]
  },
  receives: ({
    debitGross,
    debitNet,
    creditGross,
    creditNet,
    pixGross,
    pixNet,
  }) => {
    return [
      [
        "Débito",
        format(debitGross / 100, { code: "BRL" }),
        format(debitNet / 100, { code: "BRL" }),
      ],
      [
        "Crédito",
        format(creditGross / 100, { code: "BRL" }),
        format(creditNet / 100, { code: "BRL" }),
      ],
      [
        "Pix",
        format(pixGross / 100, { code: "BRL" }),
        format(pixNet / 100, { code: "BRL" }),
      ],
    ]
  },
}
