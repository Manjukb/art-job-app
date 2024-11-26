import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from './services/auth.service';

const PrivateRoute = ({ element, allowedRoles }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  // If the user does not have one of the allowed roles, redirect to a default page (like /home or /paintjob)
  if (!allowedRoles.some(role => currentUser.user.roles.includes(role))) {
    return <Navigate to="/home" />; // You can change the redirect to wherever you'd like
  }

  // If the user has the required role(s), render the requested component
  return element;
};

export default PrivateRoute;
