import React, { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { connect } from "react-redux"
import { Grid, CircularProgress } from "@material-ui/core"
import { format } from "currency-formatter"

import EaseGrid from "../../../components/EaseGrid"
import { Between } from "../../../components/Input/DateTime"

import { formatDateTimeToDB } from "../../../utils/date"
import Api from "../../../api"

import PaymentTypeColumn from "./Columns/PaymentType"
import UserColumn from "./Columns/User"
import ModalDetailsOrder from "./Modal/detailsOrder"
import { Info } from "@material-ui/icons"
import useStyles from "../../../global/styles"
import ModalCheck from "../../../components/Modals/CheckDivergencies"
import ModalDevices from "../../../components/Modals/Devices"

const colors = {
  ok: "#1FAA34",
  error: "#B22222",
}

const ReconcileData = ({ event, user }) => {
  const styles = useStyles()

  const columns = {
    totals: [
      { title: "Origem", field: "origin" },
      {
        title: "Total",
        field: "total",
        render: ({ total }) => (
          <span style={{ color: total.ok ? colors.ok : colors.error }}>
            {total.value}
          </span>
        ),
      },
      {
        title: "Débito",
        field: "debit",
        render: ({ debit }) => (
          <span style={{ color: debit.ok ? colors.ok : colors.error }}>
            {debit.value}
          </span>
        ),
      },
      {
        title: "Crédito",
        field: "credit",
        render: ({ credit }) => (
          <span style={{ color: credit.ok ? colors.ok : colors.error }}>
            {credit.value}
          </span>
        ),
      },
      {
        title: "Pix",
        field: "pix",
        render: ({ pix }) => (
          <span style={{ color: pix.ok ? colors.ok : colors.error }}>
            {pix.value}
          </span>
        ),
      },
    ],
    cancelled: [
      {
        title: "",
        render: (row) => (
          <>
            <Info
              variant="outlined"
              size="small"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={handleDetailOrder(row)}
            ></Info>
          </>
        ),
      },
      { title: "ID transação", field: "id" },
      {
        title: "Forma de Pagamento",
        field: "payments",
        render: PaymentTypeColumn,
      },
      { title: "Data e Hora", field: "created_at", type: "datetime" },
      { title: "Operador", field: "user_id", render: UserColumn },
      {
        title: "Número de Série",
        field: "terminalSerialNumber",
        render: (data) => {
          let txt = "-"

          if (data.payments.some(p => p.machineData)) {
            const machineData = (data.payments.filter(p => p.machineData)[0].machineData ?? "null")

            if (machineData) {
              const { terminalSerialNumber } = JSON.parse(machineData)
              if (terminalSerialNumber) txt = terminalSerialNumber
            }
          }

          return txt
        }
      },
      {
        title: "Valor",
        field: "total_price",
        render: ({ total_price }) => format(total_price / 100, { code: "BRL" }),
      },
      {
        title: "Status",
        field: "status",
        render: ({ status }) =>
          status === "cancelamento" ? "Cancelado" : "Normal",
      },
    ],
    notReg: [
      { title: "ID PagSeguro", field: "Transacao_ID" },
      { title: "Tipo de Pagamento", field: "Tipo_Pagamento" },
      { title: "Data e Hora", field: "Data_Transacao" },
      { title: "Valor", field: "Valor_Bruto" },
      { title: "Número de Série", field: "Serial_Leitor" },
    ],
  }

  const [loading] = useState(false)
  const [checkLoading] = useState(false)
  const [autoTotal, setAutoTotal] = useState(null)
  const [totalData, setTotalData] = useState([])
  const [cancelledData, setCancelledData] = useState([])
  const [notRegData, setNotRegData] = useState([])
  const [productList] = useState([])

  const [status] = useState("todos")
  const [type] = useState("todos")
  const [group] = useState("todos")
  const [product, setProduct] = useState("todos")
  const [operator] = useState("todos")
  const [paymentType] = useState("todos")
  const [iniValue, onChangeIni] = useState(new Date().setHours(0, 0, 0, 0))
  const [endValue, onChangeEnd] = useState(new Date().setHours(23, 59, 59, 999))
  const [selectType, onSelectType] = useState(0)
  const [urlWithFilters, setUrlWithFilters] = useState(
    `/order/getList/${event}?status=todos&type=todos&per_page=1000000&page=0`
  )
  const [showDetailsOrder, setShowDetailsOrder] = useState(false)
  const [showDevicesSelector, setShowDevicesSelector] = useState(false)
  const [detailsOrderData, setDetailsOrderData] = useState(0)
  const [detailsOrderDataId, setDetailsOrderDataId] = useState(0)
  const [dateFilters, setDateFilters] = useState({
    iniDate: null,
    endDate: null,
  })
  const [QRCode] = useState("")

  const [allDevices, setAllDevices] = useState([])
  const [devices, setDevices] = useState([])

  const [showFilePicker, setShowFilePicker] = useState(false)

  const handleDetailOrder =
    ({ order_id, id }) =>
      () => {
        setDetailsOrderData(order_id)
        setDetailsOrderDataId(id)
        setShowDetailsOrder(true)
      }

  const unshowModal = () => {
    setShowFilePicker(false)
    setShowDevicesSelector(false)
  }

  const parseData = () => {
    const dateIni = formatDateTimeToDB(iniValue)
    const dateEnd = formatDateTimeToDB(endValue)

    const statusURL = `status=${status}`
    const typeURL = `&type=${type}`
    const groupURL =
      group !== "todos" && product === "todos" ? `&group=${group}` : ""
    const productURL = product !== "todos" ? `&product=${product}` : ""
    const operatorURL = operator !== "todos" ? `&operator=${operator}` : ""
    const paymentTypeURL =
      paymentType !== "todos" ? `&paymentType=${paymentType}` : ""
    const QRCodeURL =
      QRCode !== "" ? `&qrcode=${`${QRCode}`.toUpperCase().trim()}` : ""
    const dateURL =
      selectType !== 1 ? `&date_ini=${dateIni}&date_end=${dateEnd}` : ""

    return {
      statusURL,
      typeURL,
      groupURL,
      productURL,
      operatorURL,
      paymentTypeURL,
      QRCodeURL,
      dateURL,
    }
  }

  useEffect(() => {
    if (group !== "todos" && product !== "todos") {
      const productData = productList.find((prod) => prod.id === product)

      if (productData.group_id !== group) {
        const newProduct = productList.find((prod) => prod.group_id === group)

        if (newProduct) {
          setProduct(newProduct.id)
        } else {
          setProduct("todos")
        }
      }
    }
  }, [group, product, productList])

  const generateUrl = () => {
    const filters = parseData()

    return (
      `/order/getList/${event}?` +
      `${filters.statusURL}` +
      `${filters.typeURL}` +
      `${filters.paymentTypeURL}` +
      `${filters.dateURL}` +
      `&per_page=1000000` +
      `&page=0`
    )
  }

  const handleDivgsSearch = () => {
    setUrlWithFilters(generateUrl())
    setShowFilePicker(true)
  }

  const generateDateFilters = useCallback(() => {
    const iniDate =
      selectType === 1
        ? null
        : selectType === 0
          ? iniValue
          : new Date(iniValue).getTime()

    const endDate =
      selectType === 1
        ? null
        : selectType === 0
          ? endValue
          : new Date(endValue).getTime()

    setDateFilters({
      iniDate,
      endDate,
    })
  }, [endValue, iniValue, selectType])

  const renderLoadingOverlay = () => {
    const el = (
      <div
        id="loadingOverlayTmp"
        className={styles.loadingOverlay}
        style={{ display: checkLoading ? "grid" : "none" }}
      >
        <CircularProgress />
      </div>
    )

    return createPortal(el, document.body)
  }

  const orderByData = (arr) =>
    arr.sort((a, b) => {
      const aDate = a.Data_Transacao ?? a.created_at
      const bDate = b.Data_Transacao ?? b.created_at

      return new Date(aDate).getTime() === new Date(bDate).getTime()
        ? 0
        : new Date(aDate).getTime() > new Date(bDate).getTime()
          ? 1
          : -1
    })

  const handleCheckOver = (checkResult) => {
    setShowFilePicker(false)
    const parsedResult = [
      {
        origin: "PagSeguro",
        total: checkResult.pagseguro.resume,
        credit: checkResult.pagseguro.details.credit,
        debit: checkResult.pagseguro.details.debit,
        pix: checkResult.pagseguro.details.pix,
      },
      {
        origin: "OiTickets",
        total: checkResult.backData.resume,
        credit: checkResult.backData.details.credit,
        debit: checkResult.backData.details.debit,
        pix: checkResult.backData.details.pix,
      },
    ]
    setTotalData(parsedResult)
    setCancelledData(orderByData(checkResult.cancelled))
    setNotRegData(orderByData(checkResult.notReg))
  }

  useEffect(() => {
    generateDateFilters()
  }, [iniValue, endValue, selectType, generateDateFilters])

  useEffect(() => {
    if (event)
      // payments
      Api.get(`/statistical/resume/${event}`).then((res) => {
        const { success, totalReceipt } = res.data
        if (success) {
          const totalResume = (parseInt(totalReceipt.total_credit)) +
            (parseInt(totalReceipt.total_debit)) +
            (parseInt(totalReceipt.total_pix))

          const autoTotalData = {
            resume: {
              value: totalResume,
              ok: false,
            },
            details: {
              credit: {
                value: parseInt(totalReceipt.total_credit) / 100,
                ok: false,
              },
              debit: {
                value: parseInt(totalReceipt.total_debit) / 100,
                ok: false,
              },
              pix: {
                value: parseInt(totalReceipt.total_pix) / 100,
                ok: false,
              },
            },
          }

          setAutoTotal(autoTotalData)
        }
      })

    // devices
    Api.get('/device/getList')
      .then(({ data }) => {
        if (data.success) {
          setAllDevices(data.devices
            .filter(device => {
              if (!(user.role === "master" || user.role === "admin")) {
                return (device.name !== "NEUTRO")
              } else return device
            })
            .sort((a, b) => {
              const dataA = new Date(a.created_at).getTime();
              const dataB = new Date(b.created_at).getTime();
              return dataA > dataB ? -1 : dataA < dataB ? 1 : 0;
            }));
        }
      })
      .catch((e) => {
        if (e.error) {
          alert(e.error);
        } else {
          alert('Erro não esperado');
        }
      });
  }, [event])

  return (
    <>
      {renderLoadingOverlay()}
      <Grid container direction="column" spacing={2}>
        <ModalDetailsOrder
          event={event}
          show={showDetailsOrder}
          onClose={() => setShowDetailsOrder(false)}
          order_id={detailsOrderData}
          detailsOrderDataId={detailsOrderDataId}
        />

        <ModalCheck
          show={showFilePicker}
          finish={handleCheckOver}
          closeFn={unshowModal}
          urlWithFilters={urlWithFilters}
          dates={dateFilters}
          autoTotal={autoTotal}
          devices={devices}
        />

        <ModalDevices
          show={showDevicesSelector}
          finish={(list) => {
            setDevices(list)
            unshowModal()
          }}
          closeFn={unshowModal}
          allDevices={allDevices}
          selected={devices}
        />

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Between
                iniValue={iniValue}
                onChangeIni={onChangeIni}
                endValue={endValue}
                onChangeEnd={onChangeEnd}
                onSelectType={onSelectType}
                selected={selectType}
                toggleDevicesModal={() => {
                  setShowDevicesSelector(true)
                }}
                onSearch={handleDivgsSearch}
                size="small"
                fullWidth
                isForDivgs
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <EaseGrid
            title="Totais Pagseguro e Registrados"
            columns={columns.totals}
            data={totalData}
            loading={loading}
          />
        </Grid>
      </Grid>

      {notRegData.length > 0 &&
        totalData.length > 0 &&
        !totalData[0].total.ok && (
          <Grid container direction="column" spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <EaseGrid
                title="Transações no PagSeguro e não encontradas nos registros"
                columns={columns.notReg}
                data={notRegData}
                loading={loading}
              />
            </Grid>
          </Grid>
        )}

      {totalData.length > 0 && !totalData[0].total.ok && (
        <Grid container direction="column" spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <EaseGrid
              config={{
                rowStyle: (row) => ({
                  backgroundColor:
                    row.status === "cancelamento" ? "#fff0f0" : "white",
                }),
              }}
              title="Transações canceladas"
              columns={columns.cancelled}
              data={cancelledData}
              loading={loading}
            />
          </Grid>
        </Grid>
      )}
    </>
  )
}

const mapStateToProps = ({ event, user }) => ({ event, user })

export default connect(mapStateToProps)(ReconcileData)
