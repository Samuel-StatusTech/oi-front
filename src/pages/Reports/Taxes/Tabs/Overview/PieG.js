import React, { memo } from 'react';
import Chart from 'react-apexcharts';
import Utils from '../../../../../utils';

export default memo(({ values, labels = [], series = [], ...props }) => {
  const { money, debit, credit, pix } = values
  const total = money + debit + credit + pix

  const colors = ['#2FD8A0', '#FF9774', '#31BCDC', '#54789D', '#34375A', '#CCCCCC']
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


  const data = {
    series: [{ name: 'Valor', data: seriesData }],
    options: {
      chart: {
        height: 240,
        width: '100%',
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
        offsetX: 10,
        offsetY: 6,
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
        show: true,
        position: 'right'
      },
      xaxis: {
        categories,
        labels: {
          show: false,
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
          formatter: val => {
            const vId = categories.findIndex(c => c === val)
            const qnt = seriesData[vId]
            return Utils.prototype.currencyFormatter(qnt)
          }
        }
      },
      tooltip: {
        x: {
          title: 'Valor',
          formatter: val => val
        },
        y: {
          formatter: val => Utils.prototype.currencyFormatter(val)
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  }


  return (
    <Chart
      options={data.options}
      series={data.series}
      type='bar'
      height={240}
      width={'100%'}

    />
  );
});
