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

const ModalCheck = ({ show, finish, closeFn, urlWithFilters, dates }) => {
  const styles = useStyles()

  const [pagData, setPagData] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [checkProgress, setCheckProgress] = useState(0)
  const [finishMessage, setFinishMessage] = useState(null)
  const pagDataInput = useRef(null)
  const checkBtn = useRef(null)

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
    if (transactions.length === 0) {
      return {
        resume: parseBRL(0),
        details: {
          credit: parseBRL(details.credit),
          debit: parseBRL(details.debit),
          pix: parseBRL(details.pix),
        },
      }
    } else {
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
              return resolve({
                resume: parseBRL(currentTotal),
                details: {
                  credit: parseBRL(details.credit),
                  debit: parseBRL(details.debit),
                  pix: parseBRL(details.pix),
                },
              })
            }

            return acc + parsedMoney
          }, 0)
        }
      })
    }
  }

  const filterBackData = (log) => {
    return log.filter((transaction) => {
      return (
        !transaction.payments.some((p) =>
          "dinheiro".includes(p.payment_type.toLowerCase())
        ) && transaction.status === "validado"
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

  const closeModal = () => {
    setCheckProgress(0)
    setPagData(null)
    setFinishMessage(null)
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
        Data_Transacao: a.Data_Transacao,
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
    setCheckProgress(100)

    const req = await Api.get(urlWithFilters).then((res) => {
      setTimeout(null, 300)
      return res
    })

    if (req.status === 200) {
      const backData = req.data.orders

      if (backData.length > 0 && pagData.data.length > 0) {
        const cancelledData = backData.filter(
          (t) => t.status === "cancelamento"
        )
        const filteredBack = filterBackData(backData)

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
      } else {
        const totals = {
          pagseguro: await calcTotal([], "pagseguro"),
          backData: await calcTotal([], "back"),
          cancelled: [],
          notReg: [],
        }

        finish(totals)
      }

      setIsChecking(false)
      closeModal()
    } else {
      const totals = {
        pagseguro: await calcTotal([], "pagseguro"),
        backData: await calcTotal([], "back"),
        cancelled: [],
        notReg: [],
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

  const triggerCheckBtn = () => {
    if (checkBtn.current) checkBtn.current.click()
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

      setPagData({
        fileName: file.name,
        data: checkable,
      })

      setTimeout(triggerCheckBtn, 300)
    }

    reader.readAsText(file, "ascii")
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
        <div
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {isChecking && (
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
          )}
          <button
            onClick={checkTotal}
            style={{ visibility: "hidden" }}
            ref={checkBtn}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              closeFn()
              closeModal()
            }}
            style={{
              cursor: "pointer",
            }}
          >
            Fechar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCheck
