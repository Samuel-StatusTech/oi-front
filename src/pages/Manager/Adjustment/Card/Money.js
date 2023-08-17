import React, { memo } from 'react';

import Card from './';

export default memo(({ payments = [], handleChange = () => {}, disabled }) => {
  const payment_type = 'dinheiro';
  const payment =
    payments.find((payment) => payment.payment_type === payment_type) || {};

  return (
    <Card
      title="Dinheiro"
      value={payment.price}
      onChange={({ value }) => {
        console.log('Value =>', value, 'ALOOOO');
        handleChange(payment_type, value);
      }}
      disabled={disabled}
    />
  );
});
