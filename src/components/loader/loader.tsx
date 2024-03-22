import { Loader } from '@mantine/core';

interface LoaderProps {
  color?: string;
  size?: number;
  type?: string; // Make type optional
  [key: string]: any; // Index signature for additional props
}

const CustomLoader = ({
  type = 'oval',
  color = '#000',
  size = 30,
  ...rest
}: LoaderProps) => {
  return <Loader type={type} color={color} size={size} {...rest} />;
};

export default CustomLoader;
