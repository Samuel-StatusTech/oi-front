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
  Typography,
  Divider,
  withStyles,
  InputAdornment,
  CardContent,
} from '@material-ui/core';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import Api from '../../../api';
import InputMoney from '../../../components/Input/Money';
import Tooltip from '../../../components/Tooltip';
import ImagePicker from '../../../components/ImagePicker';

const SimpleProduct = ({ user }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const { handleSubmit, register, errors } = useForm();
  const [action] = useState(idProduct === 'new');
  const [errorsVerify, setErrorsVerify] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);

  // Dados do produto
  const [status, setStatus] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [desc2, setDesc2] = useState('');
  const [type, setType] = useState('bar');
  const [group, setGroup] = useState('');
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
        } else if (data.code === "ER_DUP_ENTRY") {
          alert('Erro. Verifique as informações do produto e tente novamente')
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
      // console.log(e);
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
    history.push('/dashboard/product');
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
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2} direction='row'>
                <Grid item lg={3} md={4} sm={12} xs={12}>
                  <Card style={{ height: '100%' }}>
                    <ImagePicker
                      image={image}
                      name='image'
                      setImage={setImage}
                      label='Imagem do produto'
                      style={{
                        height: 0,
                        paddingTop: '56.25%',
                        backgroundSize: 'contain',
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
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
                        <Grid item md={8} xs={12}>
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
                        <Grid item md={4} xs={12}>
                          <TextField
                            name='type'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            label='Tipo'
                            variant='outlined'
                            size='small'
                            select
                            fullWidth
                          >
                            <MenuItem value='bar'>Bar</MenuItem>
                            <MenuItem value='ingresso'>Ingresso</MenuItem>
                            <MenuItem value='estacionamento'>Estacionamento</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            name='desc'
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            label='Texto para impressão Linha 01'
                            variant='outlined'
                            size='small'
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Tooltip
                                    title='Esse texto irá impresso no campo de Observações do Ticket'
                                    placement='right'
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            name='desc2'
                            value={desc2}
                            onChange={(e) => setDesc2(e.target.value)}
                            label='Texto para impressão Linha 02'
                            variant='outlined'
                            size='small'
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <Tooltip
                                    title='Esse texto irá impresso no campo de Observações do Ticket'
                                    placement='right'
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {/* <Grid item xs={12}>
                    <TextField
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      label="Observações do produto"
                      variant="outlined"
                      size="small"
                      multiline
                      fullWidth
                      rows={6}
                    /> */}
                        {/* </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
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
                {/* {type === 'bar' ? (
                  <Grid item>
                    <InputMoney
                      name='priceCost'
                      value={priceCost}
                      onChange={({ value }) => setPriceCost(value)}
                      label='Preço de custo'
                      variant='outlined'
                      disabled={hasVariable || hasCourtesy}
                      size='small'
                      fullWidth
                    />
                  </Grid>
                ) : null} */}
                <Grid item>
                  <Grid container alignItems='center'>
                    <Grid item>
                      <FormControlLabel
                        name='hasVariable'
                        control={
                          <GreenSwitch
                            checked={hasVariable}
                            onChange={(e) => setHasVariable(e.target.checked)}
                            disabled={hasCourtesy}
                          />
                        }
                        label='Valor variável'
                        inputRef={register}
                      />
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title='O valor de venda será variável e deverá ser digitado a cada venda'
                        placement='right'
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <FormControlLabel
                    name='hasCourtesy'
                    control={<GreenSwitch checked={hasCourtesy} onChange={(e) => setHasCourtesy(e.target.checked)} />}
                    label='Produto cortesia'
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    value={warehouseType}
                    onChange={(e) => setWarehouseType(e.target.value)}
                    label='Estoque'
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                  >
                    <MenuItem value='controled'>Controlado</MenuItem>
                    <MenuItem value='notControled'>Não controlado</MenuItem>
                    <MenuItem value='soldOut'>Esgotado</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    name='warehouse'
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    label='Estoque Atual'
                    disabled={!isControlled}
                    variant='outlined'
                    type='number'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography>Controle de impressão</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    name='printTicket'
                    control={<GreenSwitch checked={printTicket} onChange={(e) => setPrintTicket(e.target.checked)} />}
                    label='Imprimir ficha'
                    inputRef={register}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    name='printQrcode'
                    control={<GreenSwitch checked={printQrcode} onChange={(e) => setPrintQrcode(e.target.checked)} />}
                    label='Imprimir QRCode'
                    inputRef={register}
                    disabled={!printTicket}
                  />
                </Grid>
                <Grid item>
                  {type === 'bar' && (
                    <FormControlLabel
                      name='numberCopy'
                      control={<GreenSwitch checked={numberCopy == 2} onChange={(e) => setNumberCopy(e.target.checked ? 2 : 1)} />}
                      label='Imprimir segunda via'
                      inputRef={register}
                      disabled={!printTicket}
                    />
                  )}
                    <FormControlLabel
                      name='printGroup'
                      control={<GreenSwitch checked={printGroup} onChange={(e) => setPrintGroup(e.target.checked)} />}
                      label='Imprimir grupo'
                      inputRef={register}
                      disabled={!printTicket}
                    />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    name='printLocal'
                    control={<GreenSwitch checked={printLocal} onChange={(e) => setPrintLocal(e.target.checked)} />}
                    label='Imprimir local'
                    inputRef={register}
                    disabled={!printTicket}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    name='printDate'
                    control={<GreenSwitch checked={printDate} onChange={(e) => setPrintDate(e.target.checked)} />}
                    label='Imprimir data'
                    inputRef={register}
                    disabled={!printTicket}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    name='printValue'
                    control={<GreenSwitch checked={printValue} onChange={(e) => setPrintValue(e.target.checked)} />}
                    label='Imprimir valor'
                    inputRef={register}
                    disabled={!printTicket}
                  />
                </Grid>
              </Grid>
            </Grid>

            {type === 'estacionamento' ? (
              <Grid item>
                <FormControlLabel
                  name='printPlate'
                  control={<GreenSwitch checked={printPlate} onChange={(e) => setPrintPlate(e.target.checked)} />}
                  label='Imprimir placa'
                  inputRef={register}
                  disabled={!printTicket}
                />
              </Grid>
            ) : null}

            {type === 'ingresso' ? (
              <Grid item>
                <FormControlLabel
                  name='hasCut'
                  control={<GreenSwitch checked={hasCut} onChange={(e) => setHasCut(e.target.checked)} />}
                  label='Aviso de corte'
                  inputRef={register}
                  disabled={!printTicket}
                />
              </Grid>
            ) : null}

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                {type === 'bar' && (
                  <Grid item>
                    <Grid container alignItems='center'>
                      <Grid item>
                        <FormControlLabel
                          name='hasControl'
                          control={
                            <GreenSwitch checked={hasControl} onChange={(e) => setHasControl(e.target.checked)} />
                          }
                          label='Imprime senha de controle'
                          inputRef={register}
                          disabled={!printTicket}
                        />
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title='A cada venda, será impressa no ticket uma senha sequencial para acompanhamento do pedido'
                          placement='right'
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/*<Grid item hidden={!hasControl}>
                  <TextField
                    name='startAt'
                    value={startAt}
                    onChange={(e) => (e.target.value > 0 ? setStartAt(e.target.value) : null)}
                    label='Inicia em'
                    inputRef={register}
                    variant='outlined'
                    type='number'
                    disabled={!hasControl}
                    size='small'
                    fullWidth
                  />
                </Grid>*/}
              </Grid>
            </Grid>

            {type === 'estacionamento' ? (
              <>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <FormControlLabel
                        name='hasTolerance'
                        control={
                          <GreenSwitch checked={hasTolerance} onChange={(e) => setHasTolerance(e.target.checked)} />
                        }
                        label='Controle de tolerância'
                        inputRef={register}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        name='timeTolerance'
                        value={timeTolerance}
                        onChange={(e) =>
                          e.target.value > 0 && e.target.value < 100 ? setTimeTolerance(e.target.value) : null
                        }
                        label='Tempo limite (em minutos)'
                        inputRef={register}
                        variant='outlined'
                        size='small'
                        type='number'
                        disabled={!hasTolerance}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Tooltip
                                title='Inserir quanto tempo (em minutos) esse ticket terá de tolerância '
                                placement='right'
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControlLabel
                    name='printTolerance'
                    control={
                      <GreenSwitch checked={printTolerance} onChange={(e) => setPrintTolerance(e.target.checked)} />
                    }
                    label='Imprimir tolerância'
                    inputRef={register}
                    disabled={!printTicket}
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <FormControlLabel
                        name='takeTolerance'
                        control={
                          <GreenSwitch checked={takeTolerance} onChange={(e) => setTakeTolerance(e.target.checked)} />
                        }
                        label='Cobrar após tolerância?'
                        inputRef={register}
                      />
                    </Grid>
                    <Grid item>
                      <InputMoney
                        name='valueTolerance'
                        value={valueTolerance}
                        onChange={({ value }) => setValueTolerance(value)}
                        label='Valor da taxa da tolerância'
                        inputRef={register}
                        // error={Boolean(errors?.valueTolerance)}
                        // helperText={errors?.valueTolerance?.message}
                        variant='outlined'
                        disabled={!takeTolerance}
                        fullWidth
                        size='small'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : null}

            {/* {type === 'bar' ? (
              <Grid item>
                <Grid container alignItems='center'>
                  <Grid item>
                    <FormControlLabel
                      name='painelControl'
                      control={
                        <GreenSwitch checked={painelControl} onChange={(e) => setPainelControl(e.target.checked)} />
                      }
                      label='Enviar para o controle de pedidos'
                      inputRef={register}
                      // disabled={!printTicket}
                    />
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title='A cada venda, esse produto irá para a fila de controle de pedidos'
                      placement='right'
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null} */}

            <Grid item lg={12} md={12} sm={12} xs={12}>
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
        </CardContent>
      </Card>
    </form>
  );
};

export default SimpleProduct;
