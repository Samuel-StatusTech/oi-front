import React, { memo } from 'react';
import Chart from 'react-apexcharts';


const mockData = {
  series: [
    { name: 'Crédito', data: [30] },
    { name: 'Débito', data: [40] },
    { name: 'Dinheiro', data: [30] },
  ],
  options: {
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
      },
    },

    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      floating: true,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      offsetX: 40,
      fontSize: '14px',
      fontWeight: 300,
    },
  },
};

const Bar = ({ series, ...props }) => {
  return (
    <Chart
      options={mockData.options}
      series={series}
      type="bar"
      {...props}
    />
  );
};

export default memo(Bar);
