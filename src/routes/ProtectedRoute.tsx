import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
     pageName: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ pageName }) => {
     const { isAuthenticated, userLoggedData, isReady } = useContext(AuthContext);

     if (!isReady) {
          // Show a loading state while authentication data is being fetched
          return <div>Loading...</div>;
     }

     if (typeof isAuthenticated !== 'function' || !userLoggedData) {
          throw new Error('Authentication or user data is not available in AuthContext');
     }

     const isUserAuthenticated = isAuthenticated();

     // Check if the user has any of the allowed roles (if roles are specified)
     const hasRequiredRole =
          userLoggedData.userData.roles &&
          userLoggedData.userData.roles.length > 0 &&
          userLoggedData.userData.roles.some((role) => userLoggedData.userData.roles.includes(role));

     // Determine if the user can access the route
     const canAccessRoute = isUserAuthenticated && (!userLoggedData.userData.roles || userLoggedData.userData.roles.length === 0 || hasRequiredRole);

     // Log access attempt (optional)
     if (pageName) {
          if (!canAccessRoute) {
               console.warn(`Access denied to "${pageName}" for user with roles:`, userLoggedData.userData.roles);
          } else {
               console.log(`Access granted to "${pageName}" for user with roles:`, userLoggedData.userData.roles);
          }
     }

     return canAccessRoute ? <Outlet /> : <Navigate to="/account/login" replace />;
};

export default ProtectedRoute;