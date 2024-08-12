import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Chart from 'react-apexcharts';

import { Typography } from '@material-ui/core';
import useStyles from '../../../global/styles';
import { getGraphData } from './options';
import { formatDate } from '../../../utils/date';


const Payments = ({ history = [], total, loading, toggleDailyModal }) => {
  const styles = useStyles();

  const mockData = getGraphData(history, history.map(d => formatDate(d.timeLabel))) ?? undefined

  return (
    <div style={total === 0 ? customStyles.textWrapper : customStyles.normal} >
      <Typography className={styles.h2} style={{ textAlign: 'center' }}>
        {loading ? <Skeleton animation='wave' width='80%' /> : 'Vendas diárias'}
      </Typography>
      {
        loading ? (
          <Skeleton animation='wave' variant='rect' height={100} />
        ) : total > 0 && mockData ? (
          <Chart options={mockData.options} series={mockData.series} type={mockData.options.chart.type} height={170} />
        ) : null
      }
      <button style={customStyles.expandButton} onClick={toggleDailyModal}>
        <Typography className={customStyles.buttonText} style={{ textAlign: 'center', }}>
          {loading ? <Skeleton animation='wave' width='80%' /> : 'Expandir'}
        </Typography>
      </button>
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
  expandButton: {
    padding: "6px 14px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    width: "fit-content",
    alignSelf: "center",
    margin: "auto",
    outline: "none",
  },
  buttonText: {
    fontSize: '0.9rem',
  },
}

export default Payments;
