import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Chart from 'react-apexcharts';

import Card from '.';
import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';


const Payments = ({ event, money = 0, debit = 0, credit = 0, pix = 0, webstore = 0, loading }) => {
  const styles = useStyles();
  const total = money + debit + credit + pix + webstore

  const colors = ['#2FD8A0', '#FF9774', '#31BCDC', '#54789D', '#34375A', '#CCCCCC']
  let seriesData = []
  if (money > 0) seriesData.push(money)
  if (debit > 0) seriesData.push(debit)
  if (credit > 0) seriesData.push(credit)
  if (pix > 0) seriesData.push(pix)
  if (webstore > 0) seriesData.push(webstore)

  const mockData = {
    series: [{ name: 'Valor', data: seriesData }],
    options: {
      chart: {
        height: 170,
        type: 'bar',
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          horizontal: true,
          distributed: true,
          dataLabels: {
            position: 'bottom',
          },
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        offsetX: -10,
        formatter: val => {
          return ((val / total) * 100).toFixed(1) + "%";
        },
        dropShadow: {
          enabled: true
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ["#FFF"],
          textShadow: '2px 2px 2px #000'
        }
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          'Dinheiro',
          'Débito',
          'Crédito',
          'Pix',
        ],
        labels: {
          show: true,
          style: {
            colors: ["#000"],
            fontSize: '12px'
          },
          formatter: val => {
            return `R$ ${(val / 1000) > 0 ? (val / 1000).toFixed(3) : val}`
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
          show: true,
          style: {
            colors,
            fontSize: '12px'
          },
          formatter: function (val) {
            return val
          },
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
