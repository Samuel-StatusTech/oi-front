import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles/index.css'

import EaseGrid from '../../../components/EaseGrid';
// import Drawer from "./drawer";
import Api from '../../../api';

import ModalResetPassword from './Modal/ResetPassword';
import ButtonRound from '../../../components/ButtonRound';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';

const Operator = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [type, setType] = useState('todos');
  const [group, setGroup] = useState('todos');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('todos');

  const columns = [
    { title: 'Operador', field: 'name', },
    { title: 'Usuário', field: 'username' },
    { title: 'Dispositivo', field: 'device_name' },
    {
      title: 'É garçom?',
      field: 'is_waiter',
      render: ({ is_waiter }) => (is_waiter ? 'Sim' : 'Não'),
    },
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
      console.log(data);
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

  const handleQuery = async (props) => {
    try {
      const selectedGroup = props.group ? props.group : group;
      const searchText = props.search !== undefined ? props.search : search;
      const url = `/operator/getList?type=${props.type ? props.type : type}&search=${searchText}`;

      const { data } = await Api.get(url);

      if (data.success) {
        let list = []
        switch (selectedGroup) {
          case 'waiter':
            list = (data.operators.filter(op => op.is_waiter === 1))
            break;
          case 'status':
            list = (data.operators.filter(op => op.status === 1))
            break;
          case 'todos':
          default:
            list = data.operators
            break;
        }
        setData(list.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  var time;

  const handleType = (e) => {
    setType(e.target.value);
    setGroup('todos');
    localStorage.setItem('GROUP_SAVED', 'todos');

    if (time) {
      clearTimeout(time);
      time = null;
    }

    time = setTimeout(() => {
      handleQuery({ type: e.target.value, group: 'todos' });
    }, 100);
  };

  const handleGroup = (e) => {
    setGroup(e.target.value);
    localStorage.setItem('GROUP_SAVED', e.target.value);
    handleQuery({ group: e.target.value });
  };

  return (
    <Grid container>
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
    </Grid>
  );
};

export default Operator;
