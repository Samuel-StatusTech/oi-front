import React, { memo, useState, useEffect, useRef } from 'react';
import { Grid, CircularProgress, TextField, MenuItem } from '@material-ui/core';

import Card from './Cards';
import CardLine from './Cards/Line';
import CardBar from './Cards/Bar';

import EaseGrid from '../../../../../components/EaseGrid';
import Api from '../../../../../api';
import axios from 'axios';
import { Between } from '../../../../../components/Input/DateTime';
import CardData from '../../../../../components/CardData/index';
import { formatDateTimeToDB } from '../../../../../utils/date';

export default memo(({ type, event }) => {
  const cards = {
    bar: 'Tickets',
    ingresso: 'Ingressos',
    estacionamento: 'Tickets',
  };
  const infos = {
    infoCards: [
      {
        title: 'Total Emitidos',
        icon: null,
        key: 'total_emitidos'
      },
      {
        title: 'Total Validados',
        icon: null,
        key: 'total_validados'
      },
      {
        title: 'Total Não Validados',
        icon: null,
        key: 'total_nao_validados'
      },
      /*{
        title: `${cards[type]} Emitidos`,
        icon: null,
        key: 'tickets_emitidos'
      },
      {
        title: `${cards[type]} Não Validados`,
        icon: null,
        key: 'tickets_nao_validados'
      },*/
      {
        title: 'Cortesias Validados',
        icon: null,
        key: 'cortesias_validados'
      },
      /*{
        title: 'Cortesias Não Validados',
        icon: null,
        key: 'cortesias_nao_validados'
      },*/
    ],
  };

  const columns = [
    { title: 'Produto', field: 'name' },
    { title: 'Emitidos', field: 'emitidos' },
    { title: 'Validados', field: 'validados' },
    { title: 'Não validados', field: 'nao_validados' },
  ];
  const [groupList, setGroupList] = useState([]);

  const [group, setGroup] = useState('all');
  const [dateIni, setDateIni] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [selected, onSelectType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardsData, setCardsData] = useState({});
  const [top5List, setTop5List] = useState([]);
  const [list, setList] = useState([]);
  const cancelTokenSource = useRef();

  useEffect(() => {
    Api.get(`/group/getList?type=${type}`).then(({ data }) => {
      if (data.success) {
        setGroupList(data.groups);
        setGroup('all');
      } else {
        alert('Erro ao buscar a lista de grupos');
      }
    });
  }, [type]);

  useEffect(() => {
    if(selected != 2){
      onSearch();
    }
  }, [event, type, group, selected]);
  
  const onSearch = () => {
    if(cancelTokenSource && cancelTokenSource.current) {
      cancelTokenSource.current.cancel()
      setTimeout(() => {
        handleSearch();
      }, 500);
    } else {
      handleSearch();
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (event) {
        const dateIniFormatted = formatDateTimeToDB(dateIni);
        const dateEndFormatted = formatDateTimeToDB(dateEnd);

        const dateURL = selected !== 1 ? `&date_ini=${dateIniFormatted}&date_end=${dateEndFormatted}` : '';
        const groupURL = (group && group != 'all') ? `&group_id=${group}` : '';
        
        cancelTokenSource.current = axios.CancelToken.source();
        const { data } = await Api.get(`/validations/overview/${event}?type=${type}${dateURL}${groupURL}`, { cancelToken: cancelTokenSource.current.token });
        
        setCardsData(data.cards);
        setTop5List(data.top5);
        setList(data.list);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container direction='column' spacing={2} style={{marginTop: 20}}>
      <Grid item xs={12}>
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
            >
              <MenuItem value='all' key='todos'>
                Todos
              </MenuItem>
              {groupList.map((group) => (
                <MenuItem value={group.id} key={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item lg={10} md={10} sm={9} xs={12}>
            <Between
              iniValue={dateIni}
              endValue={dateEnd}
              onChangeIni={setDateIni}
              onChangeEnd={setDateEnd}
              selected={selected}
              onSelectType={onSelectType}
              onSearch={onSearch}
              size='small'
            />
          </Grid>
        </Grid>
      </Grid>
      {loading ?
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress />
        </div>
      :
        <Grid item container>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                {infos.infoCards.map((item, index) => (
                  <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={index}>
                    <CardData title={item.title} value={cardsData[item.key] ?? 0} icon={item.icon} styleLabel={{fontSize: 25, marginLeft: -67}} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <EaseGrid data={list} columns={columns} pageSize={10} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  );
});
