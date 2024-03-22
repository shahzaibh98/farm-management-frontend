import { Autocomplete } from '@mantine/core';

interface CustomSelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  data: string[];
  value: string;
  onChange: (value: string | null) => void;
  [key: string]: any; // Allow rest props
}

const CustomAutoComplete = ({
  label,
  description,
  placeholder,
  data,
  value,
  onChange,
  ...rest
}: CustomSelectProps) => {
  return (
    <Autocomplete
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

export default CustomAutoComplete;
