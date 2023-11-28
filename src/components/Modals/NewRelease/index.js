import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
  DialogActions,
} from "@material-ui/core"

import Api from "../../../api"
import useStyles from "../../../global/styles"
import csvtojson from "csvtojson"

const ModalNewRelease = ({ show, closeFn, singleInfo }) => {
  const styles = useStyles()

  const [isCreating, setIsCreating] = useState(false)
  const [isTax, setIsTax] = useState(false)
  const [finishMessage, setFinishMessage] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [taxQnt, setTaxQnt] = useState(0)
  const [value, setValue] = useState(0)

  const closeModal = () => {
    setName("")
    setDescription("")
    setTaxQnt(0)
    setValue(0)

    closeFn()
  }

  const handleTaxQnt = (value) => {
    const filtered = value
      // .replace(/\D+/g, "")
    setTaxQnt(filtered)
  }

  const handleValue = (value) => {
    const isNegative = Number(value) < 0

    const filtered = value.replace(/\D+/g, "")

    setValue(`${isNegative ? "-" : ""}${filtered}`)
  }

  useEffect(() => {

    if (singleInfo) {
      setName(singleInfo.name)
      setDescription(singleInfo.description)
      setTaxQnt(singleInfo.tax)
      setValue(singleInfo.value)
    }
  }, [singleInfo])

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle>Registrar Lançamento</DialogTitle>
      <DialogContent
        style={{
          paddingVertical: 24,
        }}
      >
        <div>
          <div className={styles.modalInputsArea}>
            <div style={customStyles.inputsArea}>
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newName"}>
                  Nome
                </label>
                <input
                  style={customStyles.input}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do lançamento"
                />
              </div>
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newDescription"}>
                  Descrição
                </label>
                <input
                  style={customStyles.input}
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="De onde veio ou para onde vai"
                />
              </div>
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newTax"}>
                  Taxa / Quantidade
                </label>
                <input
                  style={customStyles.input}
                  type="text"
                  name="tax"
                  value={taxQnt}
                  onChange={(e) => handleTaxQnt(e.target.value)}
                  placeholder="Taxa / Quantidade"
                />
              </div>
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newValue"}>
                  Valor
                </label>
                <input
                  style={customStyles.input}
                  type="text"
                  name="value"
                  value={value}
                  onChange={(e) => handleValue(e.target.value)}
                  placeholder="Valor do lançamento"
                />
              </div>
            </div>
          </div>

          {finishMessage && (
            <span style={{ textAlign: "center" }}>{finishMessage}</span>
          )}
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
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              //
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {isCreating ? (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CircularProgress size={25} />
              </div>
            ) : singleInfo ? (
              "Editar"
            ) : (
              "Adicionar"
            )}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={closeModal}
            style={{
              cursor: "pointer",
            }}
          >
            Cancelar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

const customStyles = {
  inputsArea: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    maxHeight: "60vh",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
  },
  input: {
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    width: 300,
    border: "none",
    outline: "none",
    boxShadow: "0 2px 4px 1px rgba(0, 0, 0, 0.2)",
  },
}

export default ModalNewRelease
