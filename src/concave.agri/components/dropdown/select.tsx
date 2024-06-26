import { Select as MantineSelect } from '@mantine/core';
import { capitalizeEveryWord } from '../../../utils/common/function';

interface SelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: any[];
  value?: string;
  onChange: (value: string | null) => void;
  nothingFoundMessage?: string;
  searchable?: boolean;
  clearable?: boolean;
  [key: string]: any; // Allow rest props
}

const Select = ({
  label,
  description,
  placeholder,
  data,
  value,
  onChange,
  nothingFoundMessage = 'Nothing found...',
  searchable = false,
  clearable = false,
  ...rest
}: SelectProps) => {
  return (
    <MantineSelect
      label={capitalizeEveryWord(label)}
      description={description}
      placeholder={capitalizeEveryWord(placeholder)}
      data={data}
      value={value}
      onChange={(value, _option) => onChange(value)}
      nothingFoundMessage={nothingFoundMessage}
      searchable={searchable}
      clearable={clearable}
      {...rest}
    />
  );
};

export default Select;
