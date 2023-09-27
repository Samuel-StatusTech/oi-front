import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@material-ui/core';

import Api from '../../../../api'
import useStyles from '../../../../global/styles';
import csvtojson from 'csvtojson';



const TableTh = ({ value, alignRight = false }) => {
  const style = { fontWeight: 'bold', color: 'black', whiteSpace: 'nowrap' }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}

const TableTd = ({ value, alignRight = false }) => {
  const style = { whiteSpace: 'nowrap' }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}


const ModalCheck = ({ show, onClose }) => {

  const styles = useStyles()

  const [pagData, setPagData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [dataErrors, setDataErrors] = useState([]);
  const [checkProgress, setCheckProgress] = useState(0);
  const [finishMessage, setFinishMessage] = useState(null);
  const pagDataInput = useRef(null);


  const changeProgress = (value) => {
    setCheckProgress(value + 30 < 100 ? value + 30 : 100)
  }

  const loadPagseguroData = async (e) => {

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async f => {
      const text = f.target.result
      const data = await csvtojson({ delimiter: ';' }).fromString(text)
      const checkable = data.filter(transaction => transaction.Tipo_Pagamento.toLowerCase !== 'dinheiro')

      setCheckProgress(12.5)

      setPagData({
        fileName: file.name,
        data: checkable
      })
    }

    reader.readAsText(file)
  }

  const closeModal = () => {
    setCheckProgress(0)
    setDataErrors([])
    setPagData(null)
    onClose()
  }

  const padValue = (v) => {
    return String(v).padStart(2, '0')
  }

  const parseMoney = (v) => {
    return `R$ ${(Number(v) / 100).toFixed(2).replace('.', ',')}`
  }

  const parseDate = (v) => {
    const date = new Date(v)
    const
      d =
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

    const req = await Api.get('/order/getList/f8eb3d9a6373?status=todos&type=todos&per_page=1000000&page=0')
      .then(res => {
        setCheckProgress(30)
        setTimeout(null, 300)
        return res
      })

    if (req.status === 200) {
      const backData = req.data.orders

      let serialsErrors = []

      let chunks = backData.length > 3000 ? [
        backData.slice(0, Math.ceil(backData.length / 3)),
        backData.slice(Math.ceil(backData.length / 3), (Math.ceil(backData.length / 3) * 2)),
        backData.slice((Math.ceil(backData.length / 3) * 2), backData.length)
      ] : [[...backData]]

      pagData.data.map((k, i) => {

        const o = function () {
          const c1 = chunks[0].find((e, index) => {
            let match = (e.id === k.Transacao_ID)

            if (match) chunks[0] = chunks[0].filter((e, i) => i !== index)
            return match
          })
          if (typeof c1 !== "undefined") return c1


          if (chunks.length > 1) {
            const c2 = chunks[1].find((e, index) => {
              let match = (e.id === k.Transacao_ID)

              if (match) chunks[1] = chunks[1].filter((e, i) => i !== index)
              return match
            })
            if (typeof c2 !== "undefined") return c2

            const c3 = chunks[2].find((e, index) => {
              let match = (e.id === k.Transacao_ID)

              if (match) chunks[2] = chunks[2].filter((e, i) => i !== index)
              return match
            })
            if (typeof c3 !== "undefined") return c3
            else return null
          } else {
            return null
          }
        }()

        if (o) {
          const pagNumber = Number(k.Valor_Bruto.replace(',', '.'))
          const ownNumber = Number(o.total_price.replace(',', '.'))

          if (pagNumber !== ownNumber) serialsErrors.push({
            Transacao_ID: o.id,
            Valor_Bruto: parseMoney(ownNumber),
            PagSeguro_Valor_Bruto: parseMoney(pagNumber),
            Data_Transacao: parseDate(o.Data_Transacao),
            Serial_Leitor: k.Serial_Leitor,
            Codigo_Usuario: k.Codigo_Usuario,
            Codigo_Venda: k.Codigo_Venda,
          })
        } else {
          serialsErrors.push({
            Transacao_ID: k.Transacao_ID,
            Valor_Bruto: 'Não encontrado',
            PagSeguro_Valor_Bruto: parseMoney(k.Valor_Bruto),
            Data_Transacao: k.Data_Transacao,
            Serial_Leitor: k.Serial_Leitor,
            Codigo_Usuario: k.Codigo_Usuario,
            Codigo_Venda: k.Codigo_Venda,
          })
        }

        if (i % Math.floor(pagData.data.length / 50) === 0) {
          let newPoint = Number(((i / ((pagData.data.length / 8) * 7)) * 100).toFixed(1))
          changeProgress(newPoint)
        }
      })

      if (serialsErrors.length === 0) {
        setFinishMessage('Os dados estão corretos')
        setIsChecking(false)
        return
      } else if (serialsErrors.length !== pagData.data.length) {
        setDataErrors(serialsErrors)
      }
      else {
        setFinishMessage('todos os dados estão incorretos')
      }
      setIsChecking(false)
    } else {
      setIsChecking(false)
      setFinishMessage('Não foi possível verificar. Tente novamente mais tarde.')
    }
  }

  const triggerPagInput = () => {
    if (pagDataInput.current) pagDataInput.current.click()
  }


  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Conciliar com PagSeguro</DialogTitle>
      <DialogContent>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          maxHeight: '60vh'
        }}>
          <div className={styles.modalInputsArea}>
            <div className={styles.inpArea}>
              <input hidden
                type='file'
                ref={pagDataInput}
                onChange={loadPagseguroData}
                accept=".csv"
              />
              <Button onClick={triggerPagInput} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                Selecionar arquivo PagSeguro (.csv)
              </Button>
              {pagData && <Typography>{pagData.fileName}</Typography>}
            </div>
          </div>

          <div className={styles.progressArea}>
            <div className={styles.progressBar} style={{ width: `${checkProgress}%` }}></div>
          </div>

          {finishMessage &&
            <span style={{ textAlign: 'center' }}>{finishMessage}</span>
          }

          {!isChecking && dataErrors.length > 0 && !finishMessage &&
            <TableContainer component={Paper} style={{
              boxShadow: 'none',
              flex: 1,
              overflowY: 'auto'
            }}>
              <Table size="medium" aria-label="conflicting-data">
                <TableHead>
                  <TableRow>
                    <TableTh value={'ID da transação'} />
                    <TableTh value={'Registrado'} />
                    <TableTh value={'PagSeguro'} />
                    <TableTh value={'Data'} />
                    <TableTh value={'Nº leitor'} />
                    <TableTh value={'Código de usuário'} />
                    <TableTh value={'Código de venda'} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataErrors.map((row, k) => (
                    <TableRow
                      key={k}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableTd value={row.Transacao_ID} />
                      <TableTd value={row.Valor_Bruto} />
                      <TableTd value={row.PagSeguro_Valor_Bruto} />
                      <TableTd value={row.Data_Transacao} />
                      <TableTd value={row.Serial_Leitor} />
                      <TableTd value={row.Codigo_Usuario} />
                      <TableTd value={row.Codigo_Venda} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </div>

      </DialogContent>
      <DialogActions>
        <Button
          type='button'
          onClick={checkTotal}
          variant='outlined'
          color='primary'
          disabled={pagData === null}
        >
          {isChecking ? (
            <>
              <span style={{ marginRight: 4 }}>Checando </span><CircularProgress size={25} />
            </>
          ) : (
            'Checar'
          )}
        </Button>
        <Button variant='outlined' color='secondary' onClick={closeModal} style={{
          cursor: 'pointer'
        }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog >
  )

}


export default ModalCheck