import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, DialogActions, TextField } from '@material-ui/core';
import Api from '../../../../api';

const ModalDelete = ({ show, onClose, data, updateRow, event }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  useEffect(() => {
    if (data) {
      setId(data.id);
    }
  }, [data]);
  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      if(password == '2303') {
        await Api.delete(`/order/deleteOrder/${id}/${event}`);
        alert('Excluído com sucesso!');
        updateRow(id);
        close();
        setLoading(false);
      } else {
        setTimeout(() => {
          alert('Senha incorreta!');
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      alert(err.data ? err.data.message : 'Falha ao excluir!');
      setLoading(false);
    }
  };
  const close = () => {
    setPassword('')
    onClose();
  }
  
  return (
    <Dialog open={show} onClose={close} fullWidth maxWidth='md'>
      <DialogTitle>Aviso</DialogTitle>
      <DialogContent>
        Deseja realmente excluir esta transação?
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
        <Button variant='outlined' color='secondary' onClick={close}>
          Não
        </Button>
        <Button type='button' onClick={handleDeleteOrder} variant='outlined' color='primary'>
          {loading ? (
            <>
              Excluindo <CircularProgress size={25} />
            </>
          ) : (
            'Excluir'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
