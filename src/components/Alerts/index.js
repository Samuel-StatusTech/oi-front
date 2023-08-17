import React from 'react';
import { Alert } from '@material-ui/lab';
import { IconButton, Collapse } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const Alerts = ({ severity, message, openned, onClose }) => {
  return (
    <Collapse in={openned}>
      <Alert
        variant='filled'
        severity={severity}
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export default Alerts;
