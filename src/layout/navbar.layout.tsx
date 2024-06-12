// Mantine library imports
import { Code, Group, Tooltip, useMantineTheme } from '@mantine/core';

import appIcon from '../assets/svg/app-icon.svg';

// Tabler icons imports

// React icon imports
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

// React library imports
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// Component imports
import { Text } from '../concave.agri/components';

// Redux action imports
import { clearUserInfo } from '../redux/actions/user';

// Utility function imports
import { extractFirstWord } from '../utils/common/function';

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

  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);
  const { isSystemAdmin, currentRole } = useSelector(
    (state: any) => state?.userInfo
  );

  const currentUserRole = isSystemAdmin
    ? 0
    : currentRole?.roleMode === 'farms'
      ? currentRole?.currentFarmRole?.roleId
      : currentRole?.currentCompanyRole?.roleId;

  const data = getNavBarAgainstRole(currentUserRole);

  // Create links for navigation using the data array
  const links = data?.map(item => (
    <Link
      className={`group flex items-center text-md font-medium rounded-l-full pl-4 py-3 mb-2 border-none hover:bg-[#0F783B] hover:text-[#ffffff] ${
        item.activeLinks?.find((e: string) => e === `/${currentUrl}`)
          ? 'bg-[#0F783B] text-[#ffffff]'
          : 'text-[#414141]'
      }`}
      to={item.link}
      key={item.label}
      onClick={() => onClick()}
    >
      {/* Render the icon */}
      {item.activeLinks?.find((e: string) => e === `/${currentUrl}`) ? (
        <>
          <item.icon className="w-6 h-6 mr-3 text-[#ffffff]" stroke={'1.5'} />
          <span className="font-montserrat font-medium text-[14px]">
            {item.label}
          </span>
        </>
      ) : (
        <>
          <item.icon
            className="w-6 h-6 mr-3 text-[#BE8B45] group-hover:text-[#ffffff]"
            stroke={'1.5'}
          />
          <span className="font-montserrat font-medium text-[14px]">
            {item.label}
          </span>
        </>
      )}
    </Link>
  ));

  return (
    <div
      className={'flex flex-col h-full'}
      // Set the text and background colors based on the theme
      style={{
        color: theme.colors.lightColors[6],
        backgroundColor: '#F3FBF2',
        borderRight: '1px solid #BFE1C8',
      }}
    >
      {/* Header section with application version */}
      <div className="h-[11%] overflow-hidden">
        <div className="flex flex-row mt-8 ml-4">
          <img src={appIcon} />
          <div className="ml-2 mt-1">
            <div className="font-bold text-[15px] text-[#0F783B] font-montserrat">
              FARM MANAGEMENT
            </div>
            <div className="font-normal text-[12px] text-[#000000] font-montserrat">
              System
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-t-[#BFE1C8] my-8" />

      {/* Main navigation links */}
      <div className="h-[82%] overflow-y-auto">
        <div className="flex flex-col pl-4">{links}</div>
      </div>

      {/* Footer section with user profile and logout button */}
      <div className="h-[30%] lg:h-[7%] border-t border-t-[#BFE1C8] flex justify-between items-center gap-5 py-1 px-3">
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
            className="w-6 rounded-md ring ring-[#0F783B] ring-offset-2 hover:ring-offset-4 transition-all duration-300 delay-400 ease-in-out"
          >
            {/* Avatar image */}
            <img
              src={
                userInfo?.profilePic ??
                'https://res.cloudinary.com/demo/image/twitter/1330457336.jpg'
              }
              className="rounded-md"
            />
          </div>
          {/* User information */}
          <div className="ml-4">
            {/* User name */}
            <div
              className="hover:text-[#0F783B] capitalize text-[#414141] font-montserrat text-[12px] font-semibold"
              onClick={() => {
                navigate('/view-profile');
                onClick();
              }}
            >
              {userInfo?.name}
            </div>
            {/* View profile link */}
            <div
              className="hover:text-['#0F783B'] font-montserrat text-[10px] font-medium text-[#414141]"
              onClick={() => {
                navigate('/view-profile');
                onClick();
              }}
            >
              View Profile
            </div>
          </div>
        </div>
        {/* Logout button with tooltip */}
        <Tooltip
          label="Logout ?"
          withArrow
          position="left"
          transitionProps={{ transition: 'skew-up', duration: 300 }}
          color={theme.colors.darkColors[1]}
        >
          {/* Logout button */}
          <div
            className="flex text-[#414141] items-center text-sm font-medium rounded-sm hover:text-[#0F783B] cursor-pointer"
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
