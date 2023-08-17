import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const Percent = ({ inputRef, onChange, ...rest }) => (
  <NumberFormat
    {...rest}
    getInputRef={inputRef}
    onValueChange={(values) => {
      onChange({ value: values.floatValue });
    }}
    allowLeadingZeros={false}
    thousandSeparator
    isNumericString
    allowNegative={false}
    suffix='%'
  />
);

const InputValue = (props) => {
  return (
    <TextField
      variant='outlined'
      {...props}
      InputProps={{
        ...props.InputProps,
        inputComponent: Percent,
      }}
    />
  );
};

export default InputValue;
