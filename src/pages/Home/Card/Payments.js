import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Chart from 'react-apexcharts';

import Card from '.';
import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';


const Payments = ({ event, money = 0, debit = 0, credit = 0, pix = 0, webstore = 0, loading }) => {
  const styles = useStyles();
  const total = money + debit + credit + pix + webstore

  const colors = ['#6AED09', '#F0B000', '#5102E0', '#F71D0A', '#0AECF7', '#CCCCCC']
  let seriesData = []
  let categories = []

  const showInfo = (value, label) => {
    if (value > 0) {
      seriesData.push(value)
      categories.push(label)
    }
  }

  showInfo(money, 'Dinheiro')
  showInfo(debit, 'Débito')
  showInfo(credit, 'Crédito')
  showInfo(pix, 'Pix')
  showInfo(webstore, 'Loja Virtual')

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
        categories,
        labels: {
          show: false,
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
