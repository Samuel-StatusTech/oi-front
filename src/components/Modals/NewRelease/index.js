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
  RadioGroup,
  Radio,
} from "@material-ui/core"

import useStyles from "../../../global/styles"

import { ReactComponent as Arrow } from "../../../assets/icons/arrow.svg"
import { format } from "currency-formatter"

const DECIMAL_SIZE = 2

export const types = [
  {
    id: "0",
    name: "Serviços",
    parsed: "Servicos",
  },
  {
    id: "1",
    name: "Vendas",
    parsed: "Vendas",
  },
  {
    id: "2",
    name: "Pagamentos",
    parsed: "Pagamentos",
  },
  {
    id: "3",
    name: "Antecipação",
    parsed: "Antecipacao",
  },
  {
    id: "4",
    name: "Descontos",
    parsed: "Descontos",
  },
  {
    id: "5",
    name: "Outros",
    parsed: "Outros",
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

  const [isSending, setIsSending] = useState(false)

  const [dropdownView, setDropdownView] = useState(false)

  const [type, setType] = useState(types[0])
  const [description, setDescription] = useState("Locação Sistema/Maq")
  const [taxQnt, setTaxQnt] = useState(0)
  const [operation, setOperation] = useState("debitar")
  const [unVal, setUnVal] = useState("0,00")
  const [currentVal, setCurrentVal] = useState("0,00")

  const toggleDropdown = () => {
    setDropdownView(!dropdownView)
  }

  const generateObj = () => {
    let obj = {
      type: type.name,
      description,
      tax_quantity: String(taxQnt),
      unitary_value: String(parseFloat(unVal.replace(",", ".")) * 100),
      total_value: String(
        Number.parseFloat(currentVal.replace(",", ".")) * 100
      ),
      operation,
    }

    if (singleInfo && singleInfo.id) obj.id = singleInfo.id

    return obj
  }

  const handleEdit = async () => {
    setIsSending(true)
    const data = generateObj()
    const res = await updateRelease(data)
    setIsSending(false)

    if (res) closeModal()
    else {
      alert("Por favor, preencha todos os campos")
    }
  }

  const handleInsert = async () => {
    setIsSending(true)
    const data = generateObj()
    const res = await insertRelease(data)
    setIsSending(false)

    if (res) closeModal()
    else {
      alert("Por favor, preencha todos os campos")
    }
  }

  const closeModal = () => {
    setType(types[0])
    setDescription("Locação Sistema/Maq")
    setTaxQnt(0)
    setOperation("debitar")
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
    setType(relItem)
    setDropdownView(false)
  }

  useEffect(() => {
    if (singleInfo) {
      const t = types.find((t) => t.parsed === singleInfo.type) ?? types[0]

      setType(t)
      setDescription(singleInfo.description)
      setTaxQnt(parseFloat(singleInfo.tax_quantity))
      setOperation(singleInfo.operation)
      setUnVal(format(singleInfo.unitary_value / 100, { code: "BRL" }).slice(2))
      setCurrentVal(
        format(singleInfo.total_value / 100, { code: "BRL" }).slice(2)
      )
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
              {/* type */}
              <div style={customStyles.inputContainer}>
                <label style={customStyles.label} htmlFor={"newName"}>
                  Tipo
                </label>
                <div style={customStyles.selectWrapper}>
                  <button style={customStyles.select} onClick={toggleDropdown}>
                    <span>{type.name}</span>
                    <Arrow className={dropdownView ? "flipped" : ""} />
                  </button>
                  <div
                    style={{
                      ...customStyles.optionsList,
                      ...{ display: dropdownView ? "flex" : "none" },
                    }}
                  >
                    {types.map((rt, k) => (
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

              {/* description */}
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

              {/* tax */}
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

              {/* un value */}
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

              {/* total value */}
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
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <FormControlLabel
                  value={"debitar"}
                  control={
                    <Radio color="primary" checked={operation === "debitar"} />
                  }
                  label="Debitar"
                />
                <FormControlLabel
                  value={"creditar"}
                  control={
                    <Radio color="primary" checked={operation === "creditar"} />
                  }
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
            {isSending ? (
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
