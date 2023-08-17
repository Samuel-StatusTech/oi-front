import React, { memo, useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import Api from '../../../../api';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const Modal = ({ id, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id) {
      setPassword('');
    }
  }, [id]);

  const handleSave = async () => {
    try {
      await Api.put(`/changePassword/${id}`, { password });

      onClose();
    } catch (error) {
      console.log(error);
      alert('Erro ao alterar a senha');
    }
  };

  return (
    <Dialog open={!!id} onClose={onClose}>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Alterar senha
            </Typography>
          </Grid>
          <Grid item lg md sm xs>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              label="Nova senha"
              size="small"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg md sm xs>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={handleSave}
                >
                  Confirmar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default memo(Modal);
