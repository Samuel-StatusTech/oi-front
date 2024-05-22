import React, { useState } from 'react';
import { Button, Grid, CircularProgress } from '@material-ui/core';
import Api from '../../../api';

const ActionColumn = ({ history, onQueryChange, ...row }) => {
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    switch (row.type) {
      case 'combo':
        history.push(`/dashboard/product/combo/${row.id}`);
        break;
      case 'complement':
        history.push(`/dashboard/product/complement/${row.id}`);
        break;
      default:
        history.push(`/dashboard/product/simple/${row.id}`);
        break;
    }
  };

  const handleDelete = async () => {
    if (loading) {
      return false;
    }

    setLoading(true);

    let url = '';

    switch (row.type) {
      case 'combo':
        url = `/product/combo/${row.id}`;
        break;
      case 'complement':
        url = `/product/complement/${row.id}`;
        break;
      default:
        url = `/product/simple/${row.id}`;
        break;
    }

    const { data } = await Api.delete(url);

    setLoading(false);

    if (data) {
      await onQueryChange();
    } else {
      alert('O produto ja foi vendido em algum event');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button variant='outlined' color='primary' size='small' onClick={handleEdit}>
          Editar
        </Button>
      </Grid>
      <Grid item>
        <Button variant='outlined' color='secondary' size='small' onClick={handleDelete}>
          {loading ? <CircularProgress color='secondary' /> : 'Excluir'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default ActionColumn;
