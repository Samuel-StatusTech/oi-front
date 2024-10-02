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

const WithdrawalDetailsModal = ({ show, closeFn, data, eventId, onSelectRow }) => {

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
      render: ({ status }) => (
        <td>
          <span>{status === false ? "Não validado" : "Validado"}</span>
        </td>
      ),
    },
  ]

  const [tickets, setTickets] = useState([])
  const [loadingInfo, setLoadingInfo] = useState(true)

  const closeModal = () => {
    closeFn()
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

      setLoadingInfo(false)
    }
  }, [closeFn, data.order_id, eventId, tickets])


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
              onPickRow={onSelectRow}
              data={tickets}
              columns={columns}
              hasSearch={false}
              loadingMessage={loadingInfo}
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

export default WithdrawalDetailsModal
