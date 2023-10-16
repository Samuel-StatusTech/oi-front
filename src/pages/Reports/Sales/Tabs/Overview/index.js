import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField, MenuItem, Card, CardContent, Typography, CircularProgress, Button } from '@material-ui/core';

import Api from '../../../../../api';
import firebase from '../../../../../firebase';
import axios from 'axios';
import { format } from 'currency-formatter';

import { Between } from '../../../../../components/Input/DateTime';
import Tooltip from '../../../../../components/Tooltip';
import Ranking from '../../../../../components/Ranking';
import ChartPieG from './PieG';
import { formatDateTimeToDB } from '../../../../../utils/date';
import EaseGrid from '../../../../../components/EaseGrid/index';
import useStyles from '../../../../../global/styles';
import Bar from '../../../../../components/Chart/Bar'

const titles = {
  sales: {
    all: 'Vendas Bar',
    bar: 'Vendas em Tickets',
    ingresso: 'Ingressos',
    estacionamento: 'Tickets Estacionamento',
  },
  balance: {
    all: 'Vendas Estacionamento',
    bar: 'Vendas em Cashless',
    ingresso: 'Ingressos Cortesia',
    estacionamento: 'Tickets Cortesias',
  },
  balanceCashless: {
    all: 'Vendas Ingressos',
    bar: 'Ticket Médio',
    ingresso: 'Ticket Médio',
    estacionamento: 'Ticket Médio',
  },
  salesItems: {
    all: (
      <Tooltip title='Faturamento com Mesas, Sobras de Recargas e Outros' placement='center'>
        Outras Receitas
      </Tooltip>
    ),
    bar: 'Itens Vendidos',
    ingresso: 'Total de Emitidos',
    estacionamento: 'Total Emitidos',
  },
  infoCards: {
    all: 'Vendas de Tickets',
    bar: 'Itens Vendidos',
    ingresso: 'Ingressos',
    estacionamento: 'Tickets Estacionamento',
  },
  infoCards1: {
    all: 'Saldo Cashless',
    bar: 'Saldo Cashless',
    ingresso: 'Ingressos Cortesias',
    estacionamento: 'Tickets Cortesias',
  },
  infoCards2: {
    all: 'Total Itens Vendidos',
    bar: 'Total Itens Vendidos',
    ingresso: 'Total Emitidos',
    estacionamento: 'Total Emitidos',
  },
  infoCards3: {
    all: 'Total Itens Cancelados',
    bar: 'Total Itens Cancelados',
    ingresso: 'Ingressos Cancelados',
    estacionamento: 'Tickets Cancelados',
  },
};

const CardValue = ({ productType, infos }) => {
  const styles = useStyles();

  const { sales = 0, balanceCashless = 0, balance = 0, salesItems = 0, totalRecipe = 0 } = infos;

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} direction='row' className={styles.marginT15}>
          <Grid item lg={4} md={4} sm={6} xs={12} className={`${styles.borderRight}`}>
            <Typography className={styles.h2}>Total Receita</Typography>
            <Typography className={styles.moneyLabelBlue}>{format(totalRecipe / 100, { code: 'BRL' })}</Typography>
          </Grid>
          <Grid container item lg={8} md={8} sm={6} xs={12}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>{titles['sales'][productType]}</Typography>
              <Typography className={styles.moneyLabel}>{format(sales / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>{titles['balance'][productType]}</Typography>
              <Typography className={styles.moneyLabel}>{(productType === 'ingresso' || productType === 'estacionamento') ? balanceCashless : format(balanceCashless / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>{titles['balanceCashless'][productType]}</Typography>
              <Typography className={styles.moneyLabel}>{format(balance / 100, { code: 'BRL' })}</Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography className={styles.h2}>{titles['salesItems'][productType]}</Typography>
              <Typography className={styles.moneyLabel}>
                {productType !== 'all' ? salesItems / 100 : format(salesItems / 100, { code: 'BRL' })}
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
  const [loadingReport, setLoadingReport] = useState(false);
  const styles = useStyles();
  const { type: productType, event, selected, onSelectType } = props;
  const [groupList, setGroupList] = useState([]);
  const columns = [
    { title: 'Grupo', field: 'group_name' },
    { title: 'Produto', field: 'name' },
    { title: 'Quantidade', field: 'quantity' },
    {
      title: 'Valor unitário',
      field: 'price_sell',
      render: ({ price_sell }) => price_sell == 'Variável' ? 'Variável' : format(price_sell / 100, { code: 'BRL' }),
    },
    {
      title: 'Valor total',
      field: 'price_total',
      render: ({ price_total }) => format(price_total / 100, { code: 'BRL' }),
    },
  ];

  const [group, setGroup] = useState('all');
  const [courtesies, setCourtesies] = useState('all');

  const [dateIni, setDateIni] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [cardInfo, setCardInfo] = useState({});
  const [topList, setTopList] = useState([]);
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState({
    money: 0,
    credit: 0,
    debit: 0,
  });
  const cancelTokenSource = useRef();

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      if (data.success) {
        setGroupList(data.groups);
      } else {
        alert('Erro ao buscar a lista de grupos');
      }
    });
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true)
      if(event) {
        
        const dateIniFormatted = formatDateTimeToDB(dateIni);
        const dateEndFormatted = formatDateTimeToDB(dateEnd);

        const dateURL = selected !== 1 ? `&date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}` : '';
        const groupURL = (group && group != 'all') ? `&group_id=${group}` : '';
        const courtesiesURL = (courtesies && courtesies != 'all') ? `&courtesies=1` : '';
        cancelTokenSource.current = axios.CancelToken.source();

        const { data } = await Api.get(
          `/statistical/resume/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
          { cancelToken: cancelTokenSource.current.token }
        )
        
        const { data:overview } = await Api.get(
          `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
          { cancelToken: cancelTokenSource.current.token }
        )

        const totalRecipe = +data.totalReceipt.total_money +
          +data.totalReceipt.total_debit +
          +data.totalReceipt.total_credit +
          +data.totalReceipt.total_pix
        const balanceCashless = +data.total.total_park
        const sales = +data.total.total_bar
        const balance = +data.total.total_ticket
        const salesItems = overview.cardInfo.sales_items

        const topListMap = overview.productInfo.topList.map((item) => {
          return { label: item.name, value: item.quantity };
        });

        setCardInfo({
          totalRecipe,
          balanceCashless,
          sales,
          balance,
          salesItems,
        });
        setTopList(topListMap);
        if (overview.productInfo.productList)
          setProducts(overview.productInfo.productList.sort((a, b) => a.name.localeCompare(b.name)));
        setPayment(data.paymentInfo);
        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selected != 2) {
      onSearch();
    }
  }, [event, productType, group, selected, courtesies]);

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

  const exportPdfReport = async () => {
    if (loadingReport)
      return
    setLoadingReport(true);
    Api.post(`/reportPDF/product`, {
      event,
      dateIni: selected !== 1 ? formatDateTimeToDB(dateIni) : '',
      dateEnd: selected !== 1 ? formatDateTimeToDB(dateEnd) : ''
    })
      .then(({ }) => {
        firebase.storage().ref(`reports/${event}/all.pdf`).getDownloadURL().then(function (url) {
          setLoadingReport(false);
          window.open(url, '_blank')
        });
      })
      .catch((error) => {
        setLoadingReport(false);
        console.log({ error })
      });
  };

  const exportPdfReportByType = async () => {
    if (loadingReport)
      return
    setLoadingReport(true);
    Api.post(`/reportPDF/product`, {
      event,
      group,
      productType,
      courtesies: courtesies && courtesies != 'all' ? courtesies : 0,
      dateIni: selected !== 1 ? formatDateTimeToDB(dateIni) : '',
      dateEnd: selected !== 1 ? formatDateTimeToDB(dateEnd) : ''
    })
      .then(({ }) => {
        firebase.storage().ref(`reports/${event}/all.pdf`).getDownloadURL().then(function (url) {
          setLoadingReport(false);
          window.open(url, '_blank')
        });
      })
      .catch((error) => {
        setLoadingReport(false);
        console.log({ error })
      });
  };

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          {productType !== 'all' ? (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  <TextField
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    label='Grupo'
                    variant='outlined'
                    size='small'
                    select
                    fullWidth
                  >
                    <MenuItem value='all'>Todos</MenuItem>
                    {groupList
                      .filter((group) => {
                        if (group.type === productType) return true;
                        return false;
                      })
                      .map((group) => (
                        <MenuItem value={group.id}>{group.name}</MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  <TextField
                    value={courtesies}
                    onChange={(e) => setCourtesies(e.target.value)}
                    label='Produtos'
                    variant='outlined'
                    size='small'
                    select
                    fullWidth
                  >
                    <MenuItem value='all'>Todos</MenuItem>
                    <MenuItem value='courtesies'>Somente Cortesias</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                  <Button onClick={exportPdfReportByType} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                    {loadingReport ?
                      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                        <CircularProgress size={20} color='#0097FF' />
                      </div>
                      :
                      'Gerar PDF'
                    }
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button onClick={exportPdfReport} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                {loadingReport ?
                  <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                    <CircularProgress size={20} color='#0097FF' />
                  </div>
                  :
                  'Gerar PDF'
                }
              </Button>
            </Grid>
          )}

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
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
              <CardValue productType={productType} infos={cardInfo} />
            </Grid>
            <Grid item xl={productType !== 'all' ? 3 : 6} lg={6} md={12} sm={12} xs={12}>
              <Card>
                {payment &&
                  ((payment.credit / 100 > 0) || (payment.debit / 100 > 0) || (payment.money / 100 > 0) || (payment.pix / 100 > 0)) &&
                  <Bar
                    money={payment.money / 100}
                    debit={payment.debit / 100}
                    credit={payment.credit / 100}
                    pix={payment.pix / 100}
                    webstore={0}
                    others={0}
                    loading={false}
                  />
                }
              </Card>
            </Grid>
            {productType !== 'all' && (
              <Grid item xl={3} lg={6} md={12} sm={12} xs={12}>
                <Card className={styles.fullHeight}>
                  <CardContent>
                    <Ranking title={'Mais Vendidos'} ranking={topList} />
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12}>
              <EaseGrid columns={columns} data={products} pageSize={10} />
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  );
};
