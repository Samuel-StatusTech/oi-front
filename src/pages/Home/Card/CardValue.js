import React from 'react';

import { Typography } from '@material-ui/core';
import { format } from 'currency-formatter';

import useStyles from '../../../global/styles';

const CardValue = ({ title, info, infoValue, infoEx, infoExValue, icon, value }) => {
  const styles = useStyles();
  const TitleFixed = 'Faturamento';

  const formatMoney = (value = 0) => {
    return format(value / 100, { code: 'BRL' });
  };

  return (
    <>
      <div className={styles.container}>
        {icon && <div className={styles.blue}>{icon}</div>}
        <label className={`${styles.h2} ${styles.marginL}`}>{title}</label>
      </div>
      <Typography className={styles.label}>{TitleFixed}</Typography>
      <Typography className={styles.label}>{formatMoney(value)}</Typography>
      <Typography className={styles.labelSmall}>
        {info} {infoValue}
      </Typography>
      <Typography className={styles.labelSmall}>
        {infoEx} {infoExValue}
      </Typography>
    </>
  );
};

export default CardValue;
