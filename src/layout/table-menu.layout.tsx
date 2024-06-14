import { Menu, rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Key } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { HiOutlinePencil } from 'react-icons/hi';
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
    <div className="flex">
      {isEdit && (
        <div className="bg-[#DDEEE0] p-2 mx-2 rounded-full border border-[rgb(15, 120, 59, 0.1)]">
          <HiOutlinePencil
            color="#0F783B"
            style={{ width: rem(14), height: rem(14) }}
            onClick={() => onEditClick(id)}
          />
        </div>
      )}

      {isDelete && (
        <div className="bg-[#FFECEC] p-2 mx-2 border border-[#E9B4B4] rounded-full">
          <IconTrash
            style={{ width: rem(14), height: rem(14) }}
            onClick={() => onDeleteClick(id)}
            color="#D63535"
          />
        </div>
      )}

      <div className="flex relative overflow-visible p-2">
        <Menu
          position="top-start"
          shadow="md"
          trigger="hover"
          openDelay={100}
          closeDelay={400}
          withinPortal={false}
          offset={8} // Adjust the offset as needed to align the dropdown properly
          transitionProps={{ transition: 'rotate-right', duration: 150 }}
          floatingStrategy="fixed"
        >
          <Menu.Target>
            <BsThreeDotsVertical />
          </Menu.Target>

          <Menu.Dropdown>
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
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default TableMenu;
