import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Button, CircularProgress, Card, CardContent } from '@material-ui/core';
import { connect } from 'react-redux';
import Api from '../../../api';
import InputPassword from '../../../components/Input/Password';

const Profile = ({ user }) => {
  const history = useHistory();
  const [errorsVerify, setErrorsVerify] = useState({});
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  // Usuário comum
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const formData = (assignData = {}) => {
    return Object.assign(assignData, {
      email,
      password,
      currentPassword,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = async () => {
    try {
      setButtonLoading(true);
      const { success } = (await Api.post('/user/changeUserProfileData', formData())).data;
      if (success) {
        alert('Dados alterados com sucesso!');
      } else {
        alert("Campos inválidos")
      }
    } catch (error) {
      alert(error?.message ?? 'Ocorreu um erro');
    } finally {
      setButtonLoading(false);
    }
  };
  const getData = async () => {
    setLoading(true);
    const { data } = await Api.get('/getProfileData');

    setEmail(data.email);
    setLoading(false);
  };

  const isEmpty = (str) => {
    return !str || str.length === 0;
  };
  const currentPasswordInputVerify = (password) => {
    if (!/^\S{6,}/.test(password)) return (errorsVerify.currentPassword = 'Mínimo 6 caracteres');
    if (!/^\S*$/i.test(password)) return (errorsVerify.currentPassword = 'Não pode espaço em branco no campo');
    errorsVerify.currentPassword = null;
    return false;
  };
  const passwordInputVerify = (password) => {
    if (password.length !== 0) {
      if (!/^\S{6,}/.test(password)) return (errorsVerify.password = 'Mínimo 6 caracteres');
      if (!/^\S*$/i.test(password)) return (errorsVerify.password = 'Não pode espaço em branco no campo');
    }

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

  const verifyInputs = () => {
    return emailInputVerify(email) || passwordInputVerify(password)/* || currentPasswordInputVerify(currentPassword)*/;
  };
  const handleSubmit = () => {
    try {
      if (verifyInputs()) throw { message: 'Por favor revise todos os campos' };

      handleEdit();
    } catch (error) {
      alert(error.message);
    }
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
                    disabled
                    label='Email'
                    name='email'
                    type='email'
                    value={email}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputPassword
                    autoComplete="one-time-code"
                    label='Nova Senha'
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
                {/*<Grid item xs={12}>
                  <InputPassword
                    autoComplete='none'
                    label='Senha Atual*'
                    name='currentPassword'
                    value={currentPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentPassword(value);
                      currentPasswordInputVerify(value);
                    }}
                    error={Boolean(errorsVerify?.currentPassword)}
                    helperText={errorsVerify?.currentPassword}
                    variant='outlined'
                    size='small'
                    fullWidth
                  />
                  </Grid>*/}
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button onClick={() => handleSubmit()} variant='outlined' color='primary'>
                    {buttonLoading ? <CircularProgress size={25} /> : 'Alterar Senha'}
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

export default connect(mapStateToProps)(Profile);
