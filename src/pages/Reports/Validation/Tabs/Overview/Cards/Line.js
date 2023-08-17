import React, { memo } from 'react';

import Card from './';
import { Grid, Typography } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import useStyles from '../../../../../../global/styles';
export default memo(({ topList = [], type }) => {
  const styles = useStyles();
  const data = {
    labels: ['18h00', '19h00', '20h00', '21h00', '22h00'],
    datasets: [
      {
        label: type === 'estacionamento' ? 'Veículos' : 'Pessoas',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#ff9800',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        data: [30, 50, 150, 200, 350],
        barPercentage: 1,
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: '#000',
      },
    },
    maintainAspectRatio: false,
    aspectRatio: 1,
  };

  return (
    <Card>
      <Typography className={`${styles.h2} ${styles.textCenter}`}>Movimentação por horário</Typography>
      <Grid container direction='row'>
        <Grid item lg md sm xs>
          <Line data={data} redraw options={options} />
        </Grid>
      </Grid>
    </Card>
  );
});
