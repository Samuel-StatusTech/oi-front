import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
} from "@material-ui/core"

import { formatDatetime } from "../../../utils/date"
import { format } from "currency-formatter"

const SellDetailsModal = ({ show, closeFn, data, handleUpdate }) => {

  const [status, setStatus] = useState('analysis')
  const [payType, setPayType] = useState('pix')

  const update = () => {
    handleUpdate({
      status: status,
      payment: payType,
    })
    closeModal()
  }

  const closeModal = () => {
    closeFn()
  }

  useEffect(() => {
    setStatus(data.status)
    setPayType(data.payment)
  }, [data])

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="lg">
      <DialogTitle>Venda online - {data.transaction}</DialogTitle>
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
            <Typography style={{ fontWeight: 'bold' }}>Dados da compra</Typography>
            <Divider />
          </Grid>

          <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Data/Hora da Compra</Typography>
                <Typography>{formatDatetime(data.date)}</Typography>
              </Grid>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Nº transação</Typography>
                <Typography>{data.transaction}</Typography>
              </Grid>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Código operadora</Typography>
                <Typography>{data.op_code}</Typography>
              </Grid>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Gateway</Typography>
                <Typography>{data.gateway}</Typography>
              </Grid>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Valor</Typography>
                <Typography>{format(data.total / 100, { code: "BRL" })}</Typography>
              </Grid>
              <Grid item xl={2} lg={2} xs={12} direction='column'>
                <Typography style={{ fontWeight: "bold" }}>Validado no Evento</Typography>
                <Typography>{Boolean(data.validated) ? "Sim" : "Não"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xl={12} lg={12} md={6} sm={12} xs={12} style={{ marginTop: 24 }}>
            <Grid container spacing={2}>
              <Grid item xl={3} lg={3} xs={12}>
                <TextField
                  label='Forma de pagamento'
                  name='payType'
                  value={payType}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 80);
                    setPayType(value);
                  }}
                  variant='outlined'
                  size='small'
                  fullWidth
                  select
                >
                  <MenuItem value='credit'>Crédito</MenuItem>
                  <MenuItem value='debit'>Débito</MenuItem>
                  <MenuItem value='pix'>Pix</MenuItem>
                </TextField>
              </Grid>

              <Grid item xl={3} lg={3} xs={12}>
                <TextField
                  label='Status'
                  name='status'
                  value={status}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 80);
                    setStatus(value);
                  }}
                  variant='outlined'
                  size='small'
                  fullWidth
                  select
                >
                  <MenuItem value='payed'>Pago</MenuItem>
                  <MenuItem value='analysis'>Em análise</MenuItem>
                  <MenuItem value='notApproved'>Não aprovado</MenuItem>
                  <MenuItem value='cancelled'>Cancelado</MenuItem>
                </TextField>
              </Grid>
            </Grid>
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
          {((status !== data.status) || (payType !== data.payment)) && (
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                update()
              }}
            >
              Salvar
            </Button>
          )}
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
