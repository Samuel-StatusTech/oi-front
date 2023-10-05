import React, { useState, useRef } from "react"
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

const ModalCheck = ({ show, finish, urlWithFilters, dates }) => {
  const styles = useStyles()

  const [pagData, setPagData] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [dataErrors, setDataErrors] = useState([])
  const [checkProgress, setCheckProgress] = useState(0)
  const [finishMessage, setFinishMessage] = useState(null)
  const pagDataInput = useRef(null)

  const changeProgress = (value) => {
    setCheckProgress(value + 30 < 100 ? value + 30 : 100)
  }

  const parseTime = (dString) => new Date(dString).getTime()

  const padValue = (v) => String(v).padStart(2, "0")

  const parseMoney = (v) => Number(v) / 100

  const parsePagMoney = (v) => {
    const pureString = v
      .replace(",", ".")
      .substring(-5, v.length - v.indexOf(",0000"))

    return Number(pureString)
  }

  const calcPagTotal = () => {
    let total = 0

    pagData.data.reduce((acc, t) => acc + parsePagMoney(t.Valor_Bruto), total)

    return total
  }

  const calcBackTotal = (transactions) => {
    let total = 0

    transactions.reduce((acc, t) => acc + parseMoney(t.Valor_Bruto), total)

    return total
  }

  const filterPagSeguro = (log) => {
    const { iniDate, endDate } = dates

    const hasntFilters = iniDate === null && endDate === null

    const f = hasntFilters
      ? log.filter(
          (transaction) => transaction.Tipo_Pagamento.toLowerCase !== "dinheiro"
        )
      : log.filter(
          (transaction) =>
            transaction.Tipo_Pagamento.toLowerCase !== "dinheiro" &&
            parseTime(transaction.Data_Transacao) >= iniDate &&
            parseTime(transaction.Data_Transacao) <= endDate
        )

    return f
  }

  const loadPagseguroData = async (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async (f) => {
      const text = f.target.result
      const data = await csvtojson({ delimiter: ";" }).fromString(text)
      const checkable = filterPagSeguro(data)

      setCheckProgress(12.5)

      setPagData({
        fileName: file.name,
        data: checkable,
      })
    }

    reader.readAsText(file)
  }

  const closeModal = () => {
    const data = {
      totals: {
        pag: {
          credit: 0,
          debit: 0,
          pix: 0,
        },
        oi: {
          credit: 0,
          debit: 0,
          pix: 0,
        },
      },
      cancelled: [],
    }

    setCheckProgress(0)
    setDataErrors([])
    setPagData(null)

    finish(!isChecking && checkProgress > 98 ? data : null)
  }

  const parseDate = (v) => {
    const date = new Date(v)
    const d =
        `${padValue(date.getDate())}/` +
        `${padValue(date.getMonth())}/` +
        `${padValue(date.getFullYear())}`,
      h =
        `${padValue(date.getHours())}:` +
        `${padValue(date.getMinutes())}:` +
        `${padValue(date.getSeconds())}`

    return `${d} — ${h}`
  }

  const checkTotal = async () => {
    setIsChecking(true)
    setFinishMessage(null)
    setCheckProgress(12.5)

    const totalPag = calcPagTotal()

    const req = await Api.get(urlWithFilters).then((res) => {
      setCheckProgress(30)
      setTimeout(null, 300)
      return res
    })

    if (req.status === 200) {
      const backData = req.data.orders

      const totalPag = calcPagTotal()
      const totalBack = calcBackTotal(backData)

      if (serialsErrors.length === 0) {
        setFinishMessage("Os dados estão corretos")
        setIsChecking(false)
        return
      } else if (serialsErrors.length !== pagData.data.length) {
        setDataErrors(serialsErrors)
      } else {
        setFinishMessage("todos os dados estão incorretos")
      }
      setIsChecking(false)
    } else {
      setIsChecking(false)
      setFinishMessage(
        "Não foi possível verificar. Tente novamente mais tarde."
      )
    }
  }

  const triggerPagInput = () => {
    if (pagDataInput.current) pagDataInput.current.click()
  }

  return (
    <Dialog open={show} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle>Conciliar com PagSeguro</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "60vh",
          }}
        >
          <div className={styles.modalInputsArea}>
            <div className={styles.inpArea}>
              <input
                hidden
                type="file"
                ref={pagDataInput}
                onChange={loadPagseguroData}
                accept=".csv"
              />
              <Button
                onClick={triggerPagInput}
                style={{ color: "#0097FF", border: "1px solid #0097FF" }}
              >
                Selecionar arquivo PagSeguro (.csv)
              </Button>
              {pagData && <Typography>{pagData.fileName}</Typography>}
            </div>
          </div>

          <div className={styles.progressArea}>
            <div
              className={styles.progressBar}
              style={{ width: `${checkProgress}%` }}
            ></div>
          </div>

          {finishMessage && (
            <span style={{ textAlign: "center" }}>{finishMessage}</span>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          onClick={checkTotal}
          variant="outlined"
          color="primary"
          disabled={pagData === null}
        >
          {isChecking ? (
            <>
              <span style={{ marginRight: 4 }}>Checando </span>
              <CircularProgress size={25} />
            </>
          ) : (
            "Checar"
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
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCheck
