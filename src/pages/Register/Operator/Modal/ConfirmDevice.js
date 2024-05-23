import React, { memo } from 'react';

import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  Typography,
  DialogActions
} from '@material-ui/core';

const RequirePass = ({ opened, onClose }) => {


  return (
    <Dialog open={opened} onClose={() => onClose(false)}>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Tem certeza que deseja desvincular todas as maquininhas?
            </Typography>
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
              onClick={() => onClose(false)}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => onClose(true)}
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
