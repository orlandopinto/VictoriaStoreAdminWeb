import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

type Pros = {
     children: React.ReactNode
}

const ProtectedRoutes = ({ children }: Pros) => {
     const location = useLocation();
     const { isAuthenticated } = useAuth()
     //console.log('ProtectedRoutes -isAuthenticated: ', isAuthenticated())
     return isAuthenticated() ? (
          <>
               {children}
          </>) : (
          <Navigate to="/account/login" state={{ from: location }} replace />
     )
};

export default ProtectedRoutes;

// const ProtectedRoutes = ({ children, resourse }: Pros) => {
//      const { isAllowed } = useAuth();
//      const location = useLocation();
//      const { isAuthenticated } = useAuth()

//      return isAuthenticated() ? (
//           resourse === undefined || isAllowed(resourse) ? (
//                <>{children}</>
//           ) : (
//                <Navigate to="/errors/403" state={{ from: location }} replace />
//           )
//      ) : (
//           <Navigate to="/account/login" state={{ from: location }} replace />
//      );
// };


// export default ProtectedRoutes