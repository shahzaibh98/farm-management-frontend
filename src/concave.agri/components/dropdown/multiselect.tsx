import { MultiSelect as MantineMultiSelect } from '@mantine/core';

interface SelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: string[];
  value: string[];
  onChange: (value: string[]) => void;
  nothingFoundMessage?: string;
  searchable?: boolean;
  clearable?: boolean;
  [key: string]: any; // Allow rest props
}

const MultiSelect = ({
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
    <MantineMultiSelect
      label={label}
      description={description}
      placeholder={placeholder}
      data={data}
      value={value}
      onChange={(value: string[]) => onChange(value)}
      nothingFoundMessage={nothingFoundMessage}
      searchable={searchable}
      clearable={clearable}
      {...rest}
    />
  );
};

export default MultiSelect;
