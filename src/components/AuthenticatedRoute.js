import React from 'react'
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({ component: C, props: childProps, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      childProps.isAuthenticated
        ? <C {...props} {...childProps} />
        : <Redirect
          to={`/login?redirect=${props.location.pathname}
          ${props.location.search}`} />
    } />


export default AuthenticatedRoute
