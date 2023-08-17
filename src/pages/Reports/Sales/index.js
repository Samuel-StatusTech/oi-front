import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import ProductType from './Pills/ProductType';
import View from './Pills/View';

import Overview from './Tabs/Overview';
import Operators from './Tabs/Operators';
import Closure from './Tabs/Closure';
import Profit from './Tabs/Profit';

const Sales = ({ event }) => {
  const [type, setType] = useState([
    {
      all: { page: 0, view: 0 },
      bar: { page: 0, view: 0 },
      ingresso: { page: 0, view: 0 },
      estacionamento: { page: 0, view: 0 },
    },
  ]);
  const [selected, onSelectType] = useState(1);
  const [value, setValue] = useState('all');
  // [page, view]
  const [view, setView] = useState([0, 0]);
  const changeSetView = (page, view) => {
    const arrayView = [...type];
    arrayView[0][value].page = page;
    arrayView[0][value].view = view;
    setType(arrayView);
    setView([page, view]);
  };
  const handleType = (productType) => {
    setValue(productType);
    setView([type[0][productType].page, type[0][productType].view]);
    onSelectType(1);
  };
  return (
    <>
      <ProductType event={event} value={value} setValue={handleType} />
      <View event={event} value={view} setValue={changeSetView} type={value} />
      <Grid container direction='column' spacing={2}>
        {view[1] === 0 && (
          <Grid item xs={12}>
            <Overview selected={selected} onSelectType={onSelectType} type={value} event={event} />
          </Grid>
        )}
        {view[1] === 1 && (
          <Grid item xs={12}>
            <Operators type={value} event={event} />
          </Grid>
        )}
        {view[1] === 2 && (
          <Grid item xs={12}>
            <Closure type={value} event={event} />
          </Grid>
        )}
        {view[1] === 3 && (
          <Grid item xs={12}>
            <Profit type={value} event={event} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Sales);
