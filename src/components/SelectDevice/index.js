import React, { useEffect, useState } from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Api from '../../api';

const SelectDevice = ({ value, onSelect, idDevice, onSelectDevice }) => {
  const [devices, setDevice] = useState([]);

  useEffect(() => {
    Api.get('/device/getList').then(({ data }) => {
      if (data.success) {
        setDevice(data.devices);
      } else {
        alert('Erro ao carregar os produtos');
      }
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item justify="center">
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={(e) => onSelect(e.target.checked)}
            />
          }
          label="Tem dispositivo?"
        />
      </Grid>
      {value ? (
        <Grid item lg={3} md={4} sm={6} xs>
          <TextField
            value={idDevice}
            onChange={(e) => onSelectDevice(e.target.value)}
            label="Dispositivo"
            variant="outlined"
            size="small"
            fullWidth
            select
          >
            {devices.map((device, index) => (
              <MenuItem key={index} value={device.code}>
                {device.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default SelectDevice;
