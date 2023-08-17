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
          onClick={() => setValue('all')}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
          variant='contained'
          active={value === 'all'}
        >
          Geral
        </ButtonRound>
      </Grid>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('bar')}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
          variant='contained'
          active={value === 'bar'}
        >
          Bar
        </ButtonRound>
      </Grid>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('ingresso')}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
          variant='contained'
          active={value === 'ingresso'}
        >
          Ingressos
        </ButtonRound>
      </Grid>
      <Grid item sm xs={12} className={styles.mediaMinFlexNotFullWidth}>
        <ButtonRound
          onClick={() => setValue('estacionamento')}
          className={`${styles.mediaMaxXSFullWidth} ${styles.buttonShadow}`}
          variant='contained'
          active={value === 'estacionamento'}
        >
          Estacionamento
        </ButtonRound>
      </Grid>
    </Grid>
  );
};
