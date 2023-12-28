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

import { ReactComponent as Arrow } from "../../../assets/icons/arrow.svg"

const DECIMAL_SIZE = 2

const defaultReleaseTypes = [
  {
    id: "0",
    name: "Serviços",
  },
  {
    id: "1",
    name: "Vendas",
  },
  {
    id: "2",
    name: "Pagamentos",
  },
  {
    id: "3",
    name: "Antecipação",
  },
  {
    id: "4",
    name: "Descontos",
  },
  {
    id: "5",
    name: "Outros",
  },
]

const ModalNewRelease = ({
  show,
  closeFn,
  singleInfo,
  insertRelease,
  updateRelease,
}) => {
  const styles = useStyles()

  const [isCreating, setIsCreating] = useState(false)
  const [finishMessage, setFinishMessage] = useState(null)

  const [dropdownView, setDropdownView] = useState(false)

  const [releaseType, setReleaseType] = useState(defaultReleaseTypes[0])
  const [description, setDescription] = useState("Locação Sistema/Maq")
  const [taxQnt, setTaxQnt] = useState(0)
  const [isInOut, setIsInOut] = useState("out")
  const [unVal, setUnVal] = useState("0,00")
  const [currentVal, setCurrentVal] = useState("0,00")

  const toggleDropdown = () => {
    setDropdownView(!dropdownView)
  }

  const generateObj = () => {
    let obj = {
      releaseType,
      description,
      tax: taxQnt,
      isDebt: isInOut === "out",
      unitaryValue: Number.parseFloat(unVal.replace(",", ".")) * 100,
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
    setReleaseType(defaultReleaseTypes[0])
    setDescription("Locação Sistema/Maq")
    setTaxQnt(0)
    setIsInOut("out")
    setUnVal("0,00")
    setCurrentVal("0,00")

    closeFn()
  }

  const handleTaxQnt = (val) => {
    const filtered = val.replace(/\D/g, "")
    setTaxQnt(Number(filtered))
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

  const changeField = (field, val) => {
    if (field === "total") setCurrentVal(val)
    if (field === "un") setUnVal(val)
  }

  const handleValue = (val, field) => {
    if (val.length > 0) {
      const masked = getMaskedValue(val)
      changeField(field, masked)
    } else {
      setCurrentVal(field, "0,00")
    }
  }

  const handleDropdown = (relItem) => {
    setReleaseType(relItem)
    setDropdownView(false)
  }

  useEffect(() => {
    if (singleInfo) {
      let treatedUnValue = 0
      let treatedValue = 0

      if (singleInfo.value > 0) {
        treatedUnValue = parseFloat(singleInfo.unVal / 100)
          .toFixed(2)
          .replace(".", ",")
        treatedValue = parseFloat(singleInfo.value / 100)
          .toFixed(2)
          .replace(".", ",")
      } else {
        treatedUnValue = "0,00"
        treatedValue = "0,00"
      }

      setReleaseType(singleInfo.releaseType)
      setDescription(singleInfo.description)
      setTaxQnt(singleInfo.tax)
      setIsInOut(singleInfo.isDebt ? "out" : "in")
      setUnVal(treatedUnValue)
      setCurrentVal(treatedValue)
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
                  Tipo
                </label>
                <div style={customStyles.selectWrapper}>
                  <button style={customStyles.select} onClick={toggleDropdown}>
                    <span>{releaseType.name}</span>
                    <Arrow className={dropdownView ? "flipped" : ""} />
                  </button>
                  <div
                    style={{
                      ...customStyles.optionsList,
                      ...{ display: dropdownView ? "flex" : "none" },
                    }}
                  >
                    {defaultReleaseTypes.map((rt, k) => (
                      <button
                        key={k}
                        type="button"
                        style={customStyles.option}
                        onClick={() => handleDropdown(rt)}
                        className="typeOptionItem"
                      >
                        {rt.name}
                      </button>
                    ))}
                  </div>
                </div>
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
                  placeholder="Descreva o lançamento"
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
              {/* valor un */}
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newValue"}>
                  Valor Unitário
                </label>
                <div style={customStyles.moneyInputArea}>
                  <div style={customStyles.currencyBox}>
                    <span>R$</span>
                  </div>
                  <input
                    style={customStyles.currencyInput}
                    type="text"
                    name="unvalue"
                    value={unVal}
                    onChange={(e) => handleValue(e.target.value, "un")}
                  />
                </div>
              </div>
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newValue"}>
                  Valor Total
                </label>
                <div style={customStyles.moneyInputArea}>
                  <div style={customStyles.currencyBox}>
                    <span>R$</span>
                  </div>
                  <input
                    style={customStyles.currencyInput}
                    type="text"
                    name="value"
                    value={currentVal}
                    onChange={(e) => handleValue(e.target.value, "total")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={customStyles.togglersArea}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={isInOut}
                onChange={(e) => setIsInOut(e.target.value)}
              >
                <FormControlLabel
                  value={"out"}
                  control={
                    <Radio color="primary" checked={isInOut === "out"} />
                  }
                  label="Debitar"
                />
                <FormControlLabel
                  value={"in"}
                  control={<Radio color="primary" checked={isInOut === "in"} />}
                  label="Creditar"
                />
              </RadioGroup>
            </FormControl>
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
  select: {
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    width: 300,
    border: "none",
    outline: "none",
    boxShadow: "0 2px 4px 1px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#FFF",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectWrapper: {
    position: "relative",
  },
  optionsList: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    flexDirection: "column",
    position: "absolute",
    top: "calc(100% + 8px)",
    boxShadow: "0 2px 6px 1px rgba(0, 0, 0, 0.4)",
  },
  option: {
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    width: "100%",
    cursor: "pointer",
    border: "none",
    outline: "none",
    display: "flex",
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
