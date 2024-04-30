import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, DialogActions, TextField } from '@material-ui/core';
import Api from '../../../api';

const ModalDelete = ({ show, onClose, password, setPassword, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      if(!password || password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres');
        return;
      }
      setLoading(true);
      const { success } = (await Api.post('/user/changeUserPassword', {
        userId,
        password
      })).data;
      if(success)
        alert('Alterado com sucesso!');
      else 
        alert('Senha inválida');
      setLoading(false);
      onClose();
    } catch (err) {
      alert('Sem permissão para mudar a senha');
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Mudança de senha</DialogTitle>
      <DialogContent>
        Informe a nova senha
        <TextField
          type="password"
          autoComplete="one-time-code"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Senha"
          variant="outlined"
          size="small"
          fullWidth
          style={{ marginTop: '2rem' }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button type='button' onClick={handleChangePassword} variant='outlined' color='primary'>
          {loading ? (
            <>
              Alterando <CircularProgress size={25} />
            </>
          ) : (
            'Alterar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
