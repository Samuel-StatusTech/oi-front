import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Card from './Cards';

import EaseGrid from '../../../components/EaseGrid';
import Api from '../../../api';
import { format } from 'currency-formatter';

const Reservation = ({ event }) => {
  const columns = [
    {
      title: 'Setor',
      field: 'section',
      render: ({ section }) => (
        <span style={{ textTransform: 'capitalize' }}>{section}</span>
      ),
    },
    { title: 'Número', field: 'number' },
    {
      title: 'Valor',
      field: 'value',
      render: ({ value }) => format(value / 100, { code: 'BRL' }),
    },
    {
      title: 'Produtos inclusos',
      field: 'has_product_list',
      render: ({ has_product_list, id }) => (
        <>
          {has_product_list > 0 && "Sim"}
          {!has_product_list && 'Não'}
        </>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      render: ({ status }) => {
        if (status === 'reservado')
          return (
            <span style={{ textTransform: 'capitalize', color: '#EEB422' }}>
              {status}
            </span>
          );
        if (status === 'bloqueado')
          return (
            <span style={{ textTransform: 'capitalize', color: '#B22222' }}>
              {status}
            </span>
          );
        if (status === 'livre')
          return (
            <span style={{ textTransform: 'capitalize', color: '#2E8B57' }}>
              {status}
            </span>
          );
        if (status === 'vendido')
          return (
            <span style={{ textTransform: 'capitalize', color: '#104E8B' }}>
              {status}
            </span>
          );
      },
    },

    { title: 'Observações', field: 'description' }
  ];
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const { data } = await Api.get(`/statistical/reservation/${event}`)
      const { data: list } = await Api.get(`/reservation/getList`)

      setStats(data);
      setData(list.reservations);
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

export default connect(mapStateToProps)(Reservation);
