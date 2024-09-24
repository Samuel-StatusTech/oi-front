/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo, useCallback } from "react"
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"

import { format } from "currency-formatter"
import { formatDatetime, parseUrlDate } from "../../../../../utils/date"
import { formatPhone } from "../../../../../utils/toolbox/formatPhone"

import { Between } from "../../../../../components/Input/DateTime"
import SellDetailsModal from "../../../../../components/Modals/SellDetails"
import SendVoucherModal from "../../../../../components/Modals/SendVoucher"
import EaseGrid from "../../../../../components/EaseGrid"

const paymentTypesRelation = {
  credit: "Crédito",
  debit: "Débito",
  pix: "Pix"
}

const paymentRelation = {
  payed: "Pago",
  analysis: "Em análise",
  notApproved: "Não aprovado",
  cancelled: "Cancelado",
}

// -----

const Statement = (props) => {
  const { loadData, event, sells } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [selected, onSelectType] = useState(1)

  // Filters
  const [transaction, setTransaction] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("todos")

  const [dateIni, setDateIni] = useState(new Date('2020-01-01'))
  const [dateEnd, setDateEnd] = useState(new Date().setHours(new Date().getHours() + 24))
  const [editModal, setEditModal] = useState({ status: false, data: null })
  const [voucherModal, setVoucherModal] = useState({ status: false, data: null })

  const cancelTokenSource = useRef()


  /*
  {
            "order_id": "1Xd0lgg1TDIyw-bLAAAJ",
            "sell_date": "2024-09-04",
            "eccommerce_product_id": "c9039e00-df8d-4d8f-be4e-b9b4e724391a",
            "product_name": "Centro Meia",
            "batch_name": "Infantil",
            "sold_quantity": 1,
            "price_unit": 1,
            "price_total": "1"
        }
  */

  const sellsColumns = [
    {
      title: <Typography style={{ fontWeight: "bold" }}>Transação</Typography>,
      field: "order_id",
      render: ({ order_id }) => (
        <td>
          <span>{order_id}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Nome</Typography>,
      field: "name",
      render: ({ name }) => (
        <td>
          <span>{name}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Telefone</Typography>,
      field: "phone",
      render: ({ phone }) => {

        return (
          <td>
            <span>{formatPhone(phone)}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>E-mail</Typography>,
      field: "email",
      render: ({ email }) => {

        return (
          <td>
            <span>{email}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Data/Hora Compra</Typography>,
      field: "sell_date",
      render: ({ sell_date }) => {

        return (
          <td>
            <span>{formatDatetime(sell_date)}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Pgto</Typography>,
      field: "payment",
      render: ({ payment }) => {

        return (
          <td>
            <span>{paymentTypesRelation[payment] ?? "Pix"}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Total</Typography>,
      field: "price_total",
      render: ({ price_total }) => {

        return (
          <td>
            <span>{format(+price_total / 100, { code: "BRL" })}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Taxa</Typography>,
      field: "tax",
      render: ({ tax }) => {

        return (
          <td>
            <span>{`${String(((tax ?? 0) / 100).toFixed(2)).replace(".", ",")}%`}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Status</Typography>,
      field: "status",
      render: ({ status }) => {

        return (
          <td>
            <span>{paymentRelation[status]}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold", textAlign: "center" }}>Opções</Typography>,
      field: "payment",
      render: (sell) => {

        return (
          <td>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}>
              <Button style={{
                color: "#FF7043"
              }} onClick={() => handleEdit(sell)}>Editar</Button>
              <Button style={{
                color: "#3B94FF"
              }} onClick={() => handleSend(sell)}>Enviar</Button>
            </div>
          </td>
        )
      },
    }
  ]

  const handleEdit = useCallback((sell) => {
    setEditModal({
      status: true,
      data: sell
    })
  }, [])

  const handleSend = (sell) => {
    setVoucherModal({
      status: true,
      data: sell
    })
  }

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
            : `?dateStart=2020-01-01&dateEnd=${parseUrlDate(new Date().setHours(new Date().getHours() + 24).replace("/", "-"))}`

        filters = dateURL

        loadData(filters)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleUpdate = (changes) => {
    const { status, payment } = changes

    console.log({ status, payment })

    // update Api ...
  }

  const handleSendVoucher = (changes) => {
    const { status, payment } = changes

    console.log({ status, payment })

    // update Api ...
  }

  useEffect(() => {
    if (selected !== 2) {
      onSearch()
    }
  }, [event, selected])

  useEffect(() => {
    onSearch()
  }, [])

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

  return (
    <>
      {editModal.data && (
        <SellDetailsModal
          show={editModal.status}
          closeFn={() => setEditModal({ status: false, data: null })}
          data={editModal.data}
          handleUpdate={handleUpdate}
        />
      )}

      {voucherModal.data && (
        <SendVoucherModal
          show={voucherModal.status}
          closeFn={() => setVoucherModal({ status: false, data: null })}
          data={voucherModal.data}
          handleSend={handleSendVoucher}
        />
      )}

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

          {/* Filters */}
          <Grid item container spacing={2}>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                label='Transação'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                label='Nome'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <TextField
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                label='Telefone'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label='E-mail'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <TextField
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label='Status'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='payed'>Pago</MenuItem>
                <MenuItem value='analysis'>Em análise</MenuItem>
                <MenuItem value='notApproved'>Não aprovado</MenuItem>
                <MenuItem value='cancelled'>Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Date */}
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
          <Grid item spacing={2} lg={12} md={12} sm={12} xs={12}>
            <EaseGrid
              className={styles.paddingT30}
              title={
                <div className={styles.flexRow}>
                  <Typography className={styles.h2}>Produtos vendidos</Typography>
                </div>
              }
              data={sells}
              columns={sellsColumns}
              hasSearch={false}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}


export default memo(Statement)