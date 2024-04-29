import {
  IconBuildingWarehouse,
  IconCarrot,
  IconDashboard,
  IconListDetails,
  IconReceipt2,
} from '@tabler/icons-react';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineLandslide,
} from 'react-icons/md';
import { PiPawPrint as IconPiPawPrint, PiUsers } from 'react-icons/pi';
import store from '../redux';

export function getNavBarAgainstRole() {
  const currentRole = store.getState()?.userInfo?.userInfo?.roleId;

  const commonNavBar = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  ];

  const clientCommonNavBar = [
    { link: '/task', label: 'Task', icon: IconListDetails },
    { link: '/lands', label: 'Lands', icon: MdOutlineLandslide },
    { link: '/crop', label: 'Crop', icon: IconCarrot },
    { link: '/livestock', label: 'LiveStock', icon: IconPiPawPrint },
    { link: '/inventory', label: 'Inventory', icon: IconBuildingWarehouse },
    { link: '/financial', label: 'Financial', icon: IconReceipt2 },
  ];

  const roleNavBarMapping: any = {
    0: [
      {
        link: '/manage-farm',
        label: 'Manage Farm',
        icon: MdOutlineAdminPanelSettings,
      },
    ],
    1: [
      ...clientCommonNavBar,
      { link: '/manage-users', label: 'Manage Users', icon: PiUsers },
    ],
    2: clientCommonNavBar,
    3: clientCommonNavBar,
    4: clientCommonNavBar,
    5: clientCommonNavBar,
    6: clientCommonNavBar,
    7: clientCommonNavBar,
    8: clientCommonNavBar,
  };

  const roleBasedNavbar = roleNavBarMapping[currentRole] || [];

  return [...commonNavBar, ...roleBasedNavbar];
}
