import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Chart from 'react-apexcharts';

import Card from '.';
import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';
import Utils from '../../../utils';




const Payments = ({ event, money = 0, debit = 0, credit = 0, pix = 0, loading }) => {
  const styles = useStyles();

  const colors = ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', '#34375A', '#CCCCCC']

  const mockData = {
    series: [{
      name: 'Valor',
      data: [credit, debit, money, pix]
    }],
    options: {
      chart: {
        height: 170,
        type: 'bar'
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          'Crédito',
          'Débito',
          'Dinheiro',
          'Pix',
        ],
        labels: {
          style: {
            colors: ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', '#34375A', '#CCCCCC'],
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val;
          }
        }

      },
    },
  }

  return (
    <Card>
      <Typography className={styles.h2} style={{ textAlign: 'center', }}>
        {loading ? <Skeleton animation='wave' width='80%' /> : 'Formas de Pagamento'}
      </Typography>
      {loading ? (
        <Skeleton animation='wave' variant='rect' height={100} />
      ) : (
        <Chart options={mockData.options} series={mockData.series} type='bar' height={170} />
      )}
    </Card>
  );

};

export default Payments;


/*

  const mockData = {
    series: [credit, debit, money, pix,
      // 0
    ],
    options: {
      labels: ['Crédito', 'Débito', 'Dinheiro', 'Pix',
        // 'Crédito Online', 'Pix Online'
      ],
      dataLabels: {
        style: {
          fontSize: '14px',
          colors: ['#404040', '#404040', '#404040', '#404040', '#404040', '#404040']
        },
        dropShadow: {
          enabled: false
        }
      },
      chart: {
        type: 'donut',
      },
      legend: {

        position: 'right',
      },
      colors: ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', '#34375A', '#CCCCCC'],
      fill: {
        gradient: {
          shade: 'light',
          shadeIntensity: 0.3,
        },
      },

    },
  };

  */