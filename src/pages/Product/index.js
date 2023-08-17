import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Checkbox,
} from '@material-ui/core';
import GridIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import { useHistory } from 'react-router-dom';

import CardProduct from '../../components/Card/product';
import InputMoney from '../../components/Input/Money';
import EaseGrid from '../../components/EaseGrid';

import Api from '../../api';
import { format } from 'currency-formatter';
import ButtonRound from '../../components/ButtonRound';
import productsIcon from '../../assets/icons/ic_produtos.svg';

import { Favorite, FavoriteBorder, FlashOn } from '@material-ui/icons/';

const Product = () => {
  const history = useHistory();
  const tableRef = useRef(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('todos');
  const [group, setGroup] = useState('todos');
  const [status, setStatus] = useState('todos');
  const [groupList, setGroupList] = useState([]);
  const [isGrid, setGrid] = useState(true);
  const [placeholder, setPlaceholder] = useState(0);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: 'Tipo',
      field: 'type',
      lookup: {
        bar: 'Bar',
        ingresso: 'Ingresso',
        estacionamento: 'Estacionamento',
        combo: 'Combo',
        complement: 'Complemento',
      },
      editable: 'never',
      cellStyle: {
        width: '10%',
        maxWidth: '10%',
      },
      headerStyle: {
        width: '10%',
        maxWidth: '10%',
      },
    },
    {
      title: 'Grupo',
      field: 'group.name',
      editable: 'never',
    },
    { title: 'Nome', field: 'name' },
    {
      title: 'Valor',
      field: 'price_sell',
      render: ({ price_sell }) => format(price_sell / 100, { code: 'BRL' }),
      editComponent: (props) => (
        <InputMoney size='small' variant='outlined' value={props.value} onChange={(e) => props.onChange(e.value)} />
      ),
    },
    {
      title: 'Situação',
      field: 'status',
      render: ({ status }) => (status && status !== '0' ? 'Ativo' : 'Inativo'),
      editComponent: (props) => (
        <Select
          value={props.value}
          label='Situação'
          variant='outlined'
          onChange={(e) => props.onChange(e.target.value)}
          fullWidth
        >
          <MenuItem value='1'>Ativo</MenuItem>
          <MenuItem value='0'>Inativo</MenuItem>
        </Select>
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
  }, []);

  useEffect(() => {
    if(groupList.length == 0)
      return;
      
    const group = localStorage.getItem('GROUP_SAVED');
    
    if(group) {
      setGroup(group);
      handleQuery({ group });
    } else {
      handleQuery({});
    }
  }, [groupList]);

  const handleCreateSimple = () => {
    history.push('/dashboard/product/simple/new');
  };

  const handleCreateCombo = () => {
    history.push('/dashboard/product/combo/new');
  };

  const handleCreateComplement = () => {
    history.push('/dashboard/product/complement/new');
  };

  const disabelAll = async () => {
    if (loading) {
      return false;
    }

    if(window.confirm("Você tem certeza que deseja inativar todos os produtos?")) {
      setLoading(true);
      await Api.put('/product/disableAll', { products: data.map(item=>item.id) });
      handleQuery({})
      setLoading(false);
    }
  };

  const handleQuery = async (props) => {
    try {
      const selectedGroup = props.group ? props.group : group;
      const searchText = props.search !== undefined ? props.search : search;
      const selectedStatus = props.status ? props.status : status;
      const url = `/product/getList?type=${props.type ? props.type : type}${
        selectedGroup !== 'todos' ? '&group=' + selectedGroup : ''
      }&search=${searchText}${selectedStatus !== 'todos' ? `&status=${selectedStatus}` : ''}`;

      const { data } = await Api.get(url);

      if (data.success) {
        setData( data.products.sort((a, b) => a.status == b.status ? a.name.localeCompare(b.name) : a.status > b.status ? -1 : 1) );
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
  const handleStatus = (e) => {
    setStatus(e.target.value);
    handleQuery({ status: e.target.value });
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    handleQuery({ search: e.target.value });
  };

  const onRowUpdate = async (newData, oldData) => {
    const promises = [];
    if (oldData.name !== newData.name) {
      promises.push(
        Api.patch(`/product/updateName/${newData.id}`, {
          type: newData.type,
          name: newData.name,
        })
      );
    }
    if (oldData.price_sell !== newData.price_sell) {
      promises.push(
        Api.patch(`/product/updatePrice/${newData.id}`, {
          type: newData.type,
          price: newData.price_sell,
        })
      );
    }
    if (oldData.status !== newData.status) {
      promises.push(
        Api.patch(`/product/updateStatus/${newData.id}`, {
          type: newData.type,
          status: newData.status,
        })
      );
    }

    await Promise.all(promises).then(() => newData);

    setData((previous) =>
      previous.map((item) => {
        if (item.id === oldData.id) {
          return newData;
        }

        return item;
      })
    );
  };
  const forceUpdate = () => {
    setPlaceholder((o) => o + 1);
  };
  const editType = {
    combo: '/dashboard/product/combo',
    complement: '/dashboard/product/complement',
  };
  const handleEdit = (row) => {
    const url = editType?.[row.type] ? `${editType[row.type]}/${row.id}` : `/dashboard/product/simple/${row.id}`;
    history.push(url);
  };
  const deleteType = {
    combo: '/product/combo',
    complement: '/product/complement',
  };
  const handleDelete = async (row) => {
    if(window.confirm("Tem certeza que deseja excluir?")) {
        if (loading) {
          return false;
        }

        setLoading(true);
        const url = deleteType?.[row.type] ? `${deleteType[row.type]}/${row.id}` : `/product/simple/${row.id}`;
        const { data } = await Api.delete(url);

        if (!data) {
          alert('O produto ja foi vendido em algum evento');
        }

        await handleQuery({});
        setLoading(false);
    }
  };
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item lg md sm xs>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <ButtonRound variant='contained' color='primary' onClick={handleCreateSimple}>
              Cadastrar Produto
            </ButtonRound>
          </Grid>
          <Grid item>
            <ButtonRound variant='contained' color='primary' onClick={handleCreateCombo}>
              Cadastrar Combo
            </ButtonRound>
          </Grid>
          <Grid item>
            <ButtonRound variant='contained' color='primary' onClick={handleCreateComplement}>
              Cadastrar Complemento
            </ButtonRound>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg md sm xs>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select value={type} onChange={handleType} label='Tipo' variant='outlined' fullWidth>
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='bar'>Bar</MenuItem>
                <MenuItem value='ingresso'>Ingresso</MenuItem>
                <MenuItem value='estacionamento'>Estacionamento</MenuItem>
                <MenuItem value='complemento'>Complemento</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel>Grupo</InputLabel>
              <Select value={group} onChange={handleGroup} label='Grupo' variant='outlined' fullWidth>
                {groupList.map((groupItem) => (
                  <MenuItem key={groupItem.id} value={groupItem.id}>
                    {groupItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant='outlined' size='small' fullWidth>
              <InputLabel>Situação</InputLabel>
              <Select value={status} onChange={handleStatus} label='Situação' variant='outlined' fullWidth>
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='1'>Ativo</MenuItem>
                <MenuItem value='0'>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              value={search}
              onChange={handleSearch}
              variant='outlined'
              label='Pesquisar'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item>
            <Button onClick={() => setGrid(!isGrid)} style={{ textTransform: 'none' }}>
              Modo de Visualização
              {isGrid ? <ListIcon /> : <GridIcon />}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} hidden={!isGrid}>
        <Grid container spacing={2}>
          {data.map((product) => (
            <CardProduct key={product.id} {...product} handleDelete={() => handleDelete(product)} />
          ))}
        </Grid>
      </Grid>

      <Grid item lg md sm xs hidden={isGrid}>
        <EaseGrid
          data={data}
          columns={columns}
          hasSearch={false}
          actionsRight={true}
          actions={[
            (rowData) => ({
              icon: () => (rowData.favorite ? <Favorite style={{ color: '#F50057' }} /> : <FavoriteBorder />),
              tooltip: 'Favoritar',
              onClick: async (event, rowData) => {
                try {
                  const favorite = rowData.favorite ? 0 : 1;
                  await Api.patch(`/product/updateFavorite/${rowData.id}`, {
                    type: rowData.type,
                    favorite,
                  });
                  const newData = [...data];
                  newData[rowData.tableData.id].favorite = favorite;
                  setData(newData);
                } catch (error) {
                  alert(error?.message ?? 'Ocorreu um erro ao favoritar');
                }
              },
              hidden: rowData.type === 'complement',
            }),
            {
              icon: () => <FlashOn />,
              tooltip: 'Edição rápida',
              onClick: (event, rowData) => {
                rowData.tableData.editing = 'update';
                forceUpdate();
              },
            },
            {
              icon: () => (
                <Button variant='outlined' color='primary' size='small'>
                  Editar
                </Button>
              ),
              tooltip: 'Editar',
              onClick: (event, rowData) => {
                handleEdit(rowData);
              },
            },
            {
              icon: () => (
                <Button variant='outlined' color='secondary' size='small'>
                  Excluir
                </Button>
              ),
              tooltip: 'Excluir',
              onClick: (event, rowData) => {
                handleDelete(rowData);
              },
            },
          ]}
          editable={{
            isEditHidden: (rowData) => true,
            onRowUpdate,
          }}
        />
      </Grid>
      {!isGrid && (<Grid item style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                <ButtonRound variant='contained' style={{height: 30, color: 'white', backgroundColor: 'red'}} onClick={disabelAll}>
                  Inativar Produtos
                </ButtonRound>
              </Grid>)}
    </Grid>
  );
};

export const Icon = () => {
  return <img src={productsIcon} alt='Ícone produtos' />;
};
export default Product;
