import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, MenuItem, TextField } from '@material-ui/core';
import Api from '../../../../api';
import EaseGrid from '../../../../components/EaseGrid';
import { format } from 'currency-formatter';
import { Between } from '../../../../components/Input/Date';
import { formatDateToDB } from '../../../../utils/date';

const Transaction = ({ event }) => {
  console.log('carregando componente', event);
  const tableRef = useRef(null);
  const columns = [
    { title: 'ID transação', field: 'id' },
    { title: 'Nº do cartão', field: 'card_number' },
    { title: 'Data/Hora', field: 'created_at', type: 'datetime' },
    { title: 'Tipo', field: 'type' },
    { title: 'PDV', field: 'pdv_name' },
    {
      title: 'Valor',
      field: 'value',
      render: ({ value }) => format(value / 100, { code: 'BRL' }),
    },
    { title: 'Status', field: 'status' },
    // { title: 'Ações', render: row => (
    //     <Button variant='contained' size='small' color='primary' onClick={handleListProducts(row)}>
    //         Editar
    //     </Button>
    // ) }
  ];

  // Listas dos filtros
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [pdvList, setPDVList] = useState([]);

  // Dados dos filtros
  const [type, setType] = useState('todos');
  const [group, setGroup] = useState('todos');
  const [paymentType, setPaymentType] = useState('todos');
  const [product, setProduct] = useState('todos');
  const [pdv, setPDV] = useState('todos');
  const [iniValue, onChangeIni] = useState(new Date());
  const [endValue, onChangeEnd] = useState(new Date());
  const [selectType, setSelectType] = useState(1);
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

    Api.get('/pdv/getList').then(({ data }) => {
      if (data.success) {
        setPDVList(data.pdvs);
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
      tableRef.current.onQueryChange({ status: type, paymentType });
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
      const dateIni = formatDateToDB(iniValue);
      const dateEnd = formatDateToDB(endValue);

      const typeURL = type !== 'todos' ? `&type=${type}` : '';
      const groupURL = group !== 'todos' && product === 'todos' ? `&group=${group}` : '';
      const productURL = product !== 'todos' ? `&product=${product}` : '';
      const pdvURL = pdv !== 'todos' ? `&pdv=${pdv}` : '';
      const paymentTypeURL = paymentType !== 'todos' ? `&paymentType=${paymentType}` : '';
      const pageURL = `&per_page=${query.pageSize}&page=${query.page + 1}`;
      const dateURL = `&date_ini=${dateIni}&date_end=${dateEnd}`;

      const url = `/cashless/getTransitions/${event}?${typeURL}${groupURL}${productURL}${pdvURL}${paymentTypeURL}${dateURL}${pageURL}`;

      Api.get(url).then(({ data }) => {
        console.log(data);

        if (data.success) {
          console.log({
            data: data.cashless,
            page: data.page - 1,
            totalCount: data.count,
          });
          resolve({
            data: data.cashless,
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
    <Grid container direction='column' spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={pdv}
              onChange={(e) => setPDV(e.target.value)}
              label='Operador'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todos</MenuItem>
              {pdvList.map((pdv) => (
                <MenuItem key={pdv.id} value={pdv.id}>
                  {pdv.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              label='Grupo'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todos</MenuItem>
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
              label='Produto'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todos</MenuItem>
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
              value={type}
              onChange={(e) => setType(e.target.value)}
              label='Status'
              variant='outlined'
              size='small'
              fullWidth
              select
            >
              <MenuItem value='todos'>Todas</MenuItem>
              <MenuItem value='ativacao'>Ativação</MenuItem>
              <MenuItem value='compra'>Compra</MenuItem>
              <MenuItem value='recarga'>Recarga</MenuItem>
              <MenuItem value='saque'>Devolução</MenuItem>
            </TextField>
          </Grid>
          <Grid item lg={2} md={4} sm={12} xs={12}>
            <TextField
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              label='Forma de pagamento'
              variant='outlined'
              size='small'
              select
              fullWidth
            >
              <MenuItem value='todos'>Todos</MenuItem>
              <MenuItem value='dinheiro'>Dinheiro</MenuItem>
              <MenuItem value='debito'>Debito</MenuItem>
              <MenuItem value='credito'>Credito</MenuItem>
              <MenuItem value='cashless'>Cashless</MenuItem>
            </TextField>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Between
              iniValue={iniValue}
              onChangeIni={onChangeIni}
              endValue={endValue}
              onChangeEnd={onChangeEnd}
              onSelectType={setSelectType}
              selected={selectType}
              size='small'
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button variant='outlined' color='primary' onClick={handleSearch}>
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid title='Consulta Cashless' columns={columns} data={handleQuery} tableRef={tableRef} />
      </Grid>
    </Grid>
  );
};

export default Transaction;
