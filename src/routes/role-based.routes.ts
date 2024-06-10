import {
  cropsRoutes,
  dashboardRoutes,
  farmAdminRoutes,
  financialRoutes,
  inventoryRoutes,
  livestockRoutes,
  manageUsersRoutes,
  plantingRoutes,
  profileRoutes,
  publicRoutes,
  taskRoutes,
} from './route';

import { landRoutes } from './route/land.routes';

export function getRoutesAgainstRole(currentRole: string) {
  const commonRoutes = [...dashboardRoutes, ...profileRoutes, ...publicRoutes];

  const roleRoutesMapping: any = {
    0: [...farmAdminRoutes, ...cropsRoutes],
    1: [
      ...taskRoutes,
      ...plantingRoutes,
      ...landRoutes,
      ...livestockRoutes,
      ...financialRoutes,
      ...inventoryRoutes,
      ...manageUsersRoutes,
    ],
    2: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    3: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    4: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    5: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    6: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    7: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
    8: [...taskRoutes, ...plantingRoutes, ...livestockRoutes],
  };

  const currentRoutes = roleRoutesMapping[currentRole?.toString()] || [];

  const routes = [...commonRoutes, ...currentRoutes];
  return routes;
}
