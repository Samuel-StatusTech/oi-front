import React, { useState } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardContent } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { format } from 'currency-formatter';

import EaseGrid from '../../../../../../components/EaseGrid';

import totalIcon from '../../../../../../assets/icons/ic_total.svg';
import salesItemsIcon from '../../../../../../assets/icons/ic_itens-vendidos.svg';
import canceledItemsIcon from '../../../../../../assets/icons/ic_itens-cancelados.svg';
import returnsIcon from '../../../../../../assets/icons/ic_total-extornos.svg';

const TileData = ({ title, value = 0, icon }) => (
  <Card>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item lg={2} xs={3}>
          {icon}
        </Grid>
        <Grid item lg={10} xs={9}>
          <Typography
            style={{
              fontSize: 18,
            }}
          >
            {title}
          </Typography>
          <Typography
            style={{
              fontSize: 24,
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
            }}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ({ title, data = [], init }) => {
  const [expanded, setExpanded] = useState(init);
  const columns = [
    { title: 'Grupo', field: 'group' },
    { title: 'Produto', field: 'product' },
    { title: 'Quantidade', field: 'quantity' },
    { title: 'Valor unitário', field: 'price_unit' },
    { title: 'Valor total', field: 'price_total' },
  ];

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item xl={3} lg={6} md={6} sm={6} xs={12}>
                <TileData
                  title='Total vendas'
                  value={format(0, { code: 'BRL' })}
                  icon={<img src={totalIcon} alt='Ícone total vendas' />}
                />
              </Grid>
              <Grid item xl={3} lg={6} md={6} sm={6} xs={12}>
                <TileData
                  title='Itens vendidos'
                  value={format(0, { code: 'BRL' })}
                  icon={<img src={salesItemsIcon} alt='Ícone itens vendidos' />}
                />
              </Grid>
              <Grid item xl={3} lg={6} md={6} sm={6} xs={12}>
                <TileData
                  title='Itens cancelados'
                  value={format(0, { code: 'BRL' })}
                  icon={<img src={canceledItemsIcon} alt='Ícone itens cancelados' />}
                />
              </Grid>
              <Grid item xl={3} lg={6} md={6} sm={6} xs={12}>
                <TileData
                  title='Total cancelamentos'
                  value={format(0, { code: 'BRL' })}
                  icon={<img src={returnsIcon} alt='Ícone total cancelamentos' />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg md xs sm>
            <EaseGrid
              // title={title}
              data={data}
              columns={columns}
              pageSize={10}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
