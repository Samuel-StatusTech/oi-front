import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Api from '../../../api';
import EaseGrid from '../../../components/EaseGrid';

import OpenColumn from './Columns/Open';
import CloseColumn from './Columns/Close';
import IdleColumn from './Columns/Idle';
import LastColumn from './Columns/Last';
import { Between } from '../../../components/Input/Date';

const Sync = ({ event }) => {
  const [list, setList] = useState([]);
  const [iniValue, onChangeIni] = useState(new Date());
  const [endValue, onChangeEnd] = useState(new Date());
  const [selectType, setSelectType] = useState(1);

  const columns = [
    { title: 'PDV', field: 'name' },
    { title: 'Última sincronização', field: 'updated_at', render: LastColumn },
    { title: 'Tempo ocioso', field: 'idle', render: IdleColumn },
    { title: 'Abertura caixa', field: 'open_at', render: OpenColumn },
    { title: 'Fechamento caixa', field: 'last_at', render: CloseColumn },
  ];

  useEffect(() => {
    console.log(`/pdv/getSinc/${event}`);
    Api.get(`/pdv/getSinc/${event}`).then(({ data }) => {
      if (data.success) {
        setList(data.pdvs);
      }
    });
  }, [event]);

  return (
    <Grid container direction='column' spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Between
          iniValue={iniValue}
          onChangeIni={onChangeIni}
          endValue={endValue}
          onChangeEnd={onChangeEnd}
          onSelectType={setSelectType}
          selected={selectType}
          size='small'
          fullWidth
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <EaseGrid title='Status de Sincronizações' columns={columns} data={list} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Sync);
