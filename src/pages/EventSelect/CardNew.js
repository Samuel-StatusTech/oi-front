import React, { memo } from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const CardNew = ({ onClick }) => {
  return (
    <Grid item xl={2} lg={3} md={4} sm={6} xs={12} onClick={onClick}>
      <Card style={{ cursor: 'pointer', height: '100%' }}>
        <CardContent style={{ height: '100%' }}>
          <Grid container alignItems='center' justify='center' direction='column' style={{ height: '100%' }}>
            <Grid item>
              <AddIcon style={{ fontSize: 40 }} color='primary' />
            </Grid>
            <Grid item>
              <span>Criar evento</span>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default memo(CardNew);
