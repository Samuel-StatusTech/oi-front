import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, DialogContent, DialogActions, Dialog, Button } from '@material-ui/core';
import { format } from 'currency-formatter';
import Tooltip from '../../../../../../components/Tooltip';
import useStyles from '../../../../../../global/styles';
// const useStyles = makeStyles((theme) => ({
//   modalItens: {
//     display: 'grid',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalTitle: {
//     borderBottom: '1px solid #DCDCDC',
//     fontWeight: 600,
//     fontSize: '22px',
//     color: '#747474',
//     padding: '10px 10px',
//   },
//   itensTitle: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   infosContainer: {
//     marginTop: '15px',
//     borderBottom: '1px solid #DCDCDC',
//     paddingBottom: '15px',
//   },
// }));

const ModalValue = (props) => {
  const styles = useStyles();

  const formatMoney = (value) => {
    return format(value, { code: 'BRL' });
  };

  const { onClose, selectedValue, open, payback_active_tax, active_tax, total_cards, inserted_value, payback_value } =
    props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth={true}>
      <DialogContent>
        <Grid item xs='auto'>
          <Typography className={styles.h1}>Detalhes</Typography>
        </Grid>
        <Grid container spacing={2} direction='column' className={styles.marginT15}>
          <Grid item>
            <Grid container spacing={2} className={styles.borderBottomPadding}>
              <Grid item lg={4} md={4} sm={6} xs={12} className={`${styles.borderRight}`}>
                <Typography className={styles.h2}>Cartões Ativos</Typography>
                <Typography className={styles.moneyLabel}>{total_cards}</Typography>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>Valores Inseridos</Typography>
                <Typography className={styles.moneyLabelBlue}>{formatMoney(inserted_value / 100)}</Typography>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>Valores Consumidos</Typography>
                <Typography className={styles.moneyLabelRed}>{formatMoney(payback_value / 100)}</Typography>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>Valores Devolvidos</Typography>
                <Typography className={styles.moneyLabelRed}>{formatMoney(payback_value / 100)}</Typography>
              </Grid>

              <Grid item lg={4} md={4} sm={6} xs={12}>
                {/* //TODO: LEMBRAR DE COLOCAR O VALOR CERTO NO COLOR TAMBÉM */}
                <Typography className={styles.h2}>Taxas e Ajustes</Typography>
                <Typography className={`${payback_value < 0 ? styles.moneyLabelRed : styles.moneyLabelBlue}`}>
                  {formatMoney(payback_value / 100)}
                </Typography>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>
                  <Tooltip title='Sobras de Consumo + Saldo de Taxas Cobradas' placement='center'>
                    Saldo Residual
                  </Tooltip>
                </Typography>
                <Typography className={styles.moneyLabelBlue}>{formatMoney(payback_value / 100)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          justify='space-between'
          alignItems='center'
          className={styles.borderBottomMarginPadding}
        >
          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            <Typography className={styles.h2}>Taxas de Abertura</Typography>
            <Typography>{formatMoney(active_tax / 100)}</Typography>
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            <Typography className={styles.h2}>Estorno de Taxas de Abertura</Typography>
            <Typography>{formatMoney(payback_active_tax / 100)}</Typography>
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            <Typography className={styles.h2}>Taxas para Devolução</Typography>
            <Typography>{formatMoney(0 / 100)}</Typography>
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
            <Typography className={styles.h2}>Ajustes</Typography>
            <Typography>{formatMoney(0 / 100)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ marginTop: '10px' }}>
        <Button style={{ fontWeight: 'bold' }} onClick={() => handleClose()}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ({ total_cards, inserted_value, payback_value, active_tax, payback_active_tax }) => {
  const styles = useStyles();
  const formatMoney = (value) => {
    return format(value, { code: 'BRL' });
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <Grid container spacing={2} justify='space-between'>
              <Grid item lg={3} md={4} sm={6} xs={12} className={styles.borderRight}>
                <Typography className={styles.h2}>Cartões Ativos</Typography>
                <Typography className={styles.moneyLabel}>{total_cards}</Typography>
                <Button variant='outlined' color='primary' onClick={handleClickOpen} className={styles.roundedButton}>
                  Ver Detalhes
                </Button>

                <ModalValue
                  open={open}
                  onClose={handleClose}
                  payback_active_tax={payback_active_tax}
                  active_tax={active_tax}
                  total_cards={total_cards}
                  inserted_value={inserted_value}
                  payback_value={payback_value}
                />
              </Grid>

              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>Valores Inseridos</Typography>
                <Typography className={styles.moneyLabelBlue}>{formatMoney(inserted_value / 100)}</Typography>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Typography className={styles.h2}>Valores Devolvidos</Typography>
                <Typography className={styles.moneyLabelRed}>{formatMoney(payback_value / 100)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
