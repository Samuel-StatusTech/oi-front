import React, { memo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  Typography,
  FormControlLabel,
  DialogActions
} from '@material-ui/core';

import { GreenSwitch } from "../../../../components/Switch"

const RequirePass = ({ opened, current, onClose }) => {
  const [state, setState] = useState(current);

  const handleSave = async () => {
    onClose(state)
  };

  return (
    <Dialog open={opened} onClose={() => onClose(current)}>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Solicitar senha
            </Typography>
          </Grid>
          <Grid item lg md sm xs>
            <FormControlLabel
              label="Permitir cadastro e edição de produtos sem senha do operador"
              name="allowCreate"
              value={!state}
              control={
                <GreenSwitch
                  checked={!state}
                  onChange={(e) => setState(!e.target.checked)}
                />
              }
            />
          </Grid>
          <Grid item lg md sm xs>
            <FormControlLabel
              label="Solicitar senha"
              name="allowCreate"
              value={state}
              control={
                <GreenSwitch
                  checked={state}
                  onChange={(e) => setState(e.target.checked)}
                />
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleSave}
            >
              Confirmar
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RequirePass);
