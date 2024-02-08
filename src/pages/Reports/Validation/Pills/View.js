import React from 'react';

import { Grid, Tab, Tabs, withStyles } from '@material-ui/core';

const AntTabs = withStyles({
  root: {
    marginBottom: '10px',
  },
  indicator: {
    backgroundColor: '#0097FF',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    '&:hover': {
      color: '#0097FF',
    },
  },
}))(Tab);

export default ({ value, setValue }) => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <AntTabs value={value} onChange={(e, data) => setValue(data)}>
          <AntTab label="Visão Geral" index={0} />
          <AntTab label="Detalhado operador" index={1} />
        </AntTabs>
      </Grid>
    </Grid>
  );
};
