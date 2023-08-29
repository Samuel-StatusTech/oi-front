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
  const [groupList, setGroupList] = useState([]);

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
    Api.get(`/group/getList`).then(async ({ data }) => {
      const { success, groups } = data;

      if (success) {
        setGroupList([{ id: 'todos', name: 'Todos' }, ...groups]);
      } else {
        alert('Erro ao carregar os grupos');
      }
    });

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
      const selectedStatus = props.status ? props.status : status;
      const url = `/operator/getList?type=${props.type ? props.type : type}${selectedGroup !== 'todos' ? '&group=' + selectedGroup : ''
        }&search=${searchText}${selectedStatus !== 'todos' ? `&status=${selectedStatus}` : ''}`;

      const { data } = await Api.get(url);

      if (data.success) {
        setData(data.operators.sort((a, b) => a.status == b.status ? a.name.localeCompare(b.name) : a.status > b.status ? -1 : 1));
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
            }}>
              <ButtonRound
                variant="contained"
                color="primary"
                onClick={handleGotoCreate}
              >
                Adicionar Operador
              </ButtonRound>
              <FormControl variant='outlined' size='small' fullWidth className='groupSelect'>
                <InputLabel>Grupo</InputLabel>
                <Select value={group} onChange={handleGroup} label='Grupo' variant='outlined' fullWidth>
                  {groupList.map((groupItem) => (
                    <MenuItem key={groupItem.id} value={groupItem.id}>
                      {groupItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Operator;
