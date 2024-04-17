import { createBrowserRouter } from 'react-router-dom';
import {
  cropRoutes,
  dashboardRoutes,
  financialRoutes,
  inventoryRoutes,
  livestockRoutes,
  publicRoutes,
  taskRoutes,
  profileRoutes,
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
    ...profileRoutes,
  ],
  { basename: '/' }
);

export default authRouter;
