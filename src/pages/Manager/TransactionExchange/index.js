import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import EaseGrid from '../../../components/EaseGrid';

import Api from '../../../api';
import { format } from 'currency-formatter';
import { Cached } from '@material-ui/icons';
import ModalExchange from './Modal/exchangeModal';
const TransactionProduct = ({ event }) => {
  const columns = [
    { title: 'Produto', field: 'product_name' },
    { title: 'Nro Transação', field: 'order_id' },
    { title: 'QR Code', field: 'qr_code' },
    {
      title: 'Valor',
      field: 'price_unit',
      render({ price_unit }) {
        return format(price_unit / 100, { code: 'BRL' });
      },
    },

    {
      title: 'Status Pgto',
      field: 'status',
      lookup: {
        cancelamento: 'Cancelado',
        validado: 'Normal',
      },
    },
    {
      title: 'Status Ticket',
      field: 'date_validated',
      render({ date_validated }) {
        return date_validated ? 'Validado' : 'Não Validado';
      },
    },
  ];
  const loadData = async () => {
    try {
      setLoading(true);
      const newData = await Api.get(`/orderproduct/getAllProductsOrder/${event}`);
      setData(newData.data);
      const newProductList = await Api.get('/product/getFilterList');
      setProductList(newProductList.data.products);
    } catch (error) {
      alert(error?.mesage ?? 'Ocorreu um erro ao pegar os dados');
    } finally {
      setLoading(false);
    }
  };
  const updateDataChange = (exchanges) => {
    let newData = [...data];
    exchanges.map((exchange) => {
      let index = newData.findIndex((element) => element.qr_code === exchange.qr_code);
      newData[index] = exchange;
    });
    return newData;
  };
  const updateRows = async (exchanges) => {
    try {
      const result = await updateDataChange(exchanges);
      setData(result);
    } catch (error) {
      alert(error?.message ?? 'Ocorreu algum erro');
    }
  };
  const exchangeOrderProductsList = async (orderProductsList) => {
    try {
      setLoading(true);
      await setExchangeData([{ orders: orderProductsList, productList }]);
      setShowExchange(true);
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro ao cancelar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event) {
      loadData();
    } else {
      console.log('Sem evento');
    }
  }, [event]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeData, setExchangeData] = useState({});
  const [productList, setProductList] = useState([]);
  return (
    <Grid container direction='column' spacing={2}>
      <ModalExchange
        show={showExchange}
        onClose={() => setShowExchange(false)}
        data={exchangeData}
        updateRow={updateRows}
      />
      <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          config={{
            rowStyle: (row) => ({
              backgroundColor: row.status === 'cancelamento' ? '#fff0f0' : 'white',
            }),
            pageConfig: {
              selection: true,
              filtering: true,
              selectionProps: (row) => {
                return {
                  color: 'primary',
                };
              },
            },
          }}
          title='Trocar Produtos'
          columns={columns}
          data={data}
          isLoading={loading}
          actions={[
            {
              tooltip: 'Trocar',
              icon: () => <Cached />,
              onClick: (evt, rows) => {
                exchangeOrderProductsList(rows);
              },
            },
          ]}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(TransactionProduct);
