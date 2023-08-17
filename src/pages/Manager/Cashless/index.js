import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import Transaction from './Tabs/transaction';
import Query from './Tabs/query';
import Residual from './Tabs/residual';
import ButtonRound from '../../../components/ButtonRound';

const Cashless = ({ event }) => {
  const [tab, setTab] = useState(0); // 0 => transacao, 1 => Consultar, 2 => Residual

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonRound
              onClick={() => setTab(0)}
              variant="contained"
              size="large"
              active={tab === 0}
            >
              Transações
            </ButtonRound>
          </Grid>
          <Grid item>
            <ButtonRound
              onClick={() => setTab(1)}
              variant="contained"
              size="large"
              active={tab === 1}
            >
              Consultar cartão
            </ButtonRound>
          </Grid>
          <Grid item>
            <ButtonRound
              onClick={() => setTab(2)}
              variant="contained"
              size="large"
              active={tab === 2}
            >
              Residual
            </ButtonRound>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} hidden={tab !== 0}>
        <Transaction event={event} hidden={tab !== 0} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} hidden={tab !== 1}>
        <Query event={event} hidden={tab !== 1} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} hidden={tab !== 2}>
        <Residual event={event} hidden={tab !== 2} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(Cashless);
