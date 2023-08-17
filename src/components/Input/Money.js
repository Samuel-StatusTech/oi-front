import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import Utils from '../../utils';

const Money = ({ inputRef, onChange, ...rest }) => (
  <NumberFormat
    {...rest}
    getInputRef={inputRef}
    onValueChange={(values) => {
      onChange({ value: values.floatValue });
    }}
    thousandSeparator='.'
    decimalSeparator=','
    isNumericString
    prefix='R$'
    allowNegative={false}
    format={Utils.prototype.currencyFormatter}
  />
);

const InputValue = (props) => {
  return (
    <TextField
      variant='outlined'
      {...props}
      InputLabelProps={{ shrink: props.value ? true : false }}
      InputProps={{
        ...props.InputProps,
        inputComponent: Money,
      }}
    />
  );
};

export default InputValue;
