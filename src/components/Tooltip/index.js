import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 14,
  },
}))(Tooltip);

export default ({ title, children, placement = 'right' }) => {
  return (
    <Grid container>
      <Grid item>
        <LightTooltip
          title={title}
          placement={placement}
          leaveDelay={200}
        >
          <div>
            {children}
            <InfoIcon style={{ fontSize: '1.3rem' }} />
          </div>
        </LightTooltip>
      </Grid>
    </Grid>
  );
};
