// assets
import { IconDashboard, IconStar } from '@tabler/icons-react';
import { GoTasklist } from 'react-icons/go';
// constant
const icons = { IconDashboard, IconStar, GoTasklist };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Farm Management',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
    {
      id: 'task',
      title: 'Task',
      type: 'item',
      url: '/task',
      icon: icons.GoTasklist,
      breadcrumbs: true,
    },
  ],
};

export default dashboard;
