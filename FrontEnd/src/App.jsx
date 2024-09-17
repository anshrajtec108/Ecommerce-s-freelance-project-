import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/requireApp/ErrorBoundary';
import NotFound from './components/requireApp/NotFound';
import ServerError from './components/requireApp/ServerError';
import AccessDenied from './components/requireApp/AccessDenied';
import BadRequest from './components/requireApp/BadRequest';
import Forbidden from './components/requireApp/Forbidden';
import MaintenanceMode from './components/requireApp/MaintenanceMode';
import HomePage from './components/HomePage/HomePage';
import CreateProduct from './components/seller/product/CreateProduct';
import RegisterUser from './components/user/RegisterUser';
import MultipleLoginPage from './components/user/MultipleLoginPage';
import ProductDetail from './components/Card/ProductDetail';
import CartPage from './components/Card/CartPage';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import SalesReport from './components/admin/SalesReport';
import UserActivityLog from './components/admin/UserActivityLog';
import SystemSettings from './components/admin/SystemSettings';
import ErrorLogs from './components/admin/ErrorLogs';
import Charts from './components/admin/Charts';
import Sidebar from './components/admin/Sidebar';
import AdminLayout from './components/admin/adminLayout';

// import PendingOrders from './components/admin/PendingOrders';
// import LogStatistics from './components/admin/LogStatistics'; // Assuming you have this component
// import ErrorStatistics from './components/admin/ErrorStatistics'; // Assuming you have this component

const router = createBrowserRouter([
  // Public routes
  {
    path: "/product/:id",
    element: <ProductDetail />
  },
  {
    path: "/cart",
    element: <CartPage />
  },
  {
    path: "/login",
    element: <MultipleLoginPage />
  },
  {
    path: "/",
    element: <HomePage />
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <UserManagement />
      },
      {
        path: "users/:id",
        element: <UserActivityLog />
      },
      {
        path: "categories",
        element: <CategoryManagement />
      },
      {
        path: "sales-report",
        element: <SalesReport />
      },
      {
        path: "user-activity-log",
        element: <UserActivityLog />
      },
      {
        path: "system-settings",
        element: <SystemSettings />
      },
      {
        path: "error-logs",
        element: <ErrorLogs />
      },
      {
        path: "/admin/log-statistics",
        element: <Charts />
      }
    ]
  },
  // {
  //   path: "/admin/pending-orders",
  //   element: <PendingOrders />
  // },

  // {
  //   path: "/admin/error-statistics",
  //   element: <ErrorStatistics />
  // },

  // Error handling routes
  {
    path: '/not-found',
    element: <NotFound />,
  },
  {
    path: '/server-error',
    element: <ServerError />,
  },
  {
    path: '/access-denied',
    element: <AccessDenied />,
  },
  {
    path: '/bad-request',
    element: <BadRequest />,
  },
  {
    path: '/forbidden',
    element: <Forbidden />,
  },
  {
    path: '/maintenance',
    element: <MaintenanceMode />,
  },
  {
    path: '*', // Wildcard route for unmatched paths
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
