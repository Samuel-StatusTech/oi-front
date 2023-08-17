import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: '#778899',
    color: '#fff',
    borderRadius: '15px',
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '3px 30px',
    '&:hover': {
      backgroundColor: '#778899',
    },
  },
  selectButton: {
    backgroundColor: '#0097FF',
    '&:hover': {
      backgroundColor: '#0097FF',
    },
  },
}));

const ButtonRound = (props) => {
  const styles = useStyles(props);
  const { active, children, className, ...rest } = props;

  return (
    <Button
      {...rest}
      className={`${styles.button} ${className} ${
        active ? styles.selectButton : ''
      }`}
    >
      {children}
    </Button>
  );
};

export default ButtonRound;
