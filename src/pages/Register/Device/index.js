import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import Api from '../../../api';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Device = ({ user }) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Dispositivo', field: 'name' },
    { title: 'Nº de série', field: 'app_code' },
    { title: 'IMEI', field: 'imei' },
    {
      title: 'Status',
      field: 'status',
      render: StatusColumn,
    },
    {
      title: 'Ações',
      render: ({ code, status }) => (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              onClick={handleGotoEdit(code)}
              variant="outlined"
              size="small"
              color="primary"
            >
              Editar
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  useEffect(() => {
    Api.get('/device/getList')
      .then(({ data }) => {
        if (data.success) {
          setData(data.devices
            .filter(device => {
              if (!(user.role === "master" || user.role === "admin")) {
                return (device.name !== "NEUTRO")
              } else return device
            })
            .sort((a,b) => {
            const dataA = new Date(a.created_at).getTime();
            const dataB = new Date(b.created_at).getTime();
            return dataA > dataB ? -1: dataA < dataB? 1: 0;
          }));
        }
      })
      .catch((e) => {
        if (e.error) {
          alert(e.error);
        } else {
          alert('Erro não esperado');
        }
      });
  }, []);

  const handleGotoCreate = () => {
    history.push('/dashboard/device/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/device/${id}`);
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
              Adicionar Dispositivo
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Device);
