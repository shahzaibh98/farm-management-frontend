import {
  cropRoutes,
  dashboardRoutes,
  farmAdminRoutes,
  financialRoutes,
  inventoryRoutes,
  livestockRoutes,
  manageUsersRoutes,
  profileRoutes,
  publicRoutes,
  taskRoutes,
} from './route';
import { cropAdminRoutes } from './route/cropAdmin.routes';
import { landRoutes } from './route/land.routes';

export function getRoutesAgainstRole(currentRole: string) {
  const commonRoutes = [...dashboardRoutes, ...profileRoutes, ...publicRoutes];

  const roleRoutesMapping: any = {
    0: [...farmAdminRoutes, ...cropAdminRoutes],
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
