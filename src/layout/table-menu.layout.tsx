import { Menu, rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  JSXElementConstructor,
  Key,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import { CgOptions } from 'react-icons/cg';
import { CiEdit } from 'react-icons/ci';
import { VscOpenPreview } from 'react-icons/vsc';

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  onClick: (id: string) => void;
};

interface TableMenuProps {
  id: string;
  isView?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  additionalMenuItems?: MenuItem[];
  onViewClick?: (id: string) => void;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

const TableMenu = ({
  id,
  isView = true,
  isEdit = true,
  isDelete = true,
  additionalMenuItems = [],
  onViewClick = id => {},
  onEditClick = id => {},
  onDeleteClick = id => {},
}: TableMenuProps) => {
  return (
    <div className="relative">
      <Menu
        position="left-start"
        shadow="md"
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withinPortal={false}
        offset={8} // Adjust the offset as needed to align the dropdown properly
        transitionProps={{ transition: 'rotate-right', duration: 150 }}
      >
        <Menu.Target>
          <CgOptions />
        </Menu.Target>

        <Menu.Dropdown>
          {isEdit && (
            <Menu.Item
              leftSection={
                <CiEdit style={{ width: rem(14), height: rem(14) }} />
              }
              onChange={() => onEditClick(id)}
            >
              Edit
            </Menu.Item>
          )}
          {isView && (
            <Menu.Item
              leftSection={
                <VscOpenPreview style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => onViewClick(id)}
            >
              View
            </Menu.Item>
          )}

          {additionalMenuItems?.map(
            (item: MenuItem, index: Key | null | undefined) => (
              <Menu.Item
                key={index}
                leftSection={item.icon ?? null}
                onClick={() => item.onClick(id)}
              >
                {item.label}
              </Menu.Item>
            )
          )}

          {(isEdit || isView) && isDelete && <Menu.Divider />}

          {isDelete && (
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => onDeleteClick(id)}
            >
              Delete
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default TableMenu;
