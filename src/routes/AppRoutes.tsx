import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/common/Layout";
import PageNotFound from "../components/common/PageNotFound";
import Login from "../pages/account/Login";
import Logout from "../pages/account/Logout";
import Dashboard from "../pages/admin/Dashboard";
import Discounts from "../pages/admin/Discounts";
import Taxes from "../pages/admin/Taxes";
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
                    { path: "/account/login", element: <Login /> },
                    { path: "/account/logout", element: <Logout /> },

                    {
                         path: "/dashboard", element: (<ProtectedRoutes>{protectedRoute(Dashboard)}</ProtectedRoutes>)
                    },

                    {
                         path: "/users", element: (<ProtectedRoutes>{protectedRoute(IndexUser)}</ProtectedRoutes>)
                    },
                    // { path: "/users/adduser", element: (<ProtectedRoutes><ProtectedAddUser /></ProtectedRoutes>) },
                    // { path: "/users/adduser/:id", element: (<ProtectedRoutes><ProtectedAddUser /></ProtectedRoutes>) },

                    // { path: "/categories", element: (<ProtectedRoutes><ProtectedCategoryIndex /></ProtectedRoutes>) },
                    // { path: "/categories/AddUpdateCategory", element: (<ProtectedRoutes><ProtectedAddUpdateCategory /></ProtectedRoutes>) },
                    // { path: "/categories/AddUpdateCategory/:id", element: (<ProtectedRoutes><ProtectedAddUpdateCategory /></ProtectedRoutes>) },

                    // { path: "/attributes", element: (<ProtectedRoutes><ProtectedAttributesIndex /></ProtectedRoutes>) },
                    // { path: "/subcategories", element: (<ProtectedRoutes><ProtectedSubCategoryIndex /></ProtectedRoutes>) },
                    // { path: "/subcategories/AddUpdateSubCategory", element: (<ProtectedRoutes><ProtectedAddUpdateSubCategory /></ProtectedRoutes>) },
                    // { path: "/subcategories/AddUpdateSubCategory/:id", element: (<ProtectedRoutes><ProtectedAddUpdateSubCategory /></ProtectedRoutes>) },

                    {
                         path: "/discounts", element: (<ProtectedRoutes>{protectedRoute(Discounts)}</ProtectedRoutes>)
                    },
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
                    {
                         path: "*",
                         element: (<PageNotFound />)
                    }
               ]
          }
     ]
);

export default AppRoutes