import React from 'react';
import { Grid, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../assets/icons/logo_azul.svg';
import Alerts from '../Alerts/index';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    background: '#F5F7FA',
  },
  cardHeader: {
    padding: 10,
  },
  cardContainer: {
    height: 'fit-content',
  },
  inputFields: {
    marginBottom: 20,
  },
}));

export default ({ children, alert, buttons = [], mainButton }) => {
  const styles = useStyles();

  return (
    <Grid
      container
      component='main'
      alignItems='center'
      justify='center'
      direction='column'
      className={styles.container}
    >
      <Grid item lg={4} md={4}>
        <Alerts severity={alert?.severity} openned={alert?.openned} onClose={alert?.onClose} message={alert?.message} />
        <Paper className={styles.cardContainer}>
          <Grid
            container
            justify='space-evenly'
            alignItems='center'
            style={{ height: '100%', padding: 50, backgroundColor: '#FFF' }}
            spacing={2}
          >
            <img src={logo} alt='logo' width='300' style={{ marginBottom: '20px' }} />

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container direction='column' spacing={2}>
                {children}
              </Grid>
            </Grid>

            {mainButton && (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button
                  variant='contained'
                  // color="primary"
                  style={{ backgroundColor: '#0097FF' }}
                  onClick={mainButton.onClick}
                  fullWidth
                >
                  {mainButton.content()}
                </Button>
              </Grid>
            )}
            <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: 20 }}>
              <Grid container justify='space-evenly'>
                {buttons
                  .filter((button) => !button.hide)
                  .map((button) => (
                    <Grid item>
                      <Button
                        variant={button.variant || 'text'}
                        color={button.color || 'primary'}
                        onClick={button.onClick}
                      >
                        <button.content />
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
