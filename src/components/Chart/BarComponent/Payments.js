import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Chart from 'react-apexcharts';

import Card from '.';
import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';


const Payments = ({ money = 0, debit = 0, credit = 0, pix = 0, webstore = 0, others = 0, loading }) => {
  const styles = useStyles();
  const total = money + debit + credit + pix + webstore + others

  const colors = ['#4C7CD0', '#FF9843', '#F05968']
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
  showInfo(others, 'Outras Receitas')

  const mockData = {
    series: [{ name: 'Valor', data: seriesData }],
    options: {
      chart: {
        height: 170,
        type: 'bar',
      },
      grid: {
        show: false
      },
      colors: colors,
      fill: {
        type: "gradient",
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.2,
          inverseColors: true,
          opacityFrom: .85,
          opacityTo: 1,
          stops: [0, 90, 100]
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          horizontal: true,
          distributed: true,
          borderRadius: 10,
          borderRadiusApplication: 'around',
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        offsetX: 5,
        formatter: val => {
          return ((val / total) * 100).toFixed(1);
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
            const isNumber = String(+val) !== 'NaN'
            if (isNumber) {
              const n = (+val).toFixed(2)
              return `R$ ${n.replace('.', ',')}`
            } else {
              return val
            }
          },
        }

      },
    },
  }

  return (
    <div style={total === 0 ? customStyles.textWrapper : customStyles.normal}>
      <Typography className={styles.h2} style={{ textAlign: 'center', }}>
        {loading ? <Skeleton animation='wave' width='80%' /> : 'Formas de Pagamento'}
      </Typography>
      {loading ? (
        <Skeleton animation='wave' variant='rect' height={100} />
      ) : total > 0 ? (
        <Chart options={mockData.options} series={mockData.series} type='bar' height={170} />
      ) : null}
    </div>
  );

};

const base = {
  height: '100%',
  padding: 8,
  width: '100%',
  backgroundColor: '#FFF',
  boxShadow: `
    0px 2px 1px -1px rgba(0,0,0,0.2),
    0px 1px 1px 0px rgba(0,0,0,0.14),
    0px 1px 3px 0px rgba(0,0,0,0.12)`,
  borderRadius: 4
}

const customStyles = {
  normal: {
    ...base
  },
  textWrapper: {
    ...base,
    display: 'flex',
    justifyContent: 'center',
  },

}

export default Payments;
