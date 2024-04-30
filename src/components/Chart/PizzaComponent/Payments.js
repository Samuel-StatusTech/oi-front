import React from 'react';
import Chart from 'react-apexcharts';

import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';
import { getGraphData } from './options';


const Payments = ({ labels, series, total = 0 }) => {
  const styles = useStyles();

  const mockData = getGraphData(series, labels) ?? undefined

  return (
    <div style={total === 0 ? customStyles.textWrapper : customStyles.normal} >
      <Typography className={styles.h2} style={{ textAlign: 'center', }}>
        Formas de pagamento
      </Typography>
      {
        total > 0 && mockData ? (
          <Chart options={mockData.options} series={mockData.series} type={mockData.options.chart.type} height={"100%"} />
        ) : null
      }
      <div style={{ padding: 11 }} />
    </div >
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
    ...base,
    display: "flex",
    flexDirection: "column"
  },
  textWrapper: {
    ...base,
    display: 'flex',
    justifyContent: 'center',
  },
}

export default Payments;
