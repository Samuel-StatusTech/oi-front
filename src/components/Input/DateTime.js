import React, { memo, useEffect, useState } from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Grid, Button, makeStyles } from '@material-ui/core';

export const Between = memo(
  ({ iniValue, onChangeIni, endValue, onChangeEnd, showToday, onSelectType, allPeriodButtonColor, onSearch, ...props }) => {
    const [selected, selectType] = useState(props.selected || 0);
    const [openIni, setOpenIni] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const onToday = () => {
      selectType(0);
      const init = new Date().setHours(0, 0, 0, 0);
      const end = new Date().setHours(23, 59, 59, 999);
      onChangeIni(init);
      onChangeEnd(end);

      onSelectType && onSelectType(0);
    };

    const onAllPeriod = () => {
      selectType(1);

      onSelectType && onSelectType(1);
    };

    const handleChangeIni = (e) => {
      selectType(2);
      onChangeIni(e);
      onSelectType && onSelectType(2);
    };

    const handleChangeEnd = (e) => {
      selectType(2);
      onChangeEnd(e);
      onSelectType && onSelectType(2);
    };

    const labelFunc = (date, invalidLabel) => {
      if(selected == 1)
        return 'Todo período';

      const dateF = date._d;
      const day = `${dateF.getDate() < 10 ? '0' : ''}${dateF.getDate()}`
      const month = `${(dateF.getMonth()+1) < 10 ? '0' : ''}${(dateF.getMonth()+1)}`
      const hours = `${dateF.getHours() < 10 ? '0' : ''}${dateF.getHours()}`
      const minutes = `${dateF.getMinutes() < 10 ? '0' : ''}${dateF.getMinutes()}`
      return `${day}/${month}/${dateF.getFullYear()} ${hours}:${minutes}`
    }
    useEffect(() => {
      selectType(props.selected);
      onSelectType && onSelectType(props.selected);
    },[props.selected])
    return (
      <Grid container spacing={2} alignItems='center'>
        <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
          <Button
            variant='outlined'
            color='default'
            onClick={onAllPeriod}
            fullWidth
            style={{ padding: '8px', fontSize: 13,  color: selected === 1 ? '#fff' : '#000', backgroundColor: selected === 1 ? '#0097FF' : '#FFF' }}
            >
            Todo o Período
          </Button>
        </Grid>
        {showToday !== false && (
          <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
            <Button
              variant='outlined'
              color='default'
              onClick={onToday}
              fullWidth
              style={{ padding: '8px', fontSize: 13,  color: selected === 0 ? '#fff' : '#000', backgroundColor: selected === 0 ? '#0097FF' : '#FFF' }}
            >
              Hoje
            </Button>
          </Grid>
        )}
        <Grid item xl={3} lg={3} md={4} sm={6} xs={12} >
            <KeyboardDateTimePicker
              autoOk
              ampm={false}
              allowKeyboardControl={false}
              label='De'
              value={iniValue}
              labelFunc={labelFunc}
              onChange={(dateIni)=>handleChangeIni(dateIni._d)}
              open={openIni}
              onOpen={() => setOpenIni(true)}
              onClose={() => setOpenIni(false)}
              onClick={()=>setOpenIni(true)}
              inputVariant='outlined'
              variant='inline'
              format='DD/MM/YYYY hh:mm'
              fullWidth
              {...props}
              style={{ backgroundColor: '#fff' }}
            />
        </Grid>
        <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
          <KeyboardDateTimePicker
            autoOk
            ampm={false}
            allowKeyboardControl={false}
            label='Até'
            value={endValue}
            labelFunc={labelFunc}
            onChange={(setDateEnd)=>handleChangeEnd(setDateEnd._d)}
            open={openEnd}
            onOpen={() => setOpenEnd(true)}
            onClose={() => setOpenEnd(false)}
            onClick={()=>setOpenEnd(true)}
            minDate={iniValue}
            minDateMessage='A data final deve ser posterior a data inicial'
            inputVariant='outlined'
            variant='inline'
            format='DD/MM/YYYY hh:mm'
            fullWidth
            {...props}
            style={{ backgroundColor: '#fff' }}
          />
        </Grid>
        <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
          <Button
              variant='outlined'
              color='default'
              onClick={onSearch}
              fullWidth
              style={{ padding: '8px', fontSize: 13, backgroundColor: 'white' }}
            >
              Pesquisar
          </Button>
        </Grid>
      </Grid>
    );
  }
);

export const DateComponent = (props) => {
  return <KeyboardDateTimePicker inputVariant='outlined' variant='inline' format='DD/MM/YYYY' {...props} />;
};
