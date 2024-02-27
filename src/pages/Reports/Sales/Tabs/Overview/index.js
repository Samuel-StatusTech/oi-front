import React, { useState, useEffect, useRef } from "react"
import {
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@material-ui/core"

import Api from "../../../../../api"
import axios from "axios"
import { format } from "currency-formatter"

import { ReactComponent as CheckIcon } from "../../../../../assets/icons/check.svg"
import { Between } from "../../../../../components/Input/DateTime"
import Ranking from "../../../../../components/Ranking"
import { formatDate } from "../../../../../utils/date"
import EaseGrid from "../../../../../components/EaseGrid/index"
import useStyles from "../../../../../global/styles"
import Bar from "../../../../../components/Chart/Bar"
import CardValue from "./CardValue"
import sellsPDF from "../../../../../utils/sellsPdf"

export default (props) => {

  const showingBtns = true
  const [loading, setLoading] = useState(false)
  const [loadingReport, setLoadingReport] = useState(false)
  const styles = useStyles()
  const { type: productType, event, selected, onSelectType } = props
  const [groupList, setGroupList] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const columns = [
    { title: "Grupo", field: "group_name" },
    { title: "Produto", field: "name" },
    { title: "Quantidade", field: "quantity" },
    {
      title: "Valor unitário",
      field: "price_sell",
      render: ({ price_sell }) =>
        price_sell == "Variável"
          ? "Variável"
          : format(price_sell / 100, { code: "BRL" }),
    },
    {
      title: "Valor total",
      field: "price_total",
      render: ({ price_total }) => format(price_total / 100, { code: "BRL" }),
    },
  ]

  const [eventData, setEventData] = useState(null)

  const [group, setGroup] = useState("all")
  const [courtesies, setCourtesies] = useState("all")

  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())

  const [cardInfo, setCardInfo] = useState({})
  const [topList, setTopList] = useState([])
  const [products, setProducts] = useState([])
  const [payment, setPayment] = useState({
    money: 0,
    credit: 0,
    debit: 0,
    pix: 0,
  })
  const cancelTokenSource = useRef()

  useEffect(() => {
    Api.get("/group/getList").then(({ data }) => {
      if (data.success) {
        setGroupList(data.groups)
      } else {
        alert("Erro ao buscar a lista de grupos")
      }
    })
    Api.get(`/event/getSelect?status=todos`).then(({ data }) => {
      if (data.success) {
        setEventData(data.events.find(ev => ev.id === event))
      } else {
        alert("Erro ao buscar a lista de eventos")
      }
    })
  }, [])

  const calcRanking = () => {
    let ranking = []

    products.forEach((p) => {
      if (
        ranking.findIndex(
          (rankingItem) =>
            rankingItem.id === p.id &&
            rankingItem.quantity === p.quantity &&
            rankingItem.price_total === p.price_total
        ) < 0
      )
        ranking.push({
          label: p.name,
          quantity: p.quantity,
          value: Number(p.price_total) / 100,
        })
    })

    ranking.sort((a, b) => {
      if (a.quantity > b.quantity) return -1
      if (a.quantity < b.quantity) return 1
      return 0
    })

    const podium = ranking.length > 5 ? ranking.slice(0, 5) : ranking
    setTopList && setTopList(podium)
  }

  useEffect(() => {
    if (productType !== "all") calcRanking()
  }, [products])

  const searchWithoutGroups = async (dateURL, totals) => {
    let prods = []

    const courtesiesURL =
      courtesies && courtesies != "all" ? `&courtesies=1` : ""
    cancelTokenSource.current = axios.CancelToken.source()
    const { data } = await Api.get(
      `/statistical/salesOverview/${event}?type=${productType}${dateURL}${courtesiesURL}`,
      { cancelToken: cancelTokenSource.current.token }
    )

    const total = data.cardInfo.total

    const bar = data.cardInfo.total_bar
    const park = data.cardInfo.total_park
    const tickets = data.cardInfo.total_ticket
    const others = data.cardInfo.sales_items

    const cInfo = {
      totalRecipe: total,
      balanceCashless: park,
      sales: bar,
      balance: tickets,
      salesItems: others,
    }

    totals.cardInfo = {
      totalRecipe: totals.cardInfo.totalRecipe + cInfo.totalRecipe,
      balanceCashless: totals.cardInfo.balanceCashless + cInfo.balanceCashless,
      sales: totals.cardInfo.sales + cInfo.sales,
      balance: Number(totals.cardInfo.balance) + Number(cInfo.balance),
      salesItems: totals.cardInfo.salesItems + cInfo.salesItems,
    }

    if (data.productInfo.productList)
      prods = [...prods, ...data.productInfo.productList]

    const tPayments =
      data.paymentInfo.money +
      data.paymentInfo.credit +
      data.paymentInfo.debit +
      data.paymentInfo.pix

    const percents = {
      money: data.paymentInfo.money / tPayments,
      credit: data.paymentInfo.credit / tPayments,
      debit: data.paymentInfo.debit / tPayments,
      pix: data.paymentInfo.pix / tPayments,
    }

    const vals = {
      money: total * percents.money,
      credit: total * percents.credit,
      debit: total * percents.debit,
      pix: total * percents.pix,
    }

    totals.payments = {
      money: (Number(totals.payments.money) + vals.money).toFixed(2),
      credit: (Number(totals.payments.credit) + vals.credit).toFixed(2),
      debit: (Number(totals.payments.debit) + vals.debit).toFixed(2),
      pix: (Number(totals.payments.pix) + vals.pix).toFixed(2),
    }

    setCardInfo(totals.cardInfo)
    setPayment(totals.payments)

    let filteredProds = []
    prods.forEach((p) => {
      if (
        filteredProds.findIndex(
          (fp) =>
            fp.id === p.id &&
            fp.quantity === p.quantity &&
            fp.price_total === p.price_total
        ) < 0
      )
        filteredProds.push(p)
    })

    setProducts(filteredProds)
  }

  const searchByGroups = async (dateURL, totals) => {
    let prods = []

    for (let i = 1; i <= selectedGroups.length; i++) {
      const grp = selectedGroups[i - 1]

      const gpURL = `&group_id=${grp.id}`
      const courtesiesURL =
        courtesies && courtesies != "all" ? `&courtesies=1` : ""
      cancelTokenSource.current = axios.CancelToken.source()

      const { data: overview } = await Api.get(
        `/statistical/salesOverview/${event}?type=${productType}${dateURL}${gpURL}${courtesiesURL}`,
        { cancelToken: cancelTokenSource.current.token }
      )

      const total = overview.cardInfo.total

      const balanceCashless = overview.cardInfo.total_park
      const sales = overview.cardInfo.total
      const balance =
        productType !== "all"
          ? (total / overview.cardInfo.sales_items) * 100
          : overview.cardInfo.total_ticket
      const salesItems = overview.cardInfo.sales_items

      const cInfo = {
        totalRecipe: total,
        balanceCashless,
        sales,
        balance,
        salesItems,
      }

      const newCardInfo = {
        totalRecipe: totals.cardInfo.totalRecipe + cInfo.totalRecipe,
        balanceCashless:
          totals.cardInfo.balanceCashless + cInfo.balanceCashless,
        sales: totals.cardInfo.sales + cInfo.sales,
        balance: totals.cardInfo.balance + cInfo.balance,
        salesItems: totals.cardInfo.salesItems + cInfo.salesItems,
      }

      totals.cardInfo = newCardInfo

      if (overview.productInfo.productList)
        prods = [...prods, ...overview.productInfo.productList]

      const tPayments =
        overview.paymentInfo.money +
        overview.paymentInfo.credit +
        overview.paymentInfo.debit +
        overview.paymentInfo.pix

      const percents = {
        money: overview.paymentInfo.money / tPayments,
        credit: overview.paymentInfo.credit / tPayments,
        debit: overview.paymentInfo.debit / tPayments,
        pix: overview.paymentInfo.pix / tPayments,
      }

      const vals = {
        money: total * percents.money,
        credit: total * percents.credit,
        debit: total * percents.debit,
        pix: total * percents.pix,
      }

      const newPayments = {
        money: (Number(totals.payments.money) + vals.money).toFixed(2),
        credit: (Number(totals.payments.credit) + vals.credit).toFixed(2),
        debit: (Number(totals.payments.debit) + vals.debit).toFixed(2),
        pix: (Number(totals.payments.pix) + vals.pix).toFixed(2),
      }
      totals.payments = newPayments

      if (i === selectedGroups.length) {
        setCardInfo(totals.cardInfo)
        setPayment(totals.payments)

        let filteredProds = []
        prods.forEach((p) => {
          if (
            filteredProds.findIndex(
              (fp) =>
                fp.id === p.id &&
                fp.quantity === p.quantity &&
                fp.price_total === p.price_total
            ) < 0
          )
            filteredProds.push(p)
        })

        setProducts(filteredProds)
      }
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {
        cancelTokenSource.current = axios.CancelToken.source()

        const dI = new Date(dateIni).toISOString()
        const dE = new Date(dateEnd).toISOString()
        const dateURL = selected !== 1 ? `&date_ini=${dI}&date_end=${dE}` : ""

        let totals = {
          cardInfo: {
            totalRecipe: 0,
            balanceCashless: 0,
            sales: 0,
            balance: 0,
            salesItems: 0,
          },
          payments: {
            money: 0,
            credit: 0,
            debit: 0,
            pix: 0,
          },
        }

        if (productType && productType === "all") {
          searchWithoutGroups(dateURL, totals)
        } else {
          if (selectedGroups.length === 0) searchWithoutGroups(dateURL, totals)
          else searchByGroups(dateURL, totals)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedGroups([])
  }, [productType])

  useEffect(() => {
    if (selected != 2) {
      onSearch()
    }
  }, [event, selected, productType, selectedGroups, courtesies])

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

  const exportPdfReport = async () => {
    if (loadingReport) return
    setLoadingReport(true)

    const totals = {
      money: payment.money,
      debit: {
        net: payment.debit,
      },
      credit: {
        net: payment.credit,
      },
      pix: payment.pix,
      all: +payment.money + +payment.debit + +payment.credit + +payment.pix
    }

    sellsPDF({
      event: eventData,
      products,
      isAllGroups: selectedGroups.length === 0,
      dateIni: getDateIni(),
      dateEnd: getDateEnd(),
      operators: ["Todos"],
      totals,
      mustDownload: true,
    })

    setLoadingReport(false)
  }

  const handleGrupoSelect = (groupId) => {
    setPayment({
      money: 0,
      credit: 0,
      debit: 0,
      pix: 0,
    })

    const grp = groupList.find((g) => g.id === groupId)
    if (grp) {
      if (selectedGroups.findIndex((g) => g.id === grp.id) < 0) {
        setSelectedGroups([...selectedGroups, grp])
      } else {
        setSelectedGroups([...selectedGroups.filter((g) => g.id !== grp.id)])
      }
    }
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          {productType !== "all" ? (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  <TextField
                    value={"all"}
                    onChange={(e) => handleGrupoSelect(e.target.value)}
                    label="Grupo"
                    variant="outlined"
                    size="small"
                    select
                    fullWidth
                  >
                    <MenuItem value="all" style={{ display: "none" }}>
                      Selecione os grupos
                      {`${
                        selectedGroups.length > 0
                          ? ` (${selectedGroups.length})`
                          : ""
                      }`}
                    </MenuItem>
                    {groupList
                      .filter((group) => {
                        if (group.type === productType) return true
                        return false
                      })
                      .sort((a, b) =>
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                      )
                      .map((group, k) => {
                        return (
                          <MenuItem
                            key={k}
                            value={group.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 4,
                              paddingHorizontal: 6,
                            }}
                          >
                            <span style={{ fontSize: 16 }}>{group.name}</span>
                            <div
                              style={{
                                borderRadius: 4,
                                border: 2,
                                borderStyle: "solid",
                                borderColor: "#121212",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 24,
                                height: 24,
                              }}
                            >
                              {selectedGroups.includes(group) ? (
                                <CheckIcon width={18} height={18} />
                              ) : null}
                            </div>
                          </MenuItem>
                        )
                      })}
                  </TextField>
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  <TextField
                    value={courtesies}
                    onChange={(e) => setCourtesies(e.target.value)}
                    label="Produtos"
                    variant="outlined"
                    size="small"
                    select
                    fullWidth
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="courtesies">Somente Cortesias</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  {showingBtns && (
                    <Button
                      onClick={exportPdfReport}
                      style={{ color: "#0097FF", border: "1px solid #0097FF" }}
                    >
                      {loadingReport ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress size={20} color="#0097FF" />
                        </div>
                      ) : (
                        "Gerar PDF"
                      )}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {showingBtns && (
                <Button
                  onClick={exportPdfReport}
                  style={{ color: "#0097FF", border: "1px solid #0097FF" }}
                >
                  {loadingReport ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={20} color="#0097FF" />
                    </div>
                  ) : (
                    "Gerar PDF"
                  )}
                </Button>
              )}
            </Grid>
          )}

          <Grid item lg={12} md={12} sm={12} xs={12}>
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
        <Grid item container>
          <Grid container spacing={2}>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
              <CardValue productType={productType} infos={cardInfo} />
            </Grid>
            <Grid
              item
              xl={productType !== "all" ? 3 : 6}
              lg={6}
              md={12}
              sm={12}
              xs={12}
            >
              <Card
                style={{
                  display: "flex",
                  height: "100%",
                }}
              >
                <Bar
                  money={payment.money / 100}
                  debit={payment.debit / 100}
                  credit={payment.credit / 100}
                  pix={payment.pix / 100}
                  webstore={0}
                  others={0}
                  loading={false}
                />
              </Card>
            </Grid>
            {productType !== "all" && (
              <Grid item xl={3} lg={6} md={12} sm={12} xs={12}>
                <Card className={styles.fullHeight}>
                  <CardContent>
                    <Ranking title={"Mais Vendidos"} ranking={topList} />
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12}>
              <EaseGrid columns={columns} data={products} pageSize={10} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
