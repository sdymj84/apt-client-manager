import React from 'react'
import { Route } from "react-router-dom";

const AppliedRoute = ({ component: C, props: childProps, ...rest }) => {
  return <Route {...rest} render={props => <C {...props} {...childProps} />} />
}

export default AppliedRoute
