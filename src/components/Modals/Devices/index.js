import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormControlLabel,
  DialogActions,
  Checkbox,
} from "@material-ui/core"


const DeviceItem = ({ select, data, checked }) => {

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={() => select(data)}
          defaultChecked
          color="default"
        />
      }
      label={`${data.name} - nº de série (${data.code}) - IMEI (${data.imei})`}
    />
  )

}

const ModalDevices = ({ show, closeFn, finish, allDevices, selected = [] }) => {

  const [picked, setPicked] = useState(selected)

  const handleSelect = async (device) => {
    let isSelected = picked.some(d => d.imei === device.imei)

    if (isSelected) setPicked(picked.filter(d => d.imei !== device.imei))
    else setPicked([...picked, device])
  }

  const closeModal = () => {
    closeFn()
  }

  const clearList = () => {
    finish([])
  }

  useEffect(() => {
    setPicked(selected)
  }, [selected])

  const handleFinish = () => {
    finish(picked)
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle>Filtre por dispositivos</DialogTitle>
      <DialogContent style={{
        paddingVertical: 24,
        maxHeight: "50vh"
      }}
      >
        <div>
          <div style={customStyles.togglersArea}>
            <FormControl>
              {allDevices.map((device, k) => {

                return <DeviceItem
                  select={handleSelect}
                  data={device}
                  checked={picked.some(d => d.imei === device.imei)}
                />
              })}
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
            onClick={handleFinish}
            style={{ cursor: "pointer" }}
          >
            Selecionar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearList}
            style={{ cursor: "pointer" }}
          >
            {selected.length > 0 ? "Limpar filtro" : "Cancelar"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

const customStyles = {
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

export default ModalDevices
