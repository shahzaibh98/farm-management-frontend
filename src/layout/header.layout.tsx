// Import necessary components and hooks from Mantine and other libraries
import { Breadcrumbs, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '../concave.agri/components';

interface IBreadCrumbs {
  title: string;
  href: string;
}

// Define the Props interface for the component
interface Props {
  isBackendButton?: boolean;
  isSecondButton?: boolean;
  secondButtonContent?: string;
  onSecondButtonClick?: () => void;
  headerText: string;
  breadcrumbs: IBreadCrumbs[];
  isAddOrUpdateButton?: boolean;
  isAddOrUpdateButtonLoading?: boolean;
  buttonContent?: string;
  onButtonClick?: () => void;
}

// Define the GenericHeader functional component
const GenericHeader: React.FC<Props> = ({
  isBackendButton = true,
  isAddOrUpdateButtonLoading = false,
  isSecondButton = false,
  secondButtonContent = '',
  onSecondButtonClick = () => {},
  headerText,
  breadcrumbs,
  isAddOrUpdateButton = false,
  buttonContent = 'Add',
  onButtonClick = () => {},
}) => {
  // Initialize the useNavigate hook for navigation
  const navigate = useNavigate();
  // Initialize the useMantineTheme hook for accessing theme variables
  const theme = useMantineTheme();

  const items = breadcrumbs.map((item, index) => (
    <div key={index} onClick={() => item.href !== '' && navigate(item.href)}>
      <Text
        key={index}
        className={`text-skin-caption ${item.href !== '' ? 'hover:underline hover:underline-offset-4 hover:cursor-pointer' : ''}`}
        tt="capitalize"
        style={theme => ({
          color: theme.colors.darkColors[3],
          lineHeight: theme.other.lineHeights.sm,
          fontSize: theme.fontSizes.sm,
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            fontSize: theme.fontSizes.xs,
          },
        })}
      >
        {item.title}
      </Text>
    </div>
  ));

  // Render the component's layout
  return (
    <section
      className={'flex justify-between items-center lg:px-8 lg:py-4 px-2 py-1'}
    >
      {/* Left section with back button and header text */}
      <div className="flex items-center">
        {/* Header text and breadcrumbs */}
        <div className="ml-4">
          <p className="font-montserrat text-2xl font-bold">{headerText}</p>
          <Breadcrumbs>{items}</Breadcrumbs>
        </div>
      </div>
      {/* Right section with add or update button */}
      <div>
        {isSecondButton && (
          <Button
            variant="outline"
            m={5}
            autoContrast
            color={theme.colors.secondaryColors[3]}
            size="md"
            onClick={() => onSecondButtonClick()}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic" p={2}>
              {secondButtonContent}
            </Text>
          </Button>
        )}
        {isAddOrUpdateButton && (
          <Button
            autoContrast
            m={5}
            loading={isAddOrUpdateButtonLoading}
            size="md"
            onClick={() => onButtonClick()}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            styles={{
              root: {
                borderRadius: '20px',
                background: '#F3FBF2',
                border: '1px solid rgba(15, 120, 59, 0.1)',
              },
            }}
          >
            <div className="font-montserrat font-semibold text-[12px] text-[#0F783B]">
              {buttonContent}
            </div>
          </Button>
        )}
      </div>
    </section>
  );
};

export default GenericHeader;
