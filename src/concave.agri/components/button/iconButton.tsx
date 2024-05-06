import React from 'react';
import { ActionIcon as MantineActionIcon } from '@mantine/core';

interface ActionIconProps {
  'data-disabled'?: boolean;
  size?: string;
  'aria-label'?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // Change the type to MouseEvent<HTMLButtonElement>
  children: React.ReactNode;
  [key: string]: any; // Index signature for additional props
}

const ActionIcon = ({ children, ...rest }: ActionIconProps) => {
  return <MantineActionIcon {...rest}>{children}</MantineActionIcon>; // Use a button instead of an anchor element
};

export default ActionIcon;
