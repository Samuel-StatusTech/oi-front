import React, { useState } from 'react';
import { connect } from 'react-redux';
import Overview from './Tabs/Overview';


const FinancialStatement = ({ event }) => {
  return (
    <div style={{
      height: "100%"
    }}>
       <Overview event={event} />
    </div>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(FinancialStatement);
