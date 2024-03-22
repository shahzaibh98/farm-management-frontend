import { NumberInput } from '@mantine/core';

// Define the props interface with optional properties
interface CustomNumberInputProps {
  label?: string;
  placeholder?: string;
  value?: number;
  onChange?: (value: number | string) => void;
  [key: string]: any; // Index signature for additional props
  // Add any other props you want to make optional
}

const CustomNumberInput = ({
  label,
  placeholder = 'Enter a number here',
  value,
  onChange,
  ...rest
}: CustomNumberInputProps) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default CustomNumberInput;
