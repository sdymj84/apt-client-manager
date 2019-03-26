import React from 'react'
import { Route, Switch } from "react-router-dom";
import NotFound from './containers/NotFound';
import AppliedRoute from './components/AppliedRoute'
import Home from './containers/Home';
import Login from './containers/Login'
import New from './containers/Resident/New'
import ApartInfo from './containers/Apart/Info';

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <AppliedRoute exact path='/' component={Home} props={childProps} />
      <AppliedRoute path='/login' component={Login} props={childProps} />
      <AppliedRoute path='/new-resident' component={New} props={childProps} />
      <AppliedRoute path='/aparts' component={ApartInfo} props={childProps} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes
