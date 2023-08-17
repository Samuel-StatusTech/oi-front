import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Grid, MenuItem, TextField, Button, FormControl } from '@material-ui/core';
import Api from '../../api';
import EaseGrid from '../../components/EaseGrid';
import { format } from 'currency-formatter';

import Adjust from './Adjust';

import { exportData } from './xls';
import ButtonRound from '../../components/ButtonRound';
import warehouseIcon from '../../assets/icons/ic_estoques.svg';

const Warehouse = ({ event }) => {
  const [type, setType] = useState('todos');
  const [group, setGroup] = useState('todos');
  const tableRef = useRef(null);

  const [groupList, setGroupList] = useState([]);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [status, setStatus] = useState('1');
  const columns = [
    { title: 'Item', field: 'product_name' },
    {
      title: 'Saldo em estoque',
      field: 'quantity',
      render: ({ warehouse_type, quantity }) => (warehouse_type === 'controled' ? quantity : 'Não Controlado'),
    },
    {
      title: 'Preço de venda',
      field: 'product_price_sell',
      render: ({ product_price_sell }) => format(product_price_sell / 100, { code: 'BRL' }),
    },
    {
      title: 'Custo Unit.',
      field: 'product_price_cost',
      render: ({ product_price_cost }) => format(product_price_cost / 100, { code: 'BRL' }),
    },
    {
      title: 'Custo em estoque',
      field: 'total_cost',
      render: ({ product_price_cost, quantity }) => format((product_price_cost / 100) * quantity, { code: 'BRL' }),
    },
    {
      title: 'Tipo',
      field: 'warehouse_type',
      render: (row) => (
        <TextField
          value={row.warehouse_type}
          onChange={(e) => handleChangeStatus(row.product_id, e.target.value)}
          label='Tipo'
          variant='outlined'
          size='small'
          fullWidth
          select
        >
          <MenuItem value='controled'>Controlado</MenuItem>
          <MenuItem value='notControled'>Não controlado</MenuItem>
          <MenuItem value='soldOut'>Esgotado</MenuItem>
        </TextField>
      ),
    },
    {
      title: '-----',
      field: 'adjust',
      render: (row) => (
        <Button
          variant='outlined'
          color='primary'
          size='small'
          disabled={row.warehouse_type !== 'controled'}
          onClick={handleOpen(row)}
        >
          Ajustar
        </Button>
      ),
    },
  ];

  const handleOpen = (product) => () => {
    if (product.warehouse_type !== 'controled') return;
    setProduct(product);
    setOpen(!open);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
    handleSearch();
  };
  useEffect(() => {
    Api.get(`/group/getList`).then(({ data }) => {
      const { success, groups } = data;

      if (success) {
        setGroupList(groups);
      } else {
        alert('Erro ao carregar os grupos');
      }
    });
  }, []);

  useEffect(() => {
    if (event) {
      if (tableRef.current) {
        tableRef.current.onQueryChange({ change: false });
      } else {
        console.log('Sem referencia');
      }
    } else {
      console.log('Sem evento');
    }
  }, [event]);

  useEffect(() => {
    let groupData = groupList.find((groupItem) => groupItem.id === group);

    if (group === 'todos') {
    } else if (groupList.length > 0 && (type !== 'todos' || type !== 'complemento') && groupData.type !== type) {
      groupData = groupList.find((groupItem) => groupItem.type === type);

      if (groupData) {
        setGroup(groupData.id);
      } else {
        setGroup('todos');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, groupList]);

  const handleToggle = (id) => {
    if (tableRef.current) {
      const data = tableRef.current.dataManager.data;
      const newData = data.map((product) => {
        if (product.product_id === id) {
          return {
            ...product,
            block_warehouse: !product.block_warehouse,
          };
        }

        return product;
      });

      tableRef.current.onQueryChange({ data: newData, change: true });
    } else {
      console.log('Sem referencia');
    }
  };

  const handleChangeEdit = (id, quantity) => {
    if (tableRef.current) {
      const data = tableRef.current.dataManager.data;
      const newData = data.map((product) => {
        if (product.product_id === id) {
          return {
            ...product,
            quantity,
          };
        }

        return product;
      });

      tableRef.current.onQueryChange({ data: newData, change: true });
    } else {
      console.log('Sem referencia');
    }
  };
  const handleChangeStatus = async (id, warehouseType) => {
    await Api.patch(`/warehouse/${id}/changeWarehouseType`, {
      warehouseType: warehouseType,
    });
    tableRef.current.onQueryChange({ change: false });
  };

  const handleQuery = (query) => {
    return new Promise((resolve, reject) => {
      if (!event) {
        resolve({
          data: [],
          page: 0,
          totalCount: 0,
        });
        return;
      }
      if (query.change) {
        resolve({
          data: query.data,
          page: query.page,
          totalCount: query.totalCount,
        });
        return;
      }

      Api.get(
        `/warehouse/getList?type=${type}&group=${group}${status !== 'todos' ? `&status=${status}` : ''}&per_page=${
          query.pageSize
        }&page=${query.page + 1}`
      ).then(({ data }) => {
        setList(data.warehouse);
        if (data.success) {
          resolve({
            data: data.warehouse.filter((prod) => prod.product_name.toLowerCase().includes(query.search.toLowerCase())),
            page: data.page - 1,
            totalCount: data.totalCount,
          });
        } else {
          reject();
        }
      });
    });
  };

  const handleExportXLS = () => {
    // const type = {'bar': 'Bar', 'ingresso': 'Ingresso', 'estacionamento': 'Estacionamento', 'combo': 'Combo', 'complement': 'Complemento'};

    exportData(
      '',
      list.map((item) => ({
        product_name: item.product_name,
        group_name: item.group_name,
        type: item.type,
        quantity: item.quantity,
        unit: format(item.product_price_cost, { code: 'BRL' }),
        total: format(parseInt(item.quantity, 10) * parseInt(item.product_price_cost, 10), { code: 'BRL' }),
      }))
    );
  };

  const handleType = (e) => {
    setType(e.target.value);
    setGroup('todos');
    handleSearch();
  };

  const handleGroup = (e) => {
    setGroup(e.target.value);
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      if (tableRef.current) {
        tableRef.current.onQueryChange({ change: false });
      } else {
        handleQuery();
        console.log('Sem referencia');
      }
    } catch (e) {
      console.log('Erro');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container>
          <Grid item>
            <ButtonRound variant='contained' color='primary' onClick={handleExportXLS}>
              Exportar Planilha
            </ButtonRound>
          </Grid>
        </Grid>
      </Grid>
      <Adjust {...product} open={open} onClose={() => setOpen(false)} handleChangeEdit={handleChangeEdit} />
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <TextField value={type} onChange={handleType} label='Tipo' variant='outlined' size='small' fullWidth select>
              <MenuItem value='todos'>Todos</MenuItem>
              <MenuItem value='bar'>Bar</MenuItem>
              <MenuItem value='ingresso'>Ingresso</MenuItem>
              <MenuItem value='estacionamento'>Estacionamento</MenuItem>
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              value={group}
              onChange={handleGroup}
              label='Grupo'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todos</MenuItem>
              {groupList
                .filter((group) => {
                  if (type === 'todos') return true;
                  if (group.type === type) return true;
                  return false;
                })
                .map((groupItem) => (
                  <MenuItem value={groupItem.id}>{groupItem.name}</MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              value={status}
              onChange={handleStatus}
              label='Status'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todos</MenuItem>
              <MenuItem value='1'>Ativo</MenuItem>
              <MenuItem value='0'>Inativo</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          config={{
            rowStyle: (row) => ({
              backgroundColor: row.quantity <= 0 ? '#fff0f0' : 'white',
            }),
          }}
          title='Dados do Estoque'
          tableRef={tableRef}
          columns={columns}
          data={handleQuery}
          pageSize={15}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export const Icon = () => {
  return <img src={warehouseIcon} alt='Ícone estoques' />;
};
export default connect(mapStateToProps)(Warehouse);
