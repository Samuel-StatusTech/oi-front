import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControlLabel,
  Typography,
  Divider,
  Button,
  CircularProgress,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import Tooltip from '../../../components/Tooltip';
import firebase from '../../../firebase';
import Api from '../../../api';
import InputMoney from '../../../components/Input/Money';
import InputPercent from '../../../components/Input/Percent';
import ImagePicker from '../../../components/ImagePicker';
import { useForm } from 'react-hook-form';
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';
import { getMaxDateToday, getMinDateToday, formatDateToDB } from '../../../utils/date';

const stateList = [
  { key: 'AC', name: 'Acre' },
  { key: 'AL', name: 'Alagoas' },
  { key: 'AP', name: 'Amapá' },
  { key: 'AM', name: 'Amazonas' },
  { key: 'BA', name: 'Bahia' },
  { key: 'CE', name: 'Ceará' },
  { key: 'DF', name: 'Distrito Federal' },
  { key: 'ES', name: 'Espírito Santo' },
  { key: 'GO', name: 'Goías' },
  { key: 'MA', name: 'Maranhão' },
  { key: 'MT', name: 'Mato Grosso' },
  { key: 'MS', name: 'Mato Grosso do Sul' },
  { key: 'MG', name: 'Minas Gerais' },
  { key: 'PA', name: 'Pará' },
  { key: 'PB', name: 'Paraíba' },
  { key: 'PR', name: 'Paraná' },
  { key: 'PE', name: 'Pernambuco' },
  { key: 'PI', name: 'Piauí' },
  { key: 'RJ', name: 'Rio de Janeiro' },
  { key: 'RN', name: 'Rio Grande do Norte' },
  { key: 'RS', name: 'Rio Grande do Sul' },
  { key: 'RO', name: 'Rondônia' },
  { key: 'RR', name: 'Roraíma' },
  { key: 'SC', name: 'Santa Catarina' },
  { key: 'SP', name: 'São Paulo' },
  { key: 'SE', name: 'Sergipe' },
  { key: 'TO', name: 'Tocantins' },
];

const Event = () => {
  const history = useHistory();
  const { idEvent } = useParams();
  const { handleSubmit, register, errors } = useForm();
  const [action] = useState(idEvent === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState('');
  const [logoPrint, setLogoPrint] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order_number, setOrderNumber] = useState(0);
  const [dateIni, setDateIni] = useState(null);
  const [timeIni, setTimeIni] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [local, setLocal] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [printTicket, setPrintTicket] = useState(false);
  const [printLogoTicket, setPrintLogoTicket] = useState(false);
  const [days, setDays] = useState(1);
  const [hasCashless, setHasCashless] = useState(false);
  const [hasTaxActive, setHasTaxActive] = useState(false);
  const [allowCashback, setAllowCashback] = useState(false);
  const [hasTaxCashback, setHasTaxCashback] = useState(false);
  const [taxActive, setTaxActive] = useState(0);
  const [taxPaybackCash, setTaxPaybackCash] = useState(0);
  const [taxPaybackPercent, setTaxPaybackPercent] = useState(0);
  const [logoFixed, setLogoFixed] = useState('');
  const [hasCashlessConfig, setHasCashlessConfig] = useState(false);
  const [taxPaybackType, setTaxPaybackType] = useState(true);
  const [errorsVerify, setErrorsVerify] = useState({});
  const [event_banner, setEventBanner] = useState("");
  const [event_map, setEventMap] = useState("");


  useEffect(() => {
    if (!action) {
      Api.get(`/event/getData/${idEvent}`)
        .then(({ data }) => {
          const { success, event } = data;
          if (success) {
            const time = new Date();
            time.setUTCHours(event.time_ini.split(/:/g)[0]);
            time.setUTCMinutes(event.time_ini.split(/:/g)[1]);

            const date_ini = new Date(event.date_ini)
            setDateIni((new Date(date_ini.getUTCFullYear(), date_ini.getUTCMonth(), date_ini.getUTCDate(), 5)).getTime());

            const date_end = new Date(event.date_end)
            setDateEnd((new Date(date_end.getUTCFullYear(), date_end.getUTCMonth(), date_end.getUTCDate(), 5)).getTime());

            setName(event.name);
            setDescription(event.description);
            setOrderNumber(event.order_number);
            setImage(event.logo);
            setLogoPrint(event.logo_print);
            setTimeIni(time);
            setLocal(event.local);
            setCity(event.city);
            setState(event.state);
            setStatus(event.status);
            setDays(event.days);
            setPrintTicket(event.print_valid);
            setPrintLogoTicket(event.print_logo);

            setHasCashless(event.has_cashless);
            setHasTaxActive(event.has_tax_active);
            setAllowCashback(event.allow_cashback);
            setHasTaxCashback(event.has_tax_cashback);

            setTaxActive(event.tax_active / 100);
            setTaxPaybackCash(event.tax_payback_cash / 100);
            setTaxPaybackPercent(event.tax_payback_percent !== 0 ? event.tax_payback_percent : 0);
            setTaxPaybackType(event.has_tax_cashback && event.tax_payback_cash !== 0);

            setEventBanner(event.event_banner);
            setEventMap(event.event_map);
          } else {
            alert('Não foi possível carregar os dados do evento');
            handleCancel();
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

  useEffect(() => {
    Api.get(`/getLogoFixed`)
      .then(({ data }) => {
        const { logoFixed } = data;
        setLogoFixed(logoFixed);
      });
    firebase.auth().onAuthStateChanged(hasCashlessConf)
    hasCashlessConf();
  }, []);

  const returnFormData = () => {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('status', status);
    formData.append('logo', image);
    formData.append('logo_print', logoPrint);
    formData.append('date_ini', formatDateToDB(dateIni));
    formData.append('time_ini', +timeIni);
    formData.append('date_end', formatDateToDB(dateEnd));
    formData.append('local', local);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('print_valid', printTicket);
    formData.append('description', description);
    formData.append('order_number', order_number);
    formData.append('print_logo', printLogoTicket);
    formData.append('days', days);
    formData.append('has_cashless', hasCashless);
    formData.append('has_tax_active', hasTaxActive);
    formData.append('allow_cashback', allowCashback ? 1 : 0);
    formData.append('has_tax_cashback', hasTaxCashback);
    formData.append('tax_active', taxActive * 100);
    formData.append('tax_payback_cash', taxPaybackType ? taxPaybackCash * 100 : 0);
    formData.append('tax_payback_percent', taxPaybackType ? 0 : taxPaybackPercent !== 0 ? taxPaybackPercent : 0);
    formData.append('event_banner', event_banner);
    formData.append('event_map', event_map);

    return formData;
  };
  const handleSave = async (body) => {
    try {
      setButtonLoading(true);
      await Api.post('/event/createEvent', body, {
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

  const handleEdit = async (body) => {
    try {
      console.log(body)
      setButtonLoading(true);
      await Api.put(`/event/updateEvent/${idEvent}`, body, {
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
  const verifyErrors = () => {
    const nameInput = nameInputVerify(name);
    const timeIniInput = timeIniInputVerify(timeIni);
    const localInput = localInputVerify(local);
    const cityInput = cityInputVerify(city);
    setErrorsVerify({ ...errorsVerify, name: nameInput, timeIni: timeIniInput, local: localInput, city: cityInput })
    return Boolean(nameInput) || Boolean(timeIniInput) || Boolean(localInput) || Boolean(cityInput);
  }
  const onSubmit = () => {
    if (verifyErrors()) {
      return;
    }
    if (hasTaxCashback) {
      if (!taxPaybackType) {
        if (!taxPaybackPercent) {
          alert('Porcentagem não pode ser igual a 0');
          return;
        }
      } else if (taxPaybackType) {
        if (!taxPaybackCash) {
          alert('Valor fixo não pode ser igual a 0');
          return;
        }
      }
    }
    if (hasTaxActive) {
      if (!taxActive) {
        alert('A taxa de ativação não pode ser menor ou igual a 0');
        return;
      }
    }
    if (dateIni == null) {
      alert('Por favor preencha a data de início do evento');
      return;
    }
    if (timeIni == null) {
      alert('Por favor preencha a hora de início do evento');
      return;
    }
    if (timeIni == null) {
      alert('Por favor preencha a hora de início do evento');
      return;
    }
    if (!state) {
      alert('Por favor preencha o estado');
      return;
    }

    const body = returnFormData();

    if (action) {
      handleSave(body);
      return;
    }
    handleEdit(body);
  };

  const handleCancel = () => {
    history.replace('/dashboard/event');
  };
  const hasCashlessConf = async (user) => {
    if (user && user.uid) {
      const clientKey = (await firebase.database().ref('Managers/' + user.uid + '/client').once('value')).val()
      const hasCashlessC = (await firebase.database().ref(`Clients/${clientKey}/cashless`).once('value')).val();
      setHasCashlessConfig(hasCashlessC);
    }
  }
  const nameInputVerify = (value) => {

    if (!value) {
      setErrorsVerify({ ...errorsVerify, name: 'É necessário preencher o campo' });
      return 'É necessário preencher o campo';
    }
    setErrorsVerify({ ...errorsVerify, name: null });
    return null;
  }
  const timeIniInputVerify = (value) => {
    if (!value) {
      setErrorsVerify({ ...errorsVerify, timeIni: 'É necessário preencher o campo' });
      return 'É necessário preencher o campo';
    }
    setErrorsVerify({ ...errorsVerify, timeIni: null });
    return null;
  }
  const localInputVerify = (value) => {
    if (!value) {
      setErrorsVerify({ ...errorsVerify, local: 'É necessário preencher o campo' });
      return 'É necessário preencher o campo';
    }
    setErrorsVerify({ ...errorsVerify, local: null });
    return null;
  }
  const cityInputVerify = (value) => {
    if (!value) {
      setErrorsVerify({ ...errorsVerify, city: 'É necessário preencher o campo' });
      return 'É necessário preencher o campo';
    }
    setErrorsVerify({ ...errorsVerify, city: null });
    return null;
  }
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
              <Grid container direction='row' spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container direction='row' spacing={2}>
                    <Grid style={{ textAlign: 'center' }} item xl={3} lg={4} md={6} sm={6} xs={6}>
                      <ImagePicker
                        label='Imagem do evento'
                        name='image'
                        inputRef={register}
                        image={image}
                        setImage={setImage}
                      />
                      <small>Tamanho: 512x256 (png)</small>
                    </Grid>
                    {!logoFixed &&
                      <Grid style={{ textAlign: 'center' }} item xl={3} lg={4} md={6} sm={6} xs={6}>
                        <ImagePicker
                          label='Logo (impressão)'
                          name='imageLogo'
                          inputRef={register}
                          image={logoPrint}
                          setImage={setLogoPrint}
                        />
                        <small>Tamanho: 262×100 (png)</small>
                      </Grid>
                    }
                  </Grid>
                  <div style={{ height: 20, marginTop: '1rem' }}></div>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label='Nome do evento'
                        name='name'
                        value={name}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 80);
                          setName(value);
                          nameInputVerify(value);
                        }}
                        inputRef={register}
                        error={Boolean(errorsVerify?.name)}
                        helperText={errorsVerify?.name}
                        variant='outlined'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label='Descrição de rodapé'
                        name='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                        inputRef={register}
                        variant='outlined'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <KeyboardDatePicker
                        label='Data de início'
                        name='dateIni'
                        value={dateIni}
                        onChange={setDateIni}
                        inputRef={register}
                        minDate={getMinDateToday()}
                        maxDate={getMaxDateToday()}
                        minDateMessage='A data não deve ser menor que 10 anos da data atual'
                        maxDateMessage='A data não deve ser maior que 10 anos da data atual'
                        inputVariant='outlined'
                        variant='inline'
                        format='DD/MM/YYYY'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <KeyboardTimePicker
                        label='Hora de início'
                        name='timeIni'
                        value={timeIni}
                        onChange={(e) => {
                          setTimeIni(e);
                          timeIniInputVerify(e);
                        }}
                        inputRef={register}
                        inputVariant='outlined'
                        variant='inline'
                        format='HH:mm'
                        clearable={true}
                        ampm={false}
                        size='small'
                        error={Boolean(errorsVerify?.timeIni)}
                        helperText={errorsVerify?.timeIni}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <KeyboardDatePicker
                        label='Data de término'
                        name='dateEnd'
                        value={typeof (dateEnd) == "number" && dateEnd <= 0 ? null : dateEnd}
                        onChange={setDateEnd}
                        inputRef={register}
                        inputVariant='outlined'
                        variant='inline'
                        minDate={dateIni}
                        maxDate={getMaxDateToday()}
                        maxDateMessage='A data não deve ser maior que 10 anos da data atual'
                        minDateMessage='A data não deve ser menor que a data de início do evento'
                        format='DD/MM/YYYY'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <TextField
                        label='Local'
                        name='local'
                        value={local}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 80);
                          setLocal(value);
                          localInputVerify(value)
                        }}
                        inputRef={register}
                        error={Boolean(errorsVerify?.local)}
                        helperText={errorsVerify?.local}
                        variant='outlined'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <TextField
                        label='Cidade'
                        name='city'
                        value={city}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 80);
                          setCity(value);
                          cityInputVerify(value)
                        }}
                        inputRef={register}
                        error={Boolean(errorsVerify?.city)}
                        helperText={errorsVerify?.city}
                        variant='outlined'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <TextField
                        label='Estado'
                        name='state'
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        inputRef={register}
                        variant='outlined'
                        size='small'
                        fullWidth
                        select
                      >
                        {stateList.map((item) => (
                          <MenuItem key={item.key} value={item.key}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <FormControlLabel
                    label={status ? 'Ativo' : 'Inativo'}
                    name='status'
                    value={status}
                    inputRef={register}
                    control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <FormControlLabel
                    label='Imprime Validade Ticket'
                    name='printTicket'
                    value={printTicket}
                    inputRef={register}
                    control={<GreenSwitch checked={printTicket} onChange={(e) => setPrintTicket(e.target.checked)} />}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6} hidden={!printTicket}>
                  <TextField
                    label='Quantos dias?'
                    name='days'
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    inputRef={register({
                      min: { value: 1, message: 'O número de dias tem que ser maior que 0' },
                      maxLength: { value: 3, message: 'O número de dias não pode ser maior que 365' },
                    })}
                    error={Boolean(errors?.days)}
                    helperText={errors?.days?.message}
                    variant='outlined'
                    type='number'
                    size='small'
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <FormControlLabel
                    label='Imprime Logo no Ticket'
                    name='printLogoTicket'
                    value={printLogoTicket}
                    inputRef={register}
                    control={
                      <GreenSwitch checked={printLogoTicket} onChange={(e) => setPrintLogoTicket(e.target.checked)} />
                    }
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <TextField
                    label='Senha controle de pedido'
                    name='order_number'
                    value={order_number}
                    onChange={(e) => setOrderNumber(Number(e.target.value))}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            {hasCashlessConfig && (<><Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Configurações Cashless</Typography>
              <Divider />
            </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                    <FormControlLabel
                      label='Esse evento opera Cashless'
                      name='hasCashless'
                      value={hasCashless}
                      inputRef={register}
                      control={<GreenSwitch checked={hasCashless} onChange={(e) => setHasCashless(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={4} xs={6} hidden={!hasCashless}>
                    <Grid container>
                      <Grid item>
                        <Tooltip title='Taxa cobrada para abertura de um novo cartão' placement='right'>
                          <FormControlLabel
                            label='Cobrar Taxa de Ativação'
                            name='hasTaxActive'
                            value={hasTaxActive}
                            inputRef={register}
                            control={
                              <GreenSwitch checked={hasTaxActive} onChange={(e) => setHasTaxActive(e.target.checked)} />
                            }
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item hidden={!hasTaxActive}>
                        <InputMoney
                          label='Valor'
                          name='taxActive'
                          value={taxActive}
                          inputRef={register}
                          onChange={(e) => setTaxActive(e.value)}
                          variant='outlined'
                          size='small'
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={4} xs={6} hidden={!hasCashless}>
                    <Tooltip
                      title='O sistema irá permitir que a taxa de ativação possa ser devolvida ao cliente'
                      placement='right'
                    >
                      <FormControlLabel
                        label='Devolução da Taxa de Ativação'
                        name='allowCashback'
                        value={allowCashback}
                        inputRef={register}
                        control={
                          <GreenSwitch checked={allowCashback} onChange={(e) => setAllowCashback(e.target.checked)} />
                        }
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xl={3} lg={3} md={3} sm={4} xs={6} hidden={!hasCashless}>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <Tooltip title='Taxa cobrada para devolução do saldo de créditos em um cartão.' placement='right'>
                          <FormControlLabel
                            label='Cobrar Taxa de Devolução'
                            name='hasTaxCashback'
                            value={hasTaxCashback}
                            inputRef={register}
                            control={
                              <GreenSwitch
                                checked={hasTaxCashback}
                                onChange={(e) => setHasTaxCashback(e.target.checked)}
                              />
                            }
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item hidden={!hasTaxCashback || !taxPaybackType}>
                        <InputMoney
                          label='Valor Fixo'
                          name='taxPaybackCash'
                          value={taxPaybackCash}
                          inputRef={register}
                          onChange={({ value }) => setTaxPaybackCash(value)}
                          size='small'
                        />
                      </Grid>
                      <Grid item hidden={!hasTaxCashback || taxPaybackType}>
                        <InputPercent
                          label='Porcentagem'
                          name='taxPaybackPercent'
                          value={taxPaybackPercent}
                          inputRef={register}
                          onChange={({ value }) => setTaxPaybackPercent(value)}
                          size='small'
                        />
                      </Grid>
                      <Grid item hidden={!hasTaxCashback}>
                        <FormControlLabel
                          label={taxPaybackType ? 'Valor Fixo' : 'Porcentagem'}
                          name='taxPaybackType'
                          value={taxPaybackType}
                          inputRef={register}
                          control={
                            <GreenSwitch checked={taxPaybackType} onChange={(e) => setTaxPaybackType(e.target.checked)} />
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Tooltip title="O sistema irá permitir que caso haja saldo disponivel em um cartão, poderá ser feita a devolução. Com a opção de descontar ou não, uma taxa para devolução" placement='right'>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={hasPaybackTax}
                                        onChange={e => setHasPaybackTax(e.target.checked)}
                                    />
                                }
                                label="Permite devolver a taxa de saldo?"
                            />
                        </Tooltip>
                    </Grid> */}
                </Grid>
              </Grid></>)}

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant='outlined' color='secondary' onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button type='submit' variant='outlined' color='primary'>
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

export default Event;
