import React, { useEffect, useState } from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Api from '../../api';

const SelectWaiter = ({ value, onSelect, idWaiter, onSelectWaiter }) => {
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    Api.get('/waiter/getList').then(({ data }) => {
      if (data.success) {
        setWaiters(data.waiters);
      } else {
        alert('Erro ao carregar os produtos');
      }
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={(e) => onSelect(e.target.checked)}
            />
          }
          label="É um garçom"
        />
      </Grid>
      {value ? (
        <Grid item lg={3} md={4} sm={6} xs>
          <TextField
            value={idWaiter}
            onChange={(e) => onSelectWaiter(e.target.value)}
            label="Garçom"
            variant="outlined"
            size="small"
            fullWidth
            select
          >
            {waiters.map((waiter, index) => (
              <MenuItem key={index} value={waiter.id}>
                {waiter.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default SelectWaiter;
