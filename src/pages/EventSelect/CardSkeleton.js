import React from 'react';
import { Card, Grid, CardHeader, CardContent, Typography, makeStyles } from '@material-ui/core';

import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(() => ({
  cardBorder: {
    borderLeft: '4px solid #ccc',
    cursor: 'pointer',
  },
}));

const CardSkeleton = () => {
  const styles = useStyles();
  return (
    <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
      <Card className={styles.cardBorder}>
        <Skeleton animation='wave' variant='rect' height={250} />
        <CardHeader title={<Skeleton animation='wave' />} subheader={<Skeleton animation='wave' />} />
        <CardContent>
          <Grid container justify='space-between'>
            <Grid item>
              <Grid container direction='column'>
                <Grid item>
                  <Typography>
                    <Skeleton animation='wave' style={{ width: '100px' }} />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontSize: 30 }}>
                    <Skeleton animation='wave' style={{ width: '100px' }} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography>
                <Skeleton animation='wave' style={{ width: '80px' }} />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CardSkeleton;
