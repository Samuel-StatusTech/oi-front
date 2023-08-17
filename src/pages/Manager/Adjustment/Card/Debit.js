import React from 'react';

import Card from './';

export default ({ payments = [], handleChange = () => {}, disabled }) => {
  const payment_type = 'debito';
  const payment =
    payments.find((payment) => payment.payment_type === payment_type) || {};

  return (
    <Card
      title="Débito"
      value={payment.price}
      onChange={({ value }) => handleChange(payment_type, value)}
      disabled={disabled}
    />
  );
};
