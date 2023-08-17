import React, { memo, useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
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

const AllTable = ({ type, event }) => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  let columns = [];

  columns = [
    {
      title: 'Operador',
      field: 'name',
    },
    /*{
      title: 'Última Sincronização',
      field: '',
      //field: 'last_sync',
      //render: ({ last_sync }) => formatDatetime(last_sync),
    },*/
    {
      title: 'Vendas em Dinheiro',
      field: 'sales',
      render: ({ sales = 0 }) => format(sales / 100, { code: 'BRL' }),
    },
    {
      title: 'Aporte',
      field: 'contribution',
      render: ({ contribution = 0 }) => format(contribution / 100, { code: 'BRL' }),
    },
    {
      title: 'Sangria',
      field: 'bleed',
      render: ({ bleed = 0 }) => format(bleed / 100, { code: 'BRL' }),
    },
    /*{
      title: 'Saldo em Dinheiro',
      field: 'total',
      render: ({ total = 0 }) => format(total / 100, { code: 'BRL' }),
    },*/
    {
      title: 'Status',
      field: 'status',
      render: ({ status }) => (status ? 'Aberto' : 'Fechado'),
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
      <Grid container item xs={12}>
        {type !== 'estacionamento' ? (
          <Grid container spacing={2}>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                title='Total vendas em dinheiro'
                value={format(stats.sales / 100, { code: 'BRL' })}
                icon={{ src: totalIcon, alt: 'Ícone total vendas' }}
              />
            </Grid>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                title={titles['data1'][type]}
                value={type === 'all' && format(stats.contribution / 100, { code: 'BRL' })}
                icon={{ src: cashlessIcon, alt: 'Ícone total aporte' }}
              />
            </Grid>
            <Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                title={titles['data'][type]}
                value={type === 'all' && format(stats.bleed / 100, { code: 'BRL' })}
                icon={{ src: outputsIcon, alt: 'Ícone total sangrias' }}
              />
            </Grid>
            {/*<Grid item className={styles.cardItem} xs={12} sm={12} md={6} xl={3}>
              <CardData
                title={titles['balance'][type]}
                info={type === 'all' ? 'Saldo em dinheiro disponível para sangrias' : null}
                value={type === 'all' && format(stats.total / 100, { code: 'BRL' })}
                icon={{ src: cashSalesIcon, alt: 'Ícone saldo dinheiro' }}
              />
            </Grid>*/}
          </Grid>
        ) : null}
      </Grid>

      <Grid item xs={12}>
        <EaseGrid columns={columns} data={users} />
      </Grid>
    </Grid>
  );
};

export default memo(AllTable);
