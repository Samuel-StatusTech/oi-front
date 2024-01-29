import React, { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  DialogActions,
} from "@material-ui/core"

import Api from "../../../api"
import useStyles from "../../../global/styles"
import csvtojson from "csvtojson"

const WhatsappNumberModal = ({ show, sendTo, closeFn, number, setNumber }) => {
  const styles = useStyles()

  const [errorsVerify, setErrorsVerify] = useState({})

  const closeModal = () => {
    setNumber("")
    closeFn()
  }

  const saveNumber = () => {
    sendTo(number)
    closeFn()
  }

  const handleMask = (val) => {
    const masked = val
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
      .replace(/(\d{4})\d+?$/, "$1")

    setNumber(masked)
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Qual o número do cliente</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >
          <div className={styles.modalInputsArea} style={{ padding: "10px 0" }}>
            <div className={styles.inpArea}>
              <TextField
                label="Número"
                name="number"
                value={number}
                onChange={(e) => handleMask(e.target.value)}
                error={Boolean(errorsVerify?.name)}
                helperText={errorsVerify?.name}
                variant="outlined"
                size="small"
                fullWidth
                placeholder={"(99) 99999-9999"}
              />
            </div>
          </div>
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
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              saveNumber()
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

export default WhatsappNumberModal
