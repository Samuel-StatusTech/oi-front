import React, { useState, useRef } from 'react';
import { Grid, Button, TextField, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import EaseGrid from '../../../components/EaseGrid';
// import Drawer from "./drawer";
import Api from '../../../api';
import ButtonRound from '../../../components/ButtonRound';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Group = () => {
  const history = useHistory();
  const tableRef = useRef(null);
  const [type, setType] = useState('todos');

  const columns = [
    { title: 'Tipo', field: 'type' },
    { title: 'Grupo', field: 'name' },
    {
      title: 'Status',
      field: 'status',
      render: StatusColumn,
    },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Grid container spacing={1}>
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
              onClick={handleRemove(id)}
              variant="outlined"
              size="small"
              color="secondary"
            >
              Remover
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleGotoCreate = () => {
    history.push('/dashboard/group/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/group/${id}`);
  };

  const handleRemove = (id) => async () => {
    try {
      const { status } = await Api.delete(`/group/${id}`);
      if (status === 200) {
        tableRef.current.onQueryChange();
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        if (data.error) {
          alert(data.error);
        } else {
          alert('Erro não esperado');
        }
      } else {
        alert('Erro não esperado');
      }
    }
  };

  const onHandleType = (e) => {
    setType(e.target.value);
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      if (tableRef.current) {
        tableRef.current.onQueryChange();
      } else {
        await handleQuery();
        console.log('Sem referencia');
      }
    } catch (e) {
      console.log('Erro');
    }
  };

  const handleQuery = (query) => {
    return new Promise((resolve, reject) => {
      if (query.data) {
        resolve({
          data: query.data,
          page: query.page,
          totalCount: query.totalCount,
        });
        return;
      }

      const url = `/group/getList?type=${type}&per_page=${
        query.pageSize
      }&page=${query.page + 1}`;

      Api.get(url).then(({ data }) => {
        console.log(data);

        if (data.success) {
          resolve({
            data: data.groups,
            page: data.page - 1,
            totalCount: data.totalCount,
          });
        } else {
          reject();
        }
      });
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <TextField
              value={type}
              onChange={onHandleType}
              label="Tipo"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="ingresso">Ingresso</MenuItem>
              <MenuItem value="estacionamento">Estacionamento</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          columns={columns}
          data={handleQuery}
          toolbar={() => (
            <ButtonRound
              variant="contained"
              color="primary"
              onClick={handleGotoCreate}
            >
              Adicionar Grupo
            </ButtonRound>
          )}
          tableRef={tableRef}
        />
      </Grid>
    </Grid>
  );
};

export default Group;
