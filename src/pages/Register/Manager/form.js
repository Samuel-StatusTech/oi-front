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
  Card,
  CardContent,
} from '@material-ui/core';
import { connect } from 'react-redux';

import Api from '../../../api';
import InputPassword from '../../../components/Input/Password';
import InputPhone from '../../../components/Input/NumberPhone';
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';
import Tooltip from '../../../components/Tooltip';

const Manager = ({ user }) => {
  const history = useHistory();
  const { idManager } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idManager === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  // Usuário comum
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(true);

  // Usuário gerente
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [viewMode, setViewMode] = useState(false);
  const [allowOperation, setAllowOperation] = useState(false);
  const [allowRegister, setAllowRegister] = useState(false);
  const [allowEcommerce, setAllowEcommerce] = useState(false);
  const [allowCancel, setAllowCancel] = useState(false);
  const [allowReprint, setAllowReprint] = useState(false);
  const [allowBleed, setAllowBleed] = useState(false);
  const [allowCourtesy, setAllowCourtesy] = useState(false);
  const [allowCashRegister, setAllowCashRegister] = useState(false);
  const [allowAdjust, setAllowAdjust] = useState(false);
  const [code, setCode] = useState('');
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    //if (!/^[a-zA-Z ]*$/.test(name)) return (errorsVerify.name = 'Esse campo só aceita letras.');
    errorsVerify.name = null;
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
  const codeInputVerify = (code) => {
    if (!/^\d{1,6}$/i.test(code)) return (errorsVerify.code = 'É necessário preencher este campo. (Somente Números)');
    errorsVerify.code = null;
    return false;
  };
  const descriptionInputVerify = (description) => {
    if (!/^\w{0,50}$/i.test(description)) return (errorsVerify.description = 'O máximo do campo é 50 caracteres.');
    errorsVerify.description = null;
    return false;
  };
  useEffect(() => {
    if (!action) {
      Api.get(`/manager/getData/${idManager}`)
        .then(({ data }) => {
          const { success, manager } = data;
          if (success) {
            setName(manager.name);
            //setUsername(manager.username);
            setEmail(manager.email);
            setStatus(manager.status);

            setPhone(manager.phone);
            setDescription(manager.description);
            setViewMode(Boolean(manager.view_mode));
            setAllowOperation(Boolean(manager.allow_operation));
            setAllowRegister(Boolean(manager.allow_register));
            setAllowEcommerce(Boolean(manager.allow_ecommerce ?? 0));
            setAllowCancel(Boolean(manager.allow_cancel));
            setAllowReprint(Boolean(manager.allow_reprint));
            setAllowBleed(Boolean(manager.allow_bleed));
            setAllowCourtesy(Boolean(manager.allow_courtesy));
            setAllowCashRegister(Boolean(manager.allow_cash_register));
            setAllowAdjust(Boolean(manager.allow_adjust));
            setCode(manager.safe_code);
          } else {
            alert('Não foi possível carregar os dados do gerente');
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

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      const { error, success, uid } = (await Api.post('/registerFirebase', {
        email,
        password
      })).data;

      if(success && uid) {
        await Api.post('/register', {
          firebaseUid: uid,
          name,
          username: email,
          email,
          password,
          status,
          role: 'gerente',
          org_id: user.org_id,
  
          //phone,
          description,
          view_mode: Boolean(viewMode),
          allow_operation: Boolean(allowOperation),
          allow_register: Boolean(allowRegister),
          allow_ecommerce: Boolean(allowEcommerce),
          allow_cancel: Boolean(allowCancel),
          allow_reprint: Boolean(allowReprint),
          allow_bleed: Boolean(allowBleed),
          allow_courtesy: Boolean(allowCourtesy),
          allow_cash_register: Boolean(allowCashRegister),
          allow_adjust: Boolean(allowAdjust),
          safe_code: code,
        });
        handleCancel();
      }
    } catch (e) {
      alert("Erro ao criar usuário")
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      await Api.put(`/manager/updateManager/${idManager}`, {
        name,
        username: email,
        email,
        status,

        phone,
        description,
        view_mode: Boolean(viewMode),
        allow_operation: Boolean(allowOperation),
        allow_register: Boolean(allowRegister),
        allow_ecommerce: Boolean(allowEcommerce),
        allow_cancel: Boolean(allowCancel),
        allow_reprint: Boolean(allowReprint),
        allow_bleed: Boolean(allowBleed),
        allow_courtesy: Boolean(allowCourtesy),
        allow_cash_register: Boolean(allowCashRegister),
        allow_adjust: Boolean(allowAdjust),
        safe_code: code,
      });
      handleCancel();
    } catch (e) {
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleViewMode = (e) => {
    setViewMode(e.target.checked);
    setAllowOperation(false);
    setAllowRegister(false);
    setAllowCancel(false);
    setAllowReprint(false);
    setAllowBleed(false);
    setAllowCourtesy(false);
    setAllowCashRegister(false);
  };

  const verifyInputs = () => {
    return (
      nameInputVerify(name) ||
      (action ? passwordInputVerify(password) : false) ||
      emailInputVerify(email) ||
      //phoneInputVerify(phone ?? '') ||
      codeInputVerify(code) ||
      descriptionInputVerify(description)
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
    history.push('/dashboard/manager');
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
                    label='Nome'
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

                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    disabled={!action}
                    label='E-mail'
                    name='email'
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

                {action &&
                  <Grid item xl={4} lg={4} xs={12}>
                    <InputPassword
                      label='Senha para acesso web'
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
                }

                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Senha na maquininha'
                    name='code'
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 6);
                      setCode(value);
                      codeInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.code)}
                    helperText={errorsVerify?.code}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Observações'
                    name='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 50))}
                    error={Boolean(errorsVerify?.description)}
                    helperText={errorsVerify?.description}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <FormControlLabel
                name='status'
                control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                label={status ? 'Ativo' : 'Inativo'}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Configurações de perfil</Typography>
              <Divider />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip title='Perfil somente para acesso e consulta a relatórios.' placement='right'>
                    <FormControlLabel
                      label='Apenas Consulta'
                      name='viewMode'
                      value={viewMode}
                      control={<GreenSwitch checked={viewMode} onChange={handleViewMode} />}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Permissões no sistema Web</Typography>
              <Divider />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip
                    title='Permite Acesso ao Menu Gerencial (Transações, Cancelamentos, Consultas, etc).'
                    placement='right'
                  >
                    <FormControlLabel
                      label='Menu Operacional'
                      name='allowOperation'
                      value={allowOperation}
                      control={
                        <GreenSwitch
                          disabled={viewMode}
                          checked={allowOperation}
                          onChange={(e) => setAllowOperation(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip
                    title='Permite Acesso ao Menu Cadastros (Eventos, Produtos, Estoques, Operadores, etc).'
                    placement='right'
                  >
                    <FormControlLabel
                      label='Menu Cadastros'
                      name='allowRegister'
                      value={allowRegister}
                      control={
                        <GreenSwitch
                          disabled={viewMode}
                          checked={allowRegister}
                          onChange={(e) => setAllowRegister(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip
                    title='Permite Acesso à Loja Virtual'
                    placement='right'
                  >
                    <FormControlLabel
                      label='Loja Virtual'
                      name='allowEcommerce'
                      value={allowEcommerce}
                      control={
                        <GreenSwitch
                          disabled={viewMode}
                          checked={allowEcommerce}
                          onChange={(e) => setAllowEcommerce(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Permissões da maquininha</Typography>
              <Divider />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip title='Permite efetuar Cancelamentos de Transações.' placement='right'>
                    <FormControlLabel
                      label='Cancelamentos'
                      name='allowCancel'
                      value={allowCancel}
                      control={
                        <GreenSwitch
                          checked={allowCancel}
                          disabled={viewMode}
                          onChange={(e) => setAllowCancel(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title='Permite imprimir segunda via de tickets.' placement='right'>
                    <FormControlLabel
                      label='Imprimir Segunda Via'
                      name='allowReprint'
                      value={allowReprint}
                      control={
                        <GreenSwitch
                          checked={allowReprint}
                          disabled={viewMode}
                          onChange={(e) => setAllowReprint(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title='Permite efetuar Sangrias (Retiradas de Dinheiro).' placement='right'>
                    <FormControlLabel
                      label='Sangrias'
                      name='allowBleed'
                      value={allowBleed}
                      control={
                        <GreenSwitch
                          checked={allowBleed}
                          disabled={viewMode}
                          onChange={(e) => setAllowBleed(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title='Permite impressão de Cortesias.' placement='right'>
                    <FormControlLabel
                      label='Cortesias'
                      name='allowCourtesy'
                      value={allowCourtesy}
                      control={
                        <GreenSwitch
                          checked={allowCourtesy}
                          disabled={viewMode}
                          onChange={(e) => setAllowCourtesy(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip
                    title='Permite realizar operação de Abertura e Fechamento de Caixa nos terminais.'
                    placement='right'
                  >
                    <FormControlLabel
                      label='Abre/Fecha Caixa'
                      name='allowCashRegister'
                      value={allowCashRegister}
                      control={
                        <GreenSwitch
                          checked={allowCashRegister}
                          disabled={viewMode}
                          onChange={(e) => setAllowCashRegister(e.target.checked)}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Ajustes'
                    name='allowAdjust'
                    value={allowAdjust}
                    control={
                      <GreenSwitch
                        checked={allowAdjust}
                        disabled={viewMode}
                        onChange={(e) => setAllowAdjust(e.target.checked)}
                      />
                    }
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
                  {user.role == 'master' &&
                    <Button onClick={() => handleSubmit()} variant='outlined' color='primary'>
                      {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                    </Button>
                  }
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

export default connect(mapStateToProps)(Manager);
