import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';

import Api from '../../../api';

import InputMoney from '../../../components/Input/Money';
import TransferList from '../../../components/TransferList';
import { connect } from 'react-redux';

const Reservation = ({ user, event }) => {
  const history = useHistory();
  const { idReservation } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idReservation === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [section, setSection] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [iniNumber, setIniNumber] = useState(0);
  const [endNumber, setEndNumber] = useState(0);
  const [status, setStatus] = useState('livre');
  const [hasProductList, setHasProductList] = useState(false);
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);

  useEffect(() => {
    if (!action) {
      Api.get(`/reservation/getData/${idReservation}`)
        .then(({ data }) => {
          const { success, reservation, list } = data;

          if (success) {
            setSection(reservation.section);
            setStatus(reservation.status);
            setDescription(reservation.description);
            setValue(reservation.value);
            setIniNumber(reservation.number);
            setHasProductList(reservation.has_product_list);
            setRawList(list);
          } else {
            alert('Não foi possível carregar os dados do grupo');
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
    await Api.post('/reservation/createReservation', {
      section,
      event_id: event,
      description,
      has_product_list: hasProductList,
      product_list: productList,
      value: value,
      ini_number: iniNumber,
      end_number: endNumber,
      status,
    });
    handleCancel();
  };

  const handleEdit = async () => {
    await Api.put(`/reservation/updateReservation/${idReservation}`, {
      section,
      description,
      has_product_list: hasProductList,
      product_list: productList,
      value: value,
      number: iniNumber,
      status,
    });
    handleCancel();
  };

  const onSelectProduct = (products) => {
    setProductList(products);
    setHasProductList(products.length);
  };
  const handleSubmit = () => {
    try {
      setButtonLoading(true);
      if (verifyInputs()) throw { message: 'Um ou mais campos possuem erros!' };
      if (action) {
        handleSave();
        return;
      }
      handleEdit();
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (data.error) {
          alert(data.error);
        } else {
          alert('Erro não esperado');
        }
      } else {
        alert(error?.message ?? 'Um ou mais campos possuem erros');
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/reservation');
  };
  const numberInputVerify = (number) => {
    if (!/^\d+$/.test(number)) return { value: 'O campo é obrigatório' };
    return false;
  };
  const sectionInputVerify = (section) => {
    if (!/^(\S|[ ])+$/.test(section)) return (errorsVerify.section = 'O campo é obrigatório');
    errorsVerify.section = null;
    return false;
  };
  const iniNumberInputVerify = (number) => {
    const value = String(number).replace(/[^0-9.]/g, '');
    setIniNumber(value < 0 ? 0 : value);
    const inputVerify = numberInputVerify(value);
    if (action) {
      if (parseInt(number) > parseInt(endNumber))
        return (errorsVerify.iniNumber = 'Número inicial não pode ser maior que o número final');
    }
    if (parseInt(number) === 0) return (errorsVerify.iniNumber = 'Número inicial não pode ser igual a 0');
    if (inputVerify?.value) return (errorsVerify.iniNumber = inputVerify.value);
    errorsVerify.iniNumber = null;
    return false;
  };
  const endNumberInputVerify = (number) => {
    const value = String(number).replace(/[^0-9.]/g, '');
    setEndNumber(value < 0 ? 0 : value);
    const inputVerify = numberInputVerify(value);
    if (parseInt(iniNumber) > parseInt(number))
      return (errorsVerify.endNumber = 'Número final não pode ser menor que o número inicial');
    if (inputVerify?.value) return (errorsVerify.endNumber = inputVerify.value);
    errorsVerify.endNumber = null;
    return false;
  };
  const valueInputVerify = (number) => {
    if (number <= 0) return (errorsVerify.value = 'O valor não pode ser menor ou igual a zero');
    setValue(number);
    const inputVerify = numberInputVerify(number);
    if (inputVerify?.value) return (errorsVerify.value = inputVerify.value);
    errorsVerify.value = null;
    return false;
  };
  const verifyInputs = () => {
    if (!action) {
      return sectionInputVerify(section) || iniNumberInputVerify(iniNumber) || valueInputVerify(value);
    }
    return (
      sectionInputVerify(section) ||
      iniNumberInputVerify(iniNumber) ||
      endNumberInputVerify(endNumber) ||
      valueInputVerify(value)
    );
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
    <form>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Setor'
                    name='section'
                    value={section}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSection(value);
                      sectionInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.section)}
                    helperText={errorsVerify?.section}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xl={4} lg={4} xs={12} hidden={!action}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label='Número inicial'
                        name='iniNumber'
                        value={iniNumber}
                        onChange={(e) => {
                          iniNumberInputVerify(e.target.value);
                        }}
                        error={Boolean(errorsVerify?.iniNumber)}
                        helperText={errorsVerify?.iniNumber}
                        variant='outlined'
                        type='number'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label='Número final'
                        name='endNumber'
                        value={endNumber}
                        onChange={(e) => {
                          endNumberInputVerify(e.target.value);
                        }}
                        error={Boolean(errorsVerify?.endNumber)}
                        helperText={errorsVerify?.endNumber}
                        variant='outlined'
                        type='number'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xl={4} lg={4} xs={12} hidden={action}>
                  <TextField
                    label='Número da mesa'
                    name='iniNumber'
                    value={iniNumber}
                    onChange={(e) => iniNumberInputVerify(e.target.value)}
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xl={2} lg={2} xs={12}>
                      <FormControl variant='outlined' size='small' fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label='Status'
                          name='status'
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          variant='outlined'
                        >
                          <MenuItem value='bloqueado'>Bloqueado</MenuItem>
                          <MenuItem value='reservado'>Reservado</MenuItem>
                          <MenuItem value='livre'>Livre</MenuItem>
                          <MenuItem value='vendido'>Vendido</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xl={2} lg={2} xs={12}>
                      <InputMoney
                        label='Valor'
                        name='value'
                        value={value}
                        onChange={(e) => valueInputVerify(e.value)}
                        variant='outlined'
                        size='small'
                        error={Boolean(errorsVerify?.value)}
                        helperText={errorsVerify?.value}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xl={4} lg={4} xs={12}>
                      <TextField
                        label='Observações'
                        name='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant='outlined'
                        size='small'
                        multiline
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TransferList
                onSelect={onSelectProduct}
                rawList={rawList}
                hasProduct={hasProductList}
                label='Incluir Produtos'
                info='Adicione aqui Ingressos ou Produtos para consumação, que serão inclusos nas Mesas.'
                selectAll
                hasQuantity
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant='outlined' color='secondary' onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleSubmit()} variant='outlined' color='primary'>
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

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Reservation);
