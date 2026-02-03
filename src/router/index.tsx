import { createBrowserRouter, RouterProvider } from 'react-router';
import App from '../App';
import Home from '../pages/Home';
import History from '../pages/History';
import Stats from '../pages/Stats';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'stats',
        element: <Stats />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
