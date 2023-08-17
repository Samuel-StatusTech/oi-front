import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      variant="outlined"
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputProps={{ minLength: 6 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
