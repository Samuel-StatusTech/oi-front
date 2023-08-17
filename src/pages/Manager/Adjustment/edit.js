import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import EaseGrid from '../../../components/EaseGrid';

import QuantityColumn from './Columns/quantity';
import Api from '../../../api';

import Card from './Card';
import CardMoney from './Card/Money';
import CardDebit from './Card/Debit';
import CardCredit from './Card/Credit';

export default ({ history }) => {
  const { products = [], payments = [], ...data } = history.location.state;
  const viewMode = data.status === 'cancelamento';
  const [list, setList] = useState(products);
  const [paymentList, setPaymentList] = useState(payments);
  const [buttonLoading, setLoading] = useState(false);

  const [, setValue] = useState(0);
  const [actualValue, setActualValue] = useState(0);
  const [paidValue, setPaidValue] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const value = payments.reduce((value, payment) => payment.price + value, 0);

    setValue(value);
    setPaidValue(value);
    setActualValue(value);
  }, [payments]);

  useEffect(() => {
    const value = list.reduce(
      (value, product) => (product.deleted ? 0 : product.price_total) + value,
      0
    );

    console.log(value);
    setActualValue(value);
  }, [list]);

  const columns = [
    { title: 'Produto', field: 'name' },
    { title: 'Grupo', field: 'group_name' },
    // { title: 'Código de barra', field: "group_id" },
    {
      title: 'Valor',
      field: 'price_total',
      type: 'currency',
      currencySetting: { locale: 'pt-BR', currencyCode: 'BRL' },
      headerStyle: { textAlign: 'right' },
    },
    {
      title: 'Quantidade',
      field: 'quantity',
      render: (row) => (
        <QuantityColumn
          {...row}
          handleIncrement={handleIncrementProduct}
          handleDecrement={handleDecrementProduct}
          disabled={viewMode}
        />
      ),
    },
    // { title: 'Validação', field: "group_id" },
    {
      title: 'Ação',
      field: 'action',
      render: (row) => (
        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              color={row.deleted ? 'primary' : 'secondary'}
              size="small"
              onClick={() => handleToggleProduct(row.id)}
              disabled={viewMode}
            >
              {row.deleted ? 'Desfazer' : 'Remover'}
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleToggleProduct = (id) => {
    const product = list.find((product) => product.id === id);

    if (!product) {
      return;
    }

    setList((previous) =>
      previous.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            deleted: !item.deleted,
          };
        }

        return item;
      })
    );
  };

  const handleIncrementProduct = (id) => {
    setList((previous) =>
      previous.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            price_total: (item.quantity + 1) * item.price_unit,
            quantity: item.quantity + 1,
          };
        }

        return item;
      })
    );
  };

  const handleDecrementProduct = (id) => {
    setList((previous) =>
      previous.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            price_total: (item.quantity - 1) * item.price_unit,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
    );
  };

  const handleChangePayment = (payment_type, value = 0) => {
    const payment = paymentList.find(
      (payment) => payment.payment_type === payment_type
    );
    let payments = paymentList;
    if (!payment) {
      console.log('Não tem');
      payments = [
        ...payments,
        {
          order_id: parseInt(id, 10),
          payment_type,
          price: value,
        },
      ];
    } else {
      console.log('Tem');
      payments = payments.map((item) => {
        if (item.payment_type === payment_type) {
          return {
            ...item,
            price: value,
          };
        }

        return item;
      });
    }

    const paidValue = payments.reduce(
      (value, payment) => payment.price + value,
      0
    );

    console.log('PaidValue =>', paidValue, '\nNew Value =>', value);
    console.log('Payments =>', payments);

    setPaidValue(paidValue);
    setPaymentList(payments);
  };

  const handleBack = () => {
    history.push('/dashboard/adjustment');
  };

  const handleSave = async () => {
    try {
      if (buttonLoading) {
        return;
      }

      setLoading(true);

      await Api.post(`/order/editOrder/${id}`, {
        products: list.filter((product) => !product.deleted),
        payments: paymentList,
        status: data.status,
        waiter_code: data.waiter_code,
      });
      handleBack();
    } catch (e) {
      alert('Não foi possível alterar a compra');
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid columns={columns} data={list} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <CardMoney
              payments={paymentList}
              handleChange={handleChangePayment}
              disabled={viewMode}
            />
          </Grid>
          <Grid item>
            <CardDebit
              payments={paymentList}
              handleChange={handleChangePayment}
              disabled={viewMode}
            />
          </Grid>
          <Grid item>
            <CardCredit
              payments={paymentList}
              handleChange={handleChangePayment}
              disabled={viewMode}
            />
          </Grid>
          <Grid item>
            <Card title="Valor total" value={actualValue} disabled />
          </Grid>
          {viewMode ? null : (
            <Grid item>
              <Card
                title="Valor residual"
                value={actualValue - paidValue}
                disabled
                error={actualValue - paidValue !== 0}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleBack}>
              Cancelar
            </Button>
          </Grid>
          {viewMode ? null : (
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSave}
                disabled={actualValue - paidValue !== 0}
              >
                {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
