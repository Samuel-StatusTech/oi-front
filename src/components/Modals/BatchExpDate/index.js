import React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Typography,
} from "@material-ui/core"

import useStyles from "../../../global/styles"

const BatchExpDateModal = ({ show, save, closeFn }) => {
  const styles = useStyles()

  const closeModal = () => {
    closeFn()
  }

  const saveNumber = () => {
    save()
    closeFn()
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle style={{ fontWeight: 600 }}>Cuidado</DialogTitle>
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
              <Typography>A data de expiração é hoje.<br />O que deseja fazer?</Typography>
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
            gap: 24
          }}
        >
          <Button
            variant="outlined" style={{
              color: "#FF7043",
              cursor: "pointer",
              borderColor: "#FF7043"
            }}
            onClick={() => {
              saveNumber()
            }}
          >
            Salvar mesmo assim
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              closeModal()
            }}
          >
            Quero alterar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default BatchExpDateModal
