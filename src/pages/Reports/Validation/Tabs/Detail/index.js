import React, { memo } from 'react';
import { Grid } from '@material-ui/core';

import EaseGrid from '../../../../../components/EaseGrid';

export default memo(() => {
  const columns = [
    { title: 'Portaria', field: 'name' },
    { title: 'Validados', field: 'validated' },
    { title: 'Não validados', field: 'unvalidated' },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid
          data={[
            {
              name: 'Entrada',
              validated: 'Produto',
              unvalidated: 'Produto',
              productList: [{ name: 'Masculino' }, { name: 'Feminino' }],
            },
          ]}
          columns={columns}
          detailPanel={(rowData) => (
            <div style={{ padding: 20 }}>
              <EaseGrid
                title="Produtos"
                data={rowData.productList}
                columns={[{ title: 'Produto', field: 'name' }]}
              />
            </div>
          )}
        />
      </Grid>
    </Grid>
  );
});
