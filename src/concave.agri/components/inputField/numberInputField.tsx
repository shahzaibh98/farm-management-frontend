import { NumberInput as MantineNumberInput } from '@mantine/core';
import { capitalizeEveryWord } from '../../../utils/common/function';

// Define the props interface with optional properties
interface NumberInputProps {
  label?: string;
  placeholder?: string;
  value?: number;
  onChange?: (value: number | string) => void;
  [key: string]: any; // Index signature for additional props
  // Add any other props you want to make optional
}

const NumberInput = ({
  label,
  placeholder = 'Enter a number here',
  value,
  onChange,
  ...rest
}: NumberInputProps) => {
  return (
    <MantineNumberInput
      label={capitalizeEveryWord(label)}
      placeholder={capitalizeEveryWord(placeholder)}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default NumberInput;
