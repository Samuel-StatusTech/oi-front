import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';

import EaseGrid from '../../../components/EaseGrid';

import Api from '../../../api';
import { format } from 'currency-formatter';
import { formatDatetime } from '../../../utils/date';
const TransactionProduct = ({ event }) => {
  const columns = [
    { title: 'Produto', field: 'product_name' },
    { title: 'Nro Transação', field: 'order_id' },
    { title: 'QR Code', field: 'qr_code' },
    {
      title: 'Valor',
      field: 'price_unit',
      render({ price_unit, parent_id }) {
        if (parent_id) return null;
        return format(price_unit / 100, { code: 'BRL' });
      },
    },
    {
      title: 'Validado',
      field: 'date_validated',
      render: ({ date_validated }) => {
        return !date_validated ? null : formatDatetime(date_validated);
      },
    },
    { title: 'Cancelado Por', field: 'canceled_by' },
    {
      title: 'Data/Hora Cancelado',
      field: 'canceled_date',
      render({ canceled_date }) {
        return !canceled_date ? null : formatDatetime(canceled_date);
      },
    },
    { title: 'Cancelamento', field: 'canceled_location' },
  ];
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const newData = await Api.get(`/order/getAllOrdersDetails/${event}`);
      setData(newData.data);
    } catch (error) {
      alert(error?.mesage ?? 'Ocorreu um erro ao pegar os dados');
    } finally {
      setLoading(false);
    }
  }, [event]);
  
  const updateChildRows = ({ data, where, status, canceled_location, canceled_date, canceled_by }) => {
    const length = data.length;
    for (let i = 0; i < length; i++) {
      if (`${data[i]?.id ?? data[i].parent_id}${data[i]?.combo_group}${data[i]?.order_id}` === where) {
        data[i] = { ...data[i], canceled_location, canceled_date, canceled_by, status };
      }
    }
    return data;
  };

  const updateDataChange = (orders) => {
    let newData = [...data];
    orders.forEach((order) => {
      if (order?.qr_code) {
        let index = newData.findIndex((element) => element?.qr_code === order?.qr_code);
        newData[index] = order;
      } else if (order?.id) {
        newData = updateChildRows({
          data: newData,
          where: `${order?.id}${order?.combo_group}${order?.order_id}`,
          status: order.status,
          canceled_location: order.canceled_location,
          canceled_date: order.canceled_date,
          canceled_by: order.canceled_by,
        });
      }
    });
    return newData;
  };

  const uncheckAll = (orders) => {
    const newData = orders.map((order) => {
      if (order?.tableData?.checked) order.tableData.checked = false;
      return order;
    });
    return newData;
  };
  
  const cancelOrderProductsList = async (orderProductsList) => {
    try {
      setLoading(true);
      const ordersRequest = await Api.patch('/order/cancelAllOrderList/', {
        orderProductsList,
        canceled_location: 'web',
      });
      const orders = await updateDataChange(ordersRequest.data);
      setData(await uncheckAll(orders));
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro ao cancelar');
    } finally {
      setLoading(false);
    }
  };

  const uncancelOrderProductsList = async (orderProductsList) => {
    try {
      setLoading(true);
      const ordersRequest = await Api.patch('/order/uncancelAllOrderList/', { orderProductsList });
      const orders = await updateDataChange(ordersRequest.data);
      setData(await uncheckAll(orders));
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro ao desfazer o cancelamento');
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
  }, [event, loadData]);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          config={{
            rowStyle: (row) => ({
              backgroundColor: row.status === 'cancelamento' ? '#fff0f0' : 'white',
            }),
            pageConfig: {
              selection: true,
              selectionProps: (row) => {
                return {
                  disabled: row.parent_id ? true : false,
                  color: 'primary',
                };
              },
            },
          }}
          title='Cancelamentos'
          columns={columns}
          data={data}
          isLoading={loading}
          parentChildData={(row, rows) =>
            rows.find((a) => a.id + a.combo_group + a.order_id === row.parent_id + row.combo_group + row.order_id)
          }
          actions={[
            {
              tooltip: 'Cancelar',
              icon: () => (
                <Button variant='outlined' size='small' color='secondary'>
                  Cancelar
                </Button>
              ),
              onClick: (evt, rows) => {
                const orders = rows.filter((row) => {
                  return row.tableData.path.length === 1;
                });

                cancelOrderProductsList(orders);
              },
            },
            {
              tooltip: 'Desfazer Cancelamento',
              icon: () => (
                <Button variant='outlined' size='small' color='secondary'>
                  Desfazer
                </Button>
              ),
              onClick: (evt, rows) => {
                const orders = rows.filter((row) => {
                  return row.tableData.path.length === 1;
                });
                uncancelOrderProductsList(orders);
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
