import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import { format } from 'currency-formatter';

import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import Assessment from '@material-ui/icons/Assessment';
import EventNote from '@material-ui/icons/EventNote';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AssignmentLate from '@material-ui/icons/AssignmentLate';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import CardData from '../../../../components/CardData/index';
import useStyles from '../../../../global/styles';

export default memo(({ profit = 0, people = 0, checkin = 0, lists = 0, pending = 0, attendance = 0 }) => {
  const styles = useStyles();
  const infos = {
    infoCards: [
      {
        title: 'Faturamento',
        icon: <MonetizationOn fontSize='large' className={styles.green} />,
        value: format(profit / 100, { code: 'BRL' }),
      },
      {
        title: 'Nomes Inseridos',
        icon: <AssignmentTurnedIn fontSize='large' className={styles.pink} />,
        value: people,
      },
      {
        title: 'Check In Realizados',
        icon: <CheckCircle fontSize='large' className={styles.green} />,
        value: checkin,
      },
      {
        title: 'Listas Cadastradas',
        icon: <EventNote fontSize='large' className={styles.green} />,
        value: lists,
      },
      {
        title: 'Nomes Pendentes',
        icon: <AssignmentLate fontSize='large' className={styles.orange} />,
        value: pending,
      },
      {
        title: '% de Presença',
        icon: <Assessment fontSize='large' className={styles.purple} />,
        value: `${attendance}%`,
      },
    ],
  };
  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          {infos.infoCards.map((item, index) => (
            <Grid item xl={2} lg={4} md={4} sm={6} xs={12} key={index}>
              <CardData title={item.title} value={format(item.value, { code: 'BRL' })} icon={item.icon} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
});
