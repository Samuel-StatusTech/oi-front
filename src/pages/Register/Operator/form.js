import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControlLabel,
  Button,
  CircularProgress,
  Typography,
  Divider,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import { connect } from 'react-redux';

import Api from '../../../api';
import firebase from '../../../firebase';
import InputPassword from '../../../components/Input/Password';
// import InputPhone from '../../../components/Input/Phone';
import TransferList from '../../../components/TransferList';
import ModalResetPassword from './Modal/ResetPassword';
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';

const Operator = ({ user }) => {
  const history = useHistory();
  const location = useLocation();
  const { idOperator } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [resetPassword, setResetPassword] = useState(null);
  const [action] = useState(idOperator === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasProductList, setHasProductList] = useState(false);
  const [hasBar, setHasBar] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [hasPark, setHasPark] = useState(false);
  const [allGroups, setAllGroups] = useState(false);
  const [payMoney, setPayMoney] = useState(true);
  const [payDebit, setPayDebit] = useState(true);
  const [payCredit, setPayCredit] = useState(true);
  const [payPix, setPayPix] = useState(true);
  const [payCashless, setPayCashless] = useState(false);
  const [payMulti, setPayMulti] = useState(false);
  const [printMode, setPrintMode] = useState(null);
  const [viaProduction, setViaProduction] = useState(false);
  const [allowCashback, setAllowCashback] = useState(false);
  const [allowCourtesy, setAllowCourtesy] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [isWaiter, setIsWaiter] = useState(false);
  const [hasCommission, setHasCommission] = useState(false);
  const [commission, setCommission] = useState(0);
  const [hasCashless, setHasCashless] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [allowRefound, setAllowRefound] = useState(false);
  const [allowCashbackCashless, setAllowCashbackCashless] = useState(false);
  const [deviceCode, setDeviceCode] = useState(null);
  const [productList, setProductList] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [disableOperators, setDisableOperators] = useState(false);
  const [hasCashlessConfig, setHasCashlessConfig] = useState(false);
  const [devices, setDevice] = useState([]);
  const hasCashlessConf = async (user) => {

    if (user && user.uid) {
      console.log(user.uid)
      const clientKey = (await firebase.database().ref('Managers/' + user.uid + '/client').once('value')).val()
      const hasCashlessC = (await firebase.database().ref(`Clients/${clientKey}/cashless`).once('value')).val();
      setHasCashlessConfig(hasCashlessC);
    }
  }
  useEffect(() => {
    loadData();
    firebase.auth().onAuthStateChanged(hasCashlessConf);
    hasCashlessConf();
    // eslint-disable-next-line
  }, []);

  const loadData = () => {
    Api.get('/device/getListActived').then(({ data }) => {
      if (data.success) {
        setDevice(data.devices);
      } else {
        alert('Erro ao carregar os produtos');
      }
    });

    if (idOperator === 'clone') {
      if (!location.state) {
        location['state'] = JSON.parse(localStorage.getItem('OPERATOR_CLONE'));
      }

      const { operator, list } = location.state;

      setRawList(list);
      setHasProductList(operator.has_product_list);
      setHasBar(operator.has_bar);
      setHasTicket(operator.has_ticket);
      setHasPark(operator.has_park);
      setPayMoney(operator.pay_money);
      setPayDebit(operator.pay_debit);
      setPayCredit(operator.pay_credit);
      setPayPix(operator.pay_pix);
      setPayCashless(operator.pay_cashless);
      setPayMulti(operator.pay_multi);
      setPrintMode(operator.print_mode);
      setViaProduction(operator.via_production);
      setAllowCashback(operator.allow_cashback);
      setAllowCourtesy(operator.allow_courtesy);
      setAllowDuplicate(operator.allow_duplicate);
      setIsWaiter(operator.is_waiter);
      setHasCommission(operator.has_commission);
      setCommission(operator.commission);
      setHasCashless(operator.has_cashless);
      setPrintReceipt(operator.print_receipt);
      setAllowRefound(operator.allow_refound);
      setAllowCashbackCashless(operator.allow_cashback_cashless);
      setDeviceCode(operator.device_code);

      setLoading(false);
    } else if (idOperator !== 'new') {
      Api.get(`/operator/getData/${idOperator}`)
        .then(({ data }) => {
          const { success, operator, list } = data;

          if (success) {
            setName(operator.name);
            setUsername(operator.username);
            setRawList(list);
            setHasProductList(operator.has_product_list);
            setHasBar(operator.has_bar);
            setHasTicket(operator.has_ticket);
            setHasPark(operator.has_park);
            setAllGroups(operator.has_bar && operator.has_ticket && operator.has_park);
            setPayMoney(operator.pay_money);
            setPayDebit(operator.pay_debit);
            setPayCredit(operator.pay_credit);
            setPayPix(operator.pay_pix);
            setPayCashless(operator.pay_cashless);
            setPayMulti(operator.pay_multi);
            setPrintMode(operator.print_mode);
            setViaProduction(operator.via_production);
            setAllowCashback(operator.allow_cashback);
            setAllowCourtesy(operator.allow_courtesy);
            setAllowDuplicate(operator.allow_duplicate);
            setIsWaiter(operator.is_waiter);
            setHasCommission(operator.has_commission);
            setCommission(operator.commission);
            setHasCashless(operator.has_cashless);
            setPrintReceipt(operator.print_receipt);
            setAllowRefound(operator.allow_refound);
            setAllowCashbackCashless(operator.allow_cashback_cashless);
            setDeviceCode(operator.device_code);
          } else {
            alert('Não foi possível carregar os dados do gerente');
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
  }

  const handleSave = async () => {
    try {
      setButtonLoading(true);
      await Api.post('/register', {
        name,
        username,
        password,
        status: true,
        role: 'operador',
        org_id: user.org_id,
        has_product_list: hasProductList,
        has_bar: hasBar,
        has_ticket: hasTicket,
        has_park: hasPark,
        pay_money: payMoney,
        pay_debit: payDebit,
        pay_credit: payCredit,
        pay_pix: payPix,
        pay_cashless: payCashless,
        pay_multi: payMulti,
        print_mode: printMode,
        via_production: viaProduction,
        allow_cashback: allowCashback,
        allow_courtesy: allowCourtesy,
        allow_duplicate: allowDuplicate,
        is_waiter: isWaiter,
        has_commission: hasCommission,
        commission,
        has_cashless: hasCashless,
        print_receipt: printReceipt,
        allow_refound: allowRefound,
        allow_cashback_cashless: allowCashbackCashless,
        device_code: deviceCode,
        products: productList.map((prod) => prod.id),
      });
      handleCancel();
    } catch (e) {
      console.log(e);
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
      await Api.put(`/operator/updateOperator/${idOperator}`, {
        name,
        username,
        password,
        status,
        role: 'operador',
        org_id: user.org_id,
        has_product_list: hasProductList,
        has_bar: hasBar,
        has_ticket: hasTicket,
        has_park: hasPark,
        pay_money: payMoney,
        pay_debit: payDebit,
        pay_credit: payCredit,
        pay_pix: payPix,
        pay_cashless: payCashless,
        pay_multi: payMulti,
        print_mode: printMode,
        via_production: viaProduction,
        allow_cashback: allowCashback,
        allow_courtesy: allowCourtesy,
        allow_duplicate: allowDuplicate,
        is_waiter: isWaiter,
        has_commission: hasCommission,
        commission,
        has_cashless: hasCashless,
        print_receipt: printReceipt,
        allow_refound: allowRefound,
        allow_cashback_cashless: allowCashbackCashless,
        device_code: deviceCode,
        products: productList.map((prod) => prod.id),
      });
      handleCancel();
    } catch (e) {
      console.log(e);
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

  const onSelectProduct = (products) => {
    setProductList(products);
    setHasProductList(products.length);
  };

  const onOpenedHandle = (checked) => {
    setDisableOperators(checked);
    if (checked) {
      setAllGroups(false);
      setHasBar(false);
      setHasTicket(false);
      setHasPark(false);
    }
  };
  const verifyInputs = () => {
    return (
      nameInputVerify(name) ||
      usernameInputVerify(username) ||
      (idOperator === 'new' || idOperator === 'clone' ? passwordInputVerify(password) : false) ||
      commissionInputVerify(commission)
    );
  };
  const handleSubmit = () => {
    try {
      setButtonLoading(true);
      if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
      if (idOperator === 'new' || idOperator === 'clone') {
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
    history.push('/dashboard/operator');
  };

  const selectGroups = (e) => {
    setAllGroups(e.target.checked);
    setHasBar(e.target.checked);
    setHasPark(e.target.checked);
    setHasTicket(e.target.checked);
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
      return (errorsVerify.username = 'Esse campo somente aceita letras e números. (Mín. 2 caracteres)');
    errorsVerify.username = null;
    return false;
  };
  const passwordInputVerify = (password) => {
    if (!/^\S{4,}/.test(password)) return (errorsVerify.password = 'Mínimo 4 caracteres');
    if (!/^\S*$/i.test(password)) return (errorsVerify.password = 'Não pode espaço em branco no campo');
    errorsVerify.password = null;
    return false;
  };

  const commissionInputVerify = (commission) => {
    if (!/^[0-9]{1,3}/i.test(commission)) return (errorsVerify.commission = 'Valor Inválido.');
    errorsVerify.commission = null;
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
    <>
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
                  {idOperator === 'new' || idOperator === 'clone' ? (
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

                  <Grid item xl={4} lg={4} xs={12}>
                    <TextField
                      label='Dispositivo'
                      name='deviceCode'
                      value={deviceCode}
                      onChange={(e) => setDeviceCode(e.target.value)}
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
                <Typography style={{ fontWeight: 'bold' }}>Quais produtos esse Operador vende?</Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label='Bar'
                      name='hasBar'
                      value={hasBar}
                      disabled={disableOperators}
                      control={<GreenSwitch checked={hasBar} onChange={(e) => setHasBar(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Ingresso'
                      name='hasTicket'
                      value={hasTicket}
                      disabled={disableOperators}
                      control={<GreenSwitch checked={hasTicket} onChange={(e) => setHasTicket(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Estacionamento'
                      name='hasPark'
                      value={hasPark}
                      disabled={disableOperators}
                      control={<GreenSwitch checked={hasPark} onChange={(e) => setHasPark(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Todos'
                      name='allGroups'
                      value={allGroups}
                      disabled={disableOperators}
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
                  selectAll
                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: 'bold' }}>Formas de Pagamento</Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label='Dinheiro'
                      name='payMoney'
                      value={payMoney}
                      control={<GreenSwitch checked={payMoney} onChange={(e) => setPayMoney(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Débito'
                      name='payDebit'
                      value={payDebit}
                      control={<GreenSwitch checked={payDebit} onChange={(e) => setPayDebit(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Crédito'
                      name='payCredit'
                      value={payCredit}
                      control={<GreenSwitch checked={payCredit} onChange={(e) => setPayCredit(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Pix'
                      name='payPix'
                      value={payPix}
                      control={<GreenSwitch checked={payPix} onChange={(e) => setPayPix(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      disabled
                      label='Cashless'
                      name='payCashless'
                      value={payCashless}
                      control={<GreenSwitch checked={payCashless} onChange={(e) => setPayCashless(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Múltiplo'
                      name='payMulti'
                      value={payMulti}
                      control={<GreenSwitch checked={payMulti} onChange={(e) => setPayMulti(e.target.checked)} />}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: 'bold' }}>Modo de impressão</Typography>
                <Divider />
              </Grid>

              <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                <TextField
                  label='Selecione'
                  name='printMode'
                  value={printMode}
                  onChange={(e) => setPrintMode(e.target.value)}
                  variant='outlined'
                  size='small'
                  fullWidth
                  select
                >
                  <MenuItem value='ficha'>Ficha</MenuItem>
                  <MenuItem value='recibo'>Recibo</MenuItem>
                </TextField>
              </Grid>
              {printMode == 'recibo' &&
                <Grid item>
                  <FormControlLabel
                    label='Imprimir 2 Vias do Recibo'
                    name='viaProduction'
                    value={viaProduction}
                    control={
                      <GreenSwitch checked={viaProduction} onChange={(e) => setViaProduction(e.target.checked)} />
                    }
                  />
                </Grid>
              }

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography style={{ fontWeight: 'bold' }}>Configurações Gerais</Typography>
                <Divider />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label='Permite Estorno'
                      name='allowCashback'
                      value={allowCashback}
                      control={
                        <GreenSwitch checked={allowCashback} onChange={(e) => setAllowCashback(e.target.checked)} />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Permite Cortesias'
                      name='allowCourtesy'
                      value={allowCourtesy}
                      control={
                        <GreenSwitch checked={allowCourtesy} onChange={(e) => setAllowCourtesy(e.target.checked)} />
                      }
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label='Permite Impressão 2via'
                      name='allowDuplicate'
                      value={allowDuplicate}
                      control={
                        <GreenSwitch checked={allowDuplicate} onChange={(e) => setAllowDuplicate(e.target.checked)} />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel
                      label='É um garçom'
                      name='isWaiter'
                      value={isWaiter}
                      control={<GreenSwitch checked={isWaiter} onChange={(e) => setIsWaiter(e.target.checked)} />}
                    />
                  </Grid>
                  <Grid item justify='center' hidden={!isWaiter}>
                    <FormControlLabel
                      label='Comissão'
                      name='hasCommission'
                      value={hasCommission}
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
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 3);
                        setCommission(value);
                      }}
                      error={Boolean(errorsVerify?.commission)}
                      helperText={errorsVerify?.commission}
                      variant='outlined'
                      // type="number"
                      size='small'
                      disabled={!hasCommission}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {hasCashlessConfig && (
                <>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>Operação Cashless</Typography>
                    <Divider />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <FormControlLabel
                          label='Opera Cashless'
                          name='hasCashless'
                          value={hasCashless}
                          control={<GreenSwitch checked={hasCashless} onChange={(e) => setHasCashless(e.target.checked)} />}
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label='Imprime Recibo'
                          name='printReceipt'
                          value={printReceipt}
                          control={
                            <GreenSwitch
                              checked={printReceipt}
                              onChange={(e) => setPrintReceipt(e.target.checked)}
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label='Permite Devolução'
                          name='allowRefound'
                          value={allowRefound}
                          control={
                            <GreenSwitch
                              checked={allowRefound}
                              onChange={(e) => setAllowRefound(e.target.checked)}
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          label='Permite Estorno'
                          name='allowCashbackCashless'
                          value={allowCashbackCashless}
                          control={
                            <GreenSwitch
                              checked={allowCashbackCashless}
                              onChange={(e) => setAllowCashbackCashless(e.target.checked)}
                              disabled={!hasCashless}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid></>
              )}

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  {idOperator !== 'new' && idOperator !== 'clone' ? (
                    <Grid item>
                      <Button onClick={() => setResetPassword(idOperator)} variant='outlined' color='secondary'>
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
      <ModalResetPassword id={resetPassword} onClose={() => setResetPassword(null)} />
    </>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Operator);
