import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, TextField, CircularProgress, Button } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import CardContainer from '../../components/CardContainer';
import InputPassword from '../../components/Input/Password';

import Api from '../../api';

import { loadUserData } from '../../action';
import { formatDateToDB } from '../../utils/date';
import { removeUserData } from '../../utils/user';
import firebase from '../../firebase';
import { authErrors } from '../../utils/errors';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const validMessages = {
  USERNAME: 'Usuário não encontrado',
  PASSWORD: 'Senha inválida',
};

const Login = ({ loadUserData }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);

        firebase.auth().signInWithEmailAndPassword(username, password).then(async (_user) => {
            const user = _user.user
            console.log(user)
            if(user) {
                const { data, status, statusText } = await Api.post('/authenticateDash', {
                    userKey: user.uid
                });
                if (status === 200 && data.success) {
                    setErrors({});
            
                    loadUserData({
                        ...data.user,
                        roleData: data.roleData,
                    });
                    localStorage.setItem('token', data.token);
                    localStorage.removeItem('hideExpire');
                    
                    history.push('/select');
                } else {
                  alert(data?.message ?? statusText);
                }
            }
            setLoading(false);
        }).catch(error =>
          {
            alert(authErrors[error?.code] ?? "E-mail ou senha inválidos") 
            setLoading(false);
          }           
          )
    } catch (error) {
      console.log('error2');
      if (error.isAxiosError) {
        const response = error.response;

        if (!response) {
          setErrors({});
          setAlertMessage('Servidor não esta respondendo');
          setOpenAlert(true);
        } else if (response.data.error === validMessages.USERNAME) {
          setErrors({ username: true });
        } else if (response.data.error === validMessages.PASSWORD) {
          setErrors({ password: true });
        } else {
          setAlertMessage(response?.data);
          setOpenAlert(true);
          setErrors({});
        }
      } else {
        setErrors({});
        setAlertMessage(error?.message ?? 'Erro não esperado, tente novamente mais tarde');
        setOpenAlert(true);
      }
      removeUserData();
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    history.push('/forgotpassword');
  };

  return (
    <Container>
      <CardContainer
        buttons={[
          {
            variant: 'default',
            onClick: handleForgotPassword,
            content: () => 'Esqueci a senha',
          },
        ]}
        alert={{
          severity: 'error',
          openned: openAlert,
          onClose: () => {
            setOpenAlert(false);
          },
          message: alertMessage,
        }}
      >
        <form autoComplete='off' onSubmit={handleLogin}>
          <Grid container direction='column' spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                label='Login'
                value={username}
                style={{ backgroundColor: '#fff', borderRadius: 5 }}
                onChange={(e) => setUsername(e.target.value)}
                variant='outlined'
                fullWidth
                error={errors.username}
                helperText={errors.username ? validMessages.USERNAME : null}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputPassword
                label='Senha'
                value={password}
                style={{ backgroundColor: '#fff', borderRadius: 5 }}
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                variant='outlined'
                fullWidth
                error={errors.password}
                helperText={errors.password ? validMessages.PASSWORD : null}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                type='submit'
                variant='outlined'
                style={{
                  backgroundColor: '#0097FF',
                  borderRadius: 5,
                  color: '#FFF',
                }}
                fullWidth
              >
                {loading ? <CircularProgress color='inherit' size={25} /> : 'Entrar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContainer>
    </Container>
  );
};

export default connect(null, { loadUserData })(Login);
