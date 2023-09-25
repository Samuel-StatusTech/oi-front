import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Card, CardContent,
  Typography,
  CircularProgress,
  Button,
  Modal,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  styled
} from '@material-ui/core';

import Api from '../../../../api';
import axios from 'axios';
import { format } from 'currency-formatter';
import csvtojson from 'csvtojson';

import { Between } from '../../../../components/Input/DateTime';
import { formatDateTimeToDB } from '../../../../utils/date';
import useStyles from '../../../../global/styles';
import CardData from '../../../../components/CardData';
import returnsTotalIcon from '../../../../assets/icons/ic_total-extornos.svg';
import creditTotalIcon from '../../../../assets/icons/ic_total-credito.svg';
import debitTotalIcon from '../../../../assets/icons/ic_total-debito.svg';
import pixTotalIcon from '../../../../assets/icons/ic_total-pix.svg';
import virtualIcon from '../../../../assets/icons/ic_loja.svg';
import othersIcon from '../../../../assets/icons/ic_outrasdespesas.svg';
import Bar from '../../../../components/Chart/Bar';



const CardValue = ({ infos, openModalFn }) => {
  const styles = useStyles();

  const { totalRecipe = 0, cardPixGross = 0, cardPixNet = 0, virtualGross = 0, virtualNet = 0, withdrawal = 0, balance = 0 } = infos;

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} direction='row' className={styles.marginT15}>
          <Grid item direction='column' lg={3} md={3} sm={6} xs={12} className={`${styles.borderRightBottomCard}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item xs={12}>
              <Typography className={styles.h2}>Total Receita</Typography>
              <Typography className={styles.moneyLabelBlue}>  {format(totalRecipe / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={12} md={12} xs={12} sm={12} style={{ display: 'flex', alignItems: 'end' }}>
              <Button onClick={openModalFn} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>Conciliar arquivos
              </Button>
            </Grid>
          </Grid>
          <Grid container item lg={3} md={3} sm={6} xs={12} className={`${styles.borderRightBottomCard}`}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Cartões Pix/Bruto</Typography>
              <Typography className={styles.moneyLabelBlue}>  {format(cardPixGross / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Cartões Pix/Líquido</Typography>
              <Typography className={styles.moneyLabelBlue}>
                {format(cardPixNet / 100, { code: 'BRL' })}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item lg={3} md={3} sm={6} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Loja Virtual Bruto</Typography>
              <Typography className={styles.moneyLabelBlue}>  {format(virtualGross / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Loja Virtual Líquido</Typography>
              <Typography className={styles.moneyLabelBlue}>
                {format(virtualNet / 100, { code: 'BRL' })}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item lg={3} md={3} sm={6} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Retiradas Loja Virtual</Typography>
              <Typography className={styles.moneyLabelBlue}>  {format(withdrawal / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography className={styles.h2}>Saldo Loja Virtual</Typography>
              <Typography className={styles.moneyLabelBlue}>
                {format(balance / 100, { code: 'BRL' })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const TableTh = ({ value, alignRight = false }) => {
  const style = {
    fontWeight: 'bold',
    color: 'black',
    whiteSpace: 'nowrap',
  }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}

const TableTd = ({ value, alignRight = false }) => {
  const style = {
    whiteSpace: 'nowrap',
  }

  return (
    <TableCell style={style} align={alignRight ? 'right' : 'left'}>
      {value}
    </TableCell>
  )
}


export default (props) => {
  const [loading, setLoading] = useState(false);
  const styles = useStyles();
  const { event } = props;
  const [selected, onSelectType] = useState(1);
  const [dateIni, setDateIni] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [pagData, setPagData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [dataErrors, setDataErrors] = useState([]);
  const [checkProgress, setCheckProgress] = useState(0);
  const pagDataInput = useRef(null);
  const excDataInput = useRef(null);

  const [cardInfo, setCardInfo] = useState({});
  const [payment, setPayment] = useState({
    gross: {
      money: 0,
      credit: 0,
      debit: 0,
      pix: 0
    },
    net: {
      credit: 0,
      debit: 0,
      pix: 0
    }
  });
  const cancelTokenSource = useRef();

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (event) {
        const dateIniFormatted = formatDateTimeToDB(dateIni);
        const dateEndFormatted = formatDateTimeToDB(dateEnd);

        const dateURL = selected !== 1 ? `?date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}` : '';

        cancelTokenSource.current = axios.CancelToken.source();
        const { data } = await Api.get(`/statistical/financialOverview/${event}${dateURL}`, { cancelToken: cancelTokenSource.current.token });
        setPayment(data.paymentInfo);
        setCardInfo(data.cardInfo);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected != 2) {
      onSearch();
    }
  }, [event, selected]);

  const onSearch = () => {
    if (cancelTokenSource && cancelTokenSource.current) {
      cancelTokenSource.current.cancel()
      setTimeout(() => {
        handleSearch();
      }, 500);
    } else {
      handleSearch();
    }
  }

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

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCheckProgress(0)
    setDataErrors([])
    setPagData(null)
    setExcelData(null)
  }

  const infos = {
    infoCards: [
      {
        title: 'Vendas Dinheiro',
        icon: { src: returnsTotalIcon, alt: 'Ícone dinheiro' },
        value: payment.gross.money,
        smallLabel: <>Bruto: {format(payment.gross.money / 100, { code: 'BRL' })}<br />Líquido: {format(payment.gross.money / 100, { code: 'BRL' })}</>
      },
      {
        title: 'Vendas Débito',
        icon: { src: debitTotalIcon, alt: 'Ícone vendas débito' },
        value: payment.gross.debit,
        smallLabel: <>Bruto: {format(payment.gross.debit / 100, { code: 'BRL' })}<br />Líquido: {format(payment.net.debit / 100, { code: 'BRL' })}</>
      },
      {
        title: 'Vendas Crédito',
        icon: { src: creditTotalIcon, alt: 'Ícone vendas crédito' },
        value: payment.gross.credit,
        smallLabel: <>Bruto: {format(payment.gross.credit / 100, { code: 'BRL' })}<br />Líquido: {format(payment.net.credit / 100, { code: 'BRL' })}</>
      },
      {
        title: 'Vendas Pix',
        icon: { src: pixTotalIcon, alt: 'Ícone vendas pix' },
        value: payment.gross.pix,
        smallLabel: <>Bruto: {format(payment.gross.pix / 100, { code: 'BRL' })}<br />Líquido: {format(payment.net.pix / 100, { code: 'BRL' })}</>
      },
      {
        title: 'Loja Virtual',
        icon: { src: virtualIcon, alt: 'Ícone loja virtual' },
        value: 0,
        smallLabel: <>Bruto: {format(0, { code: 'BRL' })}<br />Líquido: {format(0, { code: 'BRL' })}</>
      },
      {
        title: 'Outras Receitas',
        icon: { src: othersIcon, alt: 'Ícone outras receitas' },
        value: 0,
        smallLabel: <>Bruto: {format(0, { code: 'BRL' })}<br />Líquido: {format(0, { code: 'BRL' })}</>
      },
    ],
  };

  const changeProgress = (value) => setCheckProgress(value)

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
    <>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby='modal-conciliator-modal'
        aria-describedby="modal-matching-files"
      >
        <Box className={styles.modalBox}>
          <Typography className={styles.modalTitle}>Conciliar com PagSeguro</Typography>
          <button
            onClick={closeModal}
            className={styles.closeModalButton}
          >X</button>

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

          <Button
            disabled={!(pagData !== null && excelData !== null)}
            onClick={checkTotal}
            style={{
              color: '#0097FF',
              border: '1px solid #0097FF',
              width: '100%',
              opacity: (pagData !== null && excelData !== null) ? 1 : .6
            }}
          >
            Checar valores
          </Button>


          <div className={styles.progressArea}>
            <div className={styles.progressBar} style={{ width: `${checkProgress}%` }}></div>
          </div>

          {!isChecking && checkProgress > 99 && dataErrors.length === 0 &&
            <Typography style={{ textAlign: 'center' }}>Os dados estão corretos.</Typography>
          }

          {!isChecking && dataErrors.length > 0 &&
            <div className={styles.modalTableArea}>
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
            </div>
          }
        </Box>
      </Modal>

      <Grid container direction='column' spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Between
                iniValue={dateIni}
                endValue={dateEnd}
                onChangeIni={setDateIni}
                onChangeEnd={setDateEnd}
                selected={selected}
                onSelectType={onSelectType}
                onSearch={onSearch}
                size='small'
              />
            </Grid>
          </Grid>
        </Grid>

        {loading ?
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 20 }}>
            <CircularProgress />
          </div>
          :
          <Grid item container>
            <Grid container spacing={2}>
              <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                <CardValue infos={cardInfo} openModalFn={openModal} />
              </Grid>
              <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                <Card>
                  <CardContent >
                    <Typography className={`${styles.h2} ${styles.textCenter}`}>Formas de Pagamento</Typography>
                    <Bar
                      series={[payment.gross.credit / 100, payment.gross.debit / 100, payment.gross.money / 100, payment.gross.pix / 100, 0, 0]}
                      labels={['Crédito', 'Débito', 'Dinheiro', 'Pix', 'Loja Virtual', 'Outras Receitas']}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <Grid container spacing={2}>
                  {infos.infoCards.map((item, index) => (
                    <Grid item xl={2} lg={2} md={4} sm={6} xs={12} key={index}>
                      <CardData title={item.title} smallLabel={item.smallLabel} value={format(item.value / 100, { code: 'BRL' })} icon={item.icon} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    </>
  );
};
