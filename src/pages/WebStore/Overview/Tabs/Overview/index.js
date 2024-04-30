/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"
import Api from "../../../../../api"
import axios from "axios"
import { format } from "currency-formatter"
import { formatDateTimeToDB } from "../../../../../utils/date"
import { setSizeOptions } from '../../../../../utils/tablerows'

import creditTotalIcon from "../../../../../assets/icons/ic_total-credito.svg"
import pixTotalIcon from "../../../../../assets/icons/ic_total-pix.svg"
import withdrawIcon from "../../../../../assets/icons/ic_sangria.svg"
import totalIcon from "../../../../../assets/icons/ic_total.svg"

import { Between } from "../../../../../components/Input/DateTime"
import CardData from "../../../../../components/CardData"
import Area from "../../../../../components/Chart/Area"
import DailySellsModal from "../../../../../components/Modals/DailySellsModal"
import { formatDate } from "../../../../../utils/date"
import Pizza from "../../../../../components/Chart/Pizza"
import EaseGrid from "../../../../../components/EaseGrid"

const CardValue = ({ infos, editSingle }) => {
  const styles = useStyles()

  const {
    totalRecipe = 0,
  } = infos

  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardContent style={{ paddingBottom: 0 }}>
        <Grid
          container
          spacing={2}
          direction="row"
        >
          <Grid item direction="column" lg={12} md={12} sm={12} xs={12}>
            <Grid item xs={12} style={{ marginTop: -24 }}>
              <Typography className={styles.h2}>Total de vendas</Typography>
              <Typography className={styles.moneyLabelBlue}>
                {" "}
                {format(totalRecipe / 100, { code: "BRL" })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default (props) => {
  const { event } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [selected, onSelectType] = useState(1)
  const [groups, setGroups] = useState([])
  const [group, setGroup] = useState("todos")
  const [tickets, setTickets] = useState([])
  const [ticket, setTicket] = useState("todos")
  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [dailyShow, setDailyModalShow] = useState(false)
  const [prodsGrid, setProdsGrid] = useState({ columns: [], list: [] })
  const [dailySells, setDailySells] = useState({ columns: [], list: [] })
  const [payments, setPayments] = useState({ pix: 0, credit: 0 })

  const [cardInfo, setCardInfo] = useState()
  const [history, setHistory] = useState([])

  const [payment, setPayment] = useState({
    gross: {
      money: 0,
      credit: 0,
      debit: 0,
      pix: 0,
    },
    net: {
      credit: 0,
      debit: 0,
      pix: 0,
    },
  })
  const cancelTokenSource = useRef()

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {
        const dateIniFormatted = formatDateTimeToDB(dateIni)
        const dateEndFormatted = formatDateTimeToDB(dateEnd)

        const dateURL =
          selected !== 1
            ? `?date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}`
            : ""

        cancelTokenSource.current = axios.CancelToken.source()
        const { data } = await Api.get(
          `/statistical/financialOverview/${event}${dateURL}`,
          { cancelToken: cancelTokenSource.current.token }
        )
        setPayment(data.paymentInfo)
        setCardInfo(data.cardInfo)

        const histData = [
          {
            x: new Date('2024-04-25').getTime(),
            y: 7600,
            qnt: 64
          },
          {
            x: new Date('2024-04-26').getTime(),
            y: 5400,
            qnt: 42
          },
          {
            x: new Date('2024-04-27').getTime(),
            y: 8800,
            qnt: 88
          },
          {
            x: new Date('2024-04-28').getTime(),
            y: 9000,
            qnt: 79
          },
          {
            x: new Date('2024-04-29').getTime(),
            y: 9200,
            qnt: 54
          },
          {
            x: new Date('2024-04-30').getTime(),
            y: 9400,
            qnt: 91
          },
          {
            x: new Date('2024-05-01').getTime(),
            y: 9600,
            qnt: 120
          },
        ]

        setHistory(histData)

        setDailySells({
          columns: [
            {
              title: <Typography style={{ fontWeight: "bold" }}>Data</Typography>,
              field: "date",
              render: ({ x }) => (
                <td>
                  <span style={{ fontSize: "0.9rem" }}>{formatDate(x)}</span>
                </td>
              ),
            },
            {
              title: <Typography style={{ fontWeight: "bold" }}>Quantidade</Typography>,
              field: "quantity",
              render: ({ qnt }) => (
                <td>
                  <span>{qnt}</span>
                </td>
              ),
            },
            {
              title: <Typography style={{ fontWeight: "bold" }}>Valor</Typography>,
              field: "value",
              render: ({ y }) => {

                return (
                  <td>
                    <span style={{ color: "#70E080" }}>
                      {format(y / 100, { code: "BRL" })}
                    </span>
                  </td>
                )
              },
            },
          ],
          list: histData
        })

        const prodsCols = [
          {
            title: <Typography style={{ fontWeight: "bold" }}>Grupo</Typography>,
            field: "group",
            render: ({ group_name }) => (
              <td>
                <span>{group_name}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
            field: "quantity",
            render: ({ name }) => (
              <td>
                <span>{name}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Lote</Typography>,
            field: "lot",
            render: ({ lot }) => {

              return (
                <td>
                  <span>{lot}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>QNTE</Typography>,
            field: "qnt",
            render: ({ qnt }) => {

              return (
                <td>
                  <span>{qnt}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Valor un.</Typography>,
            field: "un_value",
            render: ({ un_value }) => {

              return (
                <td>
                  <span>{format(un_value / 100, { code: "BRL" })}</span>
                </td>
              )
            },
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Valor</Typography>,
            field: "value",
            render: ({ value }) => {

              return (
                <td>
                  <span>{format(value / 100, { code: "BRL" })}</span>
                </td>
              )
            },
          },
        ]

        const prodsList = [
          {
            group_name: "Teste",
            name: "Ingresso teste",
            lot: "A111",
            qnt: 20,
            un_value: 1200,
            value: 24000
          },
          {
            group_name: "Teste",
            name: "Ingresso 2",
            lot: "A111",
            qnt: 20,
            un_value: 1200,
            value: 24000
          },
          {
            group_name: "Teste",
            name: "Ingresso 3",
            lot: "A111",
            qnt: 20,
            un_value: 1200,
            value: 24000
          },
        ]

        setProdsGrid({
          columns: prodsCols,
          list: prodsList
        })

        setPayments({
          pix: 300000,
          credit: 284000
        })

        setGroups([])
        setTickets([])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPdfData = () => {
    if (!loading) {
      // ...
    }
  }

  useEffect(() => {
    if (selected !== 2) {
      onSearch()
    }
  }, [event, selected])

  const onSearch = () => {
    if (cancelTokenSource && cancelTokenSource.current) {
      cancelTokenSource.current.cancel()
      setTimeout(() => {
        handleSearch()
      }, 500)
    } else {
      handleSearch()
    }
  }

  const infos = {
    infoCards: [
      {
        title: "Vendas Crédito",
        icon: { src: creditTotalIcon, alt: "Ícone vendas crédito" },
        value: payment.gross.credit,
        smallLabel: (
          <>Líquido: {format(payment.net.credit / 100, { code: "BRL" })}</>
        ),
      },
      {
        title: "Vendas Pix",
        icon: { src: pixTotalIcon, alt: "Ícone vendas pix" },
        value: payment.gross.pix,
        smallLabel: (
          <>Líquido: {format(payment.net.pix / 100, { code: "BRL" })}</>
        ),
      },
      {
        title: "Retiradas",
        icon: { src: withdrawIcon, alt: "Ícone Retiradas" },
        value: payment.gross.money,
      },
      {
        title: "Saldo",
        icon: { src: totalIcon, alt: "Ícone saldo" },
        value: payment.gross.debit,
      },
    ],
  }

  return (
    <>
      <DailySellsModal
        show={dailyShow}
        closeFn={() => setDailyModalShow(false)}
        data={dailySells}
        date={new Date()}
      />

      <Grid
        container
        direction="column"
        spacing={24}
        style={{
          height: "100%",
          gap: 24,
        }}
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={1} md={2} sm={12} xs={12}>
              <TextField
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                label='Grupo'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                {groups.map((g, k) => (
                  <MenuItem value={g.id} key={k}>{g.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item lg={1} md={2} sm={12} xs={12}>
              <TextField
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                label='Ingresso'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                {tickets.map((t, k) => (
                  <MenuItem value={t.id} key={k}>{t.name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item lg={9} md={9} sm={10} xs={10}>
              <Between
                iniValue={dateIni}
                endValue={dateEnd}
                onChangeIni={setDateIni}
                onChangeEnd={setDateEnd}
                selected={selected}
                onSelectType={onSelectType}
                onSearch={onSearch}
                size="small"
              />
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1}>
              <Button
                className={styles.exportDataBtn}
                style={{ width: "100%" }}
                onClick={loading ? () => { } : downloadPdfData}
              >
                {loading ? "Carregando..." : "Baixar PDF"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Grid
            item
            container
            style={{
              gap: 24,
            }}
            spacing={2}
          >
            <Grid container spacing={2}>
              {/* total receita */}
              <Grid item xl={2} lg={2} md={12} sm={12} xs={12}>
                <CardValue infos={cardInfo ?? {}} />
              </Grid>

              {/* cards valores pagamentos */}
              <Grid item lg={10} md={10} xs={12} sm={12} style={{
                height: "100%",
                padding: 0
              }}>
                <Grid container spacing={2} wrap="wrap" style={{
                  margin: 0,
                  height: "100%",
                  width: "100%"
                }}>
                  {infos.infoCards.map((item, index) => (
                    <Grid item xl={3} lg={3} md={6} sm={6} xs={12} key={index}>
                      <CardData
                        title={item.title}
                        smallLabel={item.smallLabel}
                        value={format(item.value / 100, { code: "BRL" })}
                        styleLabel={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                        icon={item.icon}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            <Grid container style={{ flex: 1 }} spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>

                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Card
                    style={{
                      display: "flex",
                      height: "100%",
                    }}
                  >
                    <Area
                      history={history}
                      total={1}
                      toggleDailyModal={() => setDailyModalShow(true)}
                    />
                  </Card>

                  {/* ------------------------- */}

                </Grid>

              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>

                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Card
                    style={{
                      display: "flex",
                      minheight: "100%",
                    }}
                  >
                    <Pizza
                      labels={["Pix", "Crédito"]}
                      series={Object.entries(payments).map(p => p[1])}
                      type={"pie"}
                      total={payments.pix + payments.credit}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {!loading && (
          <Grid item spacing={2} lg={12} md={12} sm={12} xs={12}>
            <EaseGrid
              className={styles.paddingT30}
              title={
                <div className={styles.flexRow}>
                  <Typography className={styles.h2}>Produtos vendidos</Typography>
                </div>
              }
              data={prodsGrid.list}
              columns={prodsGrid.columns}
              pageSize={prodsGrid.list.length}
              pageSizeOptions={setSizeOptions(prodsGrid.list.length)}
              paging={true}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}
