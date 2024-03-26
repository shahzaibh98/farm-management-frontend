import { Autocomplete as MantineAutoComplete } from '@mantine/core';

interface SelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: string[];
  value: string;
  onChange: (value: string | null) => void;
  [key: string]: any; // Allow rest props
}

const AutoComplete = ({
  label,
  description,
  placeholder,
  data,
  value,
  onChange,
  ...rest
}: SelectProps) => {
  return (
    <MantineAutoComplete
      label={label}
      description={description}
      placeholder={placeholder}
      data={data}
      value={value}
      onChange={value => onChange(value)}
      {...rest}
    />
  );
};

export default AutoComplete;
