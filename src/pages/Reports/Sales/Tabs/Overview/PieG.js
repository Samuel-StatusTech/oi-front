import React, { memo } from 'react';
import Chart from 'react-apexcharts';
import Utils from '../../../../../utils';

export default memo(({labels = [], series = [], ...props}) => {
  const options = {
    labels: ['Crédito', 'Débito', 'Dinheiro', 'Pix'
    // 'Crédito Online', 'Pix Online'
  ],
    dataLabels: {
      style: {
        fontSize: '14px',
        colors: ['#404040', '#404040', '#404040', '#404040', 
        // '#404040', '#404040'
      ]
      },
      dropShadow: {
        enabled: false
      }
    },
    chart: {
      type: 'donut',
    },
    legend: {
      formatter: (label, opts) => props?.showValueLegend ? `${label} ${opts.w.globals.series[opts.seriesIndex] ? Utils.prototype.currencyFormatter(opts.w.globals.series[opts.seriesIndex] * 100) : 'R$ 0,00'}` : label,
      position: 'right',
    },
    colors: ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', 
    // '#34375A', '#CCCCCC'
  ],
    fill: {
      gradient: {
        shade: 'light',
        shadeIntensity: 10,
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            show: true,
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 1590,
        options: {
          chart: {
            width: 500,
            height: 500,
          },
          legend: {
            show: true,
          },
        },
      },
    ],
  }

  return (
    <Chart
      options={{
        ...options,
        labels
      }}
      series={series}
      type="donut"
      {...props}
    />
  );
});
