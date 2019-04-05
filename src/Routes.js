import React from 'react'
import { Route, Switch } from "react-router-dom";
import NotFound from './containers/NotFound';
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'
import Home from './containers/Home';
import Login from './containers/Login'
import New from './containers/Resident/New'
import ApartInfo from './containers/Apart/Info';
import Announcement from './containers/Apart/Announcement';
import Requests from './containers/Maintanance/Requests';

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <AuthenticatedRoute exact path='/' component={Home} props={childProps} />
      <UnauthenticatedRoute path='/login' component={Login} props={childProps} />
      <AuthenticatedRoute path='/new-resident' component={New} props={childProps} />
      <AuthenticatedRoute path='/aparts' component={ApartInfo} props={childProps} />
      <AuthenticatedRoute path='/announcement' component={Announcement} props={childProps} />
      <AuthenticatedRoute path='/maintanances' component={Requests} props={childProps} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes
