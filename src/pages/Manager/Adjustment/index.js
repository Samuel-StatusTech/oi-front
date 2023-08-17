import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import Api from '../../../api';
import EaseGrid from '../../../components/EaseGrid';

import PaymentTypeColumn from '../Transaction/Columns/PaymentType';
import UserColumn from '../Transaction/Columns/User';
import { Between } from '../../../components/Input/Date';

const Adjustment = ({ event }) => {
  const tableRef = useRef(null);
  const history = useHistory();
  const [operatorList, setOperatorList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [status, setStatus] = useState('validado');
  const [operator, setOperator] = useState('todos');
  const [group, setGroup] = useState('');
  const [product, setProduct] = useState('todos');
  const [paymentType, setPaymentType] = useState('todos');
  const [iniValue, onChangeIni] = useState(new Date());
  const [endValue, onChangeEnd] = useState(new Date());

  const [rowsSelect, setRows] = useState([]);

  const columns = [
    { title: 'ID transação', field: 'id' },
    { title: 'Tipo', field: 'payments', render: PaymentTypeColumn },
    { title: 'Data/Hora', field: 'created_at', type: 'datetime' },
    { title: 'Operador', field: 'user_id', render: UserColumn },
    {
      title: 'Valor',
      field: 'total_price',
      type: 'currency',
      currencySetting: { locale: 'pt-BR', currencyCode: 'BRL' },
      headerStyle: { textAlign: 'right' },
    },
    { title: 'Status', field: 'status' },
    {
      title: 'Ações',
      render: (row) => (
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={handleListProducts(row)}
            >
              Editar
            </Button>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleListProducts = ({ id, ...data }) => () => {
    history.push(`/dashboard/adjustment/${id}`, data);
  };

  const handleCancel = async () => {
    try {
      const order_list = rowsSelect.map((row) => row.id);

      console.log(order_list);

      await Api.delete(`/order/cancelOrder`, {
        data: { order_list },
      });

      handleSearch();
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

  const onSelectionChange = (rows) => {
    setRows(rows);
  };

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      if (data.success) {
        if (data.groups.length > 0) {
          setGroup(data.groups[0].id);
        }

        setGroupList(data.groups);
      } else {
        alert('Erro ao buscar a lista de grupos');
      }
    });

    Api.get('/product/getFilterList').then(({ data }) => {
      console.log(data);
      if (data.success) {
        setProductList(data.products);
      } else {
        alert('Erro ao buscar a lista de produtos');
      }
    });

    Api.get('/operator/getList').then(({ data }) => {
      if (data.success) {
        setOperatorList(data.operators);
      } else {
        alert('Erro ao buscar a lista de produtos');
      }
    });

    if (event) {
      if (tableRef.current) {
        tableRef.current.onQueryChange();
      } else {
        console.log('Sem referencia');
      }
    } else {
      console.log('Sem evento');
    }
  }, [event]);

  const handleSearch = () => {
    if (tableRef.current) {
      console.log('Ola');
      tableRef.current.onQueryChange({ status, paymentType });
    } else {
      console.log('Sem referencia');
    }
  };

  const handleQuery = (query) => {
    return new Promise((resolve, reject) => {
      console.log('query =>', query, event);
      if (!event) {
        resolve({
          data: [],
          page: 0,
          totalCount: 0,
        });
        return;
      }

      Api.get(
        `/order/getList/${event}?type=${status}&paymentType=${paymentType}&per_page=${
          query.pageSize
        }&page=${query.page + 1}`
      ).then(({ data }) => {
        console.log(data);

        if (data.success) {
          console.log({
            data: data.order,
            page: data.page - 1,
            totalCount: data.count,
          });
          resolve({
            data: data.order ?? [],
            page: data.page - 1,
            totalCount: data.count,
          });
        } else {
          reject();
        }
      });
    });
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="validado">Validado</MenuItem>
                <MenuItem value="cancelamento">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Grupo</InputLabel>
              <Select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                label="Grupo"
                variant="outlined"
                fullWidth
              >
                {groupList.map((group) => (
                  <MenuItem value={group.id}>{group.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Produto</InputLabel>
              <Select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                label="Produto"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="todos">Todos</MenuItem>
                {productList
                  .filter((product) => {
                    if (group === 'todos') return true;
                    if (group === product.group_id) return true;
                    return false;
                  })
                  .map((product, index) => (
                    <MenuItem key={index} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Operador</InputLabel>
              <Select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                label="Operador"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="todos">Todos</MenuItem>
                {operatorList.map((operator) => (
                  <MenuItem value={operator.id}>{operator.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <FormControl size="small" variant="outlined" fullWidth>
              <InputLabel>Forma de pagamento</InputLabel>
              <Select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                label="Forma de pagamento"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                <MenuItem value="debito">Debito</MenuItem>
                <MenuItem value="credito">Credito</MenuItem>
                {/* <MenuItem value='cashless'>Cashless</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Between
              iniValue={iniValue}
              onChangeIni={onChangeIni}
              endValue={endValue}
              onChangeEnd={onChangeEnd}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item lg={10} md={4} sm={12} xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSearch}
                  size="small"
                >
                  Filtrar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  size="small"
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          title="Ajustes"
          columns={columns}
          data={handleQuery}
          tableRef={tableRef}
          config={{
            pageConfig: {
              selection: true,
            },
          }}
          onSelectionChange={onSelectionChange}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Adjustment);
