import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import ProductType from './Pills/ProductType';
import View from './Pills/View';

import Overview from './Tabs/Overview';
import Detail from './Tabs/Detail';
import { useEffect } from 'react';

const Validation = ({ event }) => {
  const [type, setType] = useState('bar');
  const [view, setView] = useState(0);
  useEffect(() => {
    console.log(type);
  }, [type]);
  return (
    <>
      <ProductType event={event} value={type} setValue={setType} />
      {/*<View event={event} value={view} setValue={setView} />*/}
      <Overview event={event} type={type} />
      {/*<Grid container direction='column' spacing={2}>
        {view === 0 && (
          <Grid item xs={12}>
            <Overview type={type} />
          </Grid>
        )}
        {view === 1 && (
          <Grid item xs={12}>
            <Detail type={type} />
          </Grid>
        )}
        </Grid>*/}
    </>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Validation);
