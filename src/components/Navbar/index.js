import React, { useState, useEffect, useCallback, Button, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Grid, Hidden, Divider, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import LoopIcon from '@material-ui/icons/Loop';

import EventList from '../EventList';

import Api from '../../api';
import UserButton from '../UserButton';
import logo from '../../assets/images/logo_blue.png';
import { connect } from 'react-redux';
import { formatDate, formatDateToDB, formatTime } from '../../utils/date';
import { removeUserData } from '../../utils/user';
import firebase from '../../firebase';
import { saveAs } from 'file-saver';
import Context from '../../context';


const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#fff',
    color: '#666666',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sideBarContent: {
    width: 50,
    [theme.breakpoints.up('md')]: {
      width: 260,
    },
  },
}));

const Navbar = ({ toggle, event }) => {
  const styles = useStyles();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const [sync, setSync] = useState(null);
  const { setExpireAt } = useContext(Context);
  const onLogout = useCallback(() => {
    firebase.auth().signOut();
    removeUserData();
    localStorage.removeItem('hideExpire');
    history.push('/login');
  }, [history]);
  useEffect(() => {
    Api.get('/getProfileData')
      .then(({ data }) => {
        if (!localStorage.getItem('hideExpire')) {
          setExpireAt({ show: true, date: data.expireAt });
        }
        setUserData(data);
      })
      .catch(onLogout);
  }, [onLogout]);

  useEffect(() => {
    if (event) {
      getLastSync(event);
    }
  }, [event]);

  const getLastSync = (event) => {
    setSync(null)

    Api.get(`/statistical/resume/${event}`)
      .then(async ({ data }) => {
        if (data.success) {
          const { operators } = data;

          let lastGettedSync = new Date(operators[0].last_sync).getTime()

          operators.forEach(op => {
            if (new Date(op.last_sync).getTime() > lastGettedSync) {
              lastGettedSync = new Date(op.last_sync).getTime()
            }
          })

          setSync(lastGettedSync)
        }
      })

    // Api.get(`/sync/getLastSync/${event}`)
    //   .then(({ data }) => {
    //     if (data.success) {
    //       setSync(data.sync);
    //     }
    //   })
    //   .catch((error) => {
    //     setSync('error');
    //   });
  };

  const formatPrice = (value) => {
    let formatted = `R$ ${(value / 100).toFixed(2)}`
    return formatted.replace(".", ",")
  }

  const exportGeneralReport = async () => {
    Api.get(`/report/${event}`)
      .then(({ data }) => {
        let fileText = "Operador ; Dinheiro ; Débito ; Crédito ; Total"
        for (const key in data) {
          const datas = data[key]
          fileText += `\n${datas.username} (${datas.name}) ; ${formatPrice(datas.money)} ; ${formatPrice(datas.debit)} ; ${formatPrice(datas.credit)} ; ${formatPrice(datas.money + datas.debit + datas.credit)}`
        }

        var blob = new Blob([fileText], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "Resumo Geral.csv");
      })
      .catch((error) => {
        console.log({ error })
      });
  };

  const exportProductReport = async () => {
    Api.get(`/reportProduct/${event}`)
      .then(({ data }) => {
        let fileText = ` ; ; ; ; `;
        for (const key in data) {
          const datas = data[key]
          const { top5, groups, username, name } = datas;

          fileText += `\n ; ; ; ; `;
          fileText += `\n ; ; ; ; `;
          fileText += `\nOperador: ; ${username} (${name}) ; ; ; `;
          fileText += `\nTop 05 (Mais Vendidos) ; ; ; ; `;
          fileText += `\nProduto ; Quantidade ; Preço ; Total ; `;

          Object.keys(top5).sort((a, b) => {
            let totalA = 0;
            let totalB = 0
            for (const key in top5[a]) {
              totalA += top5[a][key].qtd;
            }
            for (const key in top5[b]) {
              totalB += top5[b][key].qtd;
            }
            if (totalA > totalB)
              return -1;
            if (totalA < totalB)
              return 1;
            return 0;
          }).map((productKey, idx) => {
            if (idx > 4) return
            const products = top5[productKey]

            Object.keys(products).sort((a, b) => (products[a].qtd > products[b].qtd ? -1 : (products[a].qtd < products[b].qtd ? 1 : 0))).map(key => {
              const { name, qtd, price } = products[key];
              fileText += `\n${name} ; ${qtd} ; ${formatPrice(price)} ; ${formatPrice(qtd * price)} ; `;
            })
          })

          fileText += `\n ; ; ; ; `;
          fileText += `\nVendas por Produto ; ; ; ; `;
          fileText += `\nGrupo ; Produto ; Quantidade ; Preço ; Total`;

          Object.keys(groups).map(groupKey => {
            const group = groups[groupKey]
            const { groupName } = group
            Object.keys(group.products).map(productKey => {
              const products = group.products[productKey]
              Object.keys(products).map(key => {
                const { name, qtd, price } = products[key]
                fileText += `\n${groupName} ; ${name} ; ${qtd} ; ${formatPrice(price)} ; ${formatPrice(qtd * price)}`;
              })
            })
          })
        }

        var blob = new Blob([fileText], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "Vendas por produto.csv");
      })
      .catch((error) => {
        console.log({ error })
      });
  };

  return (
    <AppBar className={styles.appBar}>
      <Toolbar>
        <div className={styles.sectionMobile}>
          <IconButton onClick={() => toggle((previous) => !previous)}>
            <MenuIcon />
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Link to='/select'>
            <img
              src={logo}
              alt='logo'
              style={{
                marginBottom: '4px',
                display: 'block',
                marginRight: '8px',
              }}
            />
          </Link>
          <EventList />
        </div>


        {/*<div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <button onClick={exportGeneralReport}>
                Resumo Geral de Vendas
          </button>
          <button onClick={exportProductReport} style={{marginLeft: 10}}>
                Vendas por produto
          </button>
        </div>*/}

        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* <Notification {...user} /> */}

          <Grid container spacing={2}>
            <Hidden only={['xs', 'sm']}>
              <Grid item>
                <IconButton size='small' style={{ color: '#fff' }} onClick={() => getLastSync(event)}>
                  <LoopIcon />
                  {!sync && (
                    <CircularProgress
                      size={30}
                      style={{
                        color: '#fff',
                        position: 'absolute',
                        zIndex: 1,
                      }}
                    />
                  )}
                </IconButton>
              </Grid>
              <Grid item style={{ color: '#fff', fontSize: 12 }}>
                <div style={{ width: '109px' }}></div>
                {sync && (
                  <Grid container direction='column'>
                    <Grid item>
                      <Typography variant='caption' style={{ color: '#3B94FF' }}>
                        Última Sincronização:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant='caption' style={{ color: '#3B94FF' }}>
                        {sync === 'error' ? 'Falha aos buscar os dados' : `${formatDate(sync)} às ${formatTime(sync)}`}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                style={{
                  backgroundColor: '#fff',
                  margin: '10px 0',
                }}
              />
            </Hidden>
            <Grid item>
              <UserButton user={userData} onLogout={onLogout} />
            </Grid>
          </Grid>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps, {})(Navbar);
