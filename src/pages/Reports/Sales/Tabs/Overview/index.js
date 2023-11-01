import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField, MenuItem, Card, CardContent, CircularProgress, Button } from '@material-ui/core';

import Api from '../../../../../api';
import firebase from '../../../../../firebase';
import axios from 'axios';
import { format } from 'currency-formatter';

import { Between } from '../../../../../components/Input/DateTime';
import Tooltip from '../../../../../components/Tooltip';
import Ranking from '../../../../../components/Ranking';
import { formatDateTimeToDB } from '../../../../../utils/date';
import EaseGrid from '../../../../../components/EaseGrid/index';
import useStyles from '../../../../../global/styles';
import Bar from '../../../../../components/Chart/Bar'
import CardValue from './CardValue';

export default (props) => {
  const showingBtns = false
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
    pix: 0
  });
  const cancelTokenSource = useRef();

  useEffect(() => {
    console.log("Payment", payment)
  }, [payment]);

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

        if(groupURL.length === 0) {

          const { data } = await Api.get(
            `/statistical/resume/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
            { cancelToken: cancelTokenSource.current.token }
          )
          
          const { data:overview } = await Api.get(
            `/statistical/salesOverview/${event}?type=${productType}${dateURL}${groupURL}${courtesiesURL}`,
            { cancelToken: cancelTokenSource.current.token }
          )

          const total = overview.cardInfo.total
          const totalRecipe = total
          const balanceCashless = overview.cardInfo.total_park
          const sales = overview.cardInfo.total
          const balance = productType!=='all'?
            ((total / overview.cardInfo.sales_items)*100):
            overview.cardInfo.total_ticket
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
          if(dateURL.length === 0) {
            // 
            setPayment({
              money: data.totalReceipt.total_money, 
              credit: data.totalReceipt.total_credit, 
              debit: data.totalReceipt.total_debit, 
              pix: data.totalReceipt.total_pix
            });
          } else if(dateURL.length > 0) {
            setPayment(overview.paymentInfo)
          }

        } else {

          cancelTokenSource.current = axios.CancelToken.source();
          const { data } = await Api.get(`/statistical/salesOverview/${event}?&type=${productType}${dateURL}${groupURL}${courtesiesURL}`, { cancelToken: cancelTokenSource.current.token });
  
          const total = data.paymentInfo.money +
            data.paymentInfo.debit +
            data.paymentInfo.credit +
            data.paymentInfo.pix
          
          const totalRecipe = total;
          const balanceCashless = data.cardInfo.total_park;
          const sales = total;

          const balance = productType !=='all' ?
          ((total / data.cardInfo.sales_items) * 100).toFixed(2) :
          data.cardInfo.total_park;
          const salesItems = data.cardInfo.sales_items;
  
          const topListMap = data.productInfo.topList.map((item) => {
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
          if (data.productInfo.productList)
            setProducts(data.productInfo.productList.sort((a, b) => a.name.localeCompare(b.name)));
          setPayment(data.paymentInfo);
          
        }
        
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
                  {showingBtns &&
                    <Button onClick={exportPdfReportByType} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                      {loadingReport ?
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                        <CircularProgress size={20} color='#0097FF' />
                        </div>
                        :
                        'Gerar PDF'
                      }
                    </Button>
                  }
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {showingBtns &&
                <Button onClick={exportPdfReport} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                  {loadingReport ?
                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                      <CircularProgress size={20} color='#0097FF' />
                    </div>
                    :
                    'Gerar PDF'
                  }
               </Button>
              }
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
