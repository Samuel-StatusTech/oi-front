import React from 'react';
import { Grid, Typography, Chip, CardMedia } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import './styles/event.css'

import Card from './';

import { formatDate, DAY } from '../../../utils/date';
import photoDefault from '../../../assets/images/example.png';

import useStyles from '../../../global/styles';

const Event = ({ event, loading, status }) => {
  const styles = useStyles();
  const EventDate = new Date(event.date_ini);
  const EventDateEnd = new Date((event.date_end ?? '').replace("T00:00:00.000Z", "T23:59:59.000Z"));
  const Today = new Date();
  const rest_ini = Today.getTime() - EventDate.getTime();
  const rest_end = Today.getTime() - EventDateEnd.getTime();
  const isToday = (rest_ini >= 0 && rest_end <= 0) || (Today.getUTCDate() == EventDate.getUTCDate() && Today.getUTCMonth() == EventDate.getUTCMonth() && Today.getUTCFullYear() == EventDate.getUTCFullYear())
  const iniDate =
    isToday ? (
      <Chip className={`${styles.backgroundOrange} ${styles.marginT10}`} label={'Hoje'} size='small' />
    ) : rest_ini < 0 && (rest_ini * -1) < DAY ? (
      <Chip className={`${styles.backgroundGreen} ${styles.marginT10}`} label={'Amanhã'} size='small' />
    ) : rest_ini < 0 ? (
      <Chip className={`${styles.backgroundGreen} ${styles.marginT10}`} label={`Em ${formatDate(EventDate)}`} size='small' />
    ) : (
      <Chip
        className={`${styles.backgroundRed} ${styles.marginT10}`} label={`Realizado em ${formatDate(event.date_ini)}`} size='small'
      />
    );

  if (loading) {
    return (
      <Card>
        <Grid container direction='row' alignItems='center'>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Skeleton animation='wave' variant='rect' style={{ height: 140, padding: 25 }} />
          </Grid>
          <Grid item xs={0} sm={0} md={1} lg={1} />
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Skeleton animation='wave' width='200px' height='35px' />
            <Skeleton animation='wave' width='200px' height='35px' />
            <Skeleton animation='wave' width='200px' height='35px' />
            <Skeleton animation='wave' width='200px' height='35px' />
          </Grid>
        </Grid>
      </Card>
    );
  }

  return (
    <Card>
      <Grid container direction='row' alignItems='center'>
        <Grid item xs={12} sm={12} md={4} lg={4} style={{ margin: 'auto' }}>
          <CardMedia
            component='img'
            image={event?.logo ?? photoDefault}
            style={{ height: 140, padding: 25, objectFit: 'contain' }}
          />
        </Grid>
        <div className='eventInfoBox'>
          <Typography className={`${styles.h2} eventLabel`}>
            {event.name}
          </Typography>
          <Grid container direction='column'>
            <>
              <Grid item>
                {
                  (new Date(event.date_end)).getFullYear() > 1970 ?
                    <Typography className={styles.label}>{`De ${formatDate(event.date_ini)} até ${formatDate(event.date_end)}`}</Typography>
                    :
                    <Typography className={styles.label}>{formatDate(event.date_ini)}</Typography>
                }
              </Grid>
              <Grid item>
                <Typography className={styles.label}>
                  {event.city}/{event.state}
                </Typography>
              </Grid>
            </>
          </Grid>
        </div>
      </Grid>
      <Grid item>
        <Typography className={styles.label}>{iniDate}</Typography>
      </Grid>
    </Card >
  );
};

export default Event;
