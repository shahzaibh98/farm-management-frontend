import React from 'react';
import { Menu as MantineMenu, Button } from '@mantine/core';

interface MenuProps {
  toggleButtonLabel: string;
  items: React.ReactNode[]; // Array of Menu.Item components
  menuProps?: React.ComponentProps<typeof Menu>;
}

const Menu: React.FC<MenuProps> = ({ toggleButtonLabel, items, menuProps }) => {
  return (
    <MantineMenu {...menuProps}>
      <MantineMenu.Target>
        <Button>{toggleButtonLabel}</Button>
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        {items.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
};

export default Menu;
