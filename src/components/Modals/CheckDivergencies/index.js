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

  const parseTime = (dString) => {
    const [dateFull, hour] = dString.split(" ")
    const date = dateFull.split("/")
    const dmyFormat = `${date[1]}-${date[0]}-${date[2]}`
    const newStr = `${dmyFormat} ${hour}`

    const newD = new Date(newStr).getTime()
    console.log(newD)
    return newD
  }

  const padValue = (v) => String(v).padStart(2, "0")

  const parseMoney = (v) => Number(v) / 100

  const parsePagMoney = (v) => {
    const pureString = v
      .replace(",", ".")
      .substring(-5, v.length - v.indexOf(",0000"))

    return Number(pureString)
  }

  const calcTotal = async (transactions, from) => {
    let total = 0

    return new Promise((resolve) => {
      if (from === "pagseguro") {
        transactions.reduce((acc, t, i) => {
          const currentTotal = acc + parsePagMoney(t.Valor_Bruto)
          if (i === transactions.length - 1) {
            resolve(acc + currentTotal)
          } else return currentTotal
        }, total)
      } else if (from === "back") {
        transactions.reduce((acc, t, i) => {
          const currentTotal = acc + parseMoney(t.total_price)
          if (i === transactions.length - 1) {
            resolve(acc + currentTotal)
          } else return currentTotal
        }, total)
      }
    })
  }

  const filterBackData = (log) => {
    return log.filter((transaction) => {
      return !transaction.payments.some((p) =>
        "dinheiro".includes(p.payment_type.toLowerCase())
      )
      // return !"dinheiro".includes(
      //   transaction.payments[0].payment_type.toLowerCase()
      // )
    })
  }

  const filterPagSeguro = (log) => {
    const { iniDate, endDate } = dates
    console.log(`iniDate: ${iniDate}, endDate: ${endDate}`)

    const hasntFilters = iniDate === null && endDate === null

    const f = hasntFilters
      ? log
      : log.filter(
          (transaction) =>
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

  const getEventSerials = (data) => {
    let codes = []

    data.forEach((order) => {
      order.payments.forEach((p) => {
        if (p.machineData.length > 0) {
          const machInfo = JSON.parse(p.machineData)
          if (machInfo) {
            const machineSerial = machInfo.terminalSerialNumber
            if (!codes.includes(machineSerial)) codes.push(machineSerial)
          }
        }
      })
    })

    return codes
  }

  const filterPagDataByMachines = (machines) => {
    const machinesTransactions = pagData.data.filter((t) =>
      machines.includes(t.Serial_Leitor)
    )

    return machinesTransactions
  }

  const checkTotal = async () => {
    setIsChecking(true)
    setFinishMessage(null)
    setCheckProgress(12.5)

    const req = await Api.get(urlWithFilters).then((res) => {
      setCheckProgress(30)
      setTimeout(null, 300)
      return res
    })

    if (req.status === 200) {
      let serialsErrors = []

      // 1. Pega dados do banco
      const backData = req.data.orders

      // 2. Filtra pelas transações que não envolvem dinheiro (em nenhuma transação)
      const filteredBack = filterBackData(backData)

      // 3. Pega as máquinas que registraram transações no evento
      const machinesInEvent = getEventSerials(filteredBack)
      console.log(machinesInEvent)

      // 4. Filtra os dados do pagseguro dessas máquinas
      const pagDataFromMachines = filterPagDataByMachines(machinesInEvent)

      console.log(
        `pagseguro data (${pagDataFromMachines.length}) - back data (${filteredBack.length})`
      )

      console.log(
        `Total from pagseguro: ${await calcTotal(
          pagDataFromMachines,
          "pagseguro"
        )}`,
        `Total from back: ${await calcTotal(filteredBack, "back")}`
      )

      changeProgress(100)

      // -------

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
        {checkProgress < 99 && (
          <Button
            type="button"
            onClick={checkTotal}
            variant="outlined"
            color="primary"
            disabled={pagData === null || isChecking}
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
        )}
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
