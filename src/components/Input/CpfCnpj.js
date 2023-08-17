import React from 'react';
import TextField from '@material-ui/core/TextField';

const InputValue = (props) => {
  const handleCpfCnpjChange = (event) => {
    // Get only the numbers from the data input
    let data = event.target.value.replace(/\D/g, '');
    // Checking data length to define if it is cpf or cnpj
    if (data.length > 11) {
      // It's cnpj
      let cnpj = `${data.substr(0, 2)}.${data.substr(2, 3)}.${data.substr(5, 3)}/`;
      if (data.length > 12) {
        cnpj += `${data.substr(8, 4)}-${data.substr(12, 2)}`;
      } else {
        cnpj += data.substr(8);
      }
      data = cnpj;
    } else {
      // It's cpf
      let cpf = '';
      let parts = Math.ceil(data.length / 3);
      for (let i = 0; i < parts; i++) {
        if (i === 3) {
          cpf += `-${data.substr(i * 3)}`;
          break;
        }
        cpf += `${i !== 0 ? '.' : ''}${data.substr(i * 3, 3)}`;
      }
      data = cpf;
    }
    props.setValue(data);
  };
  return <TextField variant='outlined' {...props} onChange={(value) => handleCpfCnpjChange(value)} />;
};

export default InputValue;
