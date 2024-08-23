import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/requireApp/ErrorBoundary';
import NotFound from './components/requireApp/NotFound';
import ServerError from './components/requireApp/ServerError';
import AccessDenied from './components/requireApp/AccessDenied';
import BadRequest from './components/requireApp/BadRequest';
import Forbidden from './components/requireApp/Forbidden';
import MaintenanceMode from './components/requireApp/MaintenanceMode';
import HomePage from './components/HomePage/HomePage';

const router = createBrowserRouter([
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
  return(<>
    {/* {<RouterProvider router={router} />; }  */}
  <HomePage/>
  </>)
};

export default App;
