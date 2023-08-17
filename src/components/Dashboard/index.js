import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Content from '../Content';

const Dashboard = () => {
  const [open, toggle] = useState(true);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (matches) {
      toggle(true);
    } else {
      toggle(false);
    }
  }, [matches]);

  return (
    <div style={{ backgroundColor: '#f5f7fa', height: '100%' }}>
      <Sidebar open={open} toggle={toggle} />
      <Navbar toggle={toggle} />
      <Content open={open} />
    </div>
  );
};

export default Dashboard;
