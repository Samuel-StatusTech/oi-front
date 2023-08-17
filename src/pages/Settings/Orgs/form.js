import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Button,
  CircularProgress,
  withStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import { connect } from 'react-redux';

import InputPhone from '../../../components/Input/NumberPhone';
import InputCpfCnpj from '../../../components/Input/CpfCnpj';
import Api from '../../../api';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MenuItem } from '@material-ui/core';
import InputPassword from '../../../components/Input/Password';
import { getMinDateToday } from '../../../utils/date';
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
const validList = [
  { key: 'global', name: 'Global' },
  { key: 'event', name: 'Por Evento' },
];
const Client = ({ user }) => {
  const history = useHistory();
  const { idOrg } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idOrg === 'new');
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  // Usuário comum
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [observations, setObservations] = useState('');
  const [expireDate, setExpireDate] = useState(new Date());
  const [password, setPassword] = useState('');
  const [validCashless, setValidCashless] = useState('global');
  const [validTicket, setValidTicket] = useState('global');
  // Usuário gerente
  const [has_cashless, setAllowCashless] = useState(false);
  const [has_devices, setAllowDevice] = useState(false);
  const [status, setStatus] = useState(false);
  const [max_devices, setDevice] = useState(0);
  const [pagseguro_code, setCode] = useState('');

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
  const formData = (assignData = {}) => {
    const data = Object.assign(assignData, {
      name,
      username,
      password,
      phone: phone.toString().match(/\d/g).join(''),
      has_cashless: has_cashless,
      has_devices: has_devices,
      max_devices: max_devices.toString().match(/\d/g).join(''),
      status: status,
      pagseguro_code,
      cpfCnpj: cpfCnpj.toString().match(/\d/g).join(''),
      address,
      city,
      email,
      state,
      valid_cashless: validCashless,
      valid_ticket: validTicket,
      observations,
      expire_date: expireDate,
    });
    return data;
  };

  useEffect(() => {
    if (!action) getData();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      await Api.post('/organization', formData());
      history.goBack();
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async (values) => {
    try {
      setButtonLoading(true);
      await Api.put('/organization/' + idOrg, formData());
      history.goBack();
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
    } finally {
      setButtonLoading(false);
    }
  };
  const getData = async (values) => {
    setLoading(true);
    const response = await Api.get('/organization/' + idOrg);
    if (response.data.success) {
      const { organization } = response.data;
      setName(organization.name);
      setUsername(organization.username);
      setPhone(organization.phone);
      setAllowCashless(organization.has_cashless);
      setAllowDevice(organization.has_devices);
      setDevice(organization.max_devices);
      setCode(organization.pagseguro_code);
      setStatus(organization.status);
      setCpfCnpj(organization.cpfCnpj);
      setAddress(organization.address);
      setCity(organization.city);
      setEmail(organization.email);
      setState(organization.state);
      setObservations(organization.observations);
      setExpireDate(organization.expire_date);
      setValidCashless(organization.valid_cashless);
      setValidTicket(organization.valid_ticket);
    } else {
      alert(response.data ? response.data.message : 'Falha ao carregar dados');
      history.goBack();
    }
    setLoading(false);
  };
  const setInputsFalse = (newErrors) => {
    let falseErrors = newErrors;
    for (let i in newErrors) {
      falseErrors[i] = '';
    }
    return falseErrors;
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    //if (!/^[a-zA-Z ]*$/.test(name)) return (errorsVerify.name = 'Esse campo só aceita letras.');
    errorsVerify.name = null;
    return false;
  };
  const pagseguroInputVerify = (pagseguro) => {
    if (isEmpty(pagseguro)) return (errorsVerify.pagseguro = 'É necessário preencher este campo');
    errorsVerify.pagseguro = null;
    return false;
  };
  const usernameInputVerify = (username) => {
    if (!/^[a-z]{1}(\w)+$/.test(username))
      return (errorsVerify.username =
        'Esse campo somente aceita letras e números, e inicial tem que ser minúsculo. (Mín. 2 caracteres)');
    errorsVerify.username = null;
    return false;
  };
  const passwordInputVerify = (password) => {
    if (!/^\S{4,}/.test(password)) return (errorsVerify.password = 'Mínimo 4 caracteres');
    if (!/^\S*$/i.test(password)) return (errorsVerify.password = 'Não pode espaço em branco no campo');
    errorsVerify.password = null;
    return false;
  };
  const emailInputVerify = (email) => {
    if (isEmpty(email)) return (errorsVerify.email = 'É necessário preencher este campo');
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      return (errorsVerify.email = 'Endereço de email inválido');
    errorsVerify.email = null;
    return false;
  };
  const phoneInputVerify = (phone) => {
    if (!/^[0-9]{10,11}$/.test(phone.replace(/[^0-9.]/g, '')))
      return (errorsVerify.phone = 'É necessário preencher este campo');
    errorsVerify.phone = null;
    return false;
  };
  const cpfCnpjVerify = (cpfCnpj) => {
    if (!/^[0-9]{11,14}$/.test(cpfCnpj.replace(/\D+/g, '')))
      return (errorsVerify.cpfCnpj = 'É necessário preencher este campo');
    errorsVerify.cpfCnpj = null;
    return false;
  };
  const addressInputVerify = (address) => {
    if (isEmpty(address)) return (errorsVerify.address = 'É necessário preencher este campo');
    errorsVerify.address = null;
    return false;
  };
  const cityInputVerify = (city) => {
    if (isEmpty(city)) return (errorsVerify.city = 'É necessário preencher este campo');
    errorsVerify.city = null;
    return false;
  };
  const observationsInputVerify = (observations) => {
    if (isEmpty(observations)) return (errorsVerify.observations = 'É necessário preencher este campo');
    errorsVerify.observations = null;
    return false;
  };
  const verifyInputs = () => {
    return (
      nameInputVerify(name) ||
      usernameInputVerify(username) ||
      (action ? passwordInputVerify(password) : false) ||
      emailInputVerify(email) ||
      phoneInputVerify(phone ?? '') ||
      pagseguroInputVerify(pagseguro_code) ||
      cpfCnpjVerify(cpfCnpj ?? '') ||
      addressInputVerify(address) ||
      cityInputVerify(city)
    );
  };
  const handleSubmit = () => {
    try {
      if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
      if (action) {
        handleSave();
        return;
      }
      handleEdit();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/organization');
  };
  return (
    <form>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label='Nome ou Razão Social'
                    name='name'
                    value={name}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 80);
                      setName(value);
                      nameInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.name)}
                    helperText={errorsVerify?.name}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label='Usuário'
                    name='username'
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 25);
                      setUsername(value);
                      usernameInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.username)}
                    helperText={errorsVerify?.username}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Código da PagSeguro'
                    name='pagseguro_code'
                    value={pagseguro_code}
                    disabled={user.role === 'master' ? false : true}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 80);
                      setCode(value);
                      pagseguroInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.pagseguro)}
                    helperText={errorsVerify?.pagseguro}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                {idOrg === 'new' ? (
                  <Grid item xs={12}>
                    <InputPassword
                      label='Senha'
                      name='password'
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        passwordInputVerify(value);
                      }}
                      error={Boolean(errorsVerify?.password)}
                      helperText={errorsVerify?.password}
                      variant='outlined'
                      size='small'
                      fullWidth
                    />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <InputPhone
                    label='Telefone'
                    name='phone'
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPhone(value);
                      phoneInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.phone)}
                    helperText={errorsVerify?.phone}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputCpfCnpj
                    label='CPF/CNPJ'
                    name='cpfCnpj'
                    placeholder='xxx.xxx.xxx-xx OU xx.xxx.xxx/xxxx-xx'
                    value={cpfCnpj}
                    setValue={(value) => {
                      setCpfCnpj(value);
                      cpfCnpjVerify(value);
                    }}
                    error={Boolean(errorsVerify?.cpfCnpj)}
                    helperText={errorsVerify?.cpfCnpj}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Endereço'
                    name='address'
                    value={address}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAddress(value);
                      addressInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.address)}
                    helperText={errorsVerify?.address}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <TextField
                    label='Cidade'
                    name='city'
                    value={city}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCity(value);
                      cityInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.city)}
                    helperText={errorsVerify?.city}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <TextField
                    label='Estado'
                    name='state'
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
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
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <TextField
                    label='Validade Cashless'
                    name='valid_cashless'
                    value={validCashless}
                    onChange={(e) => {
                      setValidCashless(e.target.value);
                    }}
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                  >
                    {validList.map((item) => (
                      <MenuItem key={item.key} value={item.key}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={6} xl={6}>
                  <TextField
                    label='Validade Ticket'
                    name='valid_ticket'
                    value={validTicket}
                    onChange={(e) => {
                      setValidTicket(e.target.value);
                    }}
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                  >
                    {validList.map((item) => (
                      <MenuItem key={item.key} value={item.key}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Email'
                    name='email'
                    type='email'
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      emailInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.email)}
                    helperText={errorsVerify?.email}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Observações'
                    name='observations'
                    value={observations}
                    onChange={(e) => {
                      const value = e.target.value;
                      setObservations(value);
                      observationsInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.observations)}
                    helperText={errorsVerify?.observations}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    label='Data de expiração'
                    name='expireDate'
                    value={expireDate}
                    onChange={setExpireDate}
                    minDate={getMinDateToday()}
                    minDateMessage='A data não deve ser menor que 10 anos da data atual'
                    inputVariant='outlined'
                    variant='inline'
                    format='DD/MM/YYYY'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Configurar permissões</Typography>
              <Divider />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Permitido uso de cashless'
                    name='has_cashless'
                    value={has_cashless}
                    control={
                      <GreenSwitch checked={has_cashless} onChange={(e) => setAllowCashless(e.target.checked)} />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Permitido dispositivo'
                    name='has_devices'
                    value={has_devices}
                    control={<GreenSwitch checked={has_devices} onChange={(e) => setAllowDevice(e.target.checked)} />}
                  />
                </Grid>
                <Grid item lg md sm xs>
                  <TextField
                    label='Número de dispositivos'
                    name='commission'
                    value={max_devices}
                    onChange={(e) => setDevice(e.target.value)}
                    variant='outlined'
                    type='number'
                    size='small'
                    disabled={!has_devices}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Status'
                    name='has_cashless'
                    value={status}
                    control={<GreenSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Client);
