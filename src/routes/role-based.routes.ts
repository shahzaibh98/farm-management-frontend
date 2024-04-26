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
} from './route';

const currentRole = store.getState()?.userInfo?.userInfo?.roleId;

export function getRoutesAgainstRole() {
  const commonRoutes = [...dashboardRoutes, ...profileRoutes, ...publicRoutes];

  const currentRoutes =
    currentRole === 0
      ? [...farmAdminRoutes]
      : [
          ...taskRoutes,
          ...cropRoutes,
          ...livestockRoutes,
          ...financialRoutes,
          ...inventoryRoutes,
        ];

  return [...commonRoutes, ...currentRoutes];
}
