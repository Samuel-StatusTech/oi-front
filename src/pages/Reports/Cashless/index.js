import React, { useState } from 'react';

import View from './Pills/View';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Overview from './Tabs/Overview';
import Adjustment from './Tabs/Adjustment';
import Query from '../../Manager/Cashless/Tabs/query';

const Cashless = ({ event }) => {
  const [view, setView] = useState(0);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <View event={event} value={view} setValue={setView} />
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12} hidden={view !== 0}>
        <Overview event={event} view={view} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} hidden={view !== 2}>
        <Adjustment event={event} view={view} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} hidden={view !== 3}>
        <Query />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Cashless);
