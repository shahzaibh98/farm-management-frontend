// Import necessary components and hooks from Mantine and other libraries
import { useMantineTheme } from '@mantine/core';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '../concave.agri/components';
import { IconBrandTwitter } from '@tabler/icons-react';

// Define the Props interface for the component
interface Props {
  isBackendButton?: boolean;
  isSecondButton?: boolean;
  secondButtonContent?: string;
  onSecondButtonClick?: () => void;
  headerText: string;
  breadcrumbsText: string;
  isAddOrUpdateButton?: boolean;
  buttonContent?: string;
  onButtonClick?: () => void;
}

// Define the GenericHeader functional component
const GenericHeader: React.FC<Props> = ({
  isBackendButton = true,
  isSecondButton = false,
  secondButtonContent = '',
  onSecondButtonClick = () => {},
  headerText,
  breadcrumbsText,
  isAddOrUpdateButton = false,
  buttonContent = 'Add',
  onButtonClick = () => {},
}) => {
  // Initialize the useNavigate hook for navigation
  const navigate = useNavigate();
  // Initialize the useMantineTheme hook for accessing theme variables
  const theme = useMantineTheme();

  // Render the component's layout
  return (
    <section
      className={'flex justify-between items-center lg:px-8 lg:py-4 px-2 py-1'}
    >
      {/* Left section with back button and header text */}
      <div className="flex items-center">
        {/* Back button */}
        {isBackendButton && (
          <IoChevronBackOutline
            size={24}
            onClick={() => navigate(-1)}
            color={theme.colors.darkColors[11]}
            className="cursor-pointer"
          />
        )}
        {/* Header text and breadcrumbs */}
        <div className="ml-4">
          <p className="font-mono text-2xl font-semibold">{headerText}</p>
          <Text
            className="text-skin-caption"
            tt="capitalize"
            fs="italic"
            style={theme => ({
              color: theme.colors.darkColors[3],
              lineHeight: theme.other.lineHeights.sm,
              fontSize: theme.fontSizes.sm,
              [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                fontSize: theme.fontSizes.xs,
              },
            })}
          >
            {breadcrumbsText}
          </Text>
        </div>
      </div>
      {/* Right section with add or update button */}
      <div>
        {isSecondButton && (
          <Button
            variant="outline"
            mr={5}
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
            variant="outline"
            autoContrast
            ml={5}
            color={theme.colors.secondaryColors[3]}
            size="md"
            onClick={() => onButtonClick()}
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <Text tt="capitalize" fs="italic" p={2}>
              {buttonContent}
            </Text>
          </Button>
        )}
      </div>
    </section>
  );
};

export default GenericHeader;
