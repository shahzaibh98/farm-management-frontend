import { Loader, MantineColorsTuple, useMantineTheme } from '@mantine/core';

interface LoaderProps {
  color?: string;
  size?: number;
  type?: string; // Make type optional
  [key: string]: any; // Index signature for additional props
}

const CustomLoader = ({
  type = 'oval',
  color,
  size = 30,
  ...rest
}: LoaderProps) => {
  const theme = useMantineTheme();
  const colorDefault = color || theme.colors.secondaryColors[3];

  return <Loader type={type} color={colorDefault} size={size} {...rest} />;
};

export default CustomLoader;
