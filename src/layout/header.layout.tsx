import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '../concave.agri/components';
import { theme } from 'highcharts';
import { Title, useMantineTheme } from '@mantine/core';

interface Props {
  isBackendButton?: boolean;
  headerText: string;
  breadcrumbsText: string;
  isAddOrUpdateButton?: boolean;
  buttonContent?: string;
  onButtonClick?: () => void;
}

const GenericHeader: React.FC<Props> = ({
  isBackendButton = true,
  headerText,
  breadcrumbsText,
  isAddOrUpdateButton = false,
  buttonContent = 'Add',
  onButtonClick = () => {},
}) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  return (
    <section
      className={'flex justify-between items-center lg:px-8 lg:py-4 px-2 py-1'}
    >
      <div className="flex items-center">
        {isBackendButton && (
          <IoChevronBackOutline
            size={24}
            onClick={() => navigate(-1)}
            color={theme.colors.darkColors[11]}
            className="cursor-pointer"
          />
        )}
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
      {isAddOrUpdateButton && (
        <Button
          variant="outline"
          autoContrast
          color={theme.colors.secondaryColors[3]}
          size="md"
          onClick={() => onButtonClick()}
          style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          <Text tt="capitalize" fs="italic">
            {buttonContent}
          </Text>
        </Button>
      )}
    </section>
  );
};

export default GenericHeader;