import React, { memo, useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import Chart from 'react-apexcharts';
import Utils from '../../utils';
import useStyles from '../../global/styles';

export default memo(({ title, ranking }) => {

  const styles = useStyles();

  const colors = ['#3B94FF']

  const [total, setTotal] = useState(0)
  const [seriesData, setSeriesData] = useState([])
  const [categories, setCategories] = useState([])


  useEffect(() => {
    if (ranking.length > 0) {
      let newInfo = {
        series: [],
        categories: []
      }
      ranking.forEach(r => {
        if (r.value > 0) {
          newInfo.series = [...newInfo.series, r.value]
          newInfo.categories = [...newInfo.categories, r.label]
        }
      })

      setTotal(newInfo.series.length > 0 ? newInfo.series.reduce((a, b) => a + b) : 0)
      setSeriesData(newInfo.series)
      setCategories(newInfo.categories)
    }
  }, [])

  const data = {

    series: [{ name: 'Valor', data: seriesData }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          dataLabels: {
            position: 'bottom'
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: 10,
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
          textShadow: '2px 2px 2px #000',
        }
      },
      legend: {
        show: false
      },
      xaxis: {
        categories,
        labels: {
          style: {
            colors: colors,
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
          show: false
        }
      },
      tooltip: {
        y: {
          title: 'Valor',
          formatter: val => Utils.prototype.currencyFormatter(val * 100)
        },
      },
    },


  }


  return (
    <>
      <Typography className={styles.h2} style={{ textAlign: 'center', }}>
        {title}
      </Typography>
      {ranking.length > 0 &&
        <Chart
          options={data.options}
          series={data.series}
          type='bar'
          height={240}
          width={'100%'}
        />
      }
    </>
  );
});
