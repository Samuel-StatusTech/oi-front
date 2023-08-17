import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pages from './Pages';
import Alerts from '../Alerts/index';
import { getDateDifferenceInDays } from '../../utils/date';
import Context from '../../context';
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  contentWidth: {
    width: (props) => 0,
    [theme.breakpoints.up('md')]: {
      width: (props) => (props.open ? 180 : 0),
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  routeWidth: {
    padding: 20,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: (props) => `calc(100% - 0px)`,
    [theme.breakpoints.up('md')]: {
      width: (props) => `calc(100% - ${props.open ? 180 : 0}px)`,
    },
  },
}));

const Content = (props) => {
  const { expireAt, setExpireAt } = useContext(Context);
  const styles = useStyles(props);
  const onCloseExpire = () => {
    localStorage.setItem('hideExpire', true);
    setExpireAt({...expireAt, show:false});
  };
  const expireDate = getDateDifferenceInDays(new Date(), new Date(expireAt.date));
  return (
    <div style={{ height: '100%', backgroundColor: 'inherit' }}>
      <div className={styles.toolbar} />
      <div style={{ display: 'flex', backgroundColor: 'inherit' }}>
        <div className={styles.contentWidth} />
        <div className={styles.routeWidth}>
          {expireAt.show && (
            <Alerts
              severity='warning'
              message={
                expireDate === 0
                  ? 'Aviso: sua licença expira hoje.'
                  : expireDate < 0 ? 'Aviso: Sistema expirado.' : `Aviso: faltam ${getDateDifferenceInDays(
                      new Date(),
                      new Date(expireAt.date)
                    )} dia(s) para expirar sua licença.`
              }
              openned={expireAt.show && getDateDifferenceInDays(new Date(), new Date(expireAt.date)) <= 7}
              onClose={onCloseExpire}
            />
          )}

          <Pages />
        </div>
      </div>
    </div>
  );
};

export default Content;
