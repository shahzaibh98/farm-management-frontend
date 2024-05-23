import { Navigate } from 'react-router-dom';
import store from '../redux';
import {
  farmAdminRoutes,
  dashboardRoutes,
  profileRoutes,
  publicRoutes,
  taskRoutes,
  cropRoutes,
  livestockRoutes,
  financialRoutes,
  inventoryRoutes,
  manageUsersRoutes,
} from './route';
import { landRoutes } from './route/land.routes';
import { cropAdminRoutes } from './route/cropAdmin.routes';
import { cropAdminPlanningRoutes } from './route/cropAdminPlanning.routes';

export function getRoutesAgainstRole(currentRole: string) {
  const commonRoutes = [...dashboardRoutes, ...profileRoutes, ...publicRoutes];

  const roleRoutesMapping: any = {
    0: [...farmAdminRoutes, ...cropAdminRoutes, ...cropAdminPlanningRoutes],
    1: [
      ...taskRoutes,
      ...cropRoutes,
      ...landRoutes,
      ...livestockRoutes,
      ...financialRoutes,
      ...inventoryRoutes,
      ...manageUsersRoutes,
    ],
    2: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    3: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    4: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    5: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    6: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    7: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
    8: [...taskRoutes, ...cropRoutes, ...livestockRoutes],
  };

  const currentRoutes = roleRoutesMapping[currentRole?.toString()] || [];

  const routes = [...commonRoutes, ...currentRoutes];
  return routes;
}
