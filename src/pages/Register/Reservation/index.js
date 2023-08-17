import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'currency-formatter';

import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import Api from '../../../api';

const Reservation = ({ event }) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Setor',
      field: 'section',
      render: ({ section }) => <span style={{ textTransform: 'capitalize' }}>{section}</span>,
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
          {has_product_list > 0 && (
            <>
              Sim
              <Button
                onClick={handleGotoEdit(id)}
                variant='outlined'
                size='small'
                color='primary'
                style={{ marginLeft: '5px' }}
              >
                Ver
              </Button>
            </>
          )}
          {!has_product_list && 'Não'}
        </>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      render: ({ status }) => {
        if (status === 'reservado')
          return <span style={{ textTransform: 'capitalize', color: '#EEB422' }}>{status}</span>;
        if (status === 'bloqueado')
          return <span style={{ textTransform: 'capitalize', color: '#B22222' }}>{status}</span>;
        if (status === 'livre') return <span style={{ textTransform: 'capitalize', color: '#2E8B57' }}>{status}</span>;
        if (status === 'vendido')
          return <span style={{ textTransform: 'capitalize', color: '#104E8B' }}>{status}</span>;
      },
    },

    { title: 'Observações', field: 'description' },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Button onClick={handleGotoEdit(id)} variant='outlined' size='small' color='primary'>
          Editar
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (event)
      Api.get(`/reservation/getList/${event}`).then(({ data }) => {
        if (data.success) {
          setData(data.reservations);
        }
      });
  }, [event]);

  const handleGotoCreate = () => {
    history.push('/dashboard/reservation/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/reservation/${id}`);
  };

  return (
    <Grid container>
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <ButtonRound variant='contained' color='primary' onClick={handleGotoCreate}>
              Adicionar Reserva
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};
const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Reservation);
