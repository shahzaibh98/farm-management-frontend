import { TextInput } from '@mantine/core';
import { ChangeEvent } from 'react';

// Define the props interface with optional properties and an index signature
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  [key: string]: any;
}

// Define a generic function to handle TextInput and NumberInput components
const CustomTextInput = ({
  label,
  placeholder,
  value = 'Enter a text value',
  onChange,
  ...rest
}: InputProps) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.currentTarget.value)
      }
      {...rest}
    />
  );
};
export default CustomTextInput;
