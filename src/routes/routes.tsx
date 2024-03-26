import { createBrowserRouter } from 'react-router-dom';
import {
  cropRoutes,
  dashboardRoutes,
  financialRoutes,
  inventoryRoutes,
  livestockRoutes,
  publicRoutes,
  taskRoutes,
} from './route';

const authRouter = createBrowserRouter(
  [
    ...taskRoutes,
    ...cropRoutes,
    ...livestockRoutes,
    ...publicRoutes,
    ...dashboardRoutes,
    ...financialRoutes,
    ...inventoryRoutes,
  ],
  { basename: '/' }
);

export default authRouter;
