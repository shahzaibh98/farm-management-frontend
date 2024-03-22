import React from 'react';
import { ComboboxItem, Select } from '@mantine/core';

interface CustomSelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: string[];
  value: string;
  onChange: (value: string | null) => void;
  nothingFoundMessage?: string;
  searchable?: boolean;
  clearable?: boolean;
  [key: string]: any; // Allow rest props
}

const CustomSelect = ({
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
}: CustomSelectProps) => {
  return (
    <Select
      label={label}
      description={description}
      placeholder={placeholder}
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

export default CustomSelect;
