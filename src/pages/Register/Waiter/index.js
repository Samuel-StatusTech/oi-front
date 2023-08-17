import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import EaseGrid from '../../../components/EaseGrid';
// import Drawer from "./drawer";
import Api from '../../../api';
import ButtonRound from '../../../components/ButtonRound';
import Tooltip from '../../../components/Tooltip';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Waiter = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Garçom', field: 'name' },
    // { title: 'Usuário', field: "username" },
    // { title: 'Dispositivo', field: "device_name" },
    { title: 'Código', field: 'code' },
    {
      title: 'Comissão (%)',
      field: 'commission',
      render: ({ commission }) => `${commission} %`,
    },
    {
      title: 'Status',
      field: 'status',
      render: StatusColumn,
    },
    {
      title: 'Ações',
      render: ({ user_id }) => (
        <Button
          onClick={handleGotoEdit(user_id)}
          variant="outlined"
          size="small"
          color="primary"
        >
          Editar
        </Button>
      ),
    },
  ];

  useEffect(() => {
    Api.get('/waiter/getList').then(({ data }) => {
      setData(data.values);
    });
  }, []);

  const handleGotoCreate = () => {
    history.push('/dashboard/waiter/new');
  };

  const handleGotoEdit = (user_id) => () => {
    history.push(`/dashboard/waiter/${user_id}`);
  };

  return (
    <Grid container>
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <Tooltip
              title="Adicione aqui os Garçons que irão operar no Modo Código. Para operação via dispositivo, deverá ser adicionado em Cadastros -> Operadores. "
              placement="right"
            >
              <ButtonRound
                variant="contained"
                color="primary"
                onClick={handleGotoCreate}
              >
                Adicionar Garçom
              </ButtonRound>
            </Tooltip>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Waiter;
