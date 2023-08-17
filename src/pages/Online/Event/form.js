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
  const [taxPaybackType, setTaxPaybackType] = useState(true);

  const [hasOnline, setHasOnline] = useState(true);
  const [chargeCustomer, setChargeCustomer] = useState(false);
  const [personalTicket, setPersonalTicket] = useState(false);
  const [taxConvenience, setTaxConvenience] = useState(0);
  const [locationDesc, setLocationDesc] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [onlineImage, setOnlineImage] = useState('');
  const [onlineDescription, setOnlineDescription] = useState('');
  const [imageOrganizer, setImageOrganizer] = useState('');
  const [descriptionOrganizer, setDescriptionOrganizer] = useState('');

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

  const onSubmit = () => {
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
    if(dateIni == null) {
      alert('Por favor preencha a data de início do evento');
      return;
    }
    if(timeIni == null) {
      alert('Por favor preencha a hora de início do evento');
      return;
    }
    if(timeIni == null) {
      alert('Por favor preencha a hora de início do evento');
      return;
    }
    if(!state) {
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
    history.replace('/dashboard/online-events');
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container direction='row' spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label='Nome do evento'
                        name='name'
                        value={name}
                        disabled
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
                        disabled
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
                        disabled
                        variant='inline'
                        format='HH:mm'
                        clearable={true}
                        ampm={false}
                        size='small'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
                      <KeyboardDatePicker
                        label='Data de término'
                        name='dateEnd'
                        value={typeof(dateEnd) == "number" && dateEnd <= 0 ? null : dateEnd}
                        disabled
                        inputVariant='outlined'
                        variant='inline'
                        format='DD/MM/YYYY'
                        size='small'
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Configurações Venda Online</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
                  <FormControlLabel
                    label='Evento vende Online'
                    name='hasOnline'
                    value={hasOnline}
                    inputRef={register}
                    control={<GreenSwitch checked={hasOnline} onChange={(e) => setHasOnline(e.target.checked)} />}
                  />
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
                  <InputPercent
                    label='Taxa de conveniência'
                    name='taxConvenience'
                    value={taxConvenience}
                    inputRef={register}
                    onChange={({ value }) => setTaxConvenience(value)}
                    size='small'
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
                  <FormControlLabel
                    label='Cobrar do cliente'
                    name='chargeCustomer'
                    value={chargeCustomer}
                    inputRef={register}
                    control={<GreenSwitch checked={chargeCustomer} onChange={(e) => setChargeCustomer(e.target.checked)} />}
                  />
                </Grid>

                <Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
                  <FormControlLabel
                    label='Ingresso nominal'
                    name='personalTicket'
                    value={personalTicket}
                    inputRef={register}
                    control={<GreenSwitch checked={personalTicket} onChange={(e) => setPersonalTicket(e.target.checked)} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Dados do Evento</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <ImagePicker
                    label='Imagem do evento'
                    name='onlineImage'
                    inputRef={register}
                    image={onlineImage}
                    setImage={setOnlineImage}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    inputProps={{
                      style:{
                        height: 131
                      }
                    }}
                    label='Descreva o evento'
                    name='onlineDescription'
                    value={onlineDescription}
                    onChange={(e) => setOnlineDescription(e.target.value)}
                    multiline
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.local)}
                    helperText={errors?.local?.message}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Local</Typography>
              <Divider />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    inputProps={{
                      style:{
                        height: 79
                      }
                    }}
                    label='Descreva o local'
                    name='locationDesc'
                    value={locationDesc}
                    onChange={(e) => setLocationDesc(e.target.value)}
                    multiline
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.local)}
                    helperText={errors?.local?.message}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      label='Latitude'
                      name='lat'
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      variant='outlined'
                      type='number'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      style={{marginTop: 20}}
                      label='Longitude'
                      name='lng'
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      variant='outlined'
                      type='number'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Organizador</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <ImagePicker
                    label='Logo do organizador'
                    name='imageOrganizer'
                    inputRef={register}
                    image={imageOrganizer}
                    setImage={setImageOrganizer}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    inputProps={{
                      style:{
                        height: 131
                      }
                    }}
                    label='Descreva o organizador'
                    name='descriptionOrganizer'
                    value={descriptionOrganizer}
                    onChange={(e) => setDescriptionOrganizer(e.target.value)}
                    multiline
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.local)}
                    helperText={errors?.local?.message}
                    variant='outlined'
                    size='small'
                    fullWidth
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
                  <Button variant='outlined' color='primary' onClick={handleCancel}>
                    Salvar
                  </Button>
                </Grid>
                {/*<Grid item>
                  <Button type='submit' variant='outlined' color='primary'>
                    {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                  </Button>
                </Grid>*/}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Event;
