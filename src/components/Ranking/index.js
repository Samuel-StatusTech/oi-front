import React, { memo } from 'react';
import { Typography, Grid } from '@material-ui/core';
import useStyles from '../../global/styles';

export default memo(({ title, ranking }) => {
  const styles = useStyles();
  return (
    <Grid container className={styles.textCenter}>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Typography className={styles.h2}>{title}</Typography>
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
        {ranking &&
          ranking.slice(0, 5).map((item, index) => (
            <div key={index} className={`${styles.marginT10} ${styles.flexRow}`}>
              <div style={{ display: 'flex', borderRadius: '1em', height: '2em', minWidth: '2em', alignItems: 'center', justifyContent: 'center', background: '#3B94FF', color: '#FFF', fontSize: 15, paddingLeft: 5, paddingRight: 5 }}>
                {item.value}
              </div>
              <label className={`${styles.label} ${styles.marginL}`}>
                {item.label}
              </label>
            </div>
          ))}
      </Grid>
      <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
        {ranking &&
          ranking.slice(5, 10).map((item, index) => (
            <div key={index} className={`${styles.marginT10} ${styles.flexRow}`}>
              <div className={styles.numberRanking}>{item.value}</div>
              <label className={`${styles.label} ${styles.marginL}`}>{item.label}</label>
            </div>
          ))}
      </Grid>
    </Grid>
  );
});
