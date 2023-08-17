import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';

export default ({ title, content, isMain, icon }) => {
  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {icon}
          </Grid>
          <Grid item xs={9}>
            <Typography
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography>
            <Typography
              style={{
                fontSize: 28,
                color: isMain ? '#3A82F8' : '#000',
                letterSpacing: '0.1rem',
              }}
            >
              {content}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
