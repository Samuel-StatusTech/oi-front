import React from 'react';
import MaskedInput from 'react-text-mask';
import TextField from '@material-ui/core/TextField';

const Phone = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={(ref) => {
      inputRef(ref ? ref.inputElement : null);
    }}
    mask={[
      '(',
      /[1-9]/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    placeholderChar={'\u2000'}
    showMask
  />
);

const InputValue = (props) => {
  return (
    <TextField
      variant="outlined"
      {...props}
      InputProps={{
        ...props.InputProps,
        inputComponent: Phone,
      }}
    />
  );
};

export default InputValue;
