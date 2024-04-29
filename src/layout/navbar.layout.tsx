// Mantine library imports
import { Code, Group, Tooltip, useMantineTheme } from '@mantine/core';

// Tabler icons imports
import {
  IconBuildingWarehouse,
  IconCarrot,
  IconDashboard,
  IconListDetails,
  IconReceipt2,
} from '@tabler/icons-react';

// React icon imports
import {
  MdOutlineAdminPanelSettings,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { PiPawPrint as IconPiPawPrint } from 'react-icons/pi';

// React library imports
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// Component imports
import { Text } from '../concave.agri/components';

// Redux action imports
import { clearUserInfo } from '../redux/actions/user';

// Utility function imports
import { extractFirstWord } from '../utils/common/function';
import { systemRoles } from '../utils/common/constant.objects';
import { getNavBarAgainstRole } from './role-based.navbar';

function Navbar({ onClick }: { onClick: () => void }) {
  // Initialize the Redux dispatch hook
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Get the current theme for styling purposes
  const theme = useMantineTheme();

  // Determine the current URL and extract the first word for comparison
  const url = window.location.href;
  const currentUrl = extractFirstWord(url);

  // Navigation data with links and icons
  const isSuperAdmin =
    useSelector((state: any) => state?.userInfo?.userInfo)?.roleId ===
    systemRoles[0].id;

  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  const data = isSuperAdmin
    ? [
        { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
        {
          link: '/manage-farm',
          label: 'Manage Farm',
          icon: MdOutlineAdminPanelSettings,
        },
      ]
    : [
        { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
        { link: '/task', label: 'Task', icon: IconListDetails },
        { link: '/livestock', label: 'LiveStock', icon: IconPiPawPrint },
        { link: '/crop', label: 'Crop', icon: IconCarrot },
        { link: '/inventory', label: 'Inventory', icon: IconBuildingWarehouse },
        { link: '/financial', label: 'Financial', icon: IconReceipt2 },
      ];

  // Create links for navigation using the data array
  const links = data?.map(item => (
    <Link
      // Apply Tailwind CSS classes for styling
      className={`flex items-center text-md font-medium rounded-md px-4 py-3 mb-2 border-none hover:bg-secondaryColors-100 hover:text-darkColors-100 hover:border-none ${
        item.link === `/${currentUrl}`
          ? 'bg-secondaryColors-100 text-darkColors-100'
          : 'text-lightColors-100'
      }`}
      to={item.link}
      key={item.label}
      onClick={() => onClick()}
    >
      {/* Render the icon */}
      <item.icon className="w-6 h-6 mr-2" stroke={'1.5'} />
      {/* Display the label */}
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <div
      className={`flex flex-col h-full`}
      // Set the text and background colors based on the theme
      style={{
        color: theme.colors.lightColors[6],
        backgroundColor: theme.colors.darkColors[0],
      }}
    >
      {/* Header section with application version */}
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

      {/* Main navigation links */}
      <div className="h-[82%] overflow-y-auto">
        <div className="flex flex-col p-2">{links}</div>
      </div>

      {/* Footer section with user profile and logout button */}
      <div className="h-[30%] lg:h-[7%] border-t-2 border-t-skin-light flex justify-between items-center gap-5 py-1 px-3">
        {/* User profile and avatar */}
        <div
          className="flex items-center rounded-sm cursor-pointer"
          onClick={event => event.preventDefault()}
        >
          <div
            onClick={() => {
              navigate('/view-profile');
              onClick();
            }}
            className="w-6 rounded-md ring ring-secondaryColors-100 ring-offset-2 hover:ring-offset-4 transition-all duration-300 delay-300"
          >
            {/* Avatar image */}
            <img
              src={
                userInfo?.profilePic ??
                'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
              }
              className="rounded-md"
            />
          </div>
          {/* User information */}
          <div className="ml-4">
            {/* User name */}
            <div
              className="hover:text-secondaryColors-100 capitalize"
              onClick={() => {
                navigate('/view-profile');
                onClick();
              }}
            >
              {userInfo?.name}
            </div>
            {/* View profile link */}
            <Text
              size="sm"
              className="hover:text-secondaryColors-100"
              onClick={() => {
                navigate('/view-profile');
                onClick();
              }} // Use navigate to redirect}
            >
              View Profile
            </Text>
          </div>
        </div>
        {/* Logout button with tooltip */}
        <Tooltip
          label="Logout ?"
          withArrow
          position="left"
          transitionProps={{ transition: 'skew-up', duration: 300 }}
          color={theme.colors.lightColors[3]}
        >
          {/* Logout button */}
          <div
            className="flex items-center text-sm font-medium rounded-sm hover:text-secondaryColors-100 cursor-pointer"
            onClick={() => dispatch(clearUserInfo())}
          >
            {/* Right arrow icon */}
            <MdOutlineKeyboardArrowRight size={32} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default Navbar;
