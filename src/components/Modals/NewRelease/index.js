import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormControlLabel,
  CircularProgress,
  DialogActions,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core"

import useStyles from "../../../global/styles"
import { GreenSwitch } from "../../../components/Switch"

const DECIMAL_SIZE = 2

const ModalNewRelease = ({
  show,
  closeFn,
  singleInfo,
  insertRelease,
  updateRelease,
}) => {
  const styles = useStyles()

  const [isCreating, setIsCreating] = useState(false)
  const [isTaxQnt, setIsTaxQnt] = useState("tax")
  const [isInOut, setIsInOut] = useState("in")
  const [isTax, setIsTax] = useState(false)
  const [isDebt, setIsDebt] = useState(false)
  const [finishMessage, setFinishMessage] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [taxQnt, setTaxQnt] = useState(0)
  const [currentVal, setCurrentVal] = useState("0,00")

  const generateObj = () => {
    let obj = {
      name,
      description,
      tax: taxQnt,
      isTax,
      isDebt,
      value: Number.parseFloat(currentVal.replace(",", ".")) * 100,
    }

    if (singleInfo && singleInfo.id) obj.id = singleInfo.id

    return obj
  }

  const handleEdit = () => {
    const data = generateObj()
    updateRelease(data)
    closeModal()
  }

  const handleInsert = () => {
    const data = generateObj()
    insertRelease(data)
    closeModal()
  }

  const closeModal = () => {
    setName("")
    setDescription("")
    setTaxQnt(0)
    setCurrentVal("0,00")
    setIsTaxQnt("qnt")
    setIsTaxQnt("in")
    setIsTax(false)
    setIsDebt(false)

    closeFn()
  }

  const handleTaxQnt = (val) => {
    const filtered = val.replace(/\D/g, "")
    setTaxQnt(filtered)
  }

  const getMaskedValue = (val) => {
    const unccomaStr = val.replace(",", "").replace(".", "")

    const sizeSlice = unccomaStr.length - DECIMAL_SIZE
    const newStr = [
      unccomaStr.slice(0, sizeSlice),
      ".",
      unccomaStr.slice(sizeSlice).padStart(2, "0"),
    ].join("")

    const n = Number.parseFloat(newStr).toFixed(2).replace(".", ",")

    return n
  }

  const handleValue = (val) => {
    if (val.length > 0) {
      const masked = getMaskedValue(val)
      setCurrentVal(masked)
    } else {
      setCurrentVal("0,00")
    }
  }

  useEffect(() => {
    if (singleInfo) {
      let treatedValue = 0
      if (singleInfo.value > 0) {
        treatedValue = parseFloat(singleInfo.value / 100)
          .toFixed(2)
          .replace(".", ",")
      } else {
        treatedValue = "0,00"
      }

      setName(singleInfo.name)
      setDescription(singleInfo.description)
      setTaxQnt(singleInfo.tax)
      setIsTaxQnt(singleInfo.isTax ? "tax" : "qnt")
      setIsInOut(singleInfo.isDebt ? "out" : "in")
      setIsTax(singleInfo.isTax)
      setIsDebt(singleInfo.isDebt)
      setCurrentVal(treatedValue)
    }
  }, [singleInfo])

  useEffect(() => {
    setIsTax(isTaxQnt === "tax")
  }, [isTaxQnt])

  useEffect(() => {
    setIsDebt(isInOut === "out")
  }, [isInOut])

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
                <div style={customStyles.moneyInputArea}>
                  <div style={customStyles.currencyBox}>
                    <span>R$</span>
                  </div>
                  <input
                    style={customStyles.currencyInput}
                    type="text"
                    name="value"
                    // value={format(value, { code: 'BRL' })}
                    value={currentVal}
                    onChange={(e) => handleValue(e.target.value)}
                    placeholder="Valor do lançamento"
                  />
                </div>
              </div>
            </div>
            <div style={customStyles.togglersArea}>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Taxa ou Quantidade
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isTaxQnt}
                  onChange={(e) => setIsTaxQnt(e.target.value)}
                >
                  <FormControlLabel
                    value={"tax"}
                    control={
                      <Radio color="primary" checked={isTaxQnt === "tax"} />
                    }
                    label="Taxa"
                  />
                  <FormControlLabel
                    value={"qnt"}
                    control={
                      <Radio color="primary" checked={isTaxQnt === "qnt"} />
                    }
                    label="Quantidade"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Entrada ou saída
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isInOut}
                  onChange={(e) => setIsInOut(e.target.value)}
                >
                  <FormControlLabel
                    value={"in"}
                    control={
                      <Radio color="primary" checked={isInOut === "in"} />
                    }
                    label="Entrada"
                  />
                  <FormControlLabel
                    value={"out"}
                    control={
                      <Radio color="primary" checked={isInOut === "out"} />
                    }
                    label="saida"
                  />
                </RadioGroup>
              </FormControl>
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
            onClick={singleInfo ? handleEdit : handleInsert}
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
    paddingBottom: 24,
    borderBottom: "1px solid #CECECE",
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
  moneyInputArea: {
    boxShadow: "0 2px 4px 1px rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    width: 300,
    display: "flex",
  },
  currencyBox: {
    padding: 8,
    backgroundColor: "#F1F1F1",
    borderRight: "1px solid #CECECE",
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
  currencyInput: {
    padding: 8,
    fontSize: 16,
    flex: 1,
    border: "none",
    outline: "none",
  },
  togglersArea: {
    display: "flex",
    gap: 24,
  },
}

export default ModalNewRelease
