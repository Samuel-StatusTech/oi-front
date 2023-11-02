import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"

import { format } from "currency-formatter"

import Tooltip from "../../../../../components/Tooltip"
import useStyles from "../../../../../global/styles"

const titles = {
  sales: {
    all: "Vendas Bar",
    bar: "Vendas em Tickets",
    ingresso: "Ingressos",
    estacionamento: "Tickets Estacionamento",
  },
  balance: {
    all: "Vendas Estacionamento",
    bar: "Vendas em Cashless",
    ingresso: "Ingressos Cortesia",
    estacionamento: "Tickets Cortesias",
  },
  balanceCashless: {
    all: "Vendas Ingressos",
    bar: "Ticket Médio",
    ingresso: "Ticket Médio",
    estacionamento: "Ticket Médio",
  },
  salesItems: {
    all: (
      <Tooltip
        title="Faturamento com Mesas, Sobras de Recargas e Outros"
        placement="center"
      >
        Outras Receitas
      </Tooltip>
    ),
    bar: "Itens Vendidos",
    ingresso: "Total de Emitidos",
    estacionamento: "Total Emitidos",
  },
  infoCards: {
    all: "Vendas de Tickets",
    bar: "Itens Vendidos",
    ingresso: "Ingressos",
    estacionamento: "Tickets Estacionamento",
  },
  infoCards1: {
    all: "Saldo Cashless",
    bar: "Saldo Cashless",
    ingresso: "Ingressos Cortesias",
    estacionamento: "Tickets Cortesias",
  },
  infoCards2: {
    all: "Total Itens Vendidos",
    bar: "Total Itens Vendidos",
    ingresso: "Total Emitidos",
    estacionamento: "Total Emitidos",
  },
  infoCards3: {
    all: "Total Itens Cancelados",
    bar: "Total Itens Cancelados",
    ingresso: "Ingressos Cancelados",
    estacionamento: "Tickets Cancelados",
  },
}

const CardValue = ({ productType, infos }) => {
  const styles = useStyles()

  const {
    sales = 0,
    balanceCashless = 0,
    balance = 0,
    salesItems = 0,
    totalRecipe = 0,
  } = infos

  return (
    <Card style={{ height: "100%" }}>
      <CardContent>
        <Grid
          container
          spacing={2}
          direction="row"
          className={styles.marginT15}
        >
          <Grid
            item
            lg={4}
            md={4}
            sm={6}
            xs={12}
            className={`${styles.borderRight}`}
          >
            <Typography className={styles.h2}>Total Receita</Typography>
            <Typography className={styles.moneyLabelBlue}>
              {format(totalRecipe / 100, { code: "BRL" })}
            </Typography>
          </Grid>
          <Grid container item lg={8} md={8} sm={6} xs={12}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>
                {titles["sales"][productType]}
              </Typography>
              <Typography className={styles.moneyLabel}>
                {format(sales / 100, { code: "BRL" })}
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>
                {titles["balance"][productType]}
              </Typography>
              <Typography className={styles.moneyLabel}>
                {productType === "ingresso" || productType === "estacionamento"
                  ? balanceCashless
                  : format(balanceCashless / 100, { code: "BRL" })}
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>
                {titles["balanceCashless"][productType]}
              </Typography>
              <Typography className={styles.moneyLabel}>
                {balance !== null && balance !== Infinity
                  ? format(balance / 100, { code: "BRL" })
                  : "R$ 0,00"}
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>
                {titles["salesItems"][productType]}
              </Typography>
              <Typography className={styles.moneyLabel}>
                {productType !== "all"
                  ? salesItems / 100
                  : format(salesItems / 100, { code: "BRL" })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardValue
