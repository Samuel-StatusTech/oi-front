import React from 'react';
import { Grid } from '@material-ui/core';
import EaseGrid from '../../../components/EaseGrid';
import { format } from 'currency-formatter';

export default ({ history }) => {
  const { products } = history.location.state;
  console.log(products);

  const columns = [
    { title: 'Produto', field: 'name' },
    { title: 'Grupo', field: 'group_name' },
    // { title: 'Código de barra', field: "group_id" },
    {
      title: 'Valor',
      field: 'price_total',
      render: ({ price_total }) => format(price_total / 100, { code: 'BRL' }),
    },
    { title: 'Quantidade', field: 'quantity' },
    // { title: 'Validação', field: "group_id" },
    // { title: 'Grupo', field: "group_id" },
  ];

  return (
    <Grid container>
      <Grid item lg md sm xs>
        <EaseGrid title="Produtos" data={products} columns={columns} />
      </Grid>
    </Grid>
  );
};
