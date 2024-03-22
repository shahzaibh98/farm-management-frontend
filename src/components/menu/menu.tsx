import React from 'react';
import { Menu, Button } from '@mantine/core';

interface CustomMenuProps {
  toggleButtonLabel: string;
  items: React.ReactNode[]; // Array of Menu.Item components
  menuProps?: React.ComponentProps<typeof Menu>;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  toggleButtonLabel,
  items,
  menuProps,
}) => {
  return (
    <Menu {...menuProps}>
      <Menu.Target>
        <Button>{toggleButtonLabel}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default CustomMenu;
