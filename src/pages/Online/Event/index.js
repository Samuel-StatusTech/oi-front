import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { loadEvents } from '../../../action';
import EaseGrid from '../../../components/EaseGrid';
import Api from '../../../api';
import { compareDateBetween, formatDateToDB } from '../../../utils/date';
import OnlineColumn from '../../../components/EaseGrid/Columns/Online';

const Event = ({ events, loadEvents }) => {
  const history = useHistory();
  const [data, setData] = useState(events);
  const [, setCityList] = useState({});
  const [, setLocalList] = useState({});
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: 'Nome do evento', field: 'name' },
    {
      title: 'Venda online',
      field: 'status',
      lookup: { 0: 'Não', 1: 'Sim' },
      render: OnlineColumn,
    },
    {
      title: 'Ações',
      render: ({ id }) => (
        <Button onClick={handleGotoEdit(id)} variant='outlined' size='small' color='primary'>
          Editar
        </Button>
      ),
    }
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

  const handleGotoEdit = (id) => () => {
    history.push(`/dashboard/online-events/${id}`);
  };

  const [iniValue] = useState(new Date());
  const [endValue] = useState(new Date());
  const [selectType] = useState(1);

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
      <Grid item lg md sm xs>
        <EaseGrid
          columns={columns}
          data={data}
          config={{
          }}
          isLoading={loading}
        />
      </Grid>
    </Grid>
  );
};

// export { default as Icon } from "@material-ui/icons/Person";
const mapStateToProps = ({ events }) => ({ events });

export default connect(mapStateToProps, { loadEvents })(Event);
