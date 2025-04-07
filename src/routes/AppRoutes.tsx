import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/common/Layout";
import Login from "../pages/account/Login";
import Dashboard from "../pages/admin/Dashboard";
import IndexCategories from "../pages/categories/Index";
import Discounts from "../pages/discounts/Discounts";
import InternalServerError from "../pages/errors/500";
import CreateProduct from "../pages/products/CreateProduct";
import EditProduct from "../pages/products/EditProduct";
import IndexProducts from "../pages/products/Index";
import IndexRoles from "../pages/roles/Index";
import Statistics from "../pages/statistics/Statistics";
import IndexSubCategories from "../pages/sub-categories/Index";
import Taxes from "../pages/taxes/Taxes";
import IndexUser from "../pages/users/Index";
import ProtectedRoute from "./ProtectedRoute";
import AccessForbidden from "../pages/errors/403";
import PageNotFound from "../pages/errors/404";
import IndexMiscelaneos from "../pages/misc/Index";

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
                         children: [{ path: '/categories', element: <Layout><IndexCategories /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="taxes" />,
                         children: [{ path: '/subcategories', element: <Layout><IndexSubCategories /></Layout > }]
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
                         element: <ProtectedRoute pageName="products" />,
                         children: [{ path: '/products', element: <Layout><IndexProducts /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="misc" />,
                         children: [{ path: '/misc', element: <Layout><IndexMiscelaneos /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="products" />,
                         children: [{ path: '/products/create', element: <Layout><CreateProduct /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="products" />,
                         children: [{ path: '/products/edit/:id', element: <Layout><EditProduct /></Layout > }]
                    },
                    {
                         element: <ProtectedRoute pageName="statistics" />,
                         children: [{
                              path: '/statistics', element: <Layout><Statistics /></Layout >
                         }]
                    }
               ],
          },
          { path: '/errors/403', element: <AccessForbidden /> },
          { path: '/errors/500', element: <InternalServerError /> },
          { path: '*', element: <PageNotFound /> }
     ])
};

export default AppRoutes;