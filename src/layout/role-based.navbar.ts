import {
  IconBuildingWarehouse,
  IconCalendar,
  IconCarrot,
  IconDashboard,
  IconListDetails,
  IconReceipt2,
} from '@tabler/icons-react';
import { MdGrass, MdOutlineAdminPanelSettings } from 'react-icons/md';
import { PiPawPrint as IconPiPawPrint, PiUsers } from 'react-icons/pi';
import { TfiMapAlt } from 'react-icons/tfi';

export function getNavBarAgainstRole(currentRole: string | number) {
  const commonNavBar = [
    {
      link: '/dashboard',
      label: 'Dashboard',
      icon: IconDashboard,
      activeLinks: ['/dashboard'],
    },
  ];

  const farmCommonNavBar = [
    {
      link: '/task',
      label: 'Task',
      icon: IconListDetails,
      activeLinks: ['/task'],
    },
    {
      link: '/lands',
      label: 'Farm Locations',
      icon: TfiMapAlt,
      activeLinks: ['/lands', '/beds', '/soil-tests'],
    },
    {
      link: '/planting',
      label: 'Planting',
      icon: MdGrass,
      activeLinks: ['/planting'],
    },
    {
      link: '/livestock',
      label: 'LiveStock',
      icon: IconPiPawPrint,
      activeLinks: ['/livestock'],
    },
    {
      link: '/inventory',
      label: 'Inventory',
      icon: IconBuildingWarehouse,
      activeLinks: ['/inventory'],
    },
    {
      link: '/financial',
      label: 'Financial',
      icon: IconReceipt2,
      activeLinks: ['/financial'],
    },
  ];

  const roleNavBarMappingForFarm: any = {
    0: [
      {
        link: '/manage-farm',
        label: 'Manage Farm',
        icon: MdOutlineAdminPanelSettings,
        activeLinks: ['/manage-farm'],
      },
      {
        link: '/crops',
        label: 'Crops',
        icon: IconCarrot,
        activeLinks: ['/crops', '/planning'],
      },
      {
        link: '/crop-plan',
        label: 'Crop Plan',
        icon: IconCalendar,
        activeLinks: ['/crop-plan'],
      },
    ],
    1: [
      ...farmCommonNavBar,
      {
        link: '/manage-users',
        label: 'Manage Users',
        icon: PiUsers,
        activeLinks: ['/manage-users'],
      },
    ],
    2: farmCommonNavBar,
    3: farmCommonNavBar,
    4: farmCommonNavBar,
    5: farmCommonNavBar,
    6: farmCommonNavBar,
    7: farmCommonNavBar,
    8: farmCommonNavBar,
  };

  const roleBasedNavbar = roleNavBarMappingForFarm[Number(currentRole)] || [];

  return [...commonNavBar, ...roleBasedNavbar];
}
