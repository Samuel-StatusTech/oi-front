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

import useStyles from "../../../../global/styles"
import Api from "../../../../api"
import axios from "axios"
import { format } from "currency-formatter"
import { formatDateTimeToDB } from "../../../../utils/date"
import releasePDF from "../../../../utils/releasePdf"

import { releasesPerPage } from "../../index"

import returnsTotalIcon from "../../../../assets/icons/ic_total-extornos.svg"
import creditTotalIcon from "../../../../assets/icons/ic_total-credito.svg"
import debitTotalIcon from "../../../../assets/icons/ic_total-debito.svg"
import pixTotalIcon from "../../../../assets/icons/ic_total-pix.svg"
import virtualIcon from "../../../../assets/icons/ic_loja.svg"
import othersIcon from "../../../../assets/icons/ic_outrasdespesas.svg"

import { Between } from "../../../../components/Input/DateTime"
import CardData from "../../../../components/CardData"
import Bar from "../../../../components/Chart/Bar"
import EaseGrid from "../../../../components/EaseGrid"
import FinancialPdfConfigModal from "../../../../components/Modals/FinancialPDFConfig"

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
      <CardContent>
        <Grid
          container
          spacing={2}
          direction="row"
          className={styles.marginT15}
        >
          <Grid item direction="column" lg={12} md={12} sm={12} xs={12}>
            <Grid item xs={12} style={{ marginBottom: 24 }}>
              <Typography className={styles.h2}>Total Receita</Typography>
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
  const {
    user,
    event,
    eventData,
    toggleModal,
    editSingle,
    deleteRelease,
    releases,
  } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [dateDialog, setDateDialog] = useState(false)
  const [loadingReport, setLoadingReport] = useState(false)
  const [selected, onSelectType] = useState(1)
  const [dateIni, setDateIni] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())

  // const [date, setDate] = useState(new Date().setHours(new Date().getHours() + 24))
  const [showTaxes, setShowTaxes] = useState(true)

  const [cardInfo, setCardInfo] = useState()
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
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
        title: "Vendas Dinheiro",
        icon: { src: returnsTotalIcon, alt: "Ícone dinheiro" },
        value: payment.gross.money,
      },
      {
        title: "Vendas Débito",
        icon: { src: debitTotalIcon, alt: "Ícone vendas débito" },
        value: payment.gross.debit,
        smallLabel: (
          <>Líquido: {format(payment.net.debit / 100, { code: "BRL" })}</>
        ),
      },
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
        title: "Loja Virtual",
        icon: { src: virtualIcon, alt: "Ícone loja virtual" },
        value: 0,
        smallLabel: <>Líquido: {format(0, { code: "BRL" })}</>,
      },
      {
        title: "Outras Receitas",
        icon: { src: othersIcon, alt: "Ícone outras receitas" },
        value: 0,
        smallLabel: <>Líquido: {format(0, { code: "BRL" })}</>,
      },
    ],
  }

  const addRelease = async () => {
    toggleModal()
  }

  const exportPdfReleases = async () => {
    setDateDialog(true)
  }

  const genPDF = async (dt) => {
    if (loadingReport) return
    setLoadingReport(true)

    if (eventData && cardInfo)
      releasePDF(
        eventData,
        releases,
        payment,
        dt,
        showTaxes,
        true
      )

    setLoadingReport(false)
    setDateDialog(false)
    setShowTaxes(true)
  }

  const editRelease = async (info) => {
    editSingle(info)
  }

  const columns = [
    {
      title: (
        <Typography style={{ fontWeight: "bold", marginLeft: 15 }}>
          Entrada / Saída
        </Typography>
      ),
      field: "status",
      render: ({ operation }) => {
        const isDebt = operation === "debitar"

        return (
          <td
            className="MuiTableCell-body MuiTableCell-alignLeft MuiTableCell-sizeSmall"
            value={isDebt}
            style={{
              color: "inherit",
              boxSizing: "border-box",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              position: "relative",
              transform: "translate(23px)",
            }}
          >
            <div
              style={{
                backgroundColor: "purple",
                position: "absolute",
                transform: "translate(0px, -5px)",
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 20,
                  background: isDebt ? "#E7345B" : "#0097FF",
                  justifySelf: "center",
                  position: "absolute",
                  transform: "translate(-20px)",
                }}
              />
            </div>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Lançamento</Typography>,
      field: "name",
      render: ({ type }) => (
        <td>
          <span>{type}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Descrição</Typography>,
      field: "description",
      render: ({ description }) => (
        <td>
          <span>{description}</span>
        </td>
      ),
    },
    {
      title: (
        <Typography style={{ fontWeight: "bold" }}>Taxa / Qtde</Typography>
      ),
      field: "tax",
      render: ({ tax_quantity }) => (
        <td>
          <span>{(+tax_quantity) ? parseFloat(tax_quantity) : tax_quantity}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Valor</Typography>,
      field: "value",
      render: ({ total_value, operation }) => {
        const isDebt = operation === "debitar"

        return (
          <td>
            <span style={{ color: isDebt ? "#E7345B" : "#70E080" }}>
              {format(total_value / 100, { code: "BRL" })}
            </span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Ações</Typography>,
      field: "actions",
      render: (info) => (
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button
              onClick={() => editRelease(info)}
              style={{ color: "#FEC87D", border: "1px solid #FEC87D" }}
            >
              Editar
            </Button>
            <Button
              onClick={() => deleteRelease(info)}
              style={{ color: "#E7345B", border: "1px solid #E7345B" }}
            >
              Excluir
            </Button>
          </div>
        </td>
      ),
    },
  ]

  return (
    <>
      <FinancialPdfConfigModal
        show={dateDialog}
        genPDF={genPDF}
        closeFn={() => setDateDialog(false)}
        showTaxes={showTaxes}
        setShowTaxes={setShowTaxes}
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
          <Grid
            item
            container
            style={{
              gap: 24,
            }}
          >
            <Grid container spacing={2}>
              {/* total receita */}
              <Grid item xl={2} lg={2} md={12} sm={12} xs={12}>
                <CardValue infos={cardInfo ?? {}} />
              </Grid>

              {/* cards valores pagamentos */}
              <Grid item lg={6} md={6} xs={12} sm={12}>
                <Grid container spacing={2} wrap="wrap">
                  {infos.infoCards.map((item, index) => (
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={index}>
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

              {/* gráfico pagamentos */}
              <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                <Card
                  style={{
                    display: "flex",
                    height: "100%",
                  }}
                >
                  <Bar
                    money={payment.gross.money / 100}
                    debit={payment.gross.debit / 100}
                    credit={payment.gross.credit / 100}
                    pix={payment.gross.pix / 100}
                    webstore={0}
                    others={0}
                    loading={false}
                  />
                </Card>
              </Grid>
            </Grid>
            <Grid container style={{ flex: 1 }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {releases && (
                  <EaseGrid
                    className={styles.paddingT30}
                    title={
                      <div
                        className={styles.flexRow}
                        style={{
                          gap: 24,
                        }}
                      >
                        <Typography className={styles.h2}>
                          Extrato de lançamentos
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 24,
                          }}
                        >
                          <Button
                            onClick={exportPdfReleases}
                            style={{
                              color: "#0097FF",
                              border: "1px solid #0097FF",
                            }}
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
                          {/* <Button
                            onClick={sendWhatsapp}
                            style={{
                              color: "#0097FF",
                              border: "1px solid #0097FF",
                            }}
                          >
                            Enviar WhatsApp
                          </Button> */}
                          {user.role === "master" && (
                            <Button
                              onClick={addRelease}
                              style={{
                                color: "#0097FF",
                                border: "1px solid #0097FF",
                              }}
                            >
                              Registrar Lançamento
                            </Button>
                          )}
                        </div>
                      </div>
                    }
                    data={releases}
                    columns={columns}
                    loading={loading}
                    paging={releases.length > releasesPerPage}
                    pageSize={releasesPerPage}
                    pageSizeOptions={releasesPerPage}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  )
}
