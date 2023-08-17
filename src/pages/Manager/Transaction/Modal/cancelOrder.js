import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, DialogActions } from '@material-ui/core';
import Api from '../../../../api';

const ModalCancel = ({ event, show, onClose, data, updateRow }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [cancel, setCancel] = useState(false);
  useEffect(() => {
    if (data) {
      setId(data.id);
      setCancel(data.cancel);
    }
  }, [data]);
  const cancelOrder = async () => {
    const value = await Api.patch(`/order/cancelOrder?event=${event}`, { order_list: [id], canceled_location: 'web' });
    updateRow(value.data[0], id);
    alert('Cancelado com sucesso!');
  };
  const uncancelOrder = async () => {
    const value = await Api.patch(`/order/uncancelOrder?event=${event}`, { order_list: [id] });
    updateRow(value.data[0], id);
    alert('Desfeito com sucesso!');
  };
  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      if (cancel) await uncancelOrder();
      else await cancelOrder();
      onClose();
    } catch (err) {
      alert(err.data ? err.data.message : 'Falha ao cancelar!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Aviso</DialogTitle>
      <DialogContent>
        Deseja realmente {cancel ? 'desfazer o cancelamento' : 'fazer o cancelamento'} desta transação?
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='secondary' onClick={onClose}>
          Não
        </Button>
        <Button type='button' onClick={handleCancelOrder} variant='outlined' color='primary'>
          {loading ? (
            <>
              {cancel ? 'Desfazendo' : 'Cancelando'} <CircularProgress size={25} />
            </>
          ) : (
            'Sim'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCancel;
