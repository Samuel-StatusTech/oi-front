import React, { memo } from 'react';
import Chart from 'react-apexcharts';


const options = {
  options: {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        dataLabels:{
          position: 'top',
          textAnchor: 'end',

        },
        distributed: true,
        borderRadius: 4,
        horizontal: true,
      }
    },
    legend: {
      show: false
    },
    colors: ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', '#34375A', '#CCCCCC'],
  },
};

const Bar = ({ series, labels, title, ...props }) => {
  const totalSeries = series.reduce((a, b) => a + b, 0);
  return (
    <Chart
      options={{...options.options, 
        dataLabels: {
          enabled: true,
          formatter: function(value) {
            if(!value)
              return '';
            const percent = (value / totalSeries) * 100;
            return percent.toFixed(1).replace(/[.,]0$/, "") + '%';
        }, 
        style: {
          colors: ['#333'],
        },
        offsetX: 30
      },
      xaxis:{categories:labels, labels: {show:false}}
      }}
      series={[{data: [...series]}]}
      type="bar"
      width='100%'
      height='100%'
      {...props}
    />
  );
};

export default memo(Bar);
