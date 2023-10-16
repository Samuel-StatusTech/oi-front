import React, { useState } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Button, CircularProgress } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import EaseGrid from '../../../../../../components/EaseGrid';

import { format } from 'currency-formatter';

import totalIcon from '../../../../../../assets/icons/ic_total.svg';
import cashSalesIcon from '../../../../../../assets/icons/ic_total-dinheiro.svg';
import creditTotalIcon from '../../../../../../assets/icons/ic_total-credito.svg';
import debitTotalIcon from '../../../../../../assets/icons/ic_total-debito.svg';
import pixTotalIcon from '../../../../../../assets/icons/ic_total-pix.svg';
import outputsIcon from '../../../../../../assets/icons/ic_sangria.svg';
import returnsTotalIcon from '../../../../../../assets/icons/ic_total-extornos.svg';
import CardData from '../../../../../../components/CardData';
import useStyles from '../../../../../../global/styles';
import Api from '../../../../../../api';
import firebase from '../../../../../../firebase';

export default (props) => {
  const { title, data = [], payments, operations, userKey, event, dateIni, dateEnd, group } = props;
  const { money=0, debit=0, credit=0, pix=0 } = payments ?? {};
  const { sangria=0, aporte=0 } = operations ?? {};
  const styles = useStyles();

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: 'Grupo', field: 'group_name' },
    { title: 'Produto', field: 'product_name' },
    { title: 'Quantidade', field: 'quantity' },
    { title: 'Valor unitário', field: 'price_unit', render: ({ price_unit }) => price_unit == 'Variável' ? 'Variável' : formatValue(price_unit / 100) },
    { title: 'Valor total', field: 'price_total', render: ({ price_total }) => formatValue(price_total / 100) },
  ];

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const formatValue = (value) => format(value, { code: 'BRL' });

  const infos = {
    infoCards: [
      {
        title: 'Total Receita',
        icon: { src: totalIcon, alt: 'Ícone total receita' },
        value: money + debit + credit + pix,
      },
      {
        title: 'Sangrias',
        icon: { src: outputsIcon, alt: 'Ícone total sangrias' },
        value: sangria,
      },
      {
        title: 'Aportes',
        icon: { src: cashSalesIcon, alt: 'Ícone total aportes' },
        value: aporte,
      },
      {
        title: 'Vendas Dinheiro',
        icon: { src: returnsTotalIcon, alt: 'Ícone vendas dinheiro' },
        value: money,
      },
      {
        title: 'Vendas Débito',
        icon: { src: debitTotalIcon, alt: 'Ícone vendas débito' },
        value: debit,
      },
      {
        title: 'Vendas Crédito',
        icon: { src: creditTotalIcon, alt: 'Ícone vendas crédito' },
        value: credit,
      },
      {
        title: 'Vendas Pix',
        icon: { src: pixTotalIcon, alt: 'Ícone vendas pix' },
        value: pix,
      },
    ],
  };

  const exportPdfReport = async () => {
    if(loading)
      return
    setLoading(true);
    Api.post(`/reportPDF/product`, {
      operator: userKey,
      operatorName: title,
      event, 
      dateIni, 
      dateEnd,
      group
    })
    .then(({ data }) => {
      firebase.storage().ref(`reports/${event}/${userKey}.pdf`).getDownloadURL().then(function(url) {
          setLoading(false);
          window.open(url, '_blank')
      });
    })
    .catch((error) => {
        setLoading(false);
        console.log({error})
    });
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      className={styles.backgroundTransparent}
      style={{
        boxShadow: `${
          expanded
            ? '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
            : 'none'
        }`,
      }}
    >
      <AccordionSummary className={styles.displayInlineFlex} expandIcon={<ExpandMoreIcon />}>
        <Typography className={styles.h2}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={styles.backgroundWhite}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            {1===0 &&
              <Button onClick={exportPdfReport} style={{ color: '#0097FF', border: '1px solid #0097FF'}}>
                {loading ?
                  <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                    <CircularProgress size={20} color='#0097FF' />
                  </div>
                :
                  'Gerar PDF'
                }
              </Button>
            }
          </Grid>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            <Grid container spacing={2}>
              {(!group || group == 'all') && infos.infoCards.map((item, index) => (
                <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={index}>
                  <CardData title={item.title} value={format(item.value / 100, { code: 'BRL' })} icon={item.icon} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item lg md xs sm>
            <EaseGrid data={data} columns={columns} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
