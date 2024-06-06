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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
} from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import Api from '../../../../api';
import InputMoney from '../../../../components/Input/Money';

const SimpleProduct = ({ user }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const { handleSubmit, register } = useForm();
  const [action] = useState(idProduct === 'new');
  const [errorsVerify] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [newLotModal, setNewLotModal] = useState(false);

  // Modal novo lote
  const [newLotName, setNewLotName] = useState("");
  const [newLotQnt, setNewLotQnt] = useState("");
  const [newLotDate, setNewLotDate] = useState("");

  // Dados do produto
  const [status, setStatus] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [desc2, setDesc2] = useState('');
  const [type, setType] = useState('ingresso');
  const [group, setGroup] = useState('');
  const [batch, setBatch] = useState('');
  const [priceSell, setPriceSell] = useState('');
  const [priceCost, setPriceCost] = useState('');
  const [hasVariable, setHasVariable] = useState(false);
  const [hasCourtesy, setHasCourtesy] = useState(false);
  const [warehouse, setWarehouse] = useState(0);
  const [warehouseType, setWarehouseType] = useState('notControled');
  const [isControlled, setIsControlled] = useState(true);

  // Dados da impressão
  const [printQrcode, setPrintQrcode] = useState(false);
  const [printTicket, setPrintTicket] = useState(true);
  const [printLocal, setPrintLocal] = useState(true);
  const [printDate, setPrintDate] = useState(true);
  const [printValue, setPrintValue] = useState(true);
  const [hasControl, setHasControl] = useState(false);
  const [startAt, setStartAt] = useState(1);
  const [canSave, setCanSave] = useState(false);
  // Dados do bar
  const [numberCopy, setNumberCopy] = useState(1);
  const [painelControl, setPainelControl] = useState(false);

  // Dados do ingresso
  const [printGroup, setPrintGroup] = useState(false);
  const [hasCut, setHasCut] = useState(false);

  // Dados do estacionamento
  const [printPlate, setPrintPlate] = useState(false);
  const [printTolerance, setPrintTolerance] = useState(false);
  const [hasTolerance, setHasTolerance] = useState(false);
  const [timeTolerance, setTimeTolerance] = useState(0);
  const [takeTolerance, setTakeTolerance] = useState(false);
  const [valueTolerance, setValueTolerance] = useState('');

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
    setCanSave(true);
  }, [warehouse, isControlled]);

  useEffect(() => {
    setIsControlled(warehouseType === 'controled');
  }, [warehouseType]);
  useEffect(() => {
    if (!action) {
      Promise.all([
        Api.get(`/group/getList`).then(({ data }) => {
          const { success, groups } = data;

          if (success) {
            setGroupList(groups);
          } else {
            alert('Erro ao carregar os grupos');
            handleCancel();
          }
        }),
        Api.get(`/product/getProduct/${idProduct}`).then(({ data }) => {
          const { success, product } = data;
          if (success) {
            setStatus(product.status === 1);
            setFavorite(product.favorite === 1);
            setName(product.name);
            setImage(product.image);
            setDesc(product.description1);
            setDesc2(product.description2);
            setType(product.type);
            setGroup(product.group_id);
            setPriceSell(product.price_sell);
            setPriceCost(product.price_cost);
            setHasVariable(product.has_variable === 1);
            setWarehouse(product.quantity);
            setWarehouseType(product.warehouse_type);
            setPrintQrcode(product.print_qrcode === 1);
            setPrintTicket(product.print_ticket === 1);
            setPrintLocal(product.print_local === 1);
            setPrintDate(product.print_date === 1);
            setPrintValue(product.print_value === 1);
            setHasControl(product.has_control === 1);
            setPainelControl(product.painel_control === 1);
            setStartAt(product.start_at);
            setHasCourtesy(product.has_courtesy);
            setNumberCopy(product.number_copy);
            setPrintGroup(product.print_group === 1);
            setHasCut(product.has_cut === 1);
            setPrintPlate(product.print_plate === 1);
            setPrintTolerance(product.print_tolerance === 1);
            setHasTolerance(product.has_tolerance === 1);
            setTimeTolerance(product.time_tolerance);
            setTakeTolerance(product.take_tolerance === 1);
            setValueTolerance(product.value_tolerance / 100);
          } else {
            alert('Não foi possível carregar os dados do gerente');
            handleCancel();
          }
        }),
      ]).finally(() => {
        setLoading(false);
      });
    } else {
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
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, []);

  const returnFormData = () => {
    /*if (0 > priceSell || priceSell > 100000) {
      alert('Preço de venda não pode ser maior que R$99.999,00');
      return;
    }*/

    const formData = new FormData();

    formData.append('group_id', group);
    formData.append('image', image);
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description1', desc);
    formData.append('description2', desc2);
    formData.append('price_sell', priceSell ? priceSell : 0);
    formData.append('price_cost', priceCost ? priceCost : 0);
    formData.append('has_variable', hasVariable);
    formData.append('has_courtesy', hasCourtesy);
    formData.append('status', status);
    formData.append('favorite', favorite);
    formData.append('warehouse', warehouse > 0 ? warehouse : 0);
    formData.append('warehouse_type', warehouseType);
    formData.append('print_qrcode', printQrcode);
    formData.append('print_ticket', printTicket);
    formData.append('print_local', printLocal);
    formData.append('print_date', printDate);
    formData.append('print_value', printValue);
    formData.append('has_control', hasControl);
    formData.append('start_at', startAt);
    formData.append('number_copy', numberCopy);
    formData.append('painel_control', painelControl);
    formData.append('print_group', printGroup);
    formData.append('has_cut', hasCut);
    formData.append('print_plate', printPlate);
    formData.append('print_tolerance', printTolerance);
    formData.append('has_tolerance', hasTolerance);
    formData.append('time_tolerance', timeTolerance);
    formData.append('take_tolerance', takeTolerance);
    formData.append('value_tolerance', valueTolerance * 100);

    return formData;
  };

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      if (!group) {
        alert('Selecione um grupo');
        return false;
      }

      const formData = returnFormData();

      if (!formData) {
        return false;
      }

      await Api.post('/product/createProduct', formData, {
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

      await Api.put(`/product/updateProduct/${idProduct}`, formData, {
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
    history.push('/dashboard/webstore/tickets');
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

  const handleNewLot = () => {
    setNewLotModal(true)
  }

  const registerNewLot = () => {
    setNewLotModal(true)
  }

  const handleCloseModal = () => {
    setNewLotName("")
    setNewLotQnt("")
    setNewLotDate("")
    setNewLotModal(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog
        open={newLotModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cadastrar Lote</DialogTitle>
        <DialogContent>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name='newLotName'
                value={newLotName}
                onChange={(e) => setNewLotName(e.target.value)}
                label='Lote'
                variant='outlined'
                size='small'
                style={{ minWidth: 100 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name='quantity'
                value={newLotQnt}
                onChange={(e) => setNewLotQnt(e.target.value)}
                label='Quantidade'
                variant='outlined'
                size='small'
                style={{ minWidth: 100 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name='date'
                value={newLotDate}
                onChange={(e) => setNewLotDate(e.target.value)}
                label='Expiração'
                variant='outlined'
                size='small'
                style={{ minWidth: 100 }}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={registerNewLot}
            variant="outlined"
            color="primary"
          >
            Cadastrar
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseModal}
            style={{ cursor: "pointer" }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

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

                          <Grid item xs={6}>
                            <InputMoney
                              name='priceSell'
                              value={priceSell}
                              onChange={({ value }) => setPriceSell(value)}
                              label='Preço de venda'
                              variant='outlined'
                              disabled={hasVariable || hasCourtesy}
                              size='small'
                              fullWidth
                            />
                          </Grid>
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                              name='batch'
                              value={batch}
                              onChange={(e) => setBatch(e.target.value)}
                              label='Lote'
                              variant='outlined'
                              size='small'
                              style={{ minWidth: 100 }}
                              select
                              fullWidth
                            >
                              {groupList
                                .filter((group) => {
                                  if (group.type === type) return true;
                                  return false;
                                })
                                .map((groupItem) => (
                                  <MenuItem key={groupItem.id} value={groupItem.id}>
                                    {groupItem.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>
                          <Grid item lg={6} md={6} sm={12} xs={12}>
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
                                  if (group.type === type) return true;
                                  return false;
                                })
                                .map((groupItem) => (
                                  <MenuItem key={groupItem.id} value={groupItem.id}>
                                    {groupItem.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>

                          <Grid item>
                            <Button variant='outlined' color='primary' onClick={handleNewLot}>
                              Adicionar lote
                            </Button>
                          </Grid>
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

export default SimpleProduct;
