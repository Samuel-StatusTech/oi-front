import React, { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core"

import { format } from "currency-formatter"
import EaseGrid from "../../EaseGrid"
import Api from "../../../api"

const SellDetailsModal = ({ show, closeFn, data, handleValidate, eventId }) => {

  const columns = [
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
      title: <Typography style={{ fontWeight: "bold" }}>Preço</Typography>,
      field: "price_unit",
      render: ({ price_unit }) => (
        <td>
          <span>{format(price_unit / 100, { code: "BRL" })}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Status</Typography>,
      field: "status",
      render: ({ status, qr_data, order_id, opuid }) => (
        <td>
          {status === false ? (
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
          ) : (<span>Validado</span>)}
        </td>
      ),
    },
  ]

  const [tickets, setTickets] = useState([])

  const update = async (qrdata, order_id, opuid) => {
    const result = await handleValidate(qrdata, order_id, opuid)

    if (result) {
      setTickets(ticketsList => ticketsList.map((item) => item.qr_data !== qrdata ? item : ({
        ...item,
        status: result
      })))
    }
  }

  const closeModal = () => {
    closeFn()
  }

  const getData = useCallback(async () => {
    try {
      const req = await Api.get(`${eventId}/ecommerce/orders/${data?.order_id}`)

      if (req.data && req.data.products) {
        const orderTickets = req.data.products
        let list = []

        let pms = []

        orderTickets.forEach(ticket => {
          pms.push(Api.get(`${eventId}/validate_ticket/${ticket.qr_data}`).then(({ data: ticketInfo }) => {
            const obj = {
              ...ticket,
              status: ticketInfo.status === false // back-end misinformation: status should return reverse (false => true | true => false)
            }

            list.push(obj)
          }))
        })


        await Promise.all(pms)

        setTickets(list)
      }
    } catch (error) {
      console.log(error)
      closeFn()
    }
  }, [closeFn, data.order_id, eventId])


  useEffect(() => {
    if (show) getData()
  }, [show, getData])

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="lg">
      <DialogTitle>Venda online - {data.order_id}</DialogTitle>
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
            />
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

export default SellDetailsModal
