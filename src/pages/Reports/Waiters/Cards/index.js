import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import { format } from 'currency-formatter';

import MonetizationOn from '@material-ui/icons/MonetizationOn';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import FolderShared from '@material-ui/icons/FolderShared';
import Folder from '@material-ui/icons/Folder';
import Money from '@material-ui/icons/Money';
import Group from '@material-ui/icons/Group';
import CardData from '../../../../components/CardData/index';
import useStyles from '../../../../global/styles';
export default memo(({ total = 0, commission = 0, average_commissions = 0, waiters = 0, pdvs = 0, codes = 0 }) => {
  const styles = useStyles();
  const infos = {
    infoCards: [
      {
        title: 'Faturamento',
        icon: <MonetizationOn fontSize='large' className={styles.green} />,
        value: format(total / 100, { code: 'BRL' }),
      },
      {
        title: 'Comissões',
        icon: <Group fontSize='large' className={styles.lightRed} />,
        value: format(commission / 100, { code: 'BRL' }),
      },
      {
        title: 'Média por Garçom',
        icon: <Money fontSize='large' className={styles.pink} />,
        value: parseInt(average_commissions) + '%',
      },
      {
        title: 'Garçons no Evento',
        icon: <AssignmentTurnedIn fontSize='large' className={styles.green} />,
        value: waiters,
      },
      {
        title: 'Garçons (Operador)',
        icon: <FolderShared fontSize='large' className={styles.yellow} />,
        value: pdvs,
      },
      {
        title: 'Garçons (Código)',
        icon: <Folder fontSize='large' className={styles.purple} />,
        value: codes,
      },
    ],
  };
  return (
    <Grid container spacing={2}>
      {infos.infoCards.map((item, index) => (
        <Grid item xl={2} lg={4} md={4} sm={6} xs={12} key={index}>
          <CardData title={item.title} value={format(item.value, { code: 'BRL' })} icon={item.icon} />
        </Grid>
      ))}
    </Grid>
  );
});
