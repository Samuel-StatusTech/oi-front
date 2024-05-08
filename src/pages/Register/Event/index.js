import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { loadEvents } from '../../../action';
import EaseGrid from '../../../components/EaseGrid';
import ButtonRound from '../../../components/ButtonRound';
// import Drawer from "./drawer";
import Api from '../../../api';
import { compareDateBetween, formatDate, formatDateToDB } from '../../../utils/date';
import StatusColumn from '../../../components/EaseGrid/Columns/Status';
import { useState } from 'react';
import { Between } from '../../../components/Input/Date';

const Event = ({ events, loadEvents }) => {
  const history = useHistory();
  const [data, setData] = useState(events);
  const [cityList, setCityList] = useState({});
  const [localList, setLocalList] = useState({});
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: 'Nome do evento', field: 'name' },
    {
      title: 'Data de início',
      field: 'date_ini',
      render: ({ date_ini }) => formatDate(date_ini),
      filtering: false,
    },
    { title: 'Local', field: 'local', lookup: localList },
    { title: 'Cidade', field: 'city', lookup: cityList },
    {
      title: 'Ativo',
      field: 'status',
      lookup: { 0: 'Não', 1: 'Sim' },
      render: StatusColumn,
    },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Button onClick={handleGotoEdit(id)} variant='outlined' size='small' color='primary'>
          Editar
        </Button>
      ),
    },
  ];

  useEffect(() => {
    Api.get('/event/getList').then(({ data }) => {
      if (data.success) {
        loadEvents(data.events);
        updateLists(data.events);
        setData(data.events);
      } else {
        alert('Erro ao buscar os eventos');
      }
    });
  }, [loadEvents]);
  const updateLists = (events) => {
    let city = {};
    let local = {};
    events.forEach((map) => {
      city[map.city] = map.city;
      local[map.local] = map.local;
    });
    setCityList(city);
    setLocalList(local);
  };
  const handleGotoCreate = () => {
    history.push('/dashboard/event/new');
  };

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/event/${id}`);
  };

  const [iniValue, setIniValue] = useState(new Date());
  const [endValue, setEndValue] = useState(new Date());
  const [selectType, setSelectType] = useState(1);

  const filterDate = useCallback(() => {
    if (selectType === 1) {
      setData(events);
    } else {
      const firstDate = formatDateToDB(iniValue);
      const endDate = formatDateToDB(endValue);
      const filteredDate = events.filter((data) => {
        return (
          compareDateBetween(firstDate, endDate, formatDateToDB(data.date_ini)) ||
          compareDateBetween(firstDate, endDate, formatDateToDB(data.date_end))
        );
      });
      setData(filteredDate);
    }
  }, [endValue, events, iniValue, selectType]);
  // See for changes on any input, to update the search
  useEffect(() => {
    try {
      setLoading(true);
      filterDate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [iniValue, endValue, selectType, filterDate]);
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Between
              showToday={false}
              iniValue={iniValue}
              endValue={endValue}
              onChangeIni={setIniValue}
              onChangeEnd={setEndValue}
              onSelectType={setSelectType}
              selected={1}
              size='small'
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          config={{
            pageConfig: {
              filtering: true,
            },
          }}
          toolbar={() => (
            <ButtonRound variant='contained' color='primary' onClick={handleGotoCreate}>
              Adicionar Evento
            </ButtonRound>
          )}
          isLoading={loading}
        />
      </Grid>
    </Grid>
  );
};

// export { default as Icon } from "@material-ui/icons/Person";
const mapStateToProps = ({ events }) => ({ events });

export default connect(mapStateToProps, { loadEvents })(Event);
