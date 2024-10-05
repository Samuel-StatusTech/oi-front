/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"
import { format } from "currency-formatter"

import creditTotalIcon from "../../../../../assets/icons/ic_total-credito.svg"
import pixTotalIcon from "../../../../../assets/icons/ic_total-pix.svg"
import withdrawIcon from "../../../../../assets/icons/ic_sangria.svg"
import totalIcon from "../../../../../assets/icons/ic_total.svg"

import { Between } from "../../../../../components/Input/DateTime"
import CardData from "../../../../../components/CardData"
import Area from "../../../../../components/Chart/Area"
import DailySellsModal from "../../../../../components/Modals/DailySellsModal"
import { formatDate, parseUrlDate } from "../../../../../utils/date"
import Pizza from "../../../../../components/Chart/Pizza"
import EaseGrid from "../../../../../components/EaseGrid"
import webstoreOverviewPDF from "../../../../../utils/webstoreOverview"

import Api from "../../../../../api"


// ---

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
            <Grid item xs={12} style={{ marginTop: -8 }}>
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


// ---

const Overview = (props) => {

  const { loadData, event, payment, productsList, histData, soldTickets } = props

  const totalRecipe = payment.gross.pix + payment.gross.credit

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [selected, onSelectType] = useState(1)
  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date().setHours(new Date().getHours() + 24))

  const [eventData, setEventData] = useState(null)

  const [dailyShow, setDailyModalShow] = useState(false)

  const [dailySells, setDailySells] = useState({
    columns: [
      {
        title: <Typography style={{ fontWeight: "bold" }}>Data</Typography>,
        field: "date",
        render: ({ timeLabel }) => (
          <td>
            <span style={{ fontSize: "0.9rem" }}>{formatDate(timeLabel)}</span>
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
    ], list: []
  })

  const cancelTokenSource = useRef()
  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {

        let filters = ""

        const dateIniFormatted = parseUrlDate(dateIni)
        const dateEndFormatted = parseUrlDate(dateEnd)

        const dateURL =
          selected !== 1
            ? `?dateStart=${dateIniFormatted}&dateEnd=${dateEndFormatted}`
            : `?dateStart=2020-01-01&dateEnd=${parseUrlDate(new Date().setHours(new Date().getHours() + 24)).replace("/", "-")}`

        filters = dateURL
        loadData(filters)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setDailySells(ds => ({ ...ds, list: histData }))
  }, [histData])

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

  const toggleModal = () => {
    setDailyModalShow(!dailyShow)
  }

  const infos = {
    infoCards: [
      {
        title: "Vendas Crédito",
        icon: { src: creditTotalIcon, alt: "Ícone vendas crédito" },
        value: payment.gross.credit,
        // smallLabel: (
        //   <>Líquido: {format(payment.net.credit / 100, { code: "BRL" })}</>
        // ),
      },
      {
        title: "Vendas Pix",
        icon: { src: pixTotalIcon, alt: "Ícone vendas pix" },
        value: payment.gross.pix,
        // smallLabel: (
        //   <>Líquido: {format(payment.net.pix / 100, { code: "BRL" })}</>
        // ),
      },
      {
        title: "Retiradas",
        icon: { src: withdrawIcon, alt: "Ícone Retiradas" },
        value: payment.withdraw,
      },
      {
        title: "Saldo",
        icon: { src: totalIcon, alt: "Ícone saldo" },
        value: totalRecipe
      },
    ],
  }

  const getDateIni = () => {
    if (selected === 0) {
      return "Hoje"
    } else {
      if (selected === 1) {
        return "Todo o período"
      } else if (selected === 2) {
        return formatDate(dateIni)
      }
    }
  }

  const getDateEnd = () => {
    if (selected === 0) {
      return "Hoje"
    } else {
      if (selected === 1) {
        return "Todo o período"
      } else if (selected === 2) {
        return formatDate(dateEnd)
      }
    }
  }

  const generatePDF = async () => {

    setLoadingPdf(true)

    try {

      await webstoreOverviewPDF({
        event: eventData,
        dateIni: getDateIni(),
        dateEnd: getDateEnd(),
        mustDownload: true,
        resume: {
          pix: payment.gross.pix,
          credit: payment.gross.credit ?? 0,
          total: payment.gross.pix + (payment.gross.credit ?? 0)
        },
        dailySells: histData,
        products: productsList
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingPdf(false)
    }

  }

  useEffect(() => {
    Api.get(`/event/getSelect?status=todos`).then(({ data }) => {
      if (data.success) {
        setEventData(data.events.find((ev) => ev.id === event))
      } else {
        alert("Erro ao buscar a lista de eventos")
      }
    })
  }, [])

  return (
    <>
      <DailySellsModal
        show={dailyShow}
        closeFn={toggleModal}
        data={dailySells}
        soldTickets={props.soldTickets}
      />

      <Grid
        container
        direction="column"
        spacing={2}
        style={{
          height: "100%",
          gap: 24,
        }}
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={10} md={10} sm={12} xs={12}>
              <Between
                iniValue={dateIni}
                endValue={dateEnd}
                onChangeIni={setDateIni}
                onChangeEnd={setDateEnd}
                selected={selected}
                onSelectType={onSelectType}
                onDownloadClick={generatePDF}
                size="small"
                onSearch={onSearch}
              />
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <Button
                className={styles.exportDataBtn}
                style={{ width: "100%" }}
                onClick={loadingPdf ? () => { } : generatePDF}
              >
                {loadingPdf ? "Carregando..." : "Baixar PDF"}
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
          <Grid item container style={{ gap: 24 }} spacing={2}>
            <Grid item container spacing={2} style={{ height: "fit-content" }}>
              {/* total receita */}
              <Grid item xl={2} lg={2} md={12} sm={12} xs={12}>
                <CardValue infos={{ totalRecipe }} />
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
                      history={dailySells.list.length === 1 ? [
                        {
                          x: 0,
                          y: 0,
                          qnt: 0,
                          timeLabel: new Date(`${new Date().getFullYear()
                            }-${String(new Date().getMonth() + 1).padStart(2, '0')
                            }-${String(new Date().getDate() - 1).padStart(2, '0')
                            }`).getTime()
                        },
                        { ...dailySells.list[0], x: 1 }
                      ] : dailySells.list}
                      total={1}
                      toggleDailyModal={toggleModal}
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
                      series={[payment.gross.pix, payment.gross.credit]}
                      type={"pie"}
                      total={payment.gross.pix + payment.gross.credit}
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
              data={productsList}
              columns={[
                {
                  title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
                  field: "product_name",
                  render: ({ product_name }) => (
                    <td>
                      <span>{product_name}</span>
                    </td>
                  ),
                },
                {
                  title: <Typography style={{ fontWeight: "bold" }}>Lote</Typography>,
                  field: "batch_name",
                  render: ({ batch_name }) => {

                    return (
                      <td>
                        <span>{batch_name}</span>
                      </td>
                    )
                  },
                },
                {
                  title: <Typography style={{ fontWeight: "bold" }}>QNTE</Typography>,
                  field: "sold_quantity",
                  render: ({ sold_quantity }) => {

                    return (
                      <td>
                        <span>{sold_quantity}</span>
                      </td>
                    )
                  },
                },
                {
                  title: <Typography style={{ fontWeight: "bold" }}>Valor un.</Typography>,
                  field: "price_unit",
                  render: ({ price_unit }) => {

                    return (
                      <td>
                        <span>{format(price_unit / 100, { code: "BRL" })}</span>
                      </td>
                    )
                  },
                },
                {
                  title: <Typography style={{ fontWeight: "bold" }}>Valor</Typography>,
                  field: "price_total",
                  render: ({ price_total }) => {

                    return (
                      <td>
                        <span>{format(price_total / 100, { code: "BRL" })}</span>
                      </td>
                    )
                  },
                },
              ]}
              paging={false}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default Overview