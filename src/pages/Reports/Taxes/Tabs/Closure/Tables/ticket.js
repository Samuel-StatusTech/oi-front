import React, { memo, useState, useEffect } from 'react';
import { Grid, makeStyles, Select, MenuItem } from '@material-ui/core';
import { format } from 'currency-formatter';

import EaseGrid from '../../../../../../components/EaseGrid';
import CardData from '../../../../../../components/CardData';

import totalIcon from '../../../../../../assets/icons/ic_total.svg';
import cashlessIcon from '../../../../../../assets/icons/ic_aporte.svg';
import outputsIcon from '../../../../../../assets/icons/ic_sangria.svg';
import cashSalesIcon from '../../../../../../assets/icons/ic_total-dinheiro.svg';
import Api from '../../../../../../api';
import { formatDatetime } from '../../../../../../utils/date';

const useStyles = makeStyles((theme) => {
  return {
    cardItem: {
      [theme.breakpoints.up('xl')]: {},
    },
  };
});

const TicketTable = ({ type, event }) => {
  const styles = useStyles();
  const [typeFilter, setTypeFilter] = useState('todos');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  let columns = [
    {
      title: 'Data',
      field: 'name',
      render: ({ name }) => `${name}`,
    },
    {
      title: 'Vendas (R$)',
      field: 'sales',
      render: ({ sales = 0 }) => format(sales / 100, { code: 'BRL' }),
    },
    {
      title: 'Total Emitidos',
      field: 'contribution',
      render: ({ contribution = 0 }) => contribution,
    },
    {
      title: 'Cortesias',
      field: 'bleed',
      render: ({ bleed = 0 }) => bleed,
    },
    {
      title: 'Última Sincronização',
      field: 'last_sync',
      render: ({ last_sync }) => formatDatetime(last_sync),
    },
  ];

  const titles = {
    balance: {
      all: 'Saldo dinheiro',
      bar: 'Saldo dinheiro',
      ingresso: 'Cortesias',
      estacionamento: 'Saldo dinheiro',
    },
    data: {
      all: 'Total Sangrias',
      bar: 'Total Sangrias',
      ingresso: 'Ingressos',
      estacionamento: 'Total Sangrias',
    },
    data1: {
      all: 'Total Aporte',
      bar: 'Total Aporte',
      ingresso: 'Total Emitidos',
      estacionamento: 'Total Aporte',
    },
  };

  useEffect(() => {
    if (event) {
      Api.get(`/statistical/saleOperations/${event}?type=${type}`).then(({ data }) => {
        if (data) {
          setUsers(data.list);
          setStats(data.stats);
        }
      });
    }
  }, [event, type]);

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item xs={12}>
        {type !== 'estacionamento' ? (
          <Grid container spacing={2}>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                style={{ width: '100%' }}
                title='Total vendas'
                value={format(stats.sales / 100, { code: 'BRL' })}
                icon={{ src: totalIcon, alt: 'Ícone total vendas' }}
              />
            </Grid>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                style={{ width: '100%' }}
                title={titles['data1'][type]}
                value={type === 'ingresso' && stats.contribution}
                icon={{ src: cashlessIcon, alt: 'Ícone total aporte' }}
              />
            </Grid>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                style={{ width: '100%' }}
                title={titles['data'][type]}
                value={type === 'ingresso' && stats.bleed}
                icon={{ src: outputsIcon, alt: 'Ícone total sangrias' }}
              />
            </Grid>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                style={{ width: '100%' }}
                title={titles['balance'][type]}
                value={type === 'ingresso' && stats.total}
                icon={{ src: cashSalesIcon, alt: 'Ícone saldo dinheiro' }}
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>

      <Grid item xs={12}>
        <EaseGrid
          toolbar={() => (
            <>
              {type === 'ingresso' && (
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label='Tipo'
                  variant='outlined'
                  fullWidth
                >
                  <MenuItem value='todos'>Todos</MenuItem>
                  <MenuItem value='ingresso'>Operador</MenuItem>
                </Select>
              )}
            </>
          )}
          columns={columns}
          data={users}
        />
      </Grid>
    </Grid>
  );
};

export default memo(TicketTable);
