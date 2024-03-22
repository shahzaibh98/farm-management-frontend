import React from 'react';
import { ActionIcon } from '@mantine/core';

interface ActionIconProps {
  'data-disabled'?: boolean;
  size: string;
  'aria-label': string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // Change the type to MouseEvent<HTMLButtonElement>
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const CustomActionIcon = ({ children, ...rest }: ActionIconProps) => {
  return <ActionIcon {...rest}>{children}</ActionIcon>; // Use a button instead of an anchor element
};

export default CustomActionIcon;
