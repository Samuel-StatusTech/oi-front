import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ModalCreateList from './Modal/createList';
import ModalConnectList from './Modal/modalConnect';
import { connect } from 'react-redux';

import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import Api from '../../../api';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Lists = ({ event }) => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Listas', field: 'name' },
    { title: 'Status', field: 'status', render: StatusColumn },
    { title: 'Limite', field: 'quantity_limit' },
    { title: 'Nomes Inseridos', field: '' },
    {
      title: 'Data/Hora Limite',
      field: 'time_limit',
      render: ({ has_time_limit, time_limit }) =>
        has_time_limit ? time_limit : '',
    },
    {
      title: 'Produtos Inclusos',
      render: ({ id }) => (
        <Button
          onClick={() => setShowConnect(id)}
          variant="outlined"
          size="small"
          color="primary"
        >
          Editar
        </Button>
      ),
    },
    { title: 'Observação', field: 'description' },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Button
          onClick={handleGotoEdit(id)}
          variant="outlined"
          size="small"
          color="primary"
        >
          Abrir
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (event) {
      Api.get(`/list/getList/${event}`).then(({ data }) => {
        console.log('aqui', data);
        setData(data.lists);
      });
    }
  }, [event]);

  const handleShowModal = () => {
    setShow(true);
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/list/${id}`);
  };

  return (
    <Grid container>
      <ModalCreateList
        show={show}
        onClose={() => setShow(false)}
        handleGotoEdit={handleGotoEdit}
      />
      <ModalConnectList
        show={showConnect}
        id={showConnect}
        onClose={() => setShowConnect(false)}
      />
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <ButtonRound
              variant="contained"
              color="primary"
              onClick={handleShowModal}
            >
              Adicionar Lista
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Lists);
