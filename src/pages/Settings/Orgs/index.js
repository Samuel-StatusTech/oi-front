import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import SettingsIcon from '../../../assets/icons/ic_config.svg';
import Api from '../../../api';
import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import { Check, Close } from '@material-ui/icons';
import Modal from './Modal/updateStatus';
const Settings = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const handleStatus = (statusData) => () => {
    setStatusData(statusData);
    setShow(true);
  };
  const updateRow = (status, id) => {
    const newData = [...data];
    newData[data.findIndex((element) => element.id === id)].status = status;
    setData(newData);
  };
  const columns = [
    { title: 'Cliente', field: 'name' },
    { title: 'Usuário', field: 'username' },
    {
      filter: true,

      title: 'Status',
      field: 'status',
      render: ({ id, status }) => {
        return status ? (
          <Check style={{ cursor: 'pointer' }} onClick={handleStatus({ status: status, id: id })}></Check>
        ) : (
          <Close style={{ cursor: 'pointer' }} onClick={handleStatus({ status: status, id: id })}></Close>
        );
      },
    },
    {
      title: 'Permissões',
      render: ({ id }) => (
        <Button onClick={handleGotoEdit(id)} variant='outlined' size='small' color='primary'>
          Editar
        </Button>
      ),
    },
  ];
  const handleGotoCreate = () => {
    history.push(`/dashboard/organization/new`);
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/organization/${id}`);
  };

  useEffect(() => {
    Api.get('/organization')
      .then(({ data }) => {
        setData(data.organization);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2} justify='center'>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Modal show={show} onClose={() => setShow(false)} data={statusData} updateRow={updateRow} />
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {/* {!permission && (
          <Card
            style={{
              height: '400px',
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <CardContent
              style={{
                margin: 'auto 0',
                justifyContent: 'center',
              }}
            >
              <Typography
                style={{ margin: '20px', fontWeight: 'bold', fontSize: 24 }}
              >
                Usuário sem permissão de acesso!
              </Typography>
              <Typography style={{ margin: '20px' }}>
                Solicite permissão para acessar esta página.
              </Typography>
              <Button variant="outlined" color="primary">
                Solicitar
              </Button>
            </CardContent>
          </Card>
        )} */}

        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <ButtonRound variant='contained' color='primary' onClick={handleGotoCreate}>
              Cadastrar cliente
            </ButtonRound>
          )}
        />
      </Grid>
    </Grid>
  );
};

export const Icon = () => {
  return <img src={SettingsIcon} alt='Ícone configurações' />;
};

export default Settings;
