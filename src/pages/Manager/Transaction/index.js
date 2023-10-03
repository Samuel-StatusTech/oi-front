import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { Grid, Button, MenuItem, TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { format } from 'currency-formatter';

import EaseGrid from '../../../components/EaseGrid';
import { Between } from '../../../components/Input/DateTime';

import { formatDateTimeToDB } from '../../../utils/date';
import Api from '../../../api';

import MainCard from './Card';

import PaymentTypeColumn from './Columns/PaymentType';
import UserColumn from './Columns/User';
import ModalCancel from './Modal/cancelOrder';
import ModalDelete from './Modal/deleteOrder';
import ModalDetailsOrder from './Modal/detailsOrder';
import { Info } from '@material-ui/icons';
import ModalDiff from './Modal/diffOrders';
import useStyles from '../../../global/styles';




const Transaction = ({ event, user }) => {

  const styles = useStyles()

  const columns = [
    {
      title: '',
      render: (row) => (
        <>
          <Info
            variant='outlined'
            size='small'
            color='primary'
            style={{ cursor: 'pointer' }}
            onClick={handleDetailOrder(row)}
          ></Info>
        </>
      ),
    },
    { title: 'ID transação', field: 'id' },
    { title: 'Forma de Pagamento', field: 'payments', render: PaymentTypeColumn },
    { title: 'Data/Hora', field: 'created_at', type: 'datetime' },
    { title: 'Operador', field: 'user_id', render: UserColumn },
    {
      title: 'Valor',
      field: 'total_price',
      render: ({ total_price }) => format(total_price / 100, { code: 'BRL' }),
    },
    {
      title: 'Status',
      field: 'status',
      render: ({ status }) => (status === 'cancelamento' ? 'Cancelado' : 'Normal'),
    }
  ];

  if (user.role === 'master') {
    columns.push({
      title: 'Ações',
      render: (row) => (
        <>
          {row.status === 'cancelamento' ? (
            <Button variant='outlined' size='small' color='secondary' onClick={handleUncancelProduct(row)}>
              Desfazer
            </Button>
          ) : (
            <Button variant='outlined' size='small' color='secondary' onClick={handleCancelProduct(row)}>
              Cancelar
            </Button>
          )}
          <Button variant='outlined' size='small' color='secondary' onClick={handleDeleteProduct(row)}
            style={{ marginLeft: 5 }}
          >
            Excluir
          </Button>
        </>
      ),
    });
  } else {
    columns.push({
      title: 'Ações',
      render: (row) => (
        <>
          {row.status === 'cancelamento' ? (
            <Button variant='outlined' size='small' color='secondary' onClick={handleUncancelProduct(row)}>
              Desfazer
            </Button>
          ) : (
            <Button variant='outlined' size='small' color='secondary' onClick={handleCancelProduct(row)}>
              Cancelar
            </Button>
          )}
        </>
      ),
    });
  }

  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [data, setData] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);

  const [totalSell, setTotalSell] = useState(0);
  const [itensSell, setItensSell] = useState(0);
  const [itensCanceled, setItensCanceled] = useState(0);

  const [status, setStatus] = useState('todos');
  const [type, setType] = useState('todos');
  const [group, setGroup] = useState('todos');
  const [product, setProduct] = useState('todos');
  const [operator, setOperator] = useState('todos');
  const [paymentType, setPaymentType] = useState('todos');
  const [iniValue, onChangeIni] = useState(new Date().setHours(0, 0, 0, 0));
  const [endValue, onChangeEnd] = useState(new Date().setHours(23, 59, 59, 999));
  const [selectType, onSelectType] = useState(0);
  const [page, setPage] = useState(0);
  const [QRCode, setQRCode] = useState('');

  const [showCancel, setShowCancel] = useState(false);
  const [cancelData, setCancelData] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [showDetailsOrder, setShowDetailsOrder] = useState(false);
  const [detailsOrderData, setDetailsOrderData] = useState(0);
  const [detailsOrderDataId, setDetailsOrderDataId] = useState(0);


  const updateRow = (value, id) => {
    const newData = [...data];
    const index = data.findIndex((element) => element.id === id);
    newData[index] = value;
    setData(newData);
  };
  const deleteRow = (id) => {
    const index = data.findIndex((element) => element.id === id);
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };
  const handleCancelProduct =
    ({ id }) =>
      () => {
        setCancelData({ id: id, cancel: false });
        setShowCancel(true);
      };
  const handleUncancelProduct =
    ({ id }) =>
      () => {
        setCancelData({ id: id, cancel: true });
        setShowCancel(true);
      };
  const handleDeleteProduct =
    ({ id }) =>
      () => {
        setDeleteData({ id: id });
        setShowDelete(true);
      };
  const handleDetailOrder =
    ({ order_id, id }) =>
      () => {
        setDetailsOrderData(order_id);
        setDetailsOrderDataId(id);
        setShowDetailsOrder(true);
      };

  const parseData = () => {

    const dateIni = formatDateTimeToDB(iniValue);
    const dateEnd = formatDateTimeToDB(endValue);

    const statusURL = `status=${status}`;
    const typeURL = `&type=${type}`;
    const groupURL = group !== 'todos' && product === 'todos' ? `&group=${group}` : '';
    const productURL = product !== 'todos' ? `&product=${product}` : '';
    const operatorURL = operator !== 'todos' ? `&operator=${operator}` : '';
    const paymentTypeURL = paymentType !== 'todos' ? `&paymentType=${paymentType}` : '';
    const QRCodeURL = QRCode != '' ? `&qrcode=${`${QRCode}`.toUpperCase().trim()}` : '';
    // const pageURL = `&per_page=${query.pageSize}&page=${query.page + 1}`;
    const dateURL = selectType !== 1 ? `&date_ini=${dateIni}&date_end=${dateEnd}` : '';

    return {
      statusURL,
      typeURL,
      groupURL,
      productURL,
      operatorURL,
      paymentTypeURL,
      QRCodeURL,
      dateURL
    }

  }

  const loadData = async (moreItens = false, pageination = page) => {
    setLoading(true);
    try {

      const p = parseData()

      const url = `/order/getList/${event}?${p.statusURL}${p.typeURL}${p.groupURL}${p.productURL}${p.operatorURL}${p.paymentTypeURL}${p.dateURL}${p.QRCodeURL}&per_page=1000&page=${pageination}`;

      const resp = await Api.get(url);

      //setTotalSell(resp.data.totalSell);
      //setItensSell(resp.data.itensSell);
      //setItensCanceled(resp.data.itensCanceled);
      if (moreItens)
        setData([...data, ...resp.data.orders]);
      else
        setData(resp.data.orders);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      if (data.success) {
        setGroupList(data.groups);
      } else {
        alert('Erro ao buscar a lista de grupos');
      }
    });

    Api.get('/product/getFilterList').then(({ data }) => {
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
      loadData();
    } else {
      console.log('Sem evento');
    }
  }, [event]);

  // See for changes on any input, to update the search
  useEffect(() => {
    if (selectType != 2) {
      handleSearch();
    }

  }, [selectType]);

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
    loadData();
  };

  const getDetails = (tId) => {

    return new Promise(async resolve => {
      const req = await Api.get(`/order/getDetailsOrder/${tId}?event=${event}`)
      resolve(req.data.orders)
    })
  }

  const generateUrl = (qr = null) => {
    const filters = parseData()

    return `/order/getList/${event}?`
      + `${filters.statusURL}`
      + `${filters.typeURL}`
      + `${filters.groupURL}`
      + `${filters.productURL}`
      + `${filters.operatorURL}`
      + `${filters.paymentTypeURL}`
      + `${qr ? `&qrcode=${qr}` : filters.QRCodeURL}`
      + `&per_page=1000000`
      + `&page=${0}`
  }

  const findByQR = async (code) => {
    return await Api.get(generateUrl(code))
  }

  const filterData = arr => {
    let newArr = []

    arr.forEach(item => {
      if (newArr.findIndex(i => Number(i.id) === Number(item.id)) < 0) {
        newArr.push(item)
      }
    })

    return newArr
  }

  const checkDivgs = async () => {

    const allTransactions = await (await Api.get(generateUrl())).data.orders
    const empties = allTransactions.filter(t => t.payments.length < 1)

    if (empties.length > 0) {
      let errorsValues = []

      await new Promise(async resolve => {

        for (let k = 0; k < empties.length; k++) {
          const transaction = empties[k]
          errorsValues.push(transaction)

          await new Promise(finishTransaction => {

            // check duplicate qr_code
            getDetails(transaction.id).then(async details => {

              await ((
                () => new Promise(async finishProduct => {
                  let result = []

                  for (let i = 0; i < details.length; i++) {
                    const pSold = details[i]
                    const { qr_code } = pSold

                    if (qr_code) {
                      await findByQR(qr_code).then(
                        ({ data }) => {
                          const containingCode = data.orders

                          if (i === details.length - 1) {
                            finishProduct([...result, ...containingCode])
                          } else {
                            result = [...result, ...containingCode]
                          }
                        })
                    }
                    else if (i === details.length - 1) finishProduct(result)

                  }
                })
                  .then(resData => {

                    if (resData) {
                      errorsValues = filterData([...errorsValues, ...resData])
                      const resumeErrors = filterData([...errorsValues, ...resData])

                      finishTransaction(resumeErrors)
                    }
                  })
              )())
            })
          }).then((resumeErrors) => {
            if (k === empties.length - 1) resolve(resumeErrors)
          })


        }

      }).then((resumedData) => {
        setCheckLoading(false)

        if (resumedData.length > 0) {
          setData(resumedData)
          alert(`Houve ${resumedData.length} divergência${resumedData.length > 1 ? 's' : ''}`)
        }
        else alert("Não houve divergências")
      })
    }
    else {
      setCheckLoading(false)
      alert("Não houve pagamentos em branco")
    }
  }


  const renderLoadingOverlay = () => {

    const el = (
      <div
        id="loadingOverlayTmp"
        className={styles.loadingOverlay}
        style={{ display: checkLoading ? 'grid' : 'none' }}
      >
        <CircularProgress />
      </div>
    )

    return createPortal(el, document.body)
  }


  return (
    <>
      {renderLoadingOverlay()}
      <Grid container direction='column' spacing={2}>
        <ModalCancel show={showCancel} onClose={() => setShowCancel(false)} data={cancelData} updateRow={updateRow} event={event} />
        <ModalDelete show={showDelete} onClose={() => setShowDelete(false)} data={deleteData} updateRow={deleteRow} event={event} />
        <ModalDetailsOrder
          event={event}
          show={showDetailsOrder}
          onClose={() => setShowDetailsOrder(false)}
          order_id={detailsOrderData}
          detailsOrderDataId={detailsOrderDataId}
        />
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <TextField
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label='Status'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='validado'>Normal</MenuItem>
                <MenuItem value='cancelamento'>Cancelado</MenuItem>
              </TextField>
            </Grid>
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <TextField
                value={type}
                onChange={(e) => {
                  if (e.target.value !== 'todos') {
                    const g = groupList.find((g) => g.id === group);

                    if (g && g.type !== e.target.value) {
                      setGroup('todos');
                      setProduct('todos');
                    }
                  }
                  setType(e.target.value);
                }}
                label='Tipo'
                variant='outlined'
                size='small'
                fullWidth
                select
              >
                <MenuItem value='todos'>Todos</MenuItem>
                <MenuItem value='bar'>Bar</MenuItem>
                <MenuItem value='ingresso'>Ingresso</MenuItem>
                <MenuItem value='estacionamento'>Estacionamento</MenuItem>
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
                {groupList
                  .filter((group) => type === 'todos' || type === group.type)
                  .map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <Autocomplete
                id='produtos'
                defaultValue={{ id: 'todos', title: 'Todos' }}
                getOptionSelected={(option, value) => option?.id === value?.id}
                options={[
                  { id: 'todos', title: 'Todos' },
                  ...productList.map((product) => ({ id: product.id, title: product.name })),
                ]}
                onChange={(event, newValue) => {
                  setProduct(newValue?.id);
                }}
                size='small'
                getOptionLabel={(option) => option?.title}
                renderInput={(params) => <TextField {...params} label='Produtos' variant='outlined' />}
                fullWidth
              />
            </Grid>
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <Autocomplete
                id='operator'
                defaultValue={{ id: 'todos', title: 'Todos' }}
                getOptionSelected={(option, value) => option?.id === value?.id}
                options={[
                  { id: 'todos', title: 'Todos' },
                  ...operatorList.map((operator) => ({ id: operator.id, title: operator.name })),
                ]}
                onChange={(event, newValue) => {
                  setOperator(newValue?.id);
                }}
                size='small'
                getOptionLabel={(option) => option.title}
                renderInput={(params) => <TextField {...params} label='Operador' variant='outlined' />}
                fullWidth
              />
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
                <MenuItem value='pix'>Pix</MenuItem>
                <MenuItem value='multiplus'>Multiplus</MenuItem>
              </TextField>
            </Grid>
            <Grid item lg={1} md={1} sm={12} xs={12}>
              <Button onClick={() => {
                setCheckLoading(true)
                checkDivgs()
              }} style={{ color: '#0097FF', border: '1px solid #0097FF' }}>
                Divergência
              </Button>
            </Grid>
            <Grid item lg={2} md={4} sm={12} xs={12}>
              <TextField
                value={QRCode}
                onChange={(e) => setQRCode(e.target.value)}
                variant='outlined'
                label='QR Code'
                fullWidth
                size='small'
              />
            </Grid>
            <Grid item lg={9} md={7} sm={12} xs={12}>
              <Between
                iniValue={iniValue}
                onChangeIni={onChangeIni}
                endValue={endValue}
                onChangeEnd={onChangeEnd}
                onSelectType={onSelectType}
                selected={selectType}
                onSearch={handleSearch}
                size='small'
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <EaseGrid
            config={{
              rowStyle: (row) => ({
                backgroundColor: row.status === 'cancelamento' ? '#fff0f0' : 'white',
              }),
            }}
            /*paging
            pageSize={data.length = 0 ? 10 : (data.length < 300 ? data.length : 300)}
            pageSizeOptions={[10, 20, 50, 100, 300, 500]}*/
            title='Transações'
            columns={columns}
            data={data}
            loading={loading}
          />
        </Grid>
        {!loading &&
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 20 }}>
              <Button
                variant='outlined'
                color='default'
                onClick={() => {
                  loadData(true, page + 1)
                  setPage(page + 1)
                }}
                style={{ padding: '8px', backgroundColor: 'white', width: 150, borderRadius: 30 }}
              >
                Mostrar mais
              </Button>
            </div>
          </Grid>
        }
        {/*<Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2} justify='flex-end'>
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard type={1} title='Total vendas:' value={format(totalSell / 100, { code: 'BRL' })} />
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard type={2} title='Itens vendidos:' value={itensSell} />
          </Grid>
          <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
            <MainCard type={3} title='Itens cancelados:' value={itensCanceled} />
          </Grid>
        </Grid>
        </Grid>*/}
      </Grid>
    </>
  );
};

const mapStateToProps = ({ event, user }) => ({ event, user });

export default connect(mapStateToProps)(Transaction);
