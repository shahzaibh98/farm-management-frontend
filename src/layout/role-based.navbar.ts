import {
  IconDashboard,
  IconListDetails,
  IconCarrot,
  IconBuildingWarehouse,
  IconReceipt2,
} from '@tabler/icons-react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { PiPawPrint as IconPiPawPrint } from 'react-icons/pi';
import store from '../redux';
import { MdOutlineLandslide } from 'react-icons/md';
import { HiOutlineUsers } from 'react-icons/hi2';

const currentRole = store.getState()?.userInfo?.userInfo?.roleId;

export function getNavBarAgainstRole() {
  const commonNavBar = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  ];
  const roleBasedNavbar =
    currentRole === 0
      ? [
          {
            link: '/manage-farm',
            label: 'Manage Farm',
            icon: MdOutlineAdminPanelSettings,
          },
        ]
      : [
          { link: '/task', label: 'Task', icon: IconListDetails },
          {
            link: '/lands',
            label: 'Lands',
            icon: MdOutlineLandslide,
          },
          { link: '/crop', label: 'Crop', icon: IconCarrot },
          { link: '/livestock', label: 'LiveStock', icon: IconPiPawPrint },

          {
            link: '/inventory',
            label: 'Inventory',
            icon: IconBuildingWarehouse,
          },
          { link: '/financial', label: 'Financial', icon: IconReceipt2 },
          {
            link: '/manage-users',
            label: 'Manage Users',
            icon: HiOutlineUsers,
          },
        ];

  return [...commonNavBar, ...roleBasedNavbar];
}
