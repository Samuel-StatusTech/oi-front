import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControlLabel,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';

import Api from '../../../api';
import { StatusSwitch } from '../../../components/Switch';
import firebase from '../../../firebase';

const Device = ({ user }) => {
  const history = useHistory();
  const { idDevice } = useParams();
  const [errors, setErrors] = useState({});
  const [action] = useState(idDevice === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [imei, setIMEI] = useState('');
  const [order_prefix, setOrderPrefix] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
    });
    if (!action) {
      Api.get(`/device/getData/${idDevice}`)
        .then(({ data }) => {
          const { success, device } = data;
          console.log(device);
          if (success) {
            setName(device.name);
            setCode(device.app_code);
            setIMEI(device.imei);
            setStatus(device.status);
            setOrderPrefix(device.order_prefix);
          } else {
            alert('Não foi possível carregar os dados do dispositivo');
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
      await Api.post('/device/createDevice', {
        name,
        code,
        appCode: code,
        imei,
        status,
        order_prefix
      });
      handleCancel();
    } catch (e) {
      if (e?.response?.data?.error) {
        alert(e?.response?.data?.error);
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
      await Api.put(`/device/updateDevice/${idDevice}`, {
        name,
        appCode: code,
        imei,
        status,
        order_prefix
      });
      handleCancel();
    } catch (e) {
      console.log(e);
      if (e?.response?.data?.error) {
        alert(e?.response?.data?.error);
      } else {
        alert('Erro não esperado');
      }
    } finally {
      setButtonLoading(false);
    }
  };
  const verifyInputs = () => {
    return nameInputVerify(name) || codeInputVerify(code) || imeiInputVerify(imei);
  };
const handleSubmit = async () => {
    try {
        if (verifyInputs()) throw { message: 'Um ou mais campos possui erro!' };
        setButtonLoading(true);

        const userKey = firebase.auth().currentUser.uid
        const clientKey = (await firebase.database().ref('Managers/'+userKey+'/client').once('value')).val()
        const imeiClient = (await firebase.database().ref('Devices/'+imei).once('value')).val()

        if(imeiClient) {
            if(status) {
                if(imeiClient != clientKey) {
                    alert("Este imei já está vinculado a outra conta");
                    return
                }
            } else {
                if(imeiClient == clientKey) {
                    firebase.database().ref('Devices/'+imei).remove()
                }
            }
        } else if(status) {
            firebase.database().ref('Devices/'+imei).set(clientKey)
        }
        
        if (action) {
            handleSave();
        } else {
            handleEdit();
        }
    } catch (error) {
        alert(error?.message);
    } finally {
        setButtonLoading(false);
    }
};

  const handleCancel = () => {
    history.push('/dashboard/device');
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errors.name = 'É necessário preencher este campo');
    errors.name = null;
    return false;
  };
  const codeInputVerify = (code) => {
    if (isEmpty(code)) return (errors.code = 'É necessário preencher este campo');
    errors.code = null;
    return false;
  };
  const imeiInputVerify = (imei) => {
    if (isEmpty(imei)) return (errors.imei = 'É necessário preencher este campo');
    errors.imei = null;
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
            <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Nome'
                    name='name'
                    value={name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setName(value);
                      nameInputVerify(value);
                    }}
                    error={Boolean(errors?.name)}
                    helperText={errors?.name}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='Número de série'
                    name='code'
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCode(value);
                      codeInputVerify(value);
                    }}
                    error={Boolean(errors?.code)}
                    helperText={errors?.code}
                    variant='outlined'
                    type='text'
                    size='small'
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} xs={12}>
                  <TextField
                    label='IMEI'
                    name='imei'
                    value={imei}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIMEI(value);
                      imeiInputVerify(value);
                    }}
                    error={Boolean(errors?.imei)}
                    helperText={errors?.imei}
                    variant='outlined'
                    type='number'
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
                control={<StatusSwitch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
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
                  <Button onClick={handleSubmit} variant='outlined' color='primary'>
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

export default Device;
