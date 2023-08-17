import React, { memo } from 'react';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';

export default memo(({ children, title }) => {
  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ height: '100%' }}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
              {title}
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {children}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});
