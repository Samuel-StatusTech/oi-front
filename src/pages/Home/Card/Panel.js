import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid, Card } from '@material-ui/core';

//components
import CardValue from './CardValue';
// Icons
import {
  FastfoodOutlined,
  ConfirmationNumberOutlined,
  DriveEtaOutlined,
  MonetizationOnOutlined,
} from '@material-ui/icons';
import { format } from 'currency-formatter';
import useStyles from '../../../global/styles';

const Panel = ({ barData, ticketData, parkData, othersData, loading }) => {
  const styles = useStyles();
  return (
    <>
      {loading ? (
        <Skeleton animation='wave' width='80%' height='100%' />
      ) : (
        <Card className={styles.cardContainer}>
          <Grid>
            <Grid item xs={12} className={styles.margin25}>
              <Grid container spacing={2} className={styles.borderBottom}>
                <Grid item xs={12} sm={6} md={6} xl={6} className={styles.borderRight}>
                  <CardValue
                    title='Bar/Alimentação'
                    info='Vendidos'
                    infoValue={barData.emitted}
                    infoEx='Ticket Médio'
                    infoExValue={format(barData.total / 100 / (barData.emitted || 1), { code: 'BRL' })}
                    icon={<FastfoodOutlined />}
                    value={barData.total}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6} className={styles.paddingL30}>
                  <CardValue
                    title='Ingressos'
                    info='Emitidos Hoje'
                    infoValue={ticketData.today}
                    infoEx='Total Emitidos'
                    infoExValue={ticketData.emitted}
                    icon={<ConfirmationNumberOutlined />}
                    value={ticketData.total}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} className={styles.paddingT30}>
                <Grid item xs={12} sm={6} md={6} xl={6} className={styles.borderRight}>
                  <CardValue
                    title='Estacionamento'
                    info='Emitidos Hoje'
                    infoValue={parkData.today}
                    infoEx='Total Emitidos'
                    infoExValue={parkData.emitted}
                    icon={<DriveEtaOutlined />}
                    value={parkData.total}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6} className={styles.paddingL30}>
                  <CardValue title='Outras Receitas' icon={<MonetizationOnOutlined />} value={othersData.total} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default Panel;
