import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { connect } from "react-redux"
import { Grid, Button, CircularProgress } from "@material-ui/core"
import { format } from "currency-formatter"

import EaseGrid from "../../../components/EaseGrid"
import { Between } from "../../../components/Input/DateTime"

import { formatDateTimeToDB } from "../../../utils/date"
import Api from "../../../api"

import PaymentTypeColumn from "./Columns/PaymentType"
import UserColumn from "./Columns/User"
import ModalCancel from "./Modal/cancelOrder"
import ModalDetailsOrder from "./Modal/detailsOrder"
import { Info } from "@material-ui/icons"
import useStyles from "../../../global/styles"
import ModalCheck from "../../../components/Modals/CheckDivergencies"

const ReconcileData = ({ event, user }) => {
  const styles = useStyles()

  const columns = [
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
    { title: "Data/Hora", field: "created_at", type: "datetime" },
    { title: "Operador", field: "user_id", render: UserColumn },
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
  ]

  const [loading, setLoading] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)
  const [data, setData] = useState([])
  const [groupList, setGroupList] = useState([])
  const [productList, setProductList] = useState([])
  const [operatorList, setOperatorList] = useState([])

  const [totalSell, setTotalSell] = useState(0)
  const [itensSell, setItensSell] = useState(0)
  const [itensCanceled, setItensCanceled] = useState(0)

  const [status, setStatus] = useState("todos")
  const [type, setType] = useState("todos")
  const [group, setGroup] = useState("todos")
  const [product, setProduct] = useState("todos")
  const [operator, setOperator] = useState("todos")
  const [paymentType, setPaymentType] = useState("todos")
  const [iniValue, onChangeIni] = useState(new Date().setHours(0, 0, 0, 0))
  const [endValue, onChangeEnd] = useState(new Date().setHours(23, 59, 59, 999))
  const [selectType, onSelectType] = useState(0)
  const [page, setPage] = useState(0)
  const [urlWithFilters, setUrlWithFilters] = useState(
    `/order/getList/${event}?status=todos&type=todos&per_page=1000000&page=0`
  )
  const [dateFilters, setDateFilters] = useState({
    iniDate: null,
    endDate: null,
  })
  const [QRCode, setQRCode] = useState("")

  const [showFilePicker, setShowFilePicker] = useState(false)

  const [showCancel, setShowCancel] = useState(false)
  const [cancelData, setCancelData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [deleteData, setDeleteData] = useState({})
  const [showDetailsOrder, setShowDetailsOrder] = useState(false)
  const [detailsOrderData, setDetailsOrderData] = useState(0)
  const [detailsOrderDataId, setDetailsOrderDataId] = useState(0)

  const updateRow = (value, id) => {
    const newData = [...data]
    const index = data.findIndex((element) => element.id === id)
    newData[index] = value
    setData(newData)
  }
  const deleteRow = (id) => {
    const index = data.findIndex((element) => element.id === id)
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }
  const handleCancelProduct =
    ({ id }) =>
    () => {
      setCancelData({ id: id, cancel: false })
      setShowCancel(true)
    }
  const handleUncancelProduct =
    ({ id }) =>
    () => {
      setCancelData({ id: id, cancel: true })
      setShowCancel(true)
    }
  const handleDeleteProduct =
    ({ id }) =>
    () => {
      setDeleteData({ id: id })
      setShowDelete(true)
    }
  const handleDetailOrder =
    ({ order_id, id }) =>
    () => {
      setDetailsOrderData(order_id)
      setDetailsOrderDataId(id)
      setShowDetailsOrder(true)
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
      QRCode != "" ? `&qrcode=${`${QRCode}`.toUpperCase().trim()}` : ""
    // const pageURL = `&per_page=${query.pageSize}&page=${query.page + 1}`;
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

  const loadData = async (moreItens = false, pageination = page) => {
    setLoading(true)
    try {
      const p = parseData()

      const url = `/order/getList/${event}?${p.statusURL}${p.typeURL}${p.groupURL}${p.productURL}${p.operatorURL}${p.paymentTypeURL}${p.dateURL}${p.QRCodeURL}&per_page=1000&page=${pageination}`

      const resp = await Api.get(url)

      //setTotalSell(resp.data.totalSell);
      //setItensSell(resp.data.itensSell);
      //setItensCanceled(resp.data.itensCanceled);
      if (moreItens) setData([...data, ...resp.data.orders])
      else setData(resp.data.orders)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!event) console.log("Sem evento")
  }, [event])

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

  const getDetails = (tId) => {
    return new Promise(async (resolve) => {
      const req = await Api.get(`/order/getDetailsOrder/${tId}?event=${event}`)
      resolve(req.data.orders)
    })
  }

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

  const findByQR = async (code) => {
    return await Api.get(generateUrl(code))
  }

  const filterData = (arr) => {
    let newArr = []

    arr.forEach((item) => {
      if (newArr.findIndex((i) => Number(i.id) === Number(item.id)) < 0) {
        newArr.push(item)
      }
    })

    return newArr
  }

  const handleDivgsSearch = () => {
    setUrlWithFilters(generateUrl())
    setShowFilePicker(true)
  }

  const generateDateFilters = () => {
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
  }

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

  const handleCheckOver = (checkResult) => {
    setShowFilePicker(false)
  }

  useEffect(() => {
    generateDateFilters()
  }, [iniValue, endValue, selectType])

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
          urlWithFilters={urlWithFilters}
          dates={dateFilters}
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
            config={{
              rowStyle: (row) => ({
                backgroundColor:
                  row.status === "cancelamento" ? "#fff0f0" : "white",
              }),
            }}
            title="Resultados"
            columns={columns}
            data={data}
            loading={loading}
          />
        </Grid>
        {!loading && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Button
                variant="outlined"
                color="default"
                onClick={() => {
                  loadData(true, page + 1)
                  setPage(page + 1)
                }}
                style={{
                  padding: "8px",
                  backgroundColor: "white",
                  width: 150,
                  borderRadius: 30,
                }}
              >
                Mostrar mais
              </Button>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  )
}

const mapStateToProps = ({ event, user }) => ({ event, user })

export default connect(mapStateToProps)(ReconcileData)
