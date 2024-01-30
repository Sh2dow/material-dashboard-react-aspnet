import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function ProtectedRoute({ children, component: Component, ...rest }) {
  const user = useSelector(state => state.auth.user);

  return user ? (
    <Route {...rest} component={Component}>
      {children}
    </Route>
  ) : (
    <Navigate to="/auth/login-page" />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
};

export default ProtectedRoute;
