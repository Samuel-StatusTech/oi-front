import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Typography,
  Divider,
  withStyles,
  Card,
  CardContent,
} from '@material-ui/core';

import Api from '../../../api';

import InputMoney from '../../../components/Input/Money';
import SelectGroup from '../../../components/SelectGroup';

const ComplementProduct = ({ user }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const [action] = useState(idProduct === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [description, setDescription] = useState('');
  const [priceSell, setPriceSell] = useState(0);
  const [cashIn, setCashIn] = useState(false);

  const GreenSwitch = withStyles({
    switchBase: {
      '&$checked': {
        color: '#9ACD32',
      },
      '&$checked + $track': {
        backgroundColor: '#9ACD32',
      },
    },
    checked: {},
    track: {},
  })(Switch);

  useEffect(() => {
    console.log(action, user);
    if (!action) {
      Api.get(`/product/getComplement/${idProduct}`)
        .then(({ data }) => {
          const { success, product, product_list } = data;
          console.log(product);
          if (success) {
            setStatus(Boolean(product.status));
            setName(product.name);
            setRawList(product_list);
            setDescription(product.description1);
            setPriceSell(product.price_sell / 100);
            setCashIn(Boolean(product.cash_in));
          } else {
            alert('Não foi possível carregar os dados do complemento');
            handleCancel();
          }
        })
        .catch((e) => {
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
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    try {
      if (groupList.length === 0) {
        alert('Selecione ao menos um item');
        return false;
      }

      setButtonLoading(true);
      await Api.post('/product/createComplement', {
        status,
        name,
        description,
        price_sell: priceSell * 100,
        cash_in: cashIn,
        group_list: groupList,
      });
      handleCancel();
    } catch (e) {
      console.log(e);
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
      if (groupList.length === 0) {
        alert('Selecione ao menos um item');
        return false;
      }

      setButtonLoading(true);
      await Api.put(`/product/updateComplement/${idProduct}`, {
        status,
        name,
        description,
        price_sell: priceSell * 100,
        cash_in: cashIn,
        group_list: groupList,
      });
      handleCancel();
    } catch (e) {
      console.log(e);
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

  const handleCancel = () => {
    history.push('/dashboard/product');
  };

  if (loading) {
    return (
      <Grid container spacing={2} justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item lg={3} md={4} sm={12} xs={12}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Nome"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Observações do complemento"
                  variant="outlined"
                  size="small"
                  multiline
                  fullWidth
                  rows={6}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              }
              label={status ? 'Ativo' : 'Inativo'}
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography style={{ fontWeight: 'bold' }}>
              Selecione abaixo quais grupos poderão ter esse complemento
            </Typography>
            <Divider />
          </Grid>

          <Grid item lg={6} md={8} sm={12} xs={12}>
            <SelectGroup onSelect={setGroupList} rawList={rawList} />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={
                    <GreenSwitch
                      checked={cashIn}
                      onChange={(e) => setCashIn(e.target.checked)}
                    />
                  }
                  label="Cobrar"
                />
              </Grid>
              <Grid item>
                <InputMoney
                  value={priceSell}
                  onChange={({ value }) => setPriceSell(value)}
                  label="Preço de venda"
                  variant="outlined"
                  disabled={!cashIn}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={action ? handleSave : handleEdit}
                >
                  {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ComplementProduct;
