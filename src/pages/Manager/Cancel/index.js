import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, MenuItem, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { format } from 'currency-formatter';

import EaseGrid from '../../../components/EaseGrid';
import { Between } from '../../../components/Input/Date';

import Api from '../../../api';
import { formatDateToDB } from '../../../utils/date';

import MainCard from './Card';

import PaymentTypeColumn from './Columns/PaymentType';
import UserColumn from './Columns/User';

const Cancel = ({ event }) => {
  const tableRef = useRef(null);
  const history = useHistory();
  const columns = [
    { title: 'ID transação', field: 'id' },
    { title: 'Tipo', field: 'payments', render: PaymentTypeColumn },
    { title: 'Data/Hora', field: 'created_at', type: 'datetime' },
    { title: 'Operador', field: 'user_id', render: UserColumn },
    {
      title: 'Valor',
      field: 'total_price',
      render: ({ total_price }) => format(total_price / 100, { code: 'BRL' }),
    },
    { title: 'Cancelado por', field: 'canceled_by' },
    { title: '2ª via', field: 'has_duplicate' },
    {
      title: 'Ações',
      render: (row) => (
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={handleListProducts(row)}
        >
          Editar
        </Button>
      ),
    },
  ];
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);

  const [totalSell, setTotalSell] = useState(0);
  const [itensSell, setItensSell] = useState(0);
  const [itensCanceled, setItensCanceled] = useState(0);

  const [status, setStatus] = useState('cancelamento');
  const [group, setGroup] = useState('todos');
  const [product, setProduct] = useState('todos');
  const [operator, setOperator] = useState('todos');
  const [paymentType, setPaymentType] = useState('todos');
  const [iniValue, onChangeIni] = useState(new Date());
  const [endValue, onChangeEnd] = useState(new Date());

  const handleListProducts = ({ id, products, updated_at }) => () => {
    history.push(`/dashboard/cancel/${id}`, {
      products,
      updated_at,
    });
  };

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      console.log(data);
      if (data.success) {
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

  useEffect(() => {
    if (group !== 'todos' && product !== 'todos') {
      const productData = productList.find((prod) => prod.id === product);

      if (productData.group_id !== group) {
        const newProduct = productList.find((prod) => prod.group_id === group);

        if (newProduct) {
          setProduct(newProduct.id);
        } else {
          setProduct('todos');
        }
      }
    }
  }, [group, product, productList]);

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

      console.log('query =>', query);

      // if (query.data) {
      //     resolve({
      //         data: query.data,
      //         page: query.page,
      //         totalCount: query.totalCount
      //     })
      //     return;
      // }

      const dateIni = formatDateToDB(iniValue);
      const dateEnd = formatDateToDB(endValue);

      const typeURL = `type=${status}`;
      const groupURL =
        group !== 'todos' && product === 'todos' ? `&group=${group}` : '';
      const productURL = product !== 'todos' ? `&product=${product}` : '';
      const operatorURL = operator !== 'todos' ? `&operator=${operator}` : '';
      const paymentTypeURL =
        paymentType !== 'todos' ? `&paymentType=${paymentType}` : '';
      const pageURL = `&per_page=${query.pageSize}&page=${query.page + 1}`;
      const dateURL = `&date_ini=${dateIni}&date_end=${dateEnd}`;

      const url = `/order/getList/${event}?${typeURL}${groupURL}${productURL}${operatorURL}${paymentTypeURL}${dateURL}${pageURL}`;

      Api.get(url).then(({ data }) => {
        console.log(data);

        setTotalSell(data.totalSell);
        setItensSell(data.itensSell);
        setItensCanceled(data.itensCanceled);

        if (data.success) {
          console.log({
            data: data.orders,
            page: data.page - 1,
            totalCount: data.count,
          });
          resolve({
            data: data.orders,
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
            <TextField
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              <MenuItem value="validado">Validado</MenuItem>
              <MenuItem value="cancelamento">Cancelado</MenuItem>
            </TextField>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              label="Operador"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              <MenuItem value="todos">Todos</MenuItem>
              {operatorList.map((operator) => (
                <MenuItem key={operator.id} value={operator.id}>
                  {operator.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              label="Grupo"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              <MenuItem value="todos">Todos</MenuItem>
              {groupList.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              label="Produto"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              <MenuItem value="todos">Todos</MenuItem>
              {productList
                .filter((product) => {
                  if (group === 'todos') return true;
                  if (group === product.group_id) return true;
                  return false;
                })
                .map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              label="Forma de pagamento"
              variant="outlined"
              size="small"
              select
              fullWidth
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="dinheiro">Dinheiro</MenuItem>
              <MenuItem value="debito">Debito</MenuItem>
              <MenuItem value="credito">Credito</MenuItem>
              {/* <MenuItem value='cashless'>Cashless</MenuItem> */}
            </TextField>
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
          <Grid item>
            <Button variant="outlined" color="primary" onClick={handleSearch}>
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          title="Cancelamentos"
          columns={columns}
          data={handleQuery}
          tableRef={tableRef}
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2} justify="flex-end">
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard
              type={1}
              title="Total vendas:"
              value={format(totalSell / 100, { code: 'BRL' })}
            />
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard type={2} title="Itens vendidos:" value={itensSell} />
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard
              type={3}
              title="Itens cancelados:"
              value={itensCanceled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Cancel);
