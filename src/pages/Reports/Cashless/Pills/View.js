import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import ButtonRound from '../../../../components/ButtonRound';

const useStyles = makeStyles((theme) => ({
  buttonShadow: {
    boxShadow: 'none',
    '&:hover': {
      background: '#0097FF',
      boxShadow: 'none',
    },
  },
}));

export default ({ value, setValue }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <ButtonRound
          onClick={() => setValue(0)}
          variant='contained'
          active={value === 0}
          className={classes.buttonShadow}
        >
          Visão geral
        </ButtonRound>
      </Grid>
      {/* <Grid item>
        <ButtonRound
          onClick={() => setValue(1)}
          variant="contained"
          active={value === 1}
          className={classes.buttonShadow}
        >
          Detalhado PDV
        </ButtonRound>
      </Grid> */}
      <Grid item>
        <ButtonRound
          onClick={() => setValue(2)}
          variant='contained'
          active={value === 2}
          className={classes.buttonShadow}
        >
          Ajustes
        </ButtonRound>
      </Grid>
      <Grid item>
        <ButtonRound
          onClick={() => setValue(3)}
          variant='contained'
          active={value === 3}
          className={classes.buttonShadow}
        >
          Consultar Cartão
        </ButtonRound>
      </Grid>
    </Grid>
  );
};
