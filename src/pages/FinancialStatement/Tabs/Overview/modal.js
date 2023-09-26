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
  const [excelData, setExcelData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [dataErrors, setDataErrors] = useState([]);
  const [checkProgress, setCheckProgress] = useState(0);
  const pagDataInput = useRef(null);
  const excDataInput = useRef(null);


  const changeProgress = (value) => setCheckProgress(value)

  const loadPagseguroData = async (e) => {

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = f => {
      const xml = f.target.result
      const obj = new DOMParser().parseFromString(xml, "text/xml")
      const transactions = obj.querySelectorAll('Table')

      let data = []

      transactions.forEach(t => {
        let fields = {}
        const fieldInfo = Array.from(t.children)
        fieldInfo.forEach(i => { fields[i.localName] = i.innerHTML })
        data.push(fields)
      })

      if (checkProgress <= 25) setCheckProgress(checkProgress + 12.5)

      setPagData({
        fileName: file.name,
        data: data
      })
    }

    reader.readAsText(file)
  }

  const loadExcelData = async (e) => {

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async f => {
      const text = f.target.result
      const data = await csvtojson({ delimiter: ';' }).fromString(text)
      const checkable = data.filter(transaction => transaction.Tipo_Pagamento.toLowerCase !== 'dinheiro')

      if (checkProgress <= 25) setCheckProgress(checkProgress + 12.5)

      setExcelData({
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
    setExcelData(null)
    onClose()
  }

  const checkTotal = async () => {
    setIsChecking(true)
    setCheckProgress(25)

    let serialsErrors = []

    let chunks = excelData.data.length > 3000 ? [
      excelData.data.slice(0, Math.ceil(excelData.data.length / 3)),
      excelData.data.slice(Math.ceil(excelData.data.length / 3), (Math.ceil(excelData.data.length / 3) * 2)),
      excelData.data.slice((Math.ceil(excelData.data.length / 3) * 2), excelData.data.length)
    ] : [...excelData.data]

    pagData.data.map((k, i) => {

      const o = function () {
        const c1 = chunks[0].find((e, index) => {
          let match = (e.Transacao_ID === k.Transacao_ID)

          if (match) chunks[0] = chunks[0].filter((e, i) => i !== index)
          return match
        })
        if (typeof c1 !== "undefined") return c1

        const c2 = chunks[1].find((e, index) => {
          let match = (e.Transacao_ID === k.Transacao_ID)

          if (match) chunks[1] = chunks[1].filter((e, i) => i !== index)
          return match
        })
        if (typeof c2 !== "undefined") return c2

        const c3 = chunks[2].find((e, index) => {
          let match = (e.Transacao_ID === k.Transacao_ID)

          if (match) chunks[2] = chunks[2].filter((e, i) => i !== index)
          return match
        })
        if (typeof c3 !== "undefined") return c3
        else return null
      }()


      if (o) {
        const pagNumber = Number(k.Valor_Bruto.replace(',', '.'))
        const ownNumber = Number(o.Valor_Bruto.replace(',', '.'))

        if (pagNumber !== ownNumber) serialsErrors.push({
          Transacao_ID: o.Transacao_ID,
          Valor_Bruto: `R$ ${ownNumber.toFixed(2).replace('.', ',')}`,
          PagSeguro_Valor_Bruto: `R$ ${pagNumber.toFixed(2).replace('.', ',')}`,
          Data_Transacao: o.Data_Transacao,
          Serial_Leitor: o.Serial_Leitor,
          Codigo_Usuario: o.Codigo_Usuario,
          Codigo_Venda: o.Codigo_Venda,
        })

        if (i % Math.floor(pagData.data.length / 5) === 0) {
          let newPoint = Number(((i / pagData.data.length) * 100).toFixed(1))
          setTimeout(() => changeProgress(newPoint), 100)
        }
      } else {
        serialsErrors.push({
          Transacao_ID: k.Transacao_ID,
          Valor_Bruto: 'não encontrado',
          PagSeguro_Valor_Bruto: `R$ ${Number(k.Valor_Bruto.replace(',', '.'))}`,
          Data_Transacao: k.Data_Transacao,
          Serial_Leitor: k.Serial_Leitor,
          Codigo_Usuario: k.Codigo_Usuario,
          Codigo_Venda: k.Codigo_Venda,
        })
      }
    })

    setDataErrors(serialsErrors)
    setIsChecking(false)
  }

  const triggerPagInput = () => {
    if (pagDataInput.current) pagDataInput.current.click()
  }

  const triggerExcInput = () => {
    if (excDataInput.current) excDataInput.current.click()
  }


  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Conciliar com PagSeguro</DialogTitle>
      <DialogContent>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          <div className={styles.modalInputsArea}>
            <div className={styles.inpArea}>
              <input hidden
                type='file'
                ref={pagDataInput}
                onChange={loadPagseguroData}
                accept=".xml"
              />
              <Button onClick={triggerPagInput} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                Selecionar arquivo PagSeguro
              </Button>
              {pagData && <Typography>{pagData.fileName}</Typography>}
            </div>

            <div className={styles.inpArea}>
              <input hidden
                type='file'
                ref={excDataInput}
                onChange={loadExcelData}
                accept=".csv"
              />
              <Button onClick={triggerExcInput} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                Selecionar arquivo Excel
              </Button>
              {excelData && <Typography>{excelData.fileName}</Typography>}
            </div>
          </div>

          <div className={styles.progressArea}>
            <div className={styles.progressBar} style={{ width: `${checkProgress}%` }}></div>
          </div>

          {!isChecking && dataErrors.length > 0 &&
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
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
                  {dataErrors.map((row) => (
                    <TableRow
                      key={row.name}
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
        <Button type='button' onClick={checkTotal} variant='outlined' color='primary'>
          {isChecking ? (
            <>
              Checando <CircularProgress size={25} />
            </>
          ) : (
            'Checar'
          )}
        </Button>
        <Button variant='outlined' color='secondary' onClick={closeModal}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )

}


export default ModalCheck