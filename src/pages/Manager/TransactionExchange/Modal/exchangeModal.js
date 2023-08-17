import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  DialogActions,
  Card,
  Grid,
  Typography,
  ListItem,
} from '@material-ui/core';
import { Skeleton, Autocomplete } from '@material-ui/lab';
import { Cached } from '@material-ui/icons';
import { TextField } from '@material-ui/core';
import { format } from 'currency-formatter';
import Api from '../../../../api/index';

const ModalExchange = ({ event, show, onClose, data, updateRow }) => {
  const [loading, setLoading] = useState(false);
  const [exchangeList, setExchangeList] = useState({ count: 0, products: {} });
  const [exchangeProduct, setExchangeProduct] = useState([]);
  useEffect(() => {
    if (!show) {
      setExchangeList({ count: 0, products: {} });
      setExchangeProduct([]);
    } else {
      if (data.length) {
        let products = { count: 0, products: {} };
        products.count = data[0].orders.length;
        data[0].orders.map((row) => {
          products['products'][row.product_name] = (parseInt(products['products'][row.product_name], 10) || 0) + 1;
        });
        setExchangeList(products);
      }
    }
  }, [show]);
  const handleChangeProduct = (row) => {
    setExchangeProduct([{ id: row?.id, unit: row?.unit }]);
  };
  const handleExchange = async () => {
    try {
      setLoading(true);
      const exchange = await Api.patch(`/orderproduct/exchangeProduct/${event}`, {
        exchangeList: data[0].orders,
        exchangeProduct: exchangeProduct[0],
      });
      updateRow(exchange.data);
      onClose();
    } catch (err) {
      alert(err.data ? err.data.message : 'Falha ao cancelar!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Trocar</DialogTitle>
      <DialogContent>
        <Grid container alignItems='center' justify='center' direction='row'>
          <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
            <Card>
              <Grid container direction='column'>
                <Grid item style={{ marginTop: 10, marginLeft: 20 }}>
                  <Typography
                    style={{
                      fontSize: 16,
                      color: '#747474',
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    }}
                  >
                    {loading ? (
                      <Skeleton animation='wave' width={100} height={50} />
                    ) : (
                      `Produtos (${exchangeList.count}):`
                    )}
                  </Typography>
                </Grid>
                <Grid item style={{ margin: 20 }}>
                  {Object.entries(exchangeList.products).map((exchange) => (
                    <ListItem key={exchange[0]}>
                      {exchange[0]} x{exchange[1]}
                    </ListItem>
                  ))}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={1} xl={1} align='center'>
            <Cached />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
            <Card>
              <Grid container direction='column'>
                <Grid item style={{ marginTop: 10, marginLeft: 20 }}>
                  <Typography
                    style={{
                      fontSize: 16,
                      color: '#747474',
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    }}
                  >
                    {loading ? <Skeleton animation='wave' width={100} height={50} /> : `Trocar Por:`}
                  </Typography>
                </Grid>
                <Grid item style={{ margin: 20 }}>
                  <Autocomplete
                    id='produtos'
                    getOptionSelected={(option, value) => option?.id == value?.id}
                    options={data[0]?.productList.map((product) => ({
                      id: product.id,
                      title: product.name,
                      unit: product.price_sell,
                    }))}
                    onChange={(event, row) => {
                      handleChangeProduct(row);
                    }}
                    size='small'
                    getOptionLabel={(option) => option?.title}
                    renderInput={(params) => <TextField {...params} label='Produto' variant='outlined' />}
                    fullWidth
                  />
                  {exchangeProduct[0]?.unit && (
                    <ListItem key={exchangeProduct[0]?.id}>
                      Valor Unitário: {format(exchangeProduct[0].unit / 100, { code: 'BRL' })}
                    </ListItem>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Não
        </Button>
        <Button type='button' onClick={handleExchange} variant='outlined' color='primary'>
          {loading ? (
            <>
              Trocando <CircularProgress size={25} />
            </>
          ) : (
            'Trocar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(ModalExchange);
