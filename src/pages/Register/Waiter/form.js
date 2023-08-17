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
import { GreenSwitch, StatusSwitch } from '../../../components/Switch';

const Waiter = ({ user }) => {
  const history = useHistory();
  const { idWaiter } = useParams();
  const [action] = useState(idWaiter === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorsVerify, setErrorsVerify] = useState({});
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');

  const [hasCommission, setHasCommission] = useState(false);
  const [commission, setCommission] = useState(0);
  const [hasCode, setHasCode] = useState(true);
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (!action) {
      Api.get(`/waiter/getData/${idWaiter}`)
        .then(({ data }) => {
          const { status, values } = data;
          if (status) {
            setName(values.name);

            setHasCommission(Boolean(values.hasCommission));
            setCommission(values.commission);
            setHasCode(Boolean(values.hasCode));
            setStatus(Boolean(values.status));
            setCode(values.code);
          } else {
            alert('Não foi possível carregar os dados do gerente');
            handleCancel();
          }
        })
        .catch((e) => {
          if (e.error) {
            alert(e.error);
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
    try {
      setButtonLoading(true);
      if (hasCode && !code) {
        alert('Este garçom deve ter um código');
        return false;
      }

      await Api.post('/waiter/createWaiter', {
        name,
        status: true,
        org_id: user.org_id,
        hasCommission: hasCommission,
        commission,
        hasCode: hasCode,
        code,
      });
      handleCancel();
    } catch (e) {
      if (e.error) {
        alert(e.error);
      } else {
        alert(e.message ?? 'Erro não esperado');
      }
      console.log(e);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      if (hasCode && !code) {
        alert('Este garçom deve ter um código');
        return false;
      }

      await Api.put(`/waiter/updateWaiter/${idWaiter}`, {
        name,
        status,
        hasCommission: hasCommission,
        commission,
        hasCode: hasCode,
        code,
      });
      handleCancel();
    } catch (e) {
      if (e.error) {
        alert(e.error);
      } else {
        alert('Erro não esperado');
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSubmit = () => {
    try {
      if (nameInputVerify(name)) throw { message: 'Um ou mais campos possui erro!' };
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
    history.push('/dashboard/waiter');
  };
  const nameInputVerify = (name) => {
    if (!/^[a-z]{1}(\w){1,24}$/.test(name))
      return (errorsVerify.name =
        'Esse campo somente aceita letras e números, e inicial tem que ser minúsculo. (Mín. 2 caracteres)');
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
    <form>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                  <TextField
                    label='Nome'
                    name='name'
                    value={name}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 25);
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
                <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
                  <FormControlLabel
                    label={status ? 'Ativo' : 'Inativo'}
                    name='status'
                    value={status}
                    control={
                      <StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} variant='outlined' />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item justify='center'>
                  <FormControlLabel
                    label='Comissão?'
                    name='hasCommission'
                    value={hasCommission}
                    control={
                      <GreenSwitch checked={hasCommission} onChange={(e) => setHasCommission(e.target.checked)} />
                    }
                  />
                </Grid>
                <Grid item lg md sm xs>
                  <TextField
                    label='%'
                    name='commission'
                    value={commission}
                    onChange={(e) => {
                      if (e.target.value >= 0) setCommission(e.target.value);
                    }}
                    variant='outlined'
                    fullWidth
                    type='number'
                    size='small'
                    disabled={!hasCommission}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Divider />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12}>
              <Grid container direction='row'>
                <Grid item justify='center'>
                  <Typography style={{ marginRight: '10px' }}>Código</Typography>
                </Grid>
                <Grid item lg md sm xs hidden={!hasCode}>
                  <TextField
                    // label='%'
                    name='code'
                    value={code}
                    onChange={(e) => (e.target.value > 0 ? setCode(e.target.value) : console.log(e.target.value))}
                    variant='outlined'
                    fullWidth
                    type='number'
                    size='small'
                  />
                </Grid>
              </Grid>
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

export default connect(mapStateToProps)(Waiter);
