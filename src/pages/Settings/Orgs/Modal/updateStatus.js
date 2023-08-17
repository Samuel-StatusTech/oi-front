import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, DialogActions } from '@material-ui/core';
import Api from '../../../../api';

const Modal = ({ show, onClose, data, updateRow }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (data) {
      setId(data.id);
      setStatus(data.status);
    }
  }, [data]);
  const handleUpdateStatus = async () => {
    setLoading(true);
    const newStatus = status ? 0 : 1;
    const response = await Api.patch('/organization/' + id, { status: newStatus });
    if (response.data.success) {
      updateRow(newStatus, id);
      alert('Status trocado com sucesso!');
      onClose();
    } else {
      alert(response.data ? response.data.message : 'Falha ao atualizar o status!');
    }
    setLoading(false);
  };
  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Aviso</DialogTitle>
      <DialogContent>Deseja realmente trocar o status deste cliente?</DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button type='button' onClick={handleUpdateStatus} variant='outlined' color='primary'>
          {loading ? (
            <>
              Trocando <CircularProgress size={25} />
            </>
          ) : (
            'Trocar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
