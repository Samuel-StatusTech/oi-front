import React, { useState, memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { Menu, MenuItem, Button } from '@material-ui/core';

import Api from '../../api';
import { loadEvents, selectEvent } from '../../action';
import { useHistory } from 'react-router-dom';

import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Brightness1Icon from '@material-ui/icons/Brightness1';

const EventList = ({ loadEvents, selectEvent, user, event, events }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [eventData, setEventData] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (events.length === 0) {
      Api.get('/event/getList').then(({ data }) => {
        if (data.success) {
          loadEvents(data.events);
        } else {
          alert('Erro ao buscar os eventos');
        }
      });
    }
  }, [events.length, loadEvents]);

  useEffect(() => {
    const evt = events.find((e) => e.id === event)
    if(evt)
      setEventData(evt);
    else if(events.length > 0)
      selectEvent(events[0].id)
  }, [event, events, selectEvent]);

  useEffect(() => {
    if (eventData) {
      setName(eventData.name);
      setStatus(eventData.status);
    } else if (events.length > 0) {
      selectEvent(events?.[0]?.id);
    } else {
      setName('Nenhum evento encontrado');
    }
  }, [eventData]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (key) => () => {
    selectEvent(key);
    handleClose();
    history.replace('/dashboard/home');
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        style={{
          color: '#3B94FF',
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}
        endIcon={<ArrowDropDown />}
      >
        {window.screen.width < 500 ? (name ?? '').substring(0, 10) : (name ?? '')}
      </Button>
      <Menu id='event-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {events.map((event, index) => {
          if (eventData.status !== event.status) return null;
          return (
            <MenuItem key={index} onClick={handleSelect(event.id)}>
              <Brightness1Icon
                style={{
                  fontSize: 16,
                  paddingRight: '3px',
                  color: event.status ? '#32CD32' : '#FF0000',
                }}
              />
              {event.name}
            </MenuItem>
          );
        })}

        <MenuItem onClick={() => history.push('/select')}>Visualizar todos os eventos</MenuItem>
      </Menu>
    </div>
  );
};

const mapStateToProps = ({ user, events, event }) => ({ user, events, event });

export default connect(mapStateToProps, { loadEvents, selectEvent })(memo(EventList));
