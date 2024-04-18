import { Menu, rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  MouseEventHandler,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from 'react';
import { CgOptions } from 'react-icons/cg';
import { CiEdit } from 'react-icons/ci';
import { VscOpenPreview } from 'react-icons/vsc';
import { JSX } from 'react/jsx-runtime';

const TableMenu = ({
  isView = true,
  isEdit = true,
  isDelete = true,
  additionalMenuItems = [],
  onViewClick = () => {},
  onEditClick = () => {},
  onDeleteClick = () => {},
}) => {
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
              onChange={() => onEditClick()}
            >
              Edit
            </Menu.Item>
          )}
          {isView && (
            <Menu.Item
              leftSection={
                <VscOpenPreview style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => onViewClick()}
            >
              View
            </Menu.Item>
          )}

          {additionalMenuItems?.map(
            (
              item: {
                icon: ReactNode;
                onClick: MouseEventHandler<HTMLButtonElement> | undefined;
                color: any;
                disabled: any;
                label:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined;
              },
              index: Key | null | undefined
            ) => (
              <Menu.Item
                key={index}
                leftSection={item.icon ?? null}
                onClick={item.onClick}
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
              onClick={() => onDeleteClick()}
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
