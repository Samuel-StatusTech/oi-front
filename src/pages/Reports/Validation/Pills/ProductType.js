import React from 'react';

import { Grid } from '@material-ui/core';
import ButtonRound from '../../../../components/ButtonRound';
import useStyles from '../../../../global/styles';
export default ({ value, setValue }) => {
  const styles = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('bar')}
          variant='contained'
          active={value === 'bar'}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
        >
          Bar
        </ButtonRound>
      </Grid>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('ingresso')}
          variant='contained'
          active={value === 'ingresso'}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
        >
          Ingressos
        </ButtonRound>
      </Grid>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('estacionamento')}
          variant='contained'
          active={value === 'estacionamento'}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
        >
          Estacionamento
        </ButtonRound>
      </Grid>
    </Grid>
  );
};
