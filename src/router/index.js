import React from 'react';
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../components/Dashboard';
import EventSelect from "../pages/EventSelect";

export default () => (
  <HashRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/select" component={EventSelect} />
      <Redirect from="/" to="/login" />
    </Switch>
  </HashRouter>
);
