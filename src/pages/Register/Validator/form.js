import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControlLabel,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import { connect } from 'react-redux';

import Api from '../../../api';
import InputPassword from '../../../components/Input/Password';
import TransferList from '../../../components/TransferList';
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';

const Validator = ({ user }) => {
  const history = useHistory();
  const { idValidator } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idValidator === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [disableValidator, setDisableValidator] = useState(false);

  // Usuário comum
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Usuário validador
  const [description, setDescription] = useState('');
  const [hasBar, setHasBar] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [hasPark, setHasPark] = useState(false);
  const [allGroups, setAllGroups] = useState(false);
  const [hasProductList, setHasProductList] = useState(false);

  useEffect(() => {
    if (!action) {
      Api.get(`/validator/getData/${idValidator}`)
        .then(({ data }) => {
          const { success, validator, products } = data;
          if (success) {
            setName(validator.name);
            setUsername(validator.username);

            setDescription(validator.description);
            setHasBar(validator.has_bar);
            setHasTicket(validator.has_ticket);
            setHasPark(validator.has_park);
            setAllGroups(validator.has_bar && validator.has_ticket && validator.has_park);
            setHasProductList(validator.has_product_list);

            setRawList(products);
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


  useEffect(() => {
    console.log({productList})
  }, [productList]);

  const handleSave = async () => {
    if (!hasBar && !hasTicket && !hasPark && !hasProductList) throw { message: 'Deve ser informado ao menos um tipo de produto' };

    if (hasProductList && productList.length === 0)
      throw { message: "Selecione ao menos um item ou desabilite a opção de 'Incluir Ingressos/Produtos'" };

    await Api.post('/register', {
      name: name,
      username: username,
      password: password,
      status: true,
      role: 'validador',
      org_id: user.org_id,
      products: productList.map(item => item.id),
      description,
      has_bar: hasBar,
      has_ticket: hasTicket,
      has_park: hasPark,
      has_product_list: productList.length,
    });
    handleCancel();
  };

  const handleEdit = async () => {
    if (!hasBar && !hasTicket && !hasPark && !hasProductList) throw { message: 'Deve ser informado ao menos um tipo de produto' };

    if (hasProductList && productList.length === 0)
      throw { message: "Selecione ao menos um item ou desabilite a opção de 'Incluir Ingressos/Produtos'" };

    await Api.put(`/validator/updateValidator/${idValidator}`, {
      name: name,
      username: username,
      status: status,
      products: productList,
      description,
      has_bar: hasBar,
      has_ticket: hasTicket,
      has_park: hasPark,
      has_product_list: productList.length,
    });
    handleCancel();
  };

  const onOpenedHandle = (checked) => {
    setDisableValidator(checked);
    setHasProductList(checked);
    if (checked) {
      setAllGroups(false);
      setHasBar(false);
      setHasTicket(false);
      setHasPark(false);
    }
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
  const descriptionInputVerify = (description) => {
    if (!/^(\S|[ ]){1,50}$/i.test(description)) return (errorsVerify.description = 'É necessário esse campo.');
    errorsVerify.description = null;
    return false;
  };
  const verifyInputs = () => {
    return (
      nameInputVerify(name) ||
      usernameInputVerify(username) ||
      (action ? passwordInputVerify(password) : false) ||
      descriptionInputVerify(description)
    );
  };
  const handleSubmit = () => {
    try {
      setButtonLoading(true);
      if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
      if (action) {
        handleSave();
        return;
      }
      handleEdit();
    } catch (error) {
      alert(error.message);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard/validator');
  };

  const selectGroups = (e) => {
    setAllGroups(e.target.checked);
    setHasBar(e.target.checked);
    setHasPark(e.target.checked);
    setHasTicket(e.target.checked);
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
              </Grid>
              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Descrição'
                    name='description'
                    value={description}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 50);
                      setDescription(value);
                      descriptionInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.description)}
                    helperText={errorsVerify?.description}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
                {action ? (
                  <Grid item xl={4} lg={4} xs={12}>
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
              </Grid>
            </Grid>

            <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
              <FormControlLabel
                label={status ? 'Ativo' : 'Inativo'}
                name='status'
                value={status}
                control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Quais produtos esse operador pode validar?</Typography>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container>
                <Grid item>
                  <FormControlLabel
                    label='Bar'
                    name='hasBar'
                    value={hasBar}
                    disabled={disableValidator}
                    control={<GreenSwitch checked={hasBar} onChange={(e) => setHasBar(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Ingresso'
                    name='hasTicket'
                    value={hasTicket}
                    disabled={disableValidator}
                    control={<GreenSwitch checked={hasTicket} onChange={(e) => setHasTicket(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Estacionamento'
                    name='hasPark'
                    value={hasPark}
                    disabled={disableValidator}
                    control={<GreenSwitch checked={hasPark} onChange={(e) => setHasPark(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Todos'
                    name='allGroups'
                    value={allGroups}
                    disabled={disableValidator}
                    control={<GreenSwitch checked={allGroups} onChange={selectGroups} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TransferList
                label='Incluir Ingressos/Produtos'
                onSelect={setProductList}
                url='/product/getList'
                hasProduct={hasProductList}
                rawList={rawList}
                onOpenedHandle={onOpenedHandle}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item justify='center'>
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

export default connect(mapStateToProps)(Validator);
