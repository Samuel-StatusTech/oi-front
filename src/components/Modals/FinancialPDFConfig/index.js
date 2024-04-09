import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  DialogActions,
} from "@material-ui/core"

import useStyles from "../../../global/styles"
import { formatDate } from "../../../utils/date"

const FinancialPdfConfigModal = ({ show, genPDF, setDate, closeFn, date, showTaxes, setShowTaxes }) => {
  const styles = useStyles()

  const [fDate, setFDate] = useState(formatDate(date))

  const closeModal = () => {
    setDate(formatDate)
    setShowTaxes(true)
    closeFn()
  }

  const getITime = () => {
    let dateData = fDate.split('/')
    let dString = `${dateData[2]}-${dateData[1]}-${dateData[0]}`
    return new Date(dString).getTime()
  }

  const saveDate = () => {
    const iTime = getITime()
    setDate(iTime)
    genPDF()
  }

  const handleMask = (val) => {
    let v = ""

    const masked = val
      .replace(/\D/g, "")


    if (masked.length < 3) {
      v = masked.slice(0)
    } else {
      if (masked.length > 2 && masked.length <= 4)
        v = masked.slice(0, 2) + "/" + masked.slice(2);
      else if (masked.length > 4)
        v = masked.slice(0, 2) + "/" + masked.slice(2, 4) + "/" + masked.slice(4, 8);
    }

    setFDate(v)
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Por favor informe...</DialogTitle>
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
                label="Previsão de pagamento"
                name="date"
                value={fDate}
                onChange={(e) => handleMask(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                placeholder={"xx/xx/xxxx"}
              />
            </div>
            <div className={styles.inpArea}>
              <input
                type={"checkbox"}
                checked={showTaxes}
                id="showTaxes"
                name="showTaxes"
                onChange={() => {
                  setShowTaxes(!showTaxes)
                }}
              />
              <label htmlFor="showTaxes" style={{ cursor: 'pointer' }}>Mostrar taxas de intermediação (SIM / NÃO)</label>
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
            gap: 12,
            marginRight: 24,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              saveDate()
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

export default FinancialPdfConfigModal
