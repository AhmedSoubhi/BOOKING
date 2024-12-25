// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // If there's no token, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return children;
}

export default PrivateRoute;
