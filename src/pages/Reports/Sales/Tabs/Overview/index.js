import React, { useState, useEffect, useRef, useMemo } from "react"
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
import firebase from "../../../../../firebase"
import axios from "axios"
import { format } from "currency-formatter"

import { ReactComponent as CloseIcon } from "../../../../../assets/icons/close.svg"
import { ReactComponent as CheckIcon } from "../../../../../assets/icons/check.svg"
import { Between } from "../../../../../components/Input/DateTime"
import Tooltip from "../../../../../components/Tooltip"
import Ranking from "../../../../../components/Ranking"
import { formatDateTimeToDB } from "../../../../../utils/date"
import EaseGrid from "../../../../../components/EaseGrid/index"
import useStyles from "../../../../../global/styles"
import Bar from "../../../../../components/Chart/Bar"
import CardValue from "./CardValue"

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
  }, [])

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (event) {
        const dI = new Date(dateIni).getTime()
        const dE = new Date(dateEnd).getTime()

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

        if (productType && productType === "bar") {
          // bar

          for (let i = 0; i <= selectedGroups.length; i++) {
            const grp = selectedGroups[i]

            const groupURL = grp ? `&group_id=${grp.id}` : ""
            const courtesiesURL =
              courtesies && courtesies != "all" ? `&courtesies=1` : ""
            cancelTokenSource.current = axios.CancelToken.source()

            if (groupURL.length === 0 && grp) {
              const { data: overview } = await Api.get(
                `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
                { cancelToken: cancelTokenSource.current.token }
              )

              const total = overview.cardInfo.total

              const totalRecipe = total
              const balanceCashless = overview.cardInfo.total_park
              const sales = overview.cardInfo.total
              const balance =
                productType !== "all"
                  ? (total / overview.cardInfo.sales_items) * 100
                  : overview.cardInfo.total_ticket
              const salesItems = overview.cardInfo.sales_items

              const topListMap = overview.productInfo.topList.map((item) => {
                return { label: item.name, value: item.quantity }
              })

              const cInfo = {
                totalRecipe,
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
              console.log(totals, newCardInfo)
              totals.cardInfo = newCardInfo

              setTopList(topListMap) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
              if (overview.productInfo.productList)
                setProducts(
                  overview.productInfo.productList.sort((a, b) =>
                    a.name.localeCompare(b.name)
                  )
                )

              const newPayments = {
                money: totals.payments.money + overview.paymentInfo.money,
                credit: totals.payments.credit + overview.paymentInfo.credit,
                debit: totals.payments.debit + overview.paymentInfo.debit,
                pix: totals.payments.pix + overview.paymentInfo.pix,
              }
              totals.payments = newPayments

              setCardInfo(totals.cardInfo)
              setPayment(totals.payments)
            } else {
              // selected groups











              
              cancelTokenSource.current = axios.CancelToken.source()
              const { data } = await Api.get(
                `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
                { cancelToken: cancelTokenSource.current.token }
              )

              const total = data.cardInfo.total

              const totalRecipe = total
              const balanceCashless = data.cardInfo.total_park
              const sales = total

              const balance =
                productType !== "all"
                  ? ((total / data.cardInfo.sales_items) * 100).toFixed(2)
                  : data.cardInfo.total_park
              const salesItems = data.cardInfo.sales_items

              const topListMap = data.productInfo.topList.map((item) => {
                return { label: item.name, value: item.quantity }
              })

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
                balanceCashless:
                  totals.cardInfo.balanceCashless + cInfo.balanceCashless,
                sales: totals.cardInfo.sales + cInfo.sales,
                balance:
                  Number(totals.cardInfo.balance) + Number(cInfo.balance),
                salesItems: totals.cardInfo.salesItems + cInfo.salesItems,
              }




















              setTopList(topListMap)
              if (data.productInfo.productList)
                setProducts(
                  data.productInfo.productList.sort((a, b) =>
                    a.name.localeCompare(b.name)
                  )
                )

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
                money: totalRecipe * percents.money,
                credit: totalRecipe * percents.credit,
                debit: totalRecipe * percents.debit,
                pix: totalRecipe * percents.pix,
              }

              totals.payments = {
                money: (Number(totals.payments.money) + vals.money).toFixed(2),
                credit: (Number(totals.payments.credit) + vals.credit).toFixed(
                  2
                ),
                debit: (Number(totals.payments.debit) + vals.debit).toFixed(2),
                pix: (Number(totals.payments.pix) + vals.pix).toFixed(2),
              }
            }

            if(selectedGroups.length > 0) {
              if (i === selectedGroups.length - 1) {
                setCardInfo(totals.cardInfo)
                setPayment(totals.payments)
              }
            } else {
              if (i === selectedGroups.length) {
                setCardInfo(totals.cardInfo)
                setPayment(totals.payments)
              }
            }
          }
        } else {
          // geral
          const groupURL = group && group !== "all" ? `&group_id=${group}` : ""
          const courtesiesURL =
            courtesies && courtesies != "all" ? `&courtesies=1` : ""
          cancelTokenSource.current = axios.CancelToken.source()

          if (groupURL.length === 0) {
            const { data: overview } = await Api.get(
              `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
              { cancelToken: cancelTokenSource.current.token }
            )

            const total = overview.cardInfo.total

            const balance =
              productType !== "all"
                ? (total / overview.cardInfo.sales_items) * 100
                : overview.cardInfo.total_ticket

            const topListMap = overview.productInfo.topList.map((item) => {
              return { label: item.name, value: item.quantity }
            })

            const bar = overview.cardInfo.total_bar
            const park = overview.cardInfo.total_park
            const tickets = overview.cardInfo.total_ticket
            const others = overview.cardInfo.sales_items

            const cInfo = {
              totalRecipe: total,
              balanceCashless: park,
              sales: bar,
              balance: tickets,
              salesItems: others,
            }
            setCardInfo(cInfo)
            setTopList(topListMap)
            if (overview.productInfo.productList)
              setProducts(
                overview.productInfo.productList.sort((a, b) =>
                  a.name.localeCompare(b.name)
                )
              )

            console.log("ÇADJÇALSKDJ", overview.paymentInfo)

            // payments
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
              money: (total * percents.money).toFixed(2),
              credit: (total * percents.credit).toFixed(2),
              debit: (total * percents.debit).toFixed(2),
              pix: (total * percents.pix).toFixed(2),
            }

            setPayment(vals)
          } else {
            cancelTokenSource.current = axios.CancelToken.source()
            console.log(productType)
            const { data } = await Api.get(
              `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
              { cancelToken: cancelTokenSource.current.token }
            )

            const total = data.cardInfo.total
            const bar = data.cardInfo.total_bar
            const park = data.cardInfo.total_park
            const tickets = data.cardInfo.total_ticket
            const others = data.cardInfo.sales_items

            const totalRecipe = total
            const balanceCashless = data.cardInfo.total_park
            const sales = data.cardInfo.total_bar

            const balance =
              productType !== "all"
                ? ((total / data.cardInfo.sales_items) * 100).toFixed(2)
                : data.cardInfo.total_park
            const salesItems = data.cardInfo.sales_items

            const topListMap = data.productInfo.topList.map((item) => {
              return { label: item.name, value: item.quantity }
            })

            console.log("HERE")
            setCardInfo({
              totalRecipe: total,
              balanceCashless: bar,
              sales: 0,
              balance: 0,
              salesItems: 0,
            })
            setTopList(topListMap)
            if (data.productInfo.productList)
              setProducts(
                data.productInfo.productList.sort((a, b) =>
                  a.name.localeCompare(b.name)
                )
              )

            // payments
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
              money: (totalRecipe * percents.money).toFixed(2),
              credit: (totalRecipe * percents.credit).toFixed(2),
              debit: (totalRecipe * percents.debit).toFixed(2),
              pix: (totalRecipe * percents.pix).toFixed(2),
            }

            setPayment(vals)
          }
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selected != 2) {
      onSearch()
    }
  }, [event, selected, productType, selectedGroups])

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

  const exportPdfReport = async () => {
    if (loadingReport) return
    setLoadingReport(true)
    Api.post(`/reportPDF/product`, {
      event,
      dateIni: selected !== 1 ? formatDateTimeToDB(dateIni) : "",
      dateEnd: selected !== 1 ? formatDateTimeToDB(dateEnd) : "",
    })
      .then(({}) => {
        firebase
          .storage()
          .ref(`reports/${event}/all.pdf`)
          .getDownloadURL()
          .then(function (url) {
            setLoadingReport(false)
            window.open(url, "_blank")
          })
      })
      .catch((error) => {
        setLoadingReport(false)
        console.log({ error })
      })
  }

  const exportPdfReportByType = async () => {
    if (loadingReport) return
    setLoadingReport(true)
    Api.post(`/reportPDF/product`, {
      event,
      group,
      productType,
      courtesies: courtesies && courtesies != "all" ? courtesies : 0,
      dateIni: selected !== 1 ? formatDateTimeToDB(dateIni) : "",
      dateEnd: selected !== 1 ? formatDateTimeToDB(dateEnd) : "",
    })
      .then(({}) => {
        firebase
          .storage()
          .ref(`reports/${event}/all.pdf`)
          .getDownloadURL()
          .then(function (url) {
            setLoadingReport(false)
            window.open(url, "_blank")
          })
      })
      .catch((error) => {
        setLoadingReport(false)
        console.log({ error })
      })
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
        // setGroupList([...groupList].filter((g) => g.id !== grp.id))
      } else {
        setSelectedGroups([...selectedGroups.filter((g) => g.id !== grp.id)])
        // setGroupList([...groupList].filter((g) => g.id !== grp.id))
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
                      onClick={exportPdfReportByType}
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
