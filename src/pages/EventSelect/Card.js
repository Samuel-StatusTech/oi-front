import React, { memo } from 'react';
import { Card, CardContent, CardHeader, Typography, Grid, Chip, CardMedia } from '@material-ui/core';
import { format } from 'currency-formatter';

import { formatDate, DAY } from '../../utils/date';
import photoDefault from '../../assets/images/example.png';
import useStyles from '../../global/styles';
export default memo(
  ({ id, title, logo, date, date_end, status, total_order = 0, total_cashless = 0, handleSelect = () => {} }) => {
    const styles = useStyles();
    const EventDate = new Date(date);
    const EventDateEnd = new Date(date_end.replace("T00:00:00.000Z", "T23:59:59.000Z"));
    const Today = new Date();
    const rest_ini = Today.getTime() - EventDate.getTime();
    const rest_end = Today.getTime() - EventDateEnd.getTime();
    const isToday = (rest_ini >= 0 && rest_end <=0) || (Today.getUTCDate() == EventDate.getUTCDate() && Today.getUTCMonth() == EventDate.getUTCMonth() && Today.getUTCFullYear() == EventDate.getUTCFullYear())
    const iniDate =
      isToday ? (
        <Chip className={styles.backgroundOrange} label={'Hoje'} size='small' />
      ) : rest_ini<0 && (rest_ini*-1) < DAY ? (
        <Chip className={styles.backgroundGreen} label={'Amanhã'} size='small' />
      ) : rest_ini < 0 ? (
        <Chip className={styles.backgroundGreen} label={`Em ${formatDate(EventDate)}`} size='small' />
      ) : (
        <Chip className={styles.backgroundRed} label={`Realizado em ${formatDate(EventDate)}`} size='small' />
      );

    const total = parseInt(total_order) + parseInt(total_cashless);

    return (
      <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
        <Card style={{ flex: '1 1 auto', width: '100%',  cursor: 'pointer'}} onClick={handleSelect} >
          <CardContent
            style={{
              padding: 5,
              backgroundColor: status ? '#90ee90' : '#EE6A50',
              textAlign: 'center',
            }}
          >
            <Typography style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
              {status ? 'ATIVO' : 'INATIVO'}
            </Typography>
          </CardContent>

          <CardMedia
            component='img'
            image={logo ?? photoDefault}
            style={{ height: 280, padding: 25, objectFit: 'contain' }}
            title={title}
            alt={title}
          />
          <CardHeader
            title={title}
            subheader={iniDate}
            style={{
              paddingBottom: 0,
            }}
          />
          <CardContent style={{ padding: '4px 16px' }}>
            {/*<Typography style={{ lineHeight: 1 }}>Faturamento</Typography>
            <Typography style={{ fontSize: 30, lineHeight: 1 }}>{format(total / 100, { code: 'BRL' })}</Typography>*/}
          </CardContent>
        </Card>
      </Grid>
    );
  }
);
