import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Card from './Cards';

import EaseGrid from '../../../components/EaseGrid';
import Api from '../../../api';
import { format } from 'currency-formatter';


const Lists = ({ event }) => {
  const columns = [
    { title: 'Lista', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Limite', field: 'quantity_limit' },
    { title: 'Check In', field: 'checkin' },
    { title: 'Pendentes', field: 'pending' },
    { title: 'Faturamento', field: 'profit', render: ({ profit }) => format(profit/100, { code: 'BRL' }) },
    { title: '% de presença', field: 'attendance', render: ({ people = 1, checkin = 0 }) => (people ? (checkin/people*100) + "%" : "0%") },
  ];
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const { data } = await Api.get(`/statistical/list/${event}`)

      setStats(data.stats);
      setData(data.list);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if(event) {
      loadData()
    }
  }, [event]);


  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Card {...stats} />
      </Grid>

      <Grid item xs={12}>
        <EaseGrid data={data} columns={columns} pageSize={10}/>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Lists);
