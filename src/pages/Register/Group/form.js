import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControlLabel,
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
import { StatusSwitch } from '../../../components/Switch';

const Group = ({ user }) => {
  const history = useHistory();
  const { idGroup } = useParams();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [action] = useState(idGroup === 'new');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('bar');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    console.log(action, user);
    if (!action) {
      Api.get(`/group/getData/${idGroup}`)
        .then(({ data }) => {
          const { success, group } = data;
          console.log(group);
          if (success) {
            setName(group.name);
            setStatus(group.status);
            setType(group.type);
          } else {
            alert('Não foi possível carregar os dados do grupo');
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
    await Api.post('/group/createGroup', {
      name,
      type,
      status,
    });
    handleCancel();
  };

  const handleEdit = async () => {
    await Api.put(`/group/updateGroup/${idGroup}`, {
      name,
      type,
      status,
    });
    handleCancel();
  };
  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const nameInputVerify = (name) => {
    if (isEmpty(name)) return (errorsVerify.name = 'É necessário preencher este campo');
    errorsVerify.name = null;
    return false;
  };
  const verifyInputs = () => {
    return nameInputVerify(name);
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
    history.push('/dashboard/group');
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
                  <FormControl size='small' variant='outlined' fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      label='Tipo'
                      name='type'
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      variant='outlined'
                    >
                      <MenuItem value='bar'>Bar</MenuItem>
                      <MenuItem value='ingresso'>Ingresso</MenuItem>
                      <MenuItem value='estacionamento'>Estacionamento</MenuItem>
                    </Select>
                  </FormControl>
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

export default Group;
