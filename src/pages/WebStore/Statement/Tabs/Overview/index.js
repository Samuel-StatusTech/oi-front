/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo, useCallback } from "react"
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  TextField,
} from "@material-ui/core"

import useStyles from "../../../../../global/styles"

import { format } from "currency-formatter"
import { formatDatetime, parseUrlDate } from "../../../../../utils/date"
import { formatPhone } from "../../../../../utils/toolbox/formatPhone"

import { Between } from "../../../../../components/Input/DateTime"
import SellDetailsModal from "../../../../../components/Modals/SellDetails"
import SendVoucherModal from "../../../../../components/Modals/SendVoucher"
import EaseGrid from "../../../../../components/EaseGrid"
import Api from "../../../../../api"
import downloadOrderPdf from "../../../../../utils/orderPdf"
import { formatCPF } from "../../../../../utils/toolbox/formatCPF"

const paymentTypesRelation = {
  credit: "Crédito",
  debit: "Débito",
  pix: "Pix"
}

const statusRelation = {
  paid: "Pago",
  cancelled: "Cancelada",
  notapproved: "Não aprovada"
}

// -----

const Statement = (props) => {
  const { loadData, event, sells } = props

  const styles = useStyles()

  const [loading, setLoading] = useState(false)
  const [selected, onSelectType] = useState(1)

  // Event
  const [isNominal, setIsNominal] = useState(false)

  // Filters
  const [transaction, setTransaction] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const [dateIni, setDateIni] = useState(new Date('2020-01-01'))
  const [dateEnd, setDateEnd] = useState(new Date().setHours(new Date().getHours() + 24))
  const [editModal, setEditModal] = useState({ status: false, data: null })
  const [voucherModal, setVoucherModal] = useState({ status: false, data: null })

  const cancelTokenSource = useRef()

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
      title: <Typography style={{ fontWeight: "bold" }}>CPF</Typography>,
      field: "cpf",
      render: ({ cpf }) => {

        return (
          <td>
            <span>{cpf ? formatCPF(cpf ?? "") : "Não definido"}</span>
          </td>
        )
      },
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Telefone</Typography>,
      field: "phone",
      render: ({ fone }) => {

        return (
          <td>
            <span>{formatPhone(fone)}</span>
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
      render: ({ created_at }) => {

        return (
          <td>
            <span>{formatDatetime(created_at)}</span>
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
            <span>{statusRelation[status] ?? "Aguardando"}</span>
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
            <span>{format(tax / 100, { code: "BRL" })}</span>
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
              }} onClick={() => handleSendVoucher(sell)}>Baixar</Button>
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

  const handleUpdate = (sell) => {
    // ...
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
            : `?dateStart=2020-01-01&dateEnd=${parseUrlDate(new Date().setHours(new Date().getHours() + 24)).replace("/", "-")}`

        const phoneFilter = phone ? `&phone=${phone.replace(/\D/g, "")}` : ""
        const emailFilter = email ? `&email=${email.trim()}` : ""

        filters = dateURL + phoneFilter + emailFilter

        loadData(filters)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getEventNominal = async () => {
    try {
      const req = await Api.get(`/event/getData/${event}`)
      setIsNominal(Boolean(req.data.event.nominal ?? 0))
    } catch (error) {
      console.log(error)
    }
  }

  const handleValidate = async (qrdata, order_id, opuid) => {
    let ok = false

    try {
      await Api.get(`/${event}/checkout_ticket/${qrdata}`)
      ok = true
    } catch (error) {
      console.log(error)
    } finally {
      handleSearch()
    }

    return ok
  }

  const getPdfTickets = async (order_id) => {
    let returnList = []

    return new Promise(async (resolve) => {

      try {
        await Api
          .get(`/${event}/ecommerce/orders/${order_id}`)
          .then((res) => returnList = res.data.products)
          .catch(() => {
            throw new Error()
          })

        resolve({
          ok: true,
          data: { list: returnList },
        })
      } catch (error) {
        console.log(error)
        resolve({
          ok: false,
          error: "Erro ao listar produtos. Tente novamente mais tarde",
        })
      }
    })
  }

  const handleSendVoucher = async (info) => {
    const { order_id } = info

    const getData = (await Api.get(`/event/getData/${event}`, {
      headers: {
        "X-event-id": event,
      }
    })).data.event
    const getInfo = (await Api.get(`/ecommerce/getInfo?eventId=${event}`, {
      headers: {
        "X-event-id": event,
      },
    })).data.info

    const eventData = {
      ...getInfo,
      ...getData
    }

    const tickets = await getPdfTickets(order_id)

    if (tickets.ok) {
      await downloadOrderPdf(eventData, tickets.data.list, true)
    } else {
      alert(tickets.error)
    }

    // update Api ...
  }

  useEffect(() => {
    if (selected !== 2) {
      onSearch()
    }
  }, [event, selected])

  useEffect(() => {
    onSearch()
    getEventNominal()
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
          isNominal={isNominal}
          show={editModal.status}
          closeFn={() => setEditModal({ status: false, data: null })}
          data={editModal.data}
          handleValidate={handleValidate}
          eventId={event}
          handleSave={handleUpdate}
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
            <Grid item lg={13} md={3} sm={12} xs={12}>
              <TextField
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                label='Transação'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
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
          </Grid>

          <Grid item container spacing={2}>
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