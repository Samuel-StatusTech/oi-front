import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
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
import { connect } from 'react-redux';

import Api from '../../../api';
import InputPassword from '../../../components/Input/Password';
import { useForm } from 'react-hook-form';
import TransferList from '../../../components/TransferList';
import ModalResetPassword from './Modal/ResetPassword';
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';

const PDV = ({ user }) => {
  const history = useHistory();
  const location = useLocation();
  const { idPDV } = useParams();
  const { handleSubmit, register, errors } = useForm();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [resetPassword, setResetPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [devices, setDevice] = useState([]);
  const [idDevice, setIdDevice] = useState(null);

  const [isWaiter, setIsWaiter] = useState(false);
  const [hasCommission, setHasCommission] = useState(false);
  const [commission, setCommission] = useState(0);

  const [hasBar, setHasBar] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [hasPark, setHasPark] = useState(false);
  const [allGroups, setAllGroups] = useState(false);
  const [hasProductList, setHasProductList] = useState(false);
  const [printSale, setPrintSale] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [allowChargeback, setAllowChargeback] = useState(false);
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [disablePdv, setDisablePdv] = useState(false);

  useEffect(() => {
    Api.get('/device/getList').then(({ data }) => {
      if (data.success) {
        setDevice(data.devices);
      } else {
        alert('Erro ao carregar os produtos');
      }
    });
  }, []);

  useEffect(() => {
    if (idPDV === 'clone') {
      const { pdv, list } = location.state;

      setName(pdv.name);
      setStatus(pdv.status);
      setDescription(pdv.description);
      setIsWaiter(pdv.is_waiter);
      setHasCommission(pdv.has_commission);
      setCommission(pdv.commission);
      setHasBar(pdv.has_bar);
      setHasTicket(pdv.has_ticket);
      setHasPark(pdv.has_park);
      setHasProductList(pdv.has_product_list);
      setPrintSale(pdv.print_sale);
      setPrintReceipt(pdv.print_receipt);
      setAllowChargeback(pdv.allow_chargeback);
      setRawList(list);

      setLoading(false);
    } else if (idPDV !== 'new') {
      Api.get(`/pdv/getData/${idPDV}`)
        .then(({ data }) => {
          const { success, pdv, list } = data;
          if (success) {
            setName(pdv.name);
            setUsername(pdv.username);
            setPassword(pdv.password);
            setStatus(pdv.status);
            setDescription(pdv.description);
            setIsWaiter(pdv.is_waiter);
            setHasCommission(pdv.has_commission);
            setCommission(pdv.commission);
            setHasBar(pdv.has_bar);
            setHasTicket(pdv.has_ticket);
            setHasPark(pdv.has_park);
            setAllGroups(pdv.has_bar && pdv.has_ticket && pdv.has_park);
            setHasProductList(pdv.has_product_list);
            setPrintSale(pdv.print_sale);
            setPrintReceipt(pdv.print_receipt);
            setAllowChargeback(pdv.allow_chargeback);
            setRawList(list);
          } else {
            alert('Não foi possível carregar os dados do PDV');
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

  const handleSave = async (values) => {
    try {
      if (!hasProductList && !hasBar && !hasTicket && !hasPark) {
        alert('Deve ser informado ao menos um tipo de produto');
        return false;
      }

      const checkedProductList = productList
        .filter((product) => product.tableData && product.tableData.checked)
        .map((product) => product.id);
      console.log(productList, checkedProductList);

      if (hasProductList && checkedProductList.length === 0) {
        alert("Selecione ao menos um item ou desabilite a opção de 'Quero escolher'");
        return false;
      }

      setButtonLoading(true);
      await Api.post('/pdv/createPDV', {
        name: values.name,
        username: values.username,
        password: values.password,
        status: values.status,
        description: values.description,
        is_waiter: isWaiter,
        has_commission: hasCommission,
        commission,
        has_bar: hasBar,
        has_ticket: hasTicket,
        has_park: hasPark,
        has_product_list: hasProductList,
        print_sale: printSale,
        print_receipt: printReceipt,
        allow_chargeback: allowChargeback,
        product_list: checkedProductList,
      });
      handleCancel();
    } catch (e) {
      if (e.response) {
        const data = e.response.data;

        if (data.error) {
          alert(data.error);
        } else {
          alert('Erro não esperado 1');
        }
      } else {
        console.log(e);
        alert('Erro não esperado 2');
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (!hasProductList && !hasBar && !hasTicket && !hasPark) {
        alert('Deve ser informado ao menos um tipo de produto');
        return false;
      }

      const checkedProductList = productList
        .filter((product) => product.tableData && product.tableData.checked)
        .map((product) => product.id);
      console.log(productList, checkedProductList);

      if (hasProductList && checkedProductList.length === 0) {
        alert("Selecione ao menos um item ou desabilite a opção de 'Quero escolher'");
        return false;
      }

      setButtonLoading(true);
      await Api.put(`/pdv/updatePDV/${idPDV}`, {
        name,
        username,
        status,
        description,
        is_waiter: isWaiter,
        has_commission: hasCommission,
        commission,
        has_bar: hasBar,
        has_ticket: hasTicket,
        has_park: hasPark,
        has_product_list: hasProductList,
        print_sale: printSale,
        print_receipt: printReceipt,
        allow_chargeback: allowChargeback,
        product_list: checkedProductList,
      });
      handleCancel();
    } catch (e) {
      console.clear();
      console.log('error =>', e.response);
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

  const onOpenedHandle = (checked) => {
    setDisablePdv(checked);
    if (checked) {
      setAllGroups(false);
      setHasBar(false);
      setHasTicket(false);
      setHasPark(false);
    }
  };

  const onSelectProduct = (products) => {
    setProductList(products);
    setHasProductList(products.length);
  };

  const setInputsFalse = (newErrors) => {
    let falseErrors = newErrors;
    for (let i in newErrors) {
      falseErrors[i] = '';
    }
    return falseErrors;
  };
  const verifyInputs = (values) => {
    let newErrors = setInputsFalse({ ...errorsVerify });
    let hasErrors = false;
    if (!/^[a-z]{1}(\w)+$/.test(values.username)) {
      newErrors['username'] =
        'Esse campo somente aceita letras e números, e inicial tem que ser minúsculo. (Min 2 Caracteres)';
      hasErrors = true;
    }
    if (!/^\S*$/.test(values?.password)) {
      newErrors['password'] = 'Não pode espaço em branco no campo';
      hasErrors = true;
    }
    setErrorsVerify(newErrors);
    if (hasErrors) throw 'Erro';
  };
  const onSubmit = (aa, bb) => {
    verifyInputs(aa);
    if (idPDV === 'new' || idPDV === 'clone') {
      handleSave(aa);
      return;
    }
    handleEdit();
  };

  const handleCancel = () => {
    history.push('/dashboard/pdv');
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={(e) => setName(e.target.value)}
                    inputRef={register({
                      required: 'É necessário preencher este campo',
                    })}
                    error={Boolean(errors?.name)}
                    helperText={errors?.name?.message}
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
                    inputProps={{ maxLength: 25 }}
                    onChange={(e) => setUsername(e.target.value)}
                    inputRef={register}
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
                    value={idDevice}
                    onChange={(e) => setIdDevice(e.target.value)}
                    label='Dispositivo'
                    variant='outlined'
                    size='small'
                    fullWidth
                    select
                  >
                    {devices.map((device, index) => (
                      <MenuItem key={index} value={device.code}>
                        {device.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xl={4} lg={4} xs={12} hidden={idPDV !== 'new' && idPDV !== 'clone'}>
                  <InputPassword
                    label='Senha'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputRef={register}
                    error={Boolean(errorsVerify?.password)}
                    helperText={errorsVerify?.password}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
              <FormControlLabel
                label={status ? 'Ativo' : 'Inativo'}
                name='status'
                value={status}
                inputRef={register}
                control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='PDV Garçom'
                    name='isWaiter'
                    value={isWaiter}
                    inputRef={register}
                    control={<GreenSwitch checked={isWaiter} onChange={(e) => setIsWaiter(e.target.checked)} />}
                  />
                </Grid>
                <Grid item justify='center' hidden={!isWaiter}>
                  <FormControlLabel
                    label='Comissão'
                    name='hasCommission'
                    value={hasCommission}
                    inputRef={register}
                    control={
                      <GreenSwitch checked={hasCommission} onChange={(e) => setHasCommission(e.target.checked)} />
                    }
                  />
                </Grid>
                <Grid item lg md sm xs hidden={!isWaiter}>
                  <TextField
                    label='%'
                    name='commission'
                    value={commission}
                    inputRef={register}
                    onChange={(e) => {
                      if (e.target.value >= 0) setCommission(e.target.value);
                    }}
                    variant='outlined'
                    type='number'
                    size='small'
                    disabled={!hasCommission}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Configurações Gerais</Typography>
              <Divider />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Imprimir Venda'
                    name='printSale'
                    value={printSale}
                    inputRef={register}
                    control={<GreenSwitch checked={printSale} onChange={(e) => setPrintSale(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Imprimir Recibo'
                    name='printReceipt'
                    value={printReceipt}
                    inputRef={register}
                    control={<GreenSwitch checked={printReceipt} onChange={(e) => setPrintReceipt(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Permitir Estorno'
                    name='allowChargeback'
                    value={allowChargeback}
                    inputRef={register}
                    control={
                      <GreenSwitch checked={allowChargeback} onChange={(e) => setAllowChargeback(e.target.checked)} />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Quais Produtos esse PDV Vende?</Typography>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12} hidden={hasProductList}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControlLabel
                    label='Bar'
                    name='hasBar'
                    value={hasBar}
                    disabled={disablePdv}
                    inputRef={register}
                    control={<GreenSwitch checked={hasBar} onChange={(e) => setHasBar(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Ingresso'
                    name='hasTicket'
                    value={hasTicket}
                    disabled={disablePdv}
                    inputRef={register}
                    control={<GreenSwitch checked={hasTicket} onChange={(e) => setHasTicket(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Estacionamento'
                    name='hasPark'
                    value={hasPark}
                    inputRef={register}
                    disabled={disablePdv}
                    control={<GreenSwitch checked={hasPark} onChange={(e) => setHasPark(e.target.checked)} />}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label='Todos'
                    name='allGroups'
                    value={allGroups}
                    disabled={disablePdv}
                    inputRef={register}
                    control={<GreenSwitch checked={allGroups} onChange={selectGroups} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TransferList
                onSelect={onSelectProduct}
                rawList={rawList}
                hasProduct={hasProductList}
                onOpenedHandle={onOpenedHandle}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                {idPDV !== 'new' && idPDV !== 'clone' ? (
                  <Grid item>
                    <Button onClick={() => setResetPassword(idPDV)} variant='outlined' color='secondary'>
                      Trocar senha
                    </Button>
                  </Grid>
                ) : null}

                <Grid item>
                  <Button variant='outlined' color='secondary' onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='outlined' color='primary' type='submit'>
                    {buttonLoading ? <CircularProgress size={25} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <ModalResetPassword id={resetPassword} onClose={() => setResetPassword(null)} />
        </CardContent>
      </Card>
    </form>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(PDV);
