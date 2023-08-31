import React, { useState } from 'react';
import { connect } from 'react-redux';
import Overview from './Tabs/Overview';


const FinancialStatement = ({ event }) => {
  return (
    <>
       <Overview event={event} />
    </>
  );
};

const mapStateToProps = ({ event }) => ({ event });

export default connect(mapStateToProps)(FinancialStatement);
