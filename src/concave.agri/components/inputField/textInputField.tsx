import { TextInput as MantineTextInput } from '@mantine/core';
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
const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  ...rest
}: InputProps) => {
  return (
    <MantineTextInput
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
export default TextInput;
