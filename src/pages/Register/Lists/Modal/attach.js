import React, { useState } from 'react';
import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  DialogActions,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

import Api from '../../../../api';
import { downloadTemplate, readXLSFile } from '../xls';

const Modal = ({ show, onClose, idList, afterAddPerson, data }) => {
  const [loading] = useState(false);

  const handleDropFile = async (files) => {
    try {
      if (files[0]) {
        const data = await readXLSFile(files[0]);
        console.log(data);

        const allRes = await Promise.all(
          data.map((user) => Api.post(`/list/addList/${idList}`, user))
        );

        allRes.map(({ data }) => {
          if (data.success) {
            afterAddPerson(data.data);
          }
          return data;
        });
      }
    } catch (e) {
      alert('Erro ao processar as informações');
    }
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Importar excel</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <DropzoneArea onChange={handleDropFile} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="outlined" color="secondary" onClick={downloadTemplate}>
          Baixar template
        </Button>
        <Button variant="outlined" color="primary" onClick={() => {}}>
          {loading ? <CircularProgress size={25} /> : 'Importar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
