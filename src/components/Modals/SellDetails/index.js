import React, { memo, useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core"

import { format } from "currency-formatter"
import EaseGrid from "../../EaseGrid"
import Api from "../../../api"
import { formatDate, formatDatetime } from "../../../utils/date"
import styles from "../../../global/styles"
import { setSizeOptions } from '../../../utils/tablerows'

const SellDetailsModal = ({ taxControl, isNominal, show, closeFn, data, handleValidate, eventId, handleSave }) => {

  const [status, setStatus] = useState('notpaid')

  const [refTickets, setRefTickets] = useState([])
  const [tickets, setTickets] = useState([])
  const [loadingInfo, setLoadingInfo] = useState(true)

  const columns = useCallback([
    {
      title: <Typography style={{ fontWeight: "bold" }}>Nome</Typography>,
      field: "username",
      render: (i) => (
        <td>
          <TextField
            name='userName'
            // value={i.username}
            onChange={(e) => {
              // i.username = e.target.value
              // setTickets((t) => t.opuid !== i.opuid ? t : { ...t, username: e.target.value })
              // console.log(refTickets.find(t => t.opuid === i.opuid))
              // console.log(tickets.find(t => t.opuid === i.opuid))
            }}
            variant='outlined'
            size='small'
            style={{ minWidth: 100 }}
            fullWidth
          />
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Nº transação</Typography>,
      field: "oid",
      render: ({ oid }) => (
        <td>
          <span>{oid ?? ""}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Nº trans. Operadora</Typography>,
      field: "mp_oid",
      render: ({ mp_oid }) => (
        <td>
          <span>{mp_oid ?? ""}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Gateway</Typography>,
      field: "gateway",
      render: ({ gateway }) => (
        <td>
          <span>Mercado Pago</span>
          {/* <span>{gateway}</span> */}
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Pgto</Typography>,
      field: "payment",
      render: ({ payment }) => (
        <td>
          <span>Pix</span>
          {/* <span>{payment}</span> */}
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Valor total</Typography>,
      field: "price_total",
      render: ({ price_total }) => (
        <td>
          <span>{format(price_total / 100, { code: "BRL" })}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Valor taxa</Typography>,
      field: "price_tax",
      render: ({ price_tax }) => (
        <td>
          <span>{format(price_tax / 100, { code: "BRL" })}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
      field: "name",
      render: ({ name }) => (
        <td>
          <span>{name}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Lote</Typography>,
      field: "batch_name",
      render: ({ batch_name }) => (
        <td>
          <span>{batch_name}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Validado</Typography>,
      field: "status",
      render: ({ status, qr_data, order_id, opuid }) => (
        <td>
          {/* {status === false ? (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                update(qr_data, order_id, opuid)
              }}
            >
              Validar
            </Button>
          ) : (<span>Validado</span>)} */}
          <span>{status ? "Sim" : "Não"}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}></Typography>,
      field: "actions",
      render:
        (info) =>

        // tickets.find(t => t.opuid === info.opuid).username !==
        // refTickets.find(t => t.opuid === info.opuid).username ?
        (
          <td>
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: "pointer" }}
              disabled={true}
              onClick={updateUserName}>
              <span style={{ whiteSpace: "nowrap" }}>Salvar - desenv.</span>
            </Button>
          </td>
        )// : null,
    }
  ], [tickets, refTickets])
  useEffect(() => {
    console.log("tickets change", tickets)
  }, [tickets])

  // const update = async (qrdata, order_id, opuid) => {
  //   const result = await handleValidate(qrdata, order_id, opuid)

  //   if (result) {
  //     setTickets(ticketsList => ticketsList.map((item) => item.qr_data !== qrdata ? item : ({
  //       ...item,
  //       status: result
  //     })))
  //   }
  // }

  const closeModal = () => {
    closeFn()
  }

  const updateUserName = () => {
    // ...
  }
  const parseProducts = (tickets) => {
    const hasTax = taxControl.has
    const isTaxAbsolute = taxControl.absolute !== 0

    let list = []

    tickets.forEach(t => {

      if (hasTax) {
        if (isTaxAbsolute) {
          const taxVal = t.quantity * +taxControl.absolute

          const obj = {
            ...t,
            price_tax: taxVal,
            price_total: t.price_unit + taxVal
          }
          list.push(obj)
        } else {
          const percentage = +taxControl.percentage
          const taxMin = +taxControl.minimum
          const calculedTax = Math.round(t.price_unit * percentage)

          const min = Math.max(taxMin, calculedTax)

          const taxVal = t.quantity * min

          const obj = {
            ...t,
            price_total: t.price_total + taxVal,
            price_tax: taxVal
          }

          list.push(obj)
        }
      } else {
        const obj = {
          ...t,
          price_tax: 0,
        }
        list.push(obj)
      }
    })


    setRefTickets(list)
    setTickets(list)
  }

  const getData = useCallback(async () => {

    if (tickets.length === 0) {
      setLoadingInfo(true)

      try {
        const req = await Api.get(`${eventId}/ecommerce/orders/${data?.order_id}`)

        if (req.data && req.data.products) {
          const orderTickets = req.data.products
          let list = []

          let pms = []

          orderTickets.forEach((ticket, k) => {
            pms.push(Api.get(`${eventId}/validate_ticket/${ticket.qr_data}`).then(({ data: ticketInfo }) => {
              const obj = {
                ...ticket,
                aid: k,
                username: "",
                status: ticketInfo.status === false // back-end misinformation: status should return reverse (false => true | true => false)
              }

              list.push(obj)
            }))
          })


          await Promise.all(pms)

          parseProducts(list)
        }
      } catch (error) {
        console.log(error)
        closeFn()
      }

      setLoadingInfo(false)
    }
  }, [closeFn, data.order_id, eventId, tickets])


  useEffect(() => {
    if (show) getData()
  }, [show, getData])

  const getDateStr = () => formatDatetime(data.created_at)

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="xl">
      <DialogTitle>Venda online - {data.order_id} (comprados em {getDateStr()})</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography style={{ fontWeight: 'bold' }}>Tickets comprados</Typography>
            <Divider />
            <EaseGrid
              data={tickets}
              columns={columns}
              hasSearch={false}
              loadingMessage={loadingInfo}
              // detailPanel={rowData => <NominalItem rowData={rowData} updateUserName={updateUserName} />}
              pageSize={tickets.length}
              pageSizeOptions={setSizeOptions(tickets.length)}
            />
          </Grid>

          <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={setStatus}
                label="Status"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="paid">Pago</MenuItem>
                <MenuItem value="notpaid">Não pago</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
                <MenuItem value="analysis">Em análise</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 24,
            gap: 12
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={handleSave}>Salvar</Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              closeModal()
            }}
          >
            Fechar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default memo(SellDetailsModal)
