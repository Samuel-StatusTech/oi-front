import React, { memo, useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Grid, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  todayButton: {
    color: (props) => (props.selected === 0 ? '#fff' : '#000'),
    backgroundColor: (props) => (props.selected === 0 ? '#0097FF' : '#fff'),
  },
  allButton: {
    color: (props) => (props.selected === 1 ? '#fff' : '#000'),
    backgroundColor: (props) => (props.selected === 1 ? '#0097FF' : '#fff'),
  },
}));

export const Between = memo(
  ({ iniValue, onChangeIni, endValue, onChangeEnd, showToday, onSelectType, allPeriodButtonColor, ...props }) => {
    const [selected, selectType] = useState(props.selected || 0);
    const onToday = () => {
      selectType(0);
      const init = new Date().setHours(0, 0, 0, 0);
      const end = new Date().setHours(23, 59, 59, 999);
      onChangeIni(init);
      onChangeEnd(end);

      onSelectType && onSelectType(0);
    };

    const classes = useStyles({ ...props, selected });

    const onAllPeriod = () => {
      selectType(1);
      // const init = Date.parse(event.date_ini);
      // const end = new Date().setHours(23, 59, 59, 999);
      // onChangeIni(init);
      // onChangeEnd(end);

      onSelectType && onSelectType(1);
    };

    const handleChangeIni = (e) => {
      e = new Date(e);
      if(e.setHours)
        e.setHours(0, 0, 0, 0);
      selectType(2);
      onChangeIni(e);
      onSelectType && onSelectType(2);
    };

    const handleChangeEnd = (e) => {
      e = new Date(e);
      if(e.setHours)
        e.setHours(23, 59, 59, 999);
      selectType(2);
      onChangeEnd(e);
      onSelectType && onSelectType(2);
    };

    return (
      <Grid container spacing={2} alignItems='center'>
        <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
          <Button
            variant='outlined'
            color='default'
            onClick={onAllPeriod}
            fullWidth
            className={classes.allButton}
            style={{ padding: '8px' }}
          >
            Todo o Período
          </Button>
        </Grid>
        {showToday !== false && (
          <Grid item xl={3} lg={3} md={2} sm={6} xs={12}>
            <Button
              variant='outlined'
              color='default'
              onClick={onToday}
              fullWidth
              className={classes.todayButton}
              style={{ padding: '8px' }}
            >
              Hoje
            </Button>
          </Grid>
        )}
        <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
          <KeyboardDatePicker
            label='De'
            value={iniValue}
            onChange={handleChangeIni}
            inputVariant='outlined'
            variant='inline'
            format='DD/MM/YYYY'
            fullWidth
            {...props}
            style={{ backgroundColor: '#fff' }}
          />
        </Grid>
        <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
          <KeyboardDatePicker
            label='Até'
            value={endValue}
            onChange={handleChangeEnd}
            minDate={iniValue}
            minDateMessage='A data final deve ser posterior a data inicial'
            inputVariant='outlined'
            variant='inline'
            format='DD/MM/YYYY'
            fullWidth
            {...props}
            style={{ backgroundColor: '#fff' }}
          />
        </Grid>
      </Grid>
    );
  }
);

export const DateComponent = (props) => {
  return <KeyboardDatePicker inputVariant='outlined' variant='inline' format='DD/MM/YYYY' {...props} />;
};
