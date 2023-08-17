import React from 'react';
import { Drawer, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawerFullWidth: {
    width: 'calc(100% - 50px)',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 260px)',
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerWidth: {
    width: 'calc(100% - 260px)',
    [theme.breakpoints.up('md')]: {
      width: 600,
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  Container: {
    paddingTop: (props) => (props && props.noVerticalPadding ? 0 : 20),
    paddingBottom: (props) => (props && props.noVerticalPadding ? 0 : 20),
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  headerContainer: {
    padding: 20,
    background: theme.palette.grey[200],
  },
  footerContainer: {
    padding: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    background: theme.palette.grey[200],
  },
  buttonStyle: {
    marginLeft: 10,
  },
}));

export default ({
  children,
  title,
  open,
  fullWidth,
  onSave,
  onClose,
  customButtons,
  variant,
  ...props
}) => {
  const styles = useStyles(props);

  return (
    <Drawer
      open={open}
      classes={{
        paper: styles.drawerFullWidth,
      }}
      variant={variant || 'persistent'}
      anchor="right"
    >
      <div className={styles.toolbar} />
      {title ? (
        <header className={styles.headerContainer}>
          <Typography variant="h4">{title}</Typography>
        </header>
      ) : null}
      <div className={styles.Container}>{children}</div>
      {onClose || customButtons || onSave ? (
        <div className={styles.footerContainer}>
          {onClose ? (
            <Button
              color="default"
              variant="text"
              onClick={onClose}
              className={styles.buttonStyle}
            >
              CANCELAR
            </Button>
          ) : null}
          {customButtons &&
            customButtons.map((button) =>
              button({ className: styles.buttonStyle })
            )}
          {onSave ? (
            <Button
              color="primary"
              variant="outlined"
              onClick={onSave}
              className={styles.buttonStyle}
            >
              SALVAR
            </Button>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
};
