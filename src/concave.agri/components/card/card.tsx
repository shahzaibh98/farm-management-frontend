import { useMantineTheme } from '@mantine/core';
import { IconTargetArrow } from '@tabler/icons-react';

const GlassCard = ({
  label,
  value,
  isSelected,
  onSelected,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onSelected: (label: string) => void;
}) => {
  const theme = useMantineTheme();
  return (
    <div
      onClick={() => onSelected(value)}
      className={`w-48 h-36 rounded-xl p-1 shadow-md transform transition-transform duration-300 cursor-pointer border border-gray-300  ${
        isSelected ? 'scale-105 shadow-2xl' : 'hover:scale-110'
      } bg-gradient-to-r from-secondaryColors-100 via-secondaryColors-80 to-secondaryColors-100 flex items-center justify-center`}
    >
      <div className="bg-[#eaebef] rounded-lg w-full h-full flex items-center justify-center">
        <div className="text-secondaryColors-100 font-medium text-xl text-center px-2">
          {label}
        </div>
        {isSelected && (
          <IconTargetArrow color={theme.colors.secondaryColors[0]} size={24} />
        )}
      </div>
    </div>
  );
};

export default GlassCard;
