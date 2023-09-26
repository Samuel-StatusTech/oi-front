import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Card, CardContent,
  Typography,
  CircularProgress,
  Button,
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
import ModalCheck from './modal';



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


export default (props) => {
  const [loading, setLoading] = useState(false);
  const styles = useStyles();
  const { event } = props;
  const [selected, onSelectType] = useState(1);
  const [dateIni, setDateIni] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

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


  return (
    <>
      <ModalCheck show={modalOpen} onClose={() => setModalOpen(false)} />

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
                <CardValue infos={cardInfo} openModalFn={() => setModalOpen(true)} />
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
