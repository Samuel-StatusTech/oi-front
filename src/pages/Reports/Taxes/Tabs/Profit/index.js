import React, { memo, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { format } from 'currency-formatter';

import EaseGrid from '../../../../../components/EaseGrid';
import CardData from '../../../../../components/CardData';

import totalIcon from '../../../../../assets/icons/ic_total.svg';
import cashSalesIcon from '../../../../../assets/icons/ic_total-dinheiro.svg';
import itemsSoldIcon from '../../../../../assets/icons/ic_itens-vendidos.svg';
import cashlessIcon from '../../../../../assets/icons/ic_aporte.svg';
import ticketSalesIcon from '../../../../../assets/icons/ic_dinheiro-disponivel.svg';
import outputsIcon from '../../../../../assets/icons/ic_sangria.svg';
import Api from '../../../../../api';

const Profit = ({ type, event }) => {
  const columns = [
    { title: 'Produto', field: 'name' },
    { title: 'Quantidade', field: 'quantity' },
    {
      title: 'Valor Unitário',
      field: 'price_unit',
      render: ({ sales = 0 }) => format(sales / 100, { code: 'BRL' }),
    },
    {
      title: 'Custo Unitário',
      field: 'cost_unit',
      render: ({ contribution = 0 }) => format(contribution / 100, { code: 'BRL' }),
    },
    {
      title: 'Total Vendas',
      field: 'total_sales',
      render: ({ bleed = 0 }) => format(bleed / 100, { code: 'BRL' }),
    },
    {
      title: 'Lucro',
      field: 'profit',
      render: ({ total = 0 }) => format(total / 100, { code: 'BRL' }),
    },
    {
      title: 'Margem de Lucro',
      field: 'margin_profit',
      render: ({ margin_profit }) => (margin_profit || 0).toFixed(2) + '%',
    },
  ];
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (event) {
      Api.get(`/statistical/saleProfit/${event}?type=${type}`).then(({ data }) => {
        setProducts(data.list);
        setStats(data.stats);
      });
    }
    console.log(type, event);
  }, [type, event]);
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
            <CardData
              title='Total Receita'
              value={format(stats.sales / 100 || 0, { code: 'BRL' })}
              icon={<img src={totalIcon} alt='Ícone faturamento' />}
            />
          </Grid>
          <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
            <CardData
              title='Custo Itens Vendidos'
              value={format(stats.total_cost / 100 || 0, { code: 'BRL' })}
              icon={<img src={ticketSalesIcon} alt='Ícone custo itens vendidos' />}
            />
          </Grid>
          <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
            <CardData
              title='Lucro'
              value={format(stats.profit / 100 || 0, { code: 'BRL' })}
              icon={<img src={outputsIcon} alt='Ícone lucro operacional' />}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <EaseGrid columns={columns} data={products} />
      </Grid>
    </Grid>
  );
};

export default memo(Profit);
