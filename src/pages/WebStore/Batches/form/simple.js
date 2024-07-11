import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { connect } from "react-redux"

import Api from '../../../../api';
import InputMoney from '../../../../components/Input/Money';

const SimpleProduct = ({ event, user }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const { handleSubmit, register } = useForm();
  const [action] = useState(idProduct === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [, setBatches] = useState([]);
  const [canSave, setCanSave] = useState(false);

  // Dados do lote
  const [batch_name, setBatchName] = useState('');
  const [batch_qnt, setBatchQnt] = useState('');
  const [priceSell, setPriceSell] = useState('');
  const [batch_exp, setBatchExp] = useState(new Date());

  const loadData = async () => {
    try {
      await Api.get(`/${event}/batches`)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setBatches(data)

            const thisBatch = data.find(b => b.id === idProduct)

            if (thisBatch) {
              setBatchName(thisBatch.batch_name)
              setBatchQnt(thisBatch.quantity)
              setPriceSell(thisBatch.price_sell)
              setBatchExp(thisBatch.data_expiracao)
            }
          } else {
            alert('Não foi possível carregar os dados. Tente novamente mais tarde');
            handleCancel();
          }
        })
    } catch (error) {
      alert('Não foi possível carregar os dados. Tente novamente mais tarde');
    }
    setLoading(false);
  }

  useEffect(() => {
    if (idProduct === "new") setLoading(false)
    else loadData()
    // eslint-disable-next-line
  }, []);

  const returnObj = () => {

    const expDate = new Date(batch_exp).toISOString()
    const sendableDate = expDate.slice(0, expDate.length - 5)

    let obj = {
      batch_name: batch_name,
      quantity: +batch_qnt,
      price_sell: +priceSell,
      data_expiracao: sendableDate,
    }

    return obj;
  };

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      if (!batch_name) {
        alert('Escolha um nome');
        return false;
      } else if (!batch_qnt) {
        alert('Defina uma quantidade');
        return false;
      } else if (!batch_exp) {
        alert('Defina uma data de expiração');
        return false;
      }

      const obj = returnObj();

      if (!obj) return false

      await Api.post(`/${event}/batches`, obj);
      handleCancel();
    } catch (e) {
      if (e.response) {
        const data = e.response.data;

        if (data.error) {
          alert(data.error);
        } else {
          alert('Erro não esperado');
        }
      } else {
        alert('Erro não esperado');
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setButtonLoading(true);

      const obj = returnObj();

      if (!obj) {
        return false;
      }

      await Api.put(`/${event}/batches/${idProduct}`, obj);
      handleCancel();
    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const onSubmit = () => {
    if (action) {
      handleSave();
      return;
    }
    handleEdit();
  };

  // eslint-disable-next-line
  const handleCancel = useCallback(() => {
    history.push('/dashboard/batches');
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setCanSave(!!batch_name, !!batch_qnt, !!batch_exp)
  }, [batch_name, batch_qnt, batch_exp])

  if (loading) {
    return (
      <Grid container spacing={2} justify='center'>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Card>
        <CardContent>

          <div style={{
            display: 'flex',
            justifyContent: "space-between"
          }}>

            <Grid container spacing={2} item lg={6} md={6} sm={12} xs={12}>
              <Grid item xs={6}>
                <TextField
                  name='batchName'
                  value={batch_name}
                  onChange={(e) => setBatchName(e.target.value)}
                  label='Lote'
                  variant='outlined'
                  size='small'
                  style={{ minWidth: 100 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  label='Data de expiração'
                  name='dateexp'
                  value={batch_exp}
                  onChange={setBatchExp}
                  inputRef={register}
                  minDate={new Date()}
                  minDateMessage='A data não deve ser menor que a data atual'
                  inputVariant='outlined'
                  variant='inline'
                  format='DD/MM/YYYY'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name='quantity'
                  value={batch_qnt}
                  onChange={(e) => setBatchQnt(e.target.value)}
                  label='Quantidade'
                  variant='outlined'
                  size='small'
                  style={{ minWidth: 100 }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <InputMoney
                  name='priceSell'
                  value={priceSell}
                  onChange={({ value }) => setPriceSell(value)}
                  label='Preço de venda'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </Grid>

              <Grid item lg={8} md={8} sm={12} xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 24 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button variant='outlined' color='secondary' onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button type='submit' variant='outlined' color='primary' disabled={!canSave}>
                        {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>
    </form >
  );
};

const mapStateToProps = ({ event, user }) => ({ event, user });

export default connect(mapStateToProps)(SimpleProduct);
