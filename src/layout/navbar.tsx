import { Code, Group, useMantineTheme } from '@mantine/core';
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
import { PiPawPrint as IconPiPawPrint } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { Text } from '../concave.agri/components';
import { extractFirstWord } from '../utils/common/function';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '../redux/actions/user';

const data = [
  { link: '/', label: 'Dashboard', icon: IconDashboard },
  { link: '/task', label: 'Task', icon: IconListDetails },
  { link: '/livestock', label: 'LiveStock', icon: IconPiPawPrint },
  { link: '/crop', label: 'Crop', icon: IconCarrot },
  { link: '/inventory', label: 'Inventory', icon: IconBuildingWarehouse },
  { link: '/financial', label: 'Financial', icon: IconReceipt2 },
];

function Navbar() {
  const theme = useMantineTheme();
  const dispatch = useDispatch();

  const [value, setValue] = useLocalStorage({
    key: 'active-tab',
    defaultValue: 'dashboard',
  });
  const [active, setActive] = useState(value);
  const url = window.location.href;
  const currentUrl = extractFirstWord(url);

  const links = data.map(item => (
    <Link
      className={`flex items-center text-md font-medium rounded-md px-4 py-3 mb-2 border-none hover:bg-secondaryColors-100 hover:text-darkColors-100 hover:border-none ${
        item.label === active || item.link === `/${currentUrl}`
          ? 'bg-secondaryColors-100 text-darkColors-100'
          : 'text-lightColors-100'
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
    <div
      className={`flex flex-col h-full`}
      style={{
        color: theme.colors.lightColors[6],
        backgroundColor: theme.colors.darkColors[0],
      }}
    >
      <div className="h-[11%] overflow-hidden mt-8 ml-4">
        <Group>
          <Code
            color={theme.colors.secondaryColors[3]}
            c={theme.colors.darkColors[0]}
          >
            <Text fw={550} c={theme.colors.darkColors[0]}>
              F.M v1.0
            </Text>
          </Code>
        </Group>
      </div>
      <div className="h-[82%] overflow-y-auto">
        <div className="flex flex-col p-2">{links}</div>
      </div>
      <div className="h-[30%] lg:h-[7%] items-center border-t-2 border-t-skin-light flex justify-around gap-5 py-1 flex-wrap">
        <a
          href=""
          className="flex items-center text-sm font-medium rounded-sm hover:bg-gray-100 hover:text-secondaryColors-100"
          onClick={event => event.preventDefault()}
        >
          <IconSwitchHorizontal className="w-6 h-6" stroke={1.5} />
        </a>
        <a
          className="flex items-center text-sm font-medium rounded-sm hover:bg-gray-100 hover:text-secondaryColors-100"
          onClick={() => dispatch(clearUserInfo())}
          href=""
        >
          <IconLogout className="w-6 h-6" stroke={1.5} />
        </a>
      </div>
    </div>
  );
}

export default Navbar;
