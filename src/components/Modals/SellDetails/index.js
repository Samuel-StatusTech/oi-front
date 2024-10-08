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
import { formatDate } from "../../../utils/date"
import styles from "../../../global/styles"
import { setSizeOptions } from '../../../utils/tablerows'

const NominalItem = ({ rowData, updateUserName }) => {

  const list = [{
    name: rowData.name,
    opuid: rowData.opuid,
    username: rowData.username ?? "Não definido",
  }]

  const [userName, setUsername] = useState(list[0].username)

  return (
    <div style={{ padding: '20px', fontSize: '14px' }}>
      <EaseGrid
        className={styles.paddingT30}
        title={"Detalhes"}
        data={list}
        columns={[
          {
            title: <Typography style={{ fontWeight: "bold" }}>Ingresso</Typography>,
            field: "name",
            render: ({ name }) => (
              <td>
                <span style={{ fontSize: "0.9rem" }}>{name}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Opuid</Typography>,
            field: "opuid",
            render: ({ opuid }) => (
              <td>
                <span style={{ fontSize: "0.9rem" }}>{opuid}</span>
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}>Nome</Typography>,
            field: "username",
            render: () => (
              <td>
                <TextField
                  name='userName'
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  variant='outlined'
                  size='small'
                  style={{ minWidth: 100 }}
                  fullWidth
                />
              </td>
            ),
          },
          {
            title: <Typography style={{ fontWeight: "bold" }}></Typography>,
            field: "actions",
            render: userName !== list[0].username ? () => (
              <td>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ cursor: "pointer" }}
                  onClick={updateUserName}>Salvar</Button>
              </td>
            ) : null,
          }
        ]}
        paging={false}
        pageSize={list.length}
        pageSizeOptions={setSizeOptions(list.length)}
        hasSearch={false}
      />
    </div>
  )
}

const SellDetailsModal = ({ isNominal, show, closeFn, data, handleValidate, eventId, handleSave }) => {

  const columns = [
    {
      title: <Typography style={{ fontWeight: "bold" }}>Data/Hora</Typography>,
      field: "data",
      render: ({ date }) => {

        const split = date.split("-")

        const d = new Date(split[0], split[1], split[2])

        return (
          <td>
            <span>{formatDate(d)}</span>
          </td>
        )
      },
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
          <span>{gateway}</span>
        </td>
      ),
    },
    {
      title: <Typography style={{ fontWeight: "bold" }}>Forma de pagamento</Typography>,
      field: "payment",
      render: ({ payment }) => (
        <td>
          <span>{payment}</span>
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
          <span>{status ? "Validado" : "Não validado"}</span>
        </td>
      ),
    },
  ]

  const [status, setStatus] = useState('notpaid')

  const [tickets, setTickets] = useState([])
  const [loadingInfo, setLoadingInfo] = useState(true)

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
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="xl">
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
              loadingMessage={loadingInfo}
              detailPanel={rowData => <NominalItem rowData={rowData} updateUserName={updateUserName} />}
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
