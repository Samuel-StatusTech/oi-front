import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid, TextField, CircularProgress, Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import CardContainer from '../../components/CardContainer';
import InputPassword from '../../components/Input/Password';

import Api from '../../api';

import { loadUserData } from '../../action';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const validMessages = {
  USERNAME: 'Usuário não encontrado',
};

const ForgotPassword = ({ loadUserData }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!password) {
        alert("Informar a sua nova senha")
        setLoading(false);
        return false;
      }

      if (password !== newPassword) {
        alert("As sehas estão diferentes\n\nVerificar as senhas")
        setLoading(false);
        return false;
      }

      const { data, status, statusText } = await Api.post('/changePassword', {
        email,
        code,
        password
      });
      if (status === 201) {
        history.push('/login');
      } else {
        alert(statusText);
      }
    } catch ({ response }) {
      if (response.data.error === validMessages.USERNAME) {
        setErrors({ username: true });
      } else if (response.data) {
        alert(response.data);
      } else {
        setErrors({})
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CardContainer>
        <form autoComplete="off" onSubmit={handleForgotPassword}>
          <Grid container direction="column" spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography style={{color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 20, fontSize: 20}}>Recuperar Senha</Typography>
              <TextField
                label="E-mail"
                value={email}
                style={{backgroundColor: '#fff', borderRadius: 5}}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                error={errors.username}
                helperText={errors.username ? validMessages.USERNAME : null}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                label="Código"
                value={code}
                style={{backgroundColor: '#fff', borderRadius: 5}}
                onChange={(e) => setCode(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>


            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputPassword
                label="Nova senha"
                value={password}
                style={{backgroundColor: '#fff', borderRadius: 5}}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputPassword
                label="Confirmar nova senha"
                value={newPassword}
                style={{backgroundColor: '#fff', borderRadius: 5}}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                type="submit"
                variant="outlined"
                style={{
                  backgroundColor: '#0097FF',
                  borderRadius: 5,
                  color: '#FFF'
                }}
                fullWidth
              >
                {loading && <CircularProgress color="inherit" size={25} />}
                {!loading && 'Enviar'}
              </Button>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button
                type="submit"
                variant="outlined"
                style={{backgroundColor: 'transparent',borderColor: '#fff', borderRadius: 5, color: '#fff'}}
                fullWidth
                onClick={() => history.push('/login')}
              >
               Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContainer>
    </Container>
  );
};

export default connect(null, { loadUserData })(ForgotPassword);
