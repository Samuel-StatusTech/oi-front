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
  const parseBRL = (v) => {
    return `R$ ${String(v.toFixed(2)).replace(".", ",")}`
  }

  const calcTotal = async (transactions, from) => {
    let details = {
      credit: 0,
      debit: 0,
      pix: 0,
    }

    return new Promise((resolve) => {
      if (from === "pagseguro") {
        transactions.reduce((acc, t, i) => {
          const parsedMoney = parsePagMoney(t.Valor_Bruto)
          const currentTotal = acc + parsedMoney

          switch (t.Tipo_Pagamento) {
            case "Cartão de Crédito":
              details.credit = details.credit + parsedMoney
              break
            case "Cartão de Débito":
              details.debit = details.debit + parsedMoney
              break
            case "Pix":
              details.pix = details.pix + parsedMoney
              break
          }

          if (i === transactions.length - 1) {
            resolve({
              resume: parseBRL(currentTotal),
              details: {
                credit: parseBRL(details.credit),
                debit: parseBRL(details.debit),
                pix: parseBRL(details.pix),
              },
            })
          } else return currentTotal
        }, 0)
      } else if (from === "back") {
        transactions.reduce((acc, t, i) => {
          const parsedMoney = parseMoney(t.total_price)
          const currentTotal = acc + parsedMoney

          t.payments.forEach((p) => {
            switch (p.payment_type) {
              case "credito":
                details.credit = details.credit + parsedMoney
                break
              case "debito":
                details.debit = details.debit + parsedMoney
                break
              case "pix":
                details.pix = details.pix + parsedMoney
                break
            }
          })

          if (i === transactions.length - 1) {
            resolve({
              resume: parseBRL(currentTotal),
              details: {
                credit: parseBRL(details.credit),
                debit: parseBRL(details.debit),
                pix: parseBRL(details.pix),
              },
            })
          } else return currentTotal
        }, 0)
      }
    })
  }

  const filterBackData = (log) => {
    return log.filter((transaction) => {
      return !transaction.payments.some((p) =>
        "dinheiro".includes(p.payment_type.toLowerCase())
      )
    })
  }

  const filterPagSeguro = (log) => {
    const { iniDate, endDate } = dates

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
      const data = await csvtojson({
        delimiter: ";",
        encoding: "ascii",
      }).fromString(text)
      const checkable = filterPagSeguro(data)

      setCheckProgress(12.5)

      setPagData({
        fileName: file.name,
        data: checkable,
      })
    }

    reader.readAsText(file, "ascii")
  }

  const closeModal = () => {
    setCheckProgress(0)
    setPagData(null)
    setFinishMessage(null)
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

    return `${d} ${h}`
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

  const parseBaseData = (arr) => {
    let filtered = []

    arr.forEach((a) => {
      filtered.push({
        Transacao_ID: a.Transacao_ID,
        Tipo_Pagamento: a.Tipo_Pagamento,
        Data_Compensacao: a.Data_Compensacao,
        Valor_Bruto: `R$ ${parsePagMoney(a.Valor_Bruto)
          .toFixed(2)
          .replace(".", ",")}`,
      })
    })

    return filtered
  }

  const findNotRegs = (from, on) => {
    let kk = []
    let arr = []

    const filtered = from.filter((i) => {
      const regEx = new RegExp(i.Codigo_Venda)

      const id = on.findIndex((t) => {
        if (t.payments.length > 1) kk.push(t)

        return t.payments.some((p) => {
          return p.machineData.match(regEx)
        })
      })

      return id === -1
    })

    kk.forEach((t) => {
      if (!arr.some((a) => a.id === t.id)) arr.push(t)
    })

    return [...parseBaseData(filtered)]
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
      const backData = req.data.orders

      const filteredBack = filterBackData(backData)
      const cancelledData = backData.filter((t) => t.status === "cancelamento")

      const machinesInEvent = getEventSerials(filteredBack)

      const pagDataFromMachines = filterPagDataByMachines(machinesInEvent)

      const pagTotal = await calcTotal(pagDataFromMachines, "pagseguro")
      const backTotal = await calcTotal(filteredBack, "back")

      const notRegistereds = findNotRegs(pagDataFromMachines, filteredBack)

      const totals = {
        pagseguro: pagTotal,
        backData: backTotal,
        cancelled: cancelledData,
        notReg: notRegistereds,
      }

      finish(totals)

      changeProgress(100)

      setIsChecking(false)
      closeModal()
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
