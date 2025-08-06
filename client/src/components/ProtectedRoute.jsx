// File: client/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This is optional but a good user experience.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;