import React from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import Tooltip from '../../components/Tooltip';
import useStyles from '../../global/styles';
const CardData = ({ title, value = 0, icon, info = null, styleLabel = {}, smallLabel = '' }) => {
  const styles = useStyles();
  return (
    <Card style={{height:'100%'}}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {icon && icon?.src ? <img src={icon?.src} alt={icon?.alt ?? ''} width='40rem' /> : icon}
          </Grid>
          <Grid item xs={info ? 8 : 9} >
            <div style={{marginLeft: '1rem'}}>
              <Typography className={styles.h2} >{title}</Typography>
              <Typography className={styles.label} style={{...styleLabel}}>{value}</Typography>
            
                {smallLabel && <Typography className={styles.labelSmallBold}> {smallLabel}
                </Typography> }
            </div>
            
          </Grid>
          {info && (
            <Grid item xs={1}>
              <Tooltip title={info} placement='right' />
            </Grid>
          )}
         
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CardData;
