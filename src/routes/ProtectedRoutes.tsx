import { Navigate, useLocation } from "react-router-dom";
//import { useAuth } from "../contexts/useAuth";

type Pros = { children: React.ReactNode }

const ProtectedRoutes = ({ children }: Pros) => {
     const location = useLocation();
     //const { isLoggedIn } = useAuth()
     const isLoggedIn = true;
     return isLoggedIn ? (
          <>
               {children}
          </>) : (
          <Navigate to="/account/login" state={{ from: location }} replace />
     )
};

export default ProtectedRoutes;

// interface Props {
//      isAllowed: boolean
//      redirectTo?: string
// }

// const ProtectedRoutes = ({ isAllowed, redirectTo = "/account/login" }: Props) => {
//      return isAllowed ? <Outlet /> : <Navigate to={redirectTo} />
// }

// export default ProtectedRoutes