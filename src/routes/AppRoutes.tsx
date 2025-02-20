import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/common/Layout";
import ForgotPassword from "../pages/account/ForgotPassword";
import Login from "../pages/account/Login";
import Profile from "../pages/account/Profile";
import Dashboard from "../pages/admin/Dashboard";
import Messages from "../pages/admin/Messages";
import Settings from "../pages/admin/Settings";
import Discounts from "../pages/discounts/Discounts";
import AccessForbidden from "../pages/errors/403";
import PageNotFound from "../pages/errors/404";
import InternalServerError from "../pages/errors/500";
import Roles from "../pages/roles/Index";
import Statistics from "../pages/statistics/Statistics";
import Taxes from "../pages/taxes/Taxes";
import IndexUser from "../pages/users/Index";
import ProtectedRoutes from "./ProtectedRoutes";

const protectedRoute = (component: any) => {
     const LayoutComponent = Layout(component);
     return <LayoutComponent />
};

const AppRoutes = createBrowserRouter(
     [
          {
               path: "/",
               element: <App />,
               children: [
                    { path: "/", element: <Login /> },
                    { path: "/account/login", element: <Login /> },
                    { path: "/account/forgotpassword", element: <ForgotPassword /> },
                    { path: "/dashboard", element: (<ProtectedRoutes>{protectedRoute(Dashboard)}</ProtectedRoutes>) },
                    { path: "/messages", element: (<ProtectedRoutes>{protectedRoute(Messages)}</ProtectedRoutes>) },
                    { path: "/settings", element: (<ProtectedRoutes>{protectedRoute(Settings)}</ProtectedRoutes>) },
                    { path: "/profile", element: (<ProtectedRoutes>{protectedRoute(Profile)}</ProtectedRoutes>) },
                    { path: "/users", element: (<ProtectedRoutes>{protectedRoute(IndexUser)}</ProtectedRoutes>) },
                    { path: "/discounts", element: (<ProtectedRoutes>{protectedRoute(Discounts)}</ProtectedRoutes>) },
                    { path: "/taxes", element: (<ProtectedRoutes>{protectedRoute(Taxes)}</ProtectedRoutes>) },
                    { path: "/statistics", element: (<ProtectedRoutes>{protectedRoute(Statistics)}</ProtectedRoutes>) },
                    { path: "/roles", element: (<ProtectedRoutes>{protectedRoute(Roles)}</ProtectedRoutes>) },
                    { path: "/errors/500", element: (<InternalServerError />) },
                    { path: "/errors/403", element: (<AccessForbidden />) },
                    { path: "*", element: (<PageNotFound />) }
               ]
               // children: [
               //      { path: "/", element: <Login /> },
               //      { path: "/account/login", element: <Login /> },
               //      { path: "/account/forgotpassword", element: <ForgotPassword /> },
               //      { path: "/dashboard", element: (<ProtectedRoutes children={protectedRoute(Dashboard)}></ProtectedRoutes>) },
               //      { path: "/messages", element: (<ProtectedRoutes resourse="messages" children={protectedRoute(Messages)}></ProtectedRoutes>) },
               //      { path: "/settings", element: (<ProtectedRoutes children={protectedRoute(Settings)}></ProtectedRoutes>) },
               //      { path: "/profile", element: (<ProtectedRoutes children={protectedRoute(Profile)}></ProtectedRoutes>) },
               //      { path: "/users", element: (<ProtectedRoutes resourse="users" children={protectedRoute(IndexUser)}></ProtectedRoutes>) },
               //      { path: "/discounts", element: (<ProtectedRoutes children={protectedRoute(Discounts)}></ProtectedRoutes>) },
               //      { path: "/taxes", element: (<ProtectedRoutes resourse="taxes" children={protectedRoute(Taxes)}></ProtectedRoutes>) },
               //      { path: "/statistics", element: (<ProtectedRoutes children={protectedRoute(Statistics)}></ProtectedRoutes>) },
               //      { path: "/roles", element: (<ProtectedRoutes resourse="roles" children={protectedRoute(Roles)}></ProtectedRoutes>) },
               //      { path: "/errors/500", element: (<InternalServerError />) },
               //      { path: "/errors/403", element: (<AccessForbidden />) },
               //      { path: "*", element: (<PageNotFound />) }
               // ]
          }
     ]
);

export default AppRoutes