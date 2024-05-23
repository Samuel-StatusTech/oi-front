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

const RequirePass = ({ opened, onClose }) => {
  const [required, setRequired] = useState(false);
  const [notRequired, setNotRequired] = useState(false);

  const handleSave = async () => {
    if (!required && !notRequired) onClose(null)
    else {
      if (required && !notRequired) onClose(true)
      else if (!required && notRequired) onClose(false)
    }
  };

  return (
    <Dialog open={opened} onClose={() => onClose(null)}>
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
              name="notRequired"
              value={notRequired}
              control={
                <GreenSwitch
                  checked={notRequired}
                  onChange={(e) => {
                    if (e.target.checked && required) setRequired(false)
                    setNotRequired(e.target.checked)
                  }}
                />
              }
            />
          </Grid>
          <Grid item lg md sm xs>
            <FormControlLabel
              label="Solicitar senha"
              name="required"
              value={required}
              control={
                <GreenSwitch
                  checked={required}
                  onChange={(e) => {
                    if (e.target.checked && notRequired) setNotRequired(false)
                    setRequired(e.target.checked)
                  }}
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
              onClick={() => onClose(null)}
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
              disabled={!notRequired && !required}
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
