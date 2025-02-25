import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/common/Layout";
import Login from "../pages/account/Login";
import Dashboard from "../pages/admin/Dashboard";
import Discounts from "../pages/discounts/Discounts";
import AccessForbidden from "../pages/errors/403";
import PageNotFound from "../pages/errors/404";
import InternalServerError from "../pages/errors/500";
import IndexRoles from "../pages/roles/Index";
import Statistics from "../pages/statistics/Statistics";
import Taxes from "../pages/taxes/Taxes";
import IndexUser from "../pages/users/Index";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
     return createBrowserRouter([
          { path: '/', element: <Login /> },
          { path: '/account/login', element: <Login /> },
          { path: '/account/login', element: <App /> },
          {
               children: [
                    {
                         element: <ProtectedRoute pageName="Dashboard" />,
                         children: [{ path: '/dashboard', element: <Layout><Dashboard /></Layout> }]
                    },
                    {
                         element: <ProtectedRoute pageName="users" />,
                         children: [{ path: '/users', element: <Layout><IndexUser /></Layout> }]
                    },
                    {
                         element: <ProtectedRoute pageName="roles" />,
                         children: [{ path: '/roles', element: <Layout><IndexRoles /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="taxes" />,
                         children: [{ path: '/taxes', element: <Layout><Taxes /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="discounts" />,
                         children: [{ path: '/discounts', element: <Layout><Discounts /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="statistics" />,
                         children: [{ path: '/statistics', element: <Layout><Statistics /></Layout > }]
                    }
               ],
          },
          { path: '/errors/403', element: <AccessForbidden /> },
          { path: '/errors/500', element: <InternalServerError /> },
          { path: '*', element: <PageNotFound /> },
     ])
};

export default AppRoutes;