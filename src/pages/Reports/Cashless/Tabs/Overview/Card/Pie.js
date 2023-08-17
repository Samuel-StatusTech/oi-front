import React, { memo } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';

import ChartBar from '../../../../../../components/Chart/Bar';

const options = {
  chart: {
    type: 'bar',
  },
  palette: 'palette10',
  colors: ['#2983FF', '#2983FF', '#2983FF', '#2983FF', '#2983FF'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: [],
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
    },
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: [
      ['Produto 1'],
      ['Produto 2'],
      ['Produto 3'],
      ['Produto 4'],
      ['Produto 5'],
    ],
    labels: {
      style: {
        colors: ['#2983FF', '#2983FF', '#2983FF', '#2983FF', '#2983FF'],
        fontSize: '12px',
        fontWeight: 'bold',
        paddingRight: '5',
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
    {
      breakpoint: 1590,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};

export default memo(({ list = [] }) => {
  const mockTopList = {
    series: [
      {
        data: list.map(item => item.total),
        theme: {
          mode: 'light',
          palette: 'palette10',
          monochrome: {
            enabled: false,
            color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.65,
          },
        },
      },
    ],
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ height: '100%' }}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Typography
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
                color: '#8B8989',
              }}
            >
              Mais Vendidos (Cashless)
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ChartBar
              series={mockTopList.series}
              options={{
                ...options,
                xaxis: {
                  categories: list.map(item => item.name)
                }
              }}
              height={150}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});
