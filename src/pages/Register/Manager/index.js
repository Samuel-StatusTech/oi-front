import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
// import Drawer from "./drawer";
import Api from '../../../api';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';
import { connect } from 'react-redux';
import ModalPassword from './changePassword';
import ModalCode from './changeCode';

const Manager = ({user}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalCode, setShowModalCode] = useState(false);
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [data, setData] = useState([]);
  const columns = [
    { title: 'Gerente', field: 'name' },
    { title: 'Usuário', field: 'username' },
    { title: 'Status', field: 'status', render: StatusColumn }
  ];
  if(user.role === 'master') {
    columns.push({
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
          <Grid item>
            <Button
              onClick={handleChangePassword(id)}
              variant="outlined"
              size="small"
              color="primary"
            >
              Mudar Senha
            </Button>
          </Grid>
        </Grid>
      ),
    })
  } else {
    columns.push({
      title: 'Ações',
      render: ({ id }) => (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              onClick={handleChangeCode(id)}
              variant="outlined"
              size="small"
              color="primary"
            >
              Mudar Código
            </Button>
          </Grid>
        </Grid>
      ),
    })
  }

  useEffect(() => {
    reload()
  }, []);

  const reload = () => {
    Api.get('/manager/getList').then(({ data }) => {
      setData(data.managers);
      setLoading(false);
    });
  };

  const handleGotoCreate = () => {
    history.push('/dashboard/manager/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/manager/${id}`);
  };
  
  const handleChangePassword = (id) => () => {
    setUserId(id);
    setShowModal(true);
  };

  const handleChangeCode = (id) => () => {
    if(user.id !== id) {
      alert("Você só tem permissão para alterar o seu código")
    } else {
      setUserId(id);
      setShowModalCode(true);
    }
  };

  const handleRemove = (id) => async () => {
    try {
      if(window.confirm("Tem certeza que deseja remover esse gerente?")) {
        setLoading(true);
        const { success } = (await Api.delete(`/manager/delete/${id}`)).data;
        if (success) {
          reload();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      alert('Sem permissão para deletar');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword('');
  }

  const closeModalCode = () => {
    setShowModalCode(false);
    setPassword('');
  }

  return (
    <Grid container>
      <ModalPassword show={showModal} onClose={closeModal} password={password} setPassword={setPassword} userId={userId} />
      <ModalCode show={showModalCode} onClose={closeModalCode} password={password} setPassword={setPassword} userId={userId} />
      <Grid item lg md sm xs>
        <EaseGrid
          loading={loading}
          columns={columns}
          data={data}
          toolbar={() => (
            <>
              {user.role === 'master' &&
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleGotoCreate}
                >
                  Adicionar Gerente
                </ButtonRound>
              }
            </>
          )}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Manager);