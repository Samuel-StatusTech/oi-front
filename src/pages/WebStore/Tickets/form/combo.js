import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

import Tooltip from '../../../components/Tooltip';

import Api from '../../../api';

import InputMoney from '../../../components/Input/Money';
import ImagePicker from '../../../components/ImagePicker';
import TransferList from '../../../components/TransferList';

const ComboProduct = ({ user }) => {
  const history = useHistory();
  const { idProduct } = useParams();
  const [action] = useState(idProduct === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorsVerify, setErrorsVerify] = useState({});
  const [status, setStatus] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [type, setType] = useState('');

  const [image, setImage] = useState('');
  const [productList, setProductList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');
  const [ticketType, setTicketType] = useState('varias'); // ['unica', 'varias']
  const [priceSell, setPriceSell] = useState(0);
  const [priceCost, setPriceCost] = useState(0);
  const [printQrcode, setPrintQrcode] = useState(false);
  const [printTicket, setPrintTicket] = useState(true);
  const [printLocal, setPrintLocal] = useState(true);
  const [printDate, setPrintDate] = useState(true);
  const [printValue, setPrintValue] = useState(true);

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
        if (!!action) {
          setLoading(false);
        }
      });
    if (!action) {
      Api.get(`/product/getCombo/${idProduct}`)
        .then(({ data }) => {
          const { success, product, product_list } = data;
          if (success) {
            setStatus(product.status);
            setFavorite(product.favorite);
            setName(product.name);
            setImage(product.image);
            setType(product.direction);
            setRawList(product_list);
            setDescription(product.description1);
            setDescription2(product.description2);
            setTicketType(product.ticket_type);
            setGroup(product.group_id);
            setPriceSell(product.price_sell);
            setPriceCost(product.price_cost);
            setPrintQrcode(product.print_qrcode);
            setPrintTicket(product.print_ticket);
            setPrintLocal(product.print_local);
            setPrintDate(product.print_date);
            setPrintValue(product.print_value);
          } else {
            alert('Não foi possível carregar os dados do combo');
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
    }
    // eslint-disable-next-line
  }, []);

  const returnFormData = () => {
    const formData = new FormData();

    formData.append('status', status);
    formData.append('name', name);
    formData.append('image', image);
    formData.append('direction', type);
    formData.append('favorite', favorite);
    formData.append('description1', description);
    formData.append('description2', description2);
    formData.append('group_id', group);
    formData.append('product_list', JSON.stringify(productList));
    formData.append('ticket_type', ticketType);
    formData.append('price_sell', priceSell);
    formData.append('price_cost', priceCost);
    formData.append('print_qrcode', printQrcode);
    formData.append('print_ticket', printTicket);
    formData.append('print_local', printLocal);
    formData.append('print_date', printDate);
    formData.append('print_value', printValue);

    return formData;
  };

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      verifyInputs();
      const formData = returnFormData();

      await Api.post('/product/createCombo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleCancel();
    } catch (e) {
      handleError(e);
    } finally {
      setButtonLoading(false);
    }
  };
  const handleError = (e) => {
    if (e.response) {
      const data = e.response.data;
      if (data.error) {
        alert(data.error);
      } else {
        alert('Erro não esperado');
      }
    } else {
      alert(e.message ?? 'Erro não esperado');
    }
  };
  const verifyInputs = () => {
    if (!priceSell || priceSell < 0) throw { message: 'O preço de venda deve ser maior que 0' };
    if (productList.length === 0) throw { message: 'Selecione ao menos um item' };
    if (type === '') throw { message: 'Campo de tipo é obrigatório' };
    if (group === '') throw { message: 'Campo de grupo é obrigatório' };
  };
  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      verifyInputs();
      const formData = returnFormData();

      await Api.put(`/product/updateCombo/${idProduct}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleCancel();
    } catch (e) {
      handleError(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/product');
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    errorsVerify.name = null;
    return false;
  };
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
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2} direction='row'>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <Card style={{ height: '100%' }}>
                  <ImagePicker
                    image={image}
                    name='image'
                    setImage={setImage}
                    label='Imagem do combo'
                    style={{
                      height: 0,
                      paddingTop: '56.25%',
                      backgroundSize: 'contain',
                    }}
                  />
                </Card>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Grid container spacing={2} direction='column'>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControlLabel
                          control={<GreenSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                          label={status ? 'Ativo' : 'Inativo'}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControlLabel
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
                      <Grid item xs={12}>
                        <TextField
                          value={name}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 40);
                            setName(value);
                            nameInputVerify(value);
                          }}
                          error={Boolean(errorsVerify?.name)}
                          helperText={errorsVerify?.name}
                          label='Nome do combo'
                          variant='outlined'
                          size='small'
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          value={description}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 80);
                            setDescription(value);
                          }}
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
                      <Grid item xs={12}>
                        <TextField
                          value={description2}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 80);
                            setDescription2(value);
                          }}
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
                      <Grid item xs={12}>
                        <TextField
                          select
                          value={ticketType}
                          onChange={(e) => setTicketType(e.target.value)}
                          label='Modo de impressão'
                          variant='outlined'
                          size='small'
                          fullWidth
                        >
                          <MenuItem value='varias'>Várias fichas</MenuItem>
                          <MenuItem value='unica'>Ficha única</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container direction='row' spacing={2}>
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <InputMoney
                              value={priceSell}
                              onChange={({ value }) => setPriceSell(value)}
                              label='Preço de venda'
                              variant='outlined'
                              size='small'
                              fullWidth
                            />
                          </Grid>
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <InputMoney
                              value={priceCost}
                              label='Preço de custo base'
                              variant='outlined'
                              size='small'
                              fullWidth
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          label='Tipo'
                          variant='outlined'
                          size='small'
                          fullWidth
                        >
                          <MenuItem value='bar'>Bar</MenuItem>
                          <MenuItem value='ingresso'>Ingresso</MenuItem>
                          <MenuItem value='estacionamento'>Estacionamento</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          select
                          value={group}
                          onChange={(e) => setGroup(e.target.value)}
                          label='Grupo'
                          variant='outlined'
                          size='small'
                          fullWidth
                        >
                          {groupList
                            .filter((group) => group.type === type)
                            .map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography style={{ fontWeight: 'bold' }}>Monte seu Combo</Typography>
            <Divider />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TransferList
              onSelect={setProductList}
              rawList={rawList}
              visible
              hasProduct
              hasQuantity
              onCostChange={setPriceCost}
              selectAll
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Divider />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container>
              <Grid item>
                <FormControlLabel
                  control={
                    <GreenSwitch
                      checked={printTicket}
                      onChange={(e) => {
                        setPrintTicket(e.target.checked);
                        if (!e.target.checked) {
                          setPrintQrcode(false);
                          setPrintLocal(false);
                          setPrintDate(false);
                          setPrintValue(false);
                        }
                      }}
                    />
                  }
                  label='Imprime ficha'
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<GreenSwitch checked={printQrcode} onChange={(e) => setPrintQrcode(e.target.checked)} />}
                  label='Imprime QRCode'
                  disabled={!printTicket}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container>
              <Grid item>
                <FormControlLabel
                  control={<GreenSwitch checked={printLocal} onChange={(e) => setPrintLocal(e.target.checked)} />}
                  label='Imprime local'
                  disabled={!printTicket}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<GreenSwitch checked={printDate} onChange={(e) => setPrintDate(e.target.checked)} />}
                  label='Imprime data'
                  disabled={!printTicket}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<GreenSwitch checked={printValue} onChange={(e) => setPrintValue(e.target.checked)} />}
                  label='Imprime valor'
                  disabled={!printTicket}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant='outlined' color='secondary' onClick={handleCancel}>
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button variant='outlined' color='primary' onClick={action ? handleSave : handleEdit}>
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

export default ComboProduct;
