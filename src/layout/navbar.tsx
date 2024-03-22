import { Code, Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconBuildingWarehouse,
  IconCarrot,
  IconDashboard,
  IconListDetails,
  IconLogout,
  IconReceipt2,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { useState } from 'react';
import { PiPawPrint } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { CustomText } from '../components/text';
import { extractFirstWord } from '../utils/common/function';

const data = [
  { link: '/', label: 'Dashboard', icon: IconDashboard },
  { link: '/task', label: 'Task', icon: IconListDetails },
  { link: '/livestock', label: 'LiveStock', icon: PiPawPrint },
  { link: '/crop', label: 'Crop', icon: IconCarrot },
  { link: '/inventory', label: 'Inventory', icon: IconBuildingWarehouse },
  { link: '/financial', label: 'Financial', icon: IconReceipt2 },
];

function Navbar() {
  const [value, setValue] = useLocalStorage({
    key: 'active-tab',
    defaultValue: 'dashboard',
  });
  const [active, setActive] = useState(value);
  const url = window.location.href;
  const currentUrl = extractFirstWord(url);
  const links = data.map(item => (
    <Link
      className={`flex items-center text-md font-medium rounded-md px-8 py-4 mb-2 ${
        item.label === active || item.link === `/${currentUrl}`
          ? 'bg-gray-500 text-[]'
          : 'text-gray-700'
      }`}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
        setValue(item.label);
      }}
    >
      <item.icon className="w-6 h-6 mr-2" stroke={'1.5'} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <div className="flex flex-col h-full mx-2">
      <div className="h-[11%] overflow-hidden mt-8 ml-4">
        <Group>
          <Code>
            <CustomText fw={700}>F.M v1.0</CustomText>
          </Code>
        </Group>
      </div>
      <div className="h-[82%] overflow-y-auto">
        <div className="flex flex-col">{links}</div>
      </div>
      <div className="h-[30%] lg:h-[7%] items-center border-t-2 border-t-skin-light flex justify-around gap-5 py-1 flex-wrap">
        <a
          href="#"
          className="flex items-center text-sm font-medium rounded-sm hover:bg-gray-100"
          onClick={event => event.preventDefault()}
        >
          <IconSwitchHorizontal className="w-6 h-6" stroke={1.5} />
        </a>
        <a
          href="#"
          className="flex items-center text-sm font-medium rounded-sm hover:bg-gray-100"
          onClick={event => event.preventDefault()}
        >
          <IconLogout className="w-6 h-6" stroke={1.5} />
        </a>
      </div>
    </div>
  );
}

export default Navbar;
