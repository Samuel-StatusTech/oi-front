import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"

const SendVoucherModal = ({ show, closeFn, data, handleSend }) => {

  const [email, setEmail] = useState('')
  const [differentEmail, setDiffEmail] = useState(false)

  const send = () => {
    handleSend({ email: email })
    closeModal()
  }

  const closeModal = () => {
    closeFn()
  }

  useEffect(() => {
    setEmail(data.email)
  }, [data])

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Confirmar envio de voucher por email ({data.order_id})</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >

          <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
            {!differentEmail ? (
              <Grid container spacing={2} direction='column'>
                <Grid item xl={2} lg={2} xs={12} direction='column'>
                  <Typography style={{ fontWeight: "bold" }}>Email</Typography>
                  <Typography>{data.email}</Typography>
                </Grid>

                <Grid item xl={2} lg={2} xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                    onClick={() => setDiffEmail(true)}
                  >
                    Enviar para outro email
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid item xl={12} lg={12} xs={12} direction='column'>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label='E-mail'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            )}
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
            onClick={() => {
              send()
            }}
          >
            Enviar
          </Button>
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

export default SendVoucherModal
