import React, { useState, useEffect } from 'react';
import { Grid, Dialog, DialogContent, Typography, Button, TextField } from '@material-ui/core';

import Api from '../../api';
import { connect } from 'react-redux';

const Adjust = ({ onClose, open, event, product_id, quantity, handleChangeEdit, ...props }) => {
  const [value, setValue] = useState(quantity);
  const [error, setError] = useState({});
  useEffect(() => {
    if (open) {
      setValue(quantity);
    }
  }, [open, quantity]);
  const valueInputVerify = (value) => {
    if (!/^\d+$/.test(value)) return (error.value = 'O campo somente aceita números');
    error.value = null;
    return false;
  };
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    valueInputVerify(value);
    setValue(value < 0 ? 0 : value);
  };

  const handleSave = async () => {
    try {
      if (valueInputVerify(value)) throw 'O campo somente aceita números';
      const qtd = parseInt(value, 10);
      const { status } = await Api.patch(`/warehouse/${product_id}/changeQuantity`, {
        quantity: qtd,
      });

      if (status === 201) {
        handleChangeEdit(product_id, qtd);
      }

      onClose();
    } catch (e) {
      alert('O campo somente aceita números');
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth='sm'>
      <DialogContent>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <Typography>{props.product_name}</Typography>
          </Grid>
          <Grid item>
            <TextField
              label='Saldo em estoque'
              value={value}
              onChange={handleChange}
              error={Boolean(error?.value)}
              helperText={error?.value}
              variant='outlined'
            />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant='outlined' color='secondary' size='small' onClick={onClose}>
                  Sair
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  onClick={handleSave}
                  disabled={value === quantity}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Adjust);
