import React from 'react';
import { Button as MantineButton } from '@mantine/core';

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

const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <MantineButton
      {...rest} // Spread the props onto the Button component
    >
      {children}
    </MantineButton>
  );
};

export default Button;
