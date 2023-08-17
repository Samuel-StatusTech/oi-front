import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { format } from 'currency-formatter';

export default ({
  count,
  totalInserted,
  totalWithdraw,
  totalTaxActive,
  totalTaxCashback,
  totalTax,
}) => {
  const formatMoney = (value) => {
    return format(value / 100, { code: 'BRL' });
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Grid container spacing={2} justify="space-between">
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Cartões ativos
                </Typography>
                <Typography style={{ fontSize: 24 }}>{count}</Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Cartões créditos inseridos
                </Typography>
                <Typography style={{ fontSize: 24 }}>
                  {formatMoney(totalInserted)}
                </Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Cartões devolvidos
                </Typography>
                <Typography style={{ fontSize: 24 }}>
                  {formatMoney(totalWithdraw)}
                </Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Taxas de ativação
                </Typography>
                <Typography style={{ fontSize: 24 }}>
                  {formatMoney(totalTaxActive)}
                </Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Taxas devolvidas
                </Typography>
                <Typography style={{ fontSize: 24 }}>
                  {formatMoney(totalTaxCashback)}
                </Typography>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography
                  style={{ fontSize: 18, color: '#3A82F8', fontWeight: 'bold' }}
                >
                  Saldo de taxas
                </Typography>
                <Typography style={{ fontSize: 24 }}>
                  {formatMoney(totalTax)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
