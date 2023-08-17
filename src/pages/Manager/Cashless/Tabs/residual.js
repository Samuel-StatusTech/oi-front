import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField, Card, CardContent, Button } from '@material-ui/core';
import { format } from 'currency-formatter';
import Api from '../../../../api';
import EaseGrid from '../../../../components/EaseGrid';

import CardDefault from '../Card';
import CardPie from '../Card/Pie';
import CardBar from '../Card/Bar';
import CardMacro from '../Card/Macro';

import fallProductsIcon from '../../../../assets/icons/ic_baixa-produtos.svg';
import residualIcon from '../../../../assets/icons/ic_baixa-produtos2.svg';
import settingsIcon from '../../../../assets/icons/ic_ajustes.svg';
import balanceTotalIcon from '../../../../assets/icons/ic_total-receita.svg';

export default ({ event }) => {
  const tableRef = useRef(null);
  const [card, setCard] = useState('');
  const [cpf, setCpf] = useState('');
  const [fone, setFone] = useState('');

  const [totalReceipt, setTotalReceipt] = useState(0);
  const [totalBuy, setTotalBuy] = useState(0);
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [count, setCount] = useState(0);
  const [totalInserted, setTotalInserted] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalTaxActive, setTotalTaxActive] = useState(0);
  const [totalTaxCashback, setTotalTaxCashback] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  const columns = [
    { title: 'Nº do cartão', field: 'card_number' },
    { title: 'CPF', field: 'cpf' },
    { title: 'Telefone', field: 'fone' },
    {
      title: 'Saldo residual',
      field: 'balance',
      render: ({ balance }) => format(balance / 100, { code: 'BRL' }),
    },
    {
      title: 'Taxa de ativação',
      field: 'active',
      render: ({ active }) => format(active / 100, { code: 'BRL' }),
    },
    {
      title: 'Dinheiro',
      field: 'money',
      render: ({ money }) => format(money / 100, { code: 'BRL' }),
    },
    {
      title: 'Débito',
      field: 'debit',
      render: ({ debit }) => format(debit / 100, { code: 'BRL' }),
    },
    {
      title: 'Crédito',
      field: 'credit',
      render: ({ credit }) => format(credit / 100, { code: 'BRL' }),
    },
    {
      title: 'Ação',
      render: (row) => (
        <Button variant='outlined' size='small' color='secondary' onClick={handleWithdraw(row)}>
          Devolver
        </Button>
      ),
    },
  ];

  useEffect(() => {
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

  const handleWithdraw = (row) => () => {
    console.log(row);
  };

  const handleSearch = () => {
    if (tableRef.current) {
      console.log('Ola');
      tableRef.current.onQueryChange();
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
        `/cashless/getResidual/${event}?per_page=${query.pageSize}&page=${
          query.page + 1
        }&card_number=${card}&cpf=${cpf}&fone=${fone}`
      ).then(({ data }) => {
        console.log(data);

        if (data.success) {
          const { overview } = data;

          setTotalReceipt(overview.total_receipt);
          setTotalBuy(overview.total_buy);
          setTotalAdjustment(overview.total_adjustment);
          setBalance(overview.balance);
          setCount(overview.count);
          setTotalInserted(overview.total_inserted);
          setTotalWithdraw(overview.total_withdraw);
          setTotalTaxActive(overview.total_tax_active);
          setTotalTaxCashback(overview.total_tax_cashback);
          setTotalTax(overview.total_tax);

          resolve({
            data: data.payload,
            page: data.page - 1,
            totalCount: overview.count,
          });
        } else {
          reject();
        }
      });
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item xl={3} lg={6} md={6} sm={12} xs={12}>
            <CardDefault
              title='Total Receita'
              content={format(totalReceipt / 100, { code: 'BRL' })}
              icon={<img src={balanceTotalIcon} alt='Ícone total receita' />}
              isMain
            />
          </Grid>
          <Grid item xl={3} lg={6} md={6} sm={12} xs={12}>
            <CardDefault
              title='Baixa de produtos'
              content={format(totalBuy / 100, { code: 'BRL' })}
              icon={<img src={fallProductsIcon} alt='Ícone baixa de produtos' />}
            />
          </Grid>
          <Grid item xl={3} lg={6} md={6} sm={12} xs={12}>
            <CardDefault
              title='Ajustes'
              content={format(totalAdjustment / 100, { code: 'BRL' })}
              icon={<img src={settingsIcon} alt='Ícone ajustes' />}
            />
          </Grid>
          <Grid item xl={3} lg={6} md={6} sm={12} xs={12}>
            <CardDefault
              title='Saldo residual'
              content={format(balance / 100, { code: 'BRL' })}
              icon={<img src={residualIcon} alt='Ícone saldo residual' />}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CardMacro
              count={count}
              totalInserted={totalInserted}
              totalWithdraw={totalWithdraw}
              totalTaxActive={totalTaxActive}
              totalTaxCashback={totalTaxCashback}
              totalTax={totalTax}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={12} xs={12}>
            <CardPie topList={[{ name: 'Produto A' }, { name: 'Produto B' }, { name: 'Produto C' }]} />
          </Grid>
          <Grid item lg={3} md={6} sm={12} xs={12}>
            <CardBar />
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  size='small'
                  label='Nº do cartão'
                  variant='outlined'
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  onBlur={handleSearch}
                />
              </Grid>
              <Grid item>
                <TextField
                  size='small'
                  label='CPF'
                  variant='outlined'
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  onBlur={handleSearch}
                />
              </Grid>
              <Grid item>
                <TextField
                  size='small'
                  label='Telefone'
                  variant='outlined'
                  value={fone}
                  onChange={(e) => setFone(e.target.value)}
                  onBlur={handleSearch}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid title='Consulta Cashless' columns={columns} data={handleQuery} tableRef={tableRef} />
      </Grid>
    </Grid>
  );
};
