import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import EaseGrid from '../../../components/EaseGrid';
import Api from '../../../api';

import ModalResetPassword from './Modal/ResetPassword';
import ButtonRound from '../../../components/ButtonRound';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const PDV = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [pdvId, setPDVId] = useState(null);
  const columns = [
    { title: 'PDV', field: 'name' },
    { title: 'Usuário', field: 'username' },
    { title: 'Dispositivo', field: 'device' },
    {
      title: 'Garçom',
      field: 'is_waiter',
      render: ({ is_waiter }) => (is_waiter ? 'Sim' : 'Não'),
    },
    { title: 'Ativo', field: 'status', render: StatusColumn },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Grid container spacing={2}>
          <Grid item>
            <Button
              onClick={handleGotoEdit(id)}
              variant="outlined"
              size="small"
              color="primary"
            >
              Editar
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleClone(id)}
              variant="outlined"
              size="small"
              color="primary"
            >
              Clonar
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  useEffect(() => {
    Api.get('/pdv/getList').then(({ data }) => {
      console.log(data);
      if (data.success) {
        setData(data.pdvs);
      }
    });
  }, []);

  const handleClone = (id) => async () => {
    try {
      const { data } = await Api.get(`/pdv/getData/${id}`);

      if (data.success) {
        history.push('/dashboard/pdv/clone', data);
      } else {
        alert('Erro ao clonar');
      }
    } catch (error) {
      alert('Erro ao clonar');
    }
  };

  const handleGotoCreate = () => {
    history.push('/dashboard/pdv/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/pdv/${id}`);
  };

  return (
    <Grid container>
      <ModalResetPassword id={pdvId} onClose={() => setPDVId(null)} />
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <ButtonRound
              variant="contained"
              color="primary"
              onClick={handleGotoCreate}
            >
              Adicionar PDV
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default PDV;
