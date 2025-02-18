import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/common/Layout";
import ForgotPassword from "../pages/account/ForgotPassword";
import Login from "../pages/account/Login";
import Dashboard from "../pages/admin/Dashboard";
import Discounts from "../pages/admin/Discounts";
import Taxes from "../pages/admin/Taxes";
import AccessForbidden from "../pages/errors/403";
import PageNotFound from "../pages/errors/404";
import InternalServerError from "../pages/errors/500";
import Statistics from "../pages/statistics/Statistics";
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
                    { path: "/users", element: (<ProtectedRoutes>{protectedRoute(IndexUser)}</ProtectedRoutes>) },
                    // { path: "/users/adduser", element: (<ProtectedRoutes><ProtectedAddUser /></ProtectedRoutes>) },
                    // { path: "/users/adduser/:id", element: (<ProtectedRoutes><ProtectedAddUser /></ProtectedRoutes>) },

                    // { path: "/categories", element: (<ProtectedRoutes><ProtectedCategoryIndex /></ProtectedRoutes>) },
                    // { path: "/categories/AddUpdateCategory", element: (<ProtectedRoutes><ProtectedAddUpdateCategory /></ProtectedRoutes>) },
                    // { path: "/categories/AddUpdateCategory/:id", element: (<ProtectedRoutes><ProtectedAddUpdateCategory /></ProtectedRoutes>) },

                    // { path: "/attributes", element: (<ProtectedRoutes><ProtectedAttributesIndex /></ProtectedRoutes>) },
                    // { path: "/subcategories", element: (<ProtectedRoutes><ProtectedSubCategoryIndex /></ProtectedRoutes>) },
                    // { path: "/subcategories/AddUpdateSubCategory", element: (<ProtectedRoutes><ProtectedAddUpdateSubCategory /></ProtectedRoutes>) },
                    // { path: "/subcategories/AddUpdateSubCategory/:id", element: (<ProtectedRoutes><ProtectedAddUpdateSubCategory /></ProtectedRoutes>) },

                    { path: "/discounts", element: (<ProtectedRoutes>{protectedRoute(Discounts)}</ProtectedRoutes>) },
                    // { path: "/discounts/AddUpdateDiscount", element: (<ProtectedRoutes><ProtectedAddUpdateDiscount /></ProtectedRoutes>) },
                    // { path: "/discounts/AddUpdateDiscount/:id", element: (<ProtectedRoutes><ProtectedAddUpdateDiscount /></ProtectedRoutes>) },

                    // { path: "/status", element: (<ProtectedRoutes><ProtectedStatusIndex /></ProtectedRoutes>) },
                    // { path: "/status/AddUpdateStatus", element: (<ProtectedRoutes><ProtectedAddUpdateStatus /></ProtectedRoutes>) },
                    // { path: "/status/AddUpdateStatus/:id", element: (<ProtectedRoutes><ProtectedAddUpdateStatus /></ProtectedRoutes>) },

                    { path: "/taxes", element: (<ProtectedRoutes>{protectedRoute(Taxes)}</ProtectedRoutes>) },
                    // { path: "/taxes/AddUpdateTaxes", element: (<ProtectedRoutes><ProtectedAddUpdateTaxes /></ProtectedRoutes>) },
                    // { path: "/taxes/AddUpdateTaxes/:id", element: (<ProtectedRoutes><ProtectedAddUpdateTaxes /></ProtectedRoutes>) },

                    // { path: "/products", element: (<ProtectedRoutes><ProtectedProductsIndex /></ProtectedRoutes>) },
                    // { path: "/products/AddUpdateProduct", element: (<ProtectedRoutes><ProtectedAddUpdateProduct /></ProtectedRoutes>) },
                    // { path: "/products/AddUpdateProduct/:id", element: (<ProtectedRoutes><ProtectedAddUpdateProduct /></ProtectedRoutes>) },

                    // { path: "/tools/emailsender", element: (<ProtectedRoutes><ProtectedEmailSender /></ProtectedRoutes>) },
                    { path: "/taxes", element: (<ProtectedRoutes>{protectedRoute(Statistics)}</ProtectedRoutes>) },
                    { path: "/errors/500", element: (<InternalServerError />) },
                    { path: "/errors/403", element: (<AccessForbidden />) },
                    { path: "*", element: (<PageNotFound />) }
               ]
          }
     ]
);

export default AppRoutes