import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Grid,
  TextField,
} from "@material-ui/core"

import InputMoney from "../../Input/Money"
import { KeyboardDatePicker } from "@material-ui/pickers"

const WithdrawalDetailsModal = ({ show, closeFn, data, onSave }) => {

  const [info, setInfo] = useState()


  const closeModal = () => {
    closeFn()
  }

  const handleSave = () => {
    onSave && onSave(info)
    closeFn()
  }

  const handleField = (field, value) => {
    setInfo(i => ({ ...i, [field]: value }))
  }

  useEffect(() => {
    setInfo(data)
  }, [data])

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Editar redirada {data.id && ` - ${data.id}`}</DialogTitle>
      <DialogContent style={{ overflow: "visible" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >

          <Grid item container direction="column" spacing={2} lg={12} md={12} sm={12} xs={12}>
            <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12}>
              <Grid item lg={6}>
                <KeyboardDatePicker
                  autoOk
                  label='Data'
                  value={info?.date}
                  onChange={val => handleField("date", val)}
                  inputVariant='outlined'
                  variant='inline'
                  format='DD/MM/YYYY'
                  fullWidth
                  size='small'
                  style={{ backgroundColor: '#fff' }}
                />
              </Grid>
              <Grid item lg={6}>
                <InputMoney
                  name='priceSell'
                  value={info?.value}
                  onChange={({ value }) => handleField("value", value)}
                  label='Valor de retirada'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2} lg={12} md={12} sm={12} xs={12}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                  label='Observação'
                  name='observation'
                  value={info?.observation}
                  onChange={(e) => handleField("observation", e.target.value)}
                  variant='outlined'
                  size='small'
                  fullWidth
                />
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
          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={handleSave}>Salvar</Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}>Fechar</Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default WithdrawalDetailsModal
