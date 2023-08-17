import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField, Card, CardContent } from '@material-ui/core';
import { format } from 'currency-formatter';
import Api from '../../../../api';
import EaseGrid from '../../../../components/EaseGrid';

import rateAtivationIcon from '../../../../assets/icons/ic_taxa_de_ativacao.svg';
import refillsIcon from '../../../../assets/icons/ic_recargas.svg';
import returnedIcon from '../../../../assets/icons/ic_devolvido.svg';
import consumedIcon from '../../../../assets/icons/ic_consumido.svg';
import totalIcon from '../../../../assets/icons/ic_total.svg';
import rateDevolutionIcon from '../../../../assets/icons/ic_aporte.svg';
import { ClickAwayListener } from '@material-ui/core';
import CardData from '../../../../components/CardData/index';

export default ({ event }) => {
  const tableRef = useRef(null);
  const [card, setCard] = useState('');
  const [cpf, setCpf] = useState('');
  const [fone, setFone] = useState('');

  const [active, setActive] = useState(0);
  const [buy, setBuy] = useState(0);
  const [recharge, setRecharge] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [balance, setBalance] = useState(0);

  const infos = {
    infoCards: [
      {
        title: 'Taxa de Ativação',
        icon: { src: rateAtivationIcon, alt: 'Ícone taxa de ativação' },
        value: active / 100,
      },
      {
        title: 'Recargas',
        icon: { src: refillsIcon, alt: 'Ícone recargas' },
        value: recharge / 100,
      },
      {
        title: 'Consumido',
        icon: { src: consumedIcon, alt: 'Ícone de consumido' },
        value: buy / 100,
      },
      {
        title: 'Devolvido',
        icon: { src: returnedIcon, alt: 'Ícone de devolvido' },
        value: withdraw / 100,
      },
      {
        title: 'Taxa de Devolução',
        icon: { src: rateDevolutionIcon, alt: 'Ícone taxa de devolução' },
        value: 0,
      },
      {
        title: 'Saldo',
        icon: { src: totalIcon, alt: 'Ícone de saldo' },
        value: balance / 100,
      },
    ],
  };

  const columns = [
    { title: 'ID transação', field: 'id' },
    { title: 'Data/Hora', field: 'created_at', type: 'datetime' },
    { title: 'Tipo', field: 'type' },
    { title: 'PDV', field: 'pdv_name' },
    {
      title: 'Valor',
      field: 'value',
      render: ({ value }) => format(value / 100, { code: 'BRL' }),
    },
    { title: 'CPF', field: 'cpf' },
    { title: 'Telefone', field: 'fone' },
    { title: 'Status', field: 'status' },
    // { title: 'Ações', render: row => (
    //     <Button variant='contained' size='small' color='primary' onClick={handleListProducts(row)}>
    //         Editar
    //     </Button>
    // ) }
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

  const handleSearch = () => {
    if (tableRef.current) {
      tableRef.current.onQueryChange();
    } else {
      console.log('Sem referencia');
    }
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

      Api.get(
        `/cashless/searchCard/${event}?per_page=${query.pageSize}&page=${
          query.page + 1
        }&card_number=${card}&cpf=${cpf}&fone=${fone}`
      )
        .then(({ data }) => {
          if (data.success) {
            setActive(data.stats.active);
            setBuy(data.stats.buy);
            setRecharge(data.stats.recharge);
            setWithdraw(data.stats.withdraw);
            setBalance(data.stats.balance);
            resolve({
              data: data.cashless,
              page: data.page - 1,
              totalCount: data.count,
            });
          } else {
            reject();
          }
        })
        .catch(() => {
          resolve({
            data: [],
            page: 0,
            totalCount: 0,
          });
        });
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <ClickAwayListener onClickAway={handleSearch}>
                  <TextField
                    size='small'
                    label='Nº do cartão'
                    variant='outlined'
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                  />
                </ClickAwayListener>
              </Grid>
              <Grid item>
                <ClickAwayListener onClickAway={handleSearch}>
                  <TextField
                    size='small'
                    label='CPF'
                    variant='outlined'
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </ClickAwayListener>
              </Grid>
              <Grid item>
                <ClickAwayListener onClickAway={handleSearch}>
                  <TextField
                    size='small'
                    label='Telefone'
                    variant='outlined'
                    value={fone}
                    onChange={(e) => setFone(e.target.value)}
                  />
                </ClickAwayListener>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          {infos.infoCards.map((item, index) => (
            <Grid item xl={2} lg={4} md={4} sm={6} xs={12} key={index}>
              <CardData title={item.title} value={format(item.value, { code: 'BRL' })} icon={item.icon} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid title='Consulta Cashless' columns={columns} data={handleQuery} tableRef={tableRef} />
      </Grid>
    </Grid>
  );
};
