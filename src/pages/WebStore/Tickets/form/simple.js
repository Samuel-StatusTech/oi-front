import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Card,
  Checkbox,
  MenuItem,
  withStyles,
  CardContent,
} from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { connect } from 'react-redux';

import Api from '../../../../api';
import InputMoney from '../../../../components/Input/Money';

const SimpleProduct = ({ event }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const { handleSubmit, register } = useForm();
  const [action] = useState(idProduct === 'new');
  const [errorsVerify] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [groupList, setGroupList] = useState([]);

  // Dados do produto
  const [status, setStatus] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [type, setType] = useState('ingresso');
  const [group, setGroup] = useState('');
  const [batch, setBatch] = useState('');
  const [priceSell, setPriceSell] = useState('');
  const [hasCourtesy, setHasCourtesy] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [warehouseType, setWarehouseType] = useState('notControled');

  const [canSave, setCanSave] = useState(true);

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
    let groupData = groupList.find((groupItem) => groupItem.id === group);

    if (groupList.length > 0 && groupData && groupData.type !== type) {
      groupData = groupList.find((groupItem) => groupItem.type === type);

      if (groupData) {
        setGroup(groupData.id);
      }
    }
  }, [group, groupList, type]);

  useEffect(() => {
    console.log(priceSell)
    setCanSave(!!name && !!batch)
  }, [name, batch, priceSell]);

  useEffect(() => {
    if (!action) {  // edit
      Promise.all([
        Api.get(`/${event}/batches`)
          .then(({ data }) => {

            if (Array.isArray(data)) {
              setBatchList(data);
            } else {
              alert('Erro ao carregar os lotes');
              handleCancel();
            }
          }),
        Api.get(`/group/getList`).then(({ data }) => {
          const { success, groups } = data;

          if (success) {
            setGroupList(groups);
          } else {
            alert('Erro ao carregar os grupos');
            handleCancel();
          }
        }),
        Api.get(`/ecommerce/product/getList?eventId=${event}`).then(({ data }) => {

          if (Array.isArray(data)) {

            const t = data.find(tk => tk.id === idProduct)
            if (t) {
              setBatch(t.batch_id);
              setName(t.name);
              setImage(t.image ?? null)
              setType(t.type);
              setPriceSell(t.price_sell);
              setHasCourtesy(t.has_courtesy);
              setWarehouseType(t.warehouse_type);
              setQuantity(t.quantity)
              setStatus(t.active === 1);
              setFavorite(t.favorite === 1);
            }

          } else {
            alert('Não foi possível carregar os dados do ticket');
            handleCancel();
          }
        }),
      ]).finally(() => {
        setLoading(false);
      });
    } else {  // new
      Promise.all([
        Api.get(`/${event}/batches`)
          .then(({ data }) => {

            if (Array.isArray(data)) {
              setBatchList(data);
            } else {
              alert('Erro ao carregar os lotes');
              handleCancel();
            }
          }),
        Api.get(`/group/getList`)
          .then(({ data }) => {
            const { success, groups } = data;

            if (success) {
              setGroupList(groups);
            } else {
              alert('Erro ao carregar os grupos');
              handleCancel();
            }
          })

      ])
        .finally(() => {
          setLoading(false);
        })

    }
    // eslint-disable-next-line
  }, []);

  const handleBatch = async (batch_id) => {
    try {
      setBatch(batch_id)
      setQuantity(batchList.find(b => b.id === batch_id).quantity ?? 0)
      setPriceSell(batchList.find(b => b.id === batch_id).price_sell ?? "0")
    } catch (error) {
      // ...
    }
  }

  const returnFormData = () => {
    const formData = new FormData();

    // formData.append('group_id', group);
    formData.append('name', name);
    formData.append('batch_id', batch);
    formData.append('price_sell', priceSell ? priceSell : 0);
    formData.append('has_courtesy', Number(hasCourtesy));
    formData.append('warehouse_type', warehouseType);
    formData.append('quantity', Number(quantity));
    formData.append('active', Number(status));
    formData.append('favorite', Number(favorite));
    // if (image) formData.append('image', image);
    formData.append('image', image);

    return formData;
  };

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      // if (!group) {
      //   alert('Selecione um grupo');
      //   return false;
      // }

      const formData = returnFormData();

      if (!formData) {
        return false;
      }

      await Api.post(`${event}/ecommerce_products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

      const formData = returnFormData();

      if (!formData) {
        return false;
      }

      await Api.put(`${event}/ecommerce_products/${idProduct}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleCancel();
    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const isEmpty = (str) => {
    return !str || str.length === 0;
  };

  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    errorsVerify.name = null;
    return false;
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
    history.push('/dashboard/tickets');
  });

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

            <Grid container spacing={2}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <Grid container spacing={2} direction='row'>
                  <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Grid container spacing={2}>

                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={4}>
                            <FormControlLabel
                              name='status'
                              inputRef={register}
                              control={<GreenSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                              label={status ? 'Ativo' : 'Inativo'}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <FormControlLabel
                              name='favorite'
                              control={
                                <Checkbox
                                  checked={favorite}
                                  onChange={(e) => setFavorite(e.target.checked)}
                                  icon={<FavoriteBorder />}
                                  checkedIcon={<Favorite />}
                                />
                              }
                              label='Favorito'
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={2}>

                          {/* name */}
                          <Grid item md={6} xs={12}>
                            <TextField
                              name='name'
                              value={name}
                              onChange={(e) => {
                                const value = e.target.value.slice(0, 80);
                                setName(value);
                                nameInputVerify(value);
                              }}
                              error={Boolean(errorsVerify?.name)}
                              helperText={errorsVerify?.name}
                              label='Nome'
                              variant='outlined'
                              size='small'
                              fullWidth
                            />
                          </Grid>

                          {/* qnt */}
                          <Grid item lg={6}
                            md={6} sm={12} xs={12}>
                            <TextField
                              name='quantity'
                              value={quantity}
                              label='Quantidade'
                              variant='outlined'
                              size='small'
                              style={{ minWidth: 100 }}
                              fullWidth
                              disabled={true}
                            />
                          </Grid>

                          {/* batch */}
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                              name='batch'
                              value={batch}
                              onChange={(e) => handleBatch(e.target.value)}
                              label='Lote'
                              variant='outlined'
                              size='small'
                              style={{ minWidth: 100 }}
                              select
                              fullWidth
                            >
                              {batchList.map((batchItem) => (
                                <MenuItem key={batchItem.id} value={batchItem.id}>
                                  {batchItem.batch_name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          {/* price */}
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <InputMoney
                              name='priceSell'
                              value={priceSell}
                              label='Preço de venda'
                              variant='outlined'
                              size='small'
                              fullWidth
                              disabled={true}
                            />
                          </Grid>

                          {/* group */}
                          {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                              name='group'
                              value={group}
                              onChange={(e) => setGroup(e.target.value)}
                              label='Grupo'
                              variant='outlined'
                              size='small'
                              style={{ minWidth: 100 }}
                              select
                              fullWidth
                            >
                              {groupList
                                .filter((group) => {
                                  if (group.type === 'ingresso' || group.type === 'ecommerce') return true;
                                  return false;
                                })
                                .map((groupItem) => (
                                  <MenuItem key={groupItem.id} value={groupItem.id}>
                                    {groupItem.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid> */}
                        </Grid>
                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>

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

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(SimpleProduct);
