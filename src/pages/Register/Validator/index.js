import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import Api from '../../../api';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Validator = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Validador', field: 'name' },
    { title: 'Usuário', field: 'username' },
    { title: 'Status', field: 'status', render: StatusColumn },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Button
          onClick={handleGotoEdit(id)}
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
    Api.get('/validator/getList').then(({ data }) => {
      console.log(data);
      setData(data.validators);
    });
  }, []);

  const handleGotoCreate = () => {
    history.push('/dashboard/validator/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/validator/${id}`);
  };

  return (
    <Grid container>
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
              Adicionar Validador
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Validator;
