import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import { format } from 'currency-formatter';

import Assignment from '@material-ui/icons/Assignment';
import AssignmentLate from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Block from '@material-ui/icons/Block';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CardData from '../../../../components/CardData/index';
import useStyles from '../../../../global/styles';

export default memo(({ profit, total = 0, sold = 0, available = 0, blocked = 0, reserve = 0 }) => {
  const formatMoney = (value = 0) => {
    return format(value / 100, { code: 'BRL' });
  };
  const styles = useStyles();
  const infos = {
    infoCards: [
      {
        title: 'Faturamento',
        icon: <MonetizationOn fontSize='large' className={styles.green} />,
        value: formatMoney(profit),
      },
      {
        title: 'Mesas Cadastradas',
        icon: <Assignment fontSize='large' className={styles.pink} />,
        value: total,
      },
      {
        title: 'Mesas Vendidas',
        icon: <CheckCircle fontSize='large' className={styles.green} />,
        value: sold,
      },
      {
        title: 'Mesas Disponíveis',
        icon: <AssignmentTurnedIn fontSize='large' className={styles.green} />,
        value: available,
      },
      {
        title: 'Mesas Reservadas',
        icon: <AssignmentLate fontSize='large' className={styles.orange} />,
        value: reserve,
      },
      {
        title: 'Mesas Bloqueadas',
        icon: <Block fontSize='large' className={styles.red} />,
        value: blocked,
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
