import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles/index.css'

import Api from '../../../api';
import { connect } from 'react-redux'

import ModalRequirePassword from './Modal/RequirePass';
import ModalResetPassword from './Modal/ResetPassword';
import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';
import { parseFD } from './parseFD';

const Operator = ({ user }) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const columns = [
    { title: 'Operador', field: 'name', },
    { title: 'Usuário', field: 'username' },
    { title: 'Dispositivo', field: 'device_name' },
    // {
    //   title: 'É garçom?',
    //   field: 'is_waiter',
    //   render: ({ is_waiter }) => (is_waiter ? 'Sim' : 'Não'),
    // },
    { title: 'Opera cashless', field: 'has_cashless', type: 'boolean' },
    { title: 'Ativo', field: 'status', render: StatusColumn },
    {
      title: 'Ações',
      field: 'action',
      render: ({ id }) => (
        <div style={{ width: 'fit-content' }}>
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
                onClick={handleDelete(id)}
                variant="outlined"
                size="small"
                color="secondary"
              >
                Excluir
              </Button>
            </Grid>
          </Grid>
        </div>
      ),
    },
  ];

  useEffect(() => {
    Api.get('/operator/getList').then(({ data }) => {
      setData(data.operators.sort((a, b) => {
        const first = a.name.toLowerCase();
        const second = b.name.toLowerCase();
        if (first < second) {
          return -1;
        }
        if (first > second) {
          return 1;
        }
        return 0;
      }));
    });
  }, []);

  const handleGotoCreate = () => {
    history.push('/dashboard/operator/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/operator/${id}`);
  };

  const handleDelete = (id) => async () => {
    try {
      await Api.delete(`/operator/${id}`)


      setData(previous => previous.filter(item => item.id !== id))
    } catch (error) {
      if (error.isAxiosError) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data)
        } else {
          alert("Erro não esperado")
        }
      }
    }
  };

  const updateOpPassRequirement = async (baseOp, state) => {
    const op = (await Api.get(`/operator/getData/${baseOp.id}`)).data

    if (op) {
      const fd = parseFD(user, op, state)
      const update = await Api.put(`/operator/updateOperator/${baseOp.id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return update.data.success
    } else return false
  }

  const handlePassModal = async (state) => {
    
    setShowPassModal(false)
    
    if (state !== null) {

      setUpdating(true)
      for (const idx in data) {
        const op = data[idx]
        await updateOpPassRequirement(op, state)
      }
      
      alert("Alterações concluídas")
    }

    setUpdating(false)
  }

  return (
    <Grid container>
      {(user.role === "master" || user.role === "admin") && (
        <ModalRequirePassword
          opened={showPassModal}
          onClose={handlePassModal}
        />
      )}
      <ModalResetPassword id={id} onClose={() => setId(null)} />
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          toolbar={() => (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }} className='toolbarContent'>
              <ButtonRound
                variant="contained"
                color="primary"
                onClick={handleGotoCreate}
              >
                Adicionar Operador
              </ButtonRound>
            </div>
          )}
        />
      </Grid>

      <Grid container spacing={2} justifyContent='flex-end'>
        {(user.role === "master" || user.role === "admin") && (
          <Grid item style={{marginTop: 12}}>
              <ButtonRound
                variant="contained"
                color="primary"
                onClick={() => setShowPassModal(true)}
                disabled={updating}
              >
                {updating ? (
                  <CircularProgress size={25} />
                ) : "Solicitar senha"}
              </ButtonRound>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Operator);
