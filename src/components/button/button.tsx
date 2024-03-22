import React from 'react';
import { Button } from '@mantine/core';

interface ButtonProps {
  justify?: 'start' | 'center' | 'end';
  fullWidth?: boolean;
  variant?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  mt?: string;
  onClick?: () => void;
  children?: React.ReactNode; // Add children prop
  [key: string]: any; // Index signature for additional props
}

const CustomButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <Button
      {...rest} // Spread the props onto the Button component
    >
      {children}
    </Button>
  );
};

export default CustomButton;
