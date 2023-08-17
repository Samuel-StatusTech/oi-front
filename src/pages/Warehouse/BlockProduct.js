import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';

import Api from '../../api';
import { connect } from 'react-redux';

const BlockProduct = ({
  event,
  product_id,
  block_warehouse,
  handleBlock,
  ...props
}) => {
  const handleToggle = async () => {
    try {
      const { status } = await Api.patch(`/warehouse/${product_id}/block`, {
        block_warehouse: !block_warehouse,
      });

      if (status === 201) {
        handleBlock(product_id);
      }
    } catch (e) {
      alert('Erro ao bloquear o produto no estoque');
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography>{block_warehouse ? 'Sim' : 'Não'}</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleToggle}
        >
          Alterar
        </Button>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(BlockProduct);
