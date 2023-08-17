import React, { useEffect, useState } from 'react';
import { format } from 'currency-formatter';
import { Grid, TextField, MenuItem, Card } from '@material-ui/core';
import Macro from './Card/Macro';

import Api from '../../../../../api';
import { Between } from '../../../../../components/Input/Date';
import useStyles from '../../../../../global/styles';
import { CardContent } from '@material-ui/core';
import Ranking from '../../../../../components/Ranking';
import fallProductsIcon from '../../../../../assets/icons/ic_baixa-produtos.svg';
import residualIcon from '../../../../../assets/icons/ic_baixa-produtos2.svg';
import settingsIcon from '../../../../../assets/icons/ic_ajustes.svg';
import balanceTotalIcon from '../../../../../assets/icons/ic_total-receita.svg';
import CardData from '../../../../../components/CardData/index';
export default ({ event, view }) => {
  const styles = useStyles();
  const [groupList, setGroupList] = useState([]);

  const [group, setGroup] = useState('todos');
  const [dateIni, setDateIni] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const [card, setCard] = useState({});
  const [tax, setTax] = useState({});
  const [payment, setPayment] = useState({});
  const [topProductList, setTopProductList] = useState([]);
  const [selectType, setSelectType] = useState(1);
  useEffect(() => {
    if (event) {
      Api.get(`/statistical/cashlessOverview/${event}`).then(({ data }) => {
        console.log(data);
        setCard(data.cardResult);
        setTax(data.taxResult);
        setPayment(data.paymentResult);
        setTopProductList(
          data.topProductResult.map((item) => {
            return { label: item.name, value: item.total };
          })
        );
      });
    }
  }, [event]);

  useEffect(() => {
    Api.get('/group/getList').then(({ data }) => {
      console.log(data);
      if (data.success) {
        setGroupList(data.groups);
      } else {
        alert('Erro ao buscar a lista de grupos');
      }
    });
  }, []);
  const infos = {
    infoCards: [
      {
        title: 'Total Receita',
        icon: { src: balanceTotalIcon, alt: 'Ícone total receita' },
        value: card.total,
      },
      {
        title: 'Valores Consumidos',
        icon: { src: fallProductsIcon, alt: 'Ícone valores consumidos' },
        value: card.total,
      },
      {
        title: 'Ajustes e Taxas',
        icon: { src: settingsIcon, alt: 'Ícone ajustes e taxas' },
        value: card.total,
      },
      {
        title: 'Saldo Residual',
        icon: { src: residualIcon, alt: 'Ícone saldo residual' },
        value: card.total,
        info: 'Sobras de Consumo + Saldo de Taxas Cobradas',
      },
    ],
  };
  return (
    <Grid container spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={2} md={2} sm={3} xs={12}>
            <TextField
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              label='Grupo'
              variant='outlined'
              size='small'
              select
              fullWidth
              className={styles.backgroundWhite}
            >
              <MenuItem value='todos'>Todos</MenuItem>
              {groupList.map((group) => (
                <MenuItem value={group.id}>{group.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item lg={10} md={10} sm={9} xs={12}>
            <Between
              iniValue={dateIni}
              endValue={dateEnd}
              onChangeIni={setDateIni}
              onChangeEnd={setDateEnd}
              onSelectType={setSelectType}
              selected={selectType}
              size='small'
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction='column' spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2} direction='row' className={styles.marginT15}>
            {infos.infoCards.map((item, index) => (
              <Grid item xl={3} lg={4} md={4} sm={6} xs={12} key={index}>
                <CardData
                  title={item.title}
                  value={format(item.value, { code: 'BRL' })}
                  icon={item.icon}
                  info={item.info}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <Macro {...tax} />
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <Card className={styles.fullHeight}>
              <CardContent>
                <Ranking title={'Mais Vendidos'} ranking={topProductList} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
